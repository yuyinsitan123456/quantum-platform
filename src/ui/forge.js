// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Axis} from "src/math/Axis.js"
import {CircuitDefinition} from "src/circuit/CircuitDefinition.js"
import {setGateBuilderEffectToCircuit} from "src/circuit/CircuitComputeUtil.js"
import {Complex} from "src/math/Complex.js"
import {Config} from "src/Config.js"
import {DetailedError} from "src/base/DetailedError.js"
import {drawCircuitTooltip} from "src/ui/DisplayedCircuit.js"
import {Format} from "src/base/Format.js"
import {Gate, GateBuilder} from "src/circuit/Gate.js"
import {GateColumn} from "src/circuit/GateColumn.js"
import {getCircuitCycleTime} from "src/ui/sim.js"
import {MathPainter} from "src/draw/MathPainter.js"
import {Matrix} from "src/math/Matrix.js"
import {Observable, ObservableValue} from "src/base/Obs.js"
import {Painter} from "src/draw/Painter.js"
import {Point} from "src/math/Point.js"
import {Rect} from "src/math/Rect.js"
import {fromJsonText_CircuitDefinition, Serializer} from "src/circuit/Serializer.js"
import {seq} from "src/base/Seq.js"
import {textEditObservable} from "src/browser/EventUtil.js"
import {Util} from "src/base/Util.js"

const forgeIsVisible = new ObservableValue(false);
const obsForgeIsShowing = forgeIsVisible.observable().whenDifferent();

/**
 * @param {!Revision} revision
 * @param {!Observable.<!boolean>} obsIsAnyOverlayShowing
 */
function initForge(revision, obsIsAnyOverlayShowing) {
    const obsOnShown = obsForgeIsShowing.filter(e => e === true);
    /** @type {!String} */
    let latestInspectorText;
    revision.latestActiveCommit().subscribe(e => { latestInspectorText = e; });

    // Show/hide forge overlay.
    (() => {
        const forgeButton = /** @type {!HTMLButtonElement} */ document.getElementById('gate-forge-button');
        const forgeOverlay = /** @type {!HTMLDivElement} */ document.getElementById('gate-forge-overlay');
        const forgeDiv = /** @type {HTMLDivElement} */ document.getElementById('gate-forge-div');
        forgeButton.addEventListener('click', () => forgeIsVisible.set(true));
        forgeOverlay.addEventListener('click', () => forgeIsVisible.set(false));
        obsIsAnyOverlayShowing.subscribe(e => { forgeButton.disabled = e; });
        document.addEventListener('keydown', e => {
            const ESC_KEY = 27;
            if (e.keyCode === ESC_KEY) {
                forgeIsVisible.set(false)
            }
        });
        obsForgeIsShowing.subscribe(showing => {
            forgeDiv.style.display = showing ? 'block' : 'none';
            if (showing) {
                document.getElementById('gate-forge-rotation-axis').focus();
            }
        });
    })();

    function computeAndPaintOp(canvas, opGetter, button) {
        button.disabled = true;
        let painter = new Painter(canvas);
        painter.clear();
        let d = Math.min((canvas.width - 5)/2, canvas.height);
        let rect1 = new Rect(0, 0, d, d);
        let rect2 = new Rect(d + 5, 0, d, d);
        try {
            let op = opGetter();
            MathPainter.paintMatrix(
                painter,
                op,
                rect1,
                Config.OPERATION_FORE_COLOR,
                'black',
                undefined,
                Config.OPERATION_BACK_COLOR,
                undefined,
                'transparent');
            if (!op.isUnitary(0.009)) {
                painter.printParagraph('NOT UNITARY', rect2, new Point(0.5, 0.5), 'red', 24);
            } else  if (op.width() !== 2) {
                painter.printParagraph('(Not a 1-qubit rotation)', rect2, new Point(0.5, 0.5), '#666', 20);
            } else {
                MathPainter.paintBlochSphereRotation(
                    painter,
                    op,
                    rect2,
                    Config.OPERATION_BACK_COLOR,
                    Config.OPERATION_FORE_COLOR);
            }
            let cx = (rect1.right() + rect2.x)/2;
            painter.strokeLine(new Point(cx, 0), new Point(cx, canvas.height), 'black', 2);
            if (!op.hasNaN()) {
                button.disabled = false;
            }
        } catch (ex) {
            painter.printParagraph(
                ex+"",
                new Rect(0, 0, canvas.width, canvas.height),
                new Point(0.5, 0.5),
                'red',
                24);
        }
    }

    /**
     * @param {!Gate} gate
     * @param {undefined|!CircuitDefinition=undefined} circuitDef
     */
    function createCustomGateAndClose(gate, circuitDef=undefined) {
        let c = circuitDef || fromJsonText_CircuitDefinition(latestInspectorText);
        revision.commit(JSON.stringify(Serializer.toJson(c.withCustomGate(gate)), null, 0));
        forgeIsVisible.set(false);
    }

    (() => {
        const rotationCanvas = /** @type {!HTMLCanvasElement} */ document.getElementById('gate-forge-rotation-canvas');
        const rotationButton = /** @type {!HTMLInputElement} */ document.getElementById('gate-forge-rotation-button');
        const txtAxis = /** @type {!HTMLInputElement} */ document.getElementById('gate-forge-rotation-axis');
        const txtAngle = /** @type {!HTMLInputElement} */ document.getElementById('gate-forge-rotation-angle');
        const txtName = /** @type {!HTMLInputElement} */ document.getElementById('gate-forge-rotation-name');
        obsOnShown.subscribe(() => { txtName.value = ""; });

        function parseRotationFromInputs() {
            return parseUserRotation(
                valueElsePlaceholder(txtAngle),
                valueElsePlaceholder(txtAxis));
        }

        let redraw = () => computeAndPaintOp(rotationCanvas, parseRotationFromInputs, rotationButton);
        Observable.of(obsOnShown, ...[txtAxis, txtAngle].map(textEditObservable)).
            flatten().
            throttleLatest(100).
            subscribe(redraw);

        rotationButton.addEventListener('click', () => {
            let mat;
            try {
                mat = parseRotationFromInputs();
            } catch (ex) {
                console.warn(ex);
                return; // Button is about to be disabled, so no handling required.
            }

            let gate = new GateBuilder().
                setSerializedId('~' + Math.floor(Math.random()*(1 << 20)).toString(32)).
                setSymbol(txtName.value).
                setTitle('构造转角门').
                setKnownEffectToMatrix(mat).
                gate;
            createCustomGateAndClose(gate);
        });
    })();

}

/**
 * @param {!HTMLInputElement} textBox
 * @returns {!string}
 */
function valueElsePlaceholder(textBox) {
    //noinspection JSUnresolvedVariable
    return textBox.value === '' ? textBox.placeholder : textBox.value;
}

/**
 * @param {!string} text
 * @returns {!number}
 */
function parseUserAngle(text) {
    let c = Complex.parse(text);
    if (c.imag !== 0 || isNaN(c.imag)) {
        throw new Error("You just had to make it complicated, didn't you?");
    }
    return c.real * Math.PI / 180;
}

/**
 * @param {!Matrix} matrix
 * @returns {!Matrix}
 */
function decreasePrecisionAndSerializedSize(matrix) {
    return Matrix.parse(matrix.toString(new Format(true, 0.0000001, 7, ",")))
}

/**
 * @param {!string} angleText
 * @param {!string} phaseText
 * @param {!string} axisText
 * @returns {!Matrix}
 */
function parseUserRotation(angleText, axisText) {
    let w = parseUserAngle(angleText);
    let {x, y, z} = Axis.parse(axisText);

    let len = Math.sqrt(x*x + y*y + z*z);
    x /= len;
    y /= len;
    z /= len;

    let [I, X, Y, Z] = [Matrix.identity(2), Matrix.PAULI_X, Matrix.PAULI_Y, Matrix.PAULI_Z];
    let axisMatrix = X.times(x).plus(Y.times(y)).plus(Z.times(z));

    let result = I.times(Math.cos(w/2)).
        plus(axisMatrix.times(Complex.I.neg()).times(Math.sin(w/2)))
    if (result.hasNaN()) {
        throw new DetailedError("NaN", {x, y, z, result});
    }

    return decreasePrecisionAndSerializedSize(result);
}

/**
 * @param {!CircuitDefinition} circuit
 * @returns {!CircuitDefinition}
 */
function removeBrokenGates(circuit) {
    let w = circuit.columns.length;
    let h = circuit.numWires;
    return circuit.withColumns(
        seq(circuit.columns).mapWithIndex(
            (col, c) => new GateColumn(seq(col.gates).mapWithIndex(
                (gate, r) => gate === undefined || c + gate.width > w || r + gate.height > h ? undefined : gate
            ).toArray())
        ).toArray());
}



export {initForge, obsForgeIsShowing, parseUserRotation}
