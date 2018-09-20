import {Suite} from "npmjs/test/TestUtil.js"
import {offsetShader, IncrementGates} from "npmjs/src/gates/IncrementGates.js"
import {
    assertThatCircuitShaderActsLikePermutation,
    assertThatGateActsLikePermutation,
} from "npmjs/test/CircuitOperationTestUtil.js"

import {ketArgs} from "npmjs/src/circuit/KetShaderUtil.js"
import {WglArg} from "npmjs/src/webgl/WglArg.js"

let suite = new Suite("ArithmeticGates");

suite.testUsingWebGL('offsetShader', () => {
    assertThatCircuitShaderActsLikePermutation(
        3,
        ctx => offsetShader.withArgs(...ketArgs(ctx, 3), WglArg.float("amount", 5)),
        e => (e+5) & 7);

    assertThatCircuitShaderActsLikePermutation(
        6,
        ctx => offsetShader.withArgs(...ketArgs(ctx, 6), WglArg.float("amount", -31)),
        e => (e-31) & 63);
});

suite.testUsingWebGL('IncrementGate', () => {
    assertThatGateActsLikePermutation(
        IncrementGates.IncrementFamily.ofSize(3),
        e => (e + 1) & 7);

    assertThatGateActsLikePermutation(
        IncrementGates.DecrementFamily.ofSize(4),
        e => (e - 1) & 15);
});
