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

import {Suite} from "npmjs/test/TestUtil.js"
import {XorGates} from "npmjs/src/gates/XorGates.js"
import {InputGates} from "npmjs/src/gates/InputGates.js"
import {assertThatCircuitUpdateActsLikeMatrix} from "npmjs/test/CircuitOperationTestUtil.js"
import {advanceStateWithCircuit} from "npmjs/src/circuit/CircuitComputeUtil.js"

import {CircuitDefinition} from "npmjs/src/circuit/CircuitDefinition.js"
import {GateColumn} from "npmjs/src/circuit/GateColumn.js"
import {Matrix} from "npmjs/src/math/Matrix.js"

let suite = new Suite("XorGates");

suite.testUsingWebGL('xor_a', () => {
    let matrix = Matrix.generateTransition(1 << 6, i => {
        let a = (i >> 3) & 3;
        let dst = i & 3;
        let left = i & ~3;
        return (a ^ dst) + left;
    });

    assertThatCircuitUpdateActsLikeMatrix(
        ctx => advanceStateWithCircuit(
            ctx,
            new CircuitDefinition(6, [new GateColumn([
                XorGates.XorAFamily.ofSize(2),
                undefined,
                undefined,
                InputGates.InputAFamily.ofSize(2),
                undefined,
                undefined])]),
            false),
        matrix);

    assertThatCircuitUpdateActsLikeMatrix(
        ctx => advanceStateWithCircuit(
            ctx,
            new CircuitDefinition(6, [new GateColumn([
                XorGates.XorAFamily.ofSize(3),
                undefined,
                undefined,
                InputGates.InputAFamily.ofSize(2),
                undefined,
                undefined])]),
            false),
        matrix);

    assertThatCircuitUpdateActsLikeMatrix(
        ctx => advanceStateWithCircuit(
            ctx,
            new CircuitDefinition(6, [new GateColumn([
                XorGates.XorAFamily.ofSize(2),
                undefined,
                undefined,
                InputGates.InputAFamily.ofSize(3),
                undefined,
                undefined])]),
            false),
        matrix);
});
