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

const sparkRunIsVisible = new ObservableValue(false);
const obSparkRunsIsShowing = sparkRunIsVisible.observable().whenDifferent();

/**
 * @param {!Revision} revision
 * @param {!Observable.<!boolean>} obsIsAnyOverlayShowing
 */
function initSparkRun(revision, obsIsAnyOverlayShowing) {
    // send quantum circuit.
    (() => {
        const sparkRunButton = /** @type {!HTMLButtonElement} */ document.getElementById('sparkrun-button');
        revision.latestActiveCommit().zipLatest(obsIsAnyOverlayShowing, (_, b) => b).subscribe(anyShowing => {
            sparkRunButton.disabled = revision.isAtBeginningOfHistory() || anyShowing;
        });
        const runOverlay = /** @type {!HTMLDivElement} */ document.getElementById('run-overlay');
        const runDiv = /** @type {HTMLDivElement} */ document.getElementById('run-div');
        sparkRunButton.addEventListener('click', () => {

            $.getJSON("{{ url_for('quantumCircuit.sparkrun')}}", {
                data: document.getElementById('run-circuit-json-pre').innerText
            }, function (data) {
                sparkRunIsVisible.set(true);

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
        obsIsAnyOverlayShowing.subscribe(e => sparkRunButton.disabled = e);
        runOverlay.addEventListener('click', () => sparkRunIsVisible.set(false));
        document.addEventListener('keydown', e => {
            const ESC_KEY = 27;
            if (e.keyCode === ESC_KEY) {
                sparkRunIsVisible.set(false)
            }
        });
        obSparkRunsIsShowing.subscribe(showing => {
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

export {initSparkRun, obSparkRunsIsShowing}
