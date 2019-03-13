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

import {Config} from "src/Config.js"
import {ObservableValue} from "src/base/Obs.js"
import {selectAndCopyToClipboard} from "src/browser/Clipboard.js"
import {fromJsonText_CircuitDefinition} from "src/circuit/Serializer.js"

const runIsVisible = new ObservableValue(false);
const obsRunsIsShowing = runIsVisible.observable().whenDifferent();

/**
 * @param {!Revision} revision
 * @param {!Observable.<!boolean>} obsIsAnyOverlayShowing
 */
function initRun(revision, obsIsAnyOverlayShowing) {
    // send quantum circuit.
    (() => {
        const runButton = /** @type {!HTMLButtonElement} */ document.getElementById('run-button');
        const runOverlay = /** @type {!HTMLDivElement} */ document.getElementById('run-overlay');
        const runDiv = /** @type {HTMLDivElement} */ document.getElementById('run-div');
        runButton.addEventListener('click', () => {
            $.getJSON("{{ url_for('quantumCircuit.run')}}", {
                data: document.getElementById('run-circuit-json-pre').innerText
            }, function (data) {
                runIsVisible.set(true);

                document.getElementById('run-circuit-json-show').innerText = JSON.stringify(data);
                xDomain = 0;
                yDomain = 0;
                yDomainMin = 0;
                xDomainMin = 0;

                if (Array.isArray(data)) {
                    updateChart(data);
                }
            });
        });
        obsIsAnyOverlayShowing.subscribe(e => runButton.disabled = e);
        runOverlay.addEventListener('click', () => runIsVisible.set(false));
        document.addEventListener('keydown', e => {
            const ESC_KEY = 27;
            if (e.keyCode === ESC_KEY) {
                runIsVisible.set(false)
            }
        });
        obsRunsIsShowing.subscribe(showing => {
            runDiv.style.display = showing ? 'block' : 'none';
        });
    })();
    // copy JSON.
    (() => {
        const jsonTextElement = /** @type {HTMLPreElement} */ document.getElementById('run-circuit-json-pre');
        revision.latestActiveCommit().subscribe(jsonText => {
            //noinspection UnusedCatchParameterJS
            try {
                let val = JSON.parse(jsonText);
                jsonTextElement.innerText = JSON.stringify(val, null, '  ');
            } catch (_) {
                jsonTextElement.innerText = jsonText;
            }
        });
    })();
}

export {initRun, obsRunsIsShowing}
