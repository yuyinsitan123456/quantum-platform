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

import {ArithmeticGates} from "npmjs/src/gates/ArithmeticGates.js"
import {AmplitudeDisplayFamily} from "npmjs/src/gates/AmplitudeDisplay.js"
import {BitCountGates} from "npmjs/src/gates/BitCountGates.js"
import {BlochSphereDisplay} from "npmjs/src/gates/BlochSphereDisplay.js"
import {ComparisonGates} from "npmjs/src/gates/ComparisonGates.js"
import {Controls} from "npmjs/src/gates/Controls.js"
import {CountingGates} from "npmjs/src/gates/CountingGates.js"
import {CycleBitsGates} from "npmjs/src/gates/CycleBitsGates.js"
import {DensityMatrixDisplayFamily} from "npmjs/src/gates/DensityMatrixDisplay.js"
import {ErrorInjectionGate} from "npmjs/src/gates/Debug_ErrorInjectionGate.js"
import {ExponentiatingGates} from "npmjs/src/gates/ExponentiatingGates.js"
import {FourierTransformGates} from "npmjs/src/gates/FourierTransformGates.js"
import {HalfTurnGates} from "npmjs/src/gates/HalfTurnGates.js"
import {IncrementGates} from "npmjs/src/gates/IncrementGates.js"
import {InputGates} from "npmjs/src/gates/InputGates.js"
import {InterleaveBitsGates} from "npmjs/src/gates/InterleaveBitsGates.js"
import {MeasurementGate} from "npmjs/src/gates/MeasurementGate.js"
import {ModularIncrementGates} from "npmjs/src/gates/ModularIncrementGates.js"
import {ModularAdditionGates} from "npmjs/src/gates/ModularAdditionGates.js"
import {ModularMultiplicationGates} from "npmjs/src/gates/ModularMultiplicationGates.js"
import {ModularMultiplyAccumulateGates} from "npmjs/src/gates/ModularMultiplyAccumulateGates.js"
import {MultiplicationGates} from "npmjs/src/gates/MultiplicationGates.js"
import {MultiplyAccumulateGates} from "npmjs/src/gates/MultiplyAccumulateGates.js"
import {NeGate} from "npmjs/src/gates/Joke_NeGate.js"
import {ParametrizedRotationGates} from "npmjs/src/gates/ParametrizedRotationGates.js"
import {PhaseGradientGates} from "npmjs/src/gates/PhaseGradientGates.js"
import {PivotFlipGates} from "npmjs/src/gates/PivotFlipGates.js"
import {PostSelectionGates} from "npmjs/src/gates/PostSelectionGates.js"
import {PoweringGates} from "npmjs/src/gates/PoweringGates.js"
import {ProbabilityDisplayFamily} from "npmjs/src/gates/ProbabilityDisplay.js"
import {QuarterTurnGates} from "npmjs/src/gates/QuarterTurnGates.js"
import {ReverseBitsGateFamily} from "npmjs/src/gates/ReverseBitsGate.js"
import {SampleDisplayFamily} from "npmjs/src/gates/SampleDisplay.js"
import {Detector} from "npmjs/src/gates/Detector.js"
import {SpacerGate} from "npmjs/src/gates/SpacerGate.js"
import {SwapGateHalf} from "npmjs/src/gates/SwapGateHalf.js"
import {UniversalNotGate} from "npmjs/src/gates/Impossible_UniversalNotGate.js"
import {VariousXGates} from "npmjs/src/gates/VariousXGates.js"
import {VariousYGates} from "npmjs/src/gates/VariousYGates.js"
import {VariousZGates} from "npmjs/src/gates/VariousZGates.js"
import {XorGates} from "npmjs/src/gates/XorGates.js"
import {ZeroGate} from "npmjs/src/gates/Joke_ZeroGate.js"
import {MysteryGateMaker} from "npmjs/src/gates/Joke_MysteryGate.js"

import {seq} from "npmjs/src/base/Seq.js"

let Gates = {};

/** Gates that have special behavior requiring custom code / logic to handle. */
Gates.Special = {
    Measurement: MeasurementGate,
    SwapHalf: SwapGateHalf
};
/**
 * Gates that display information without affecting the state.
 * (In reality these would require multiple runs of the circuit to do tomography.)
 */
Gates.Displays = {
    AmplitudeDisplayFamily: AmplitudeDisplayFamily,
    ProbabilityDisplayFamily: ProbabilityDisplayFamily,
    SampleDisplayFamily: SampleDisplayFamily,
    DensityMatrixDisplayFamily: DensityMatrixDisplayFamily,
    BlochSphereDisplay: BlochSphereDisplay
};
Gates.Arithmetic = ArithmeticGates;
Gates.BitCountGates = BitCountGates;
Gates.ComparisonGates = ComparisonGates;
Gates.Controls = Controls;
Gates.CountingGates = CountingGates;
Gates.CycleBitsGates = CycleBitsGates;
Gates.Displays.DensityMatrixDisplay = DensityMatrixDisplayFamily.ofSize(1);
Gates.Displays.DensityMatrixDisplay2 = DensityMatrixDisplayFamily.ofSize(2);
Gates.Displays.ChanceDisplay = Gates.Displays.ProbabilityDisplayFamily.ofSize(1);
Gates.ErrorInjection = ErrorInjectionGate;
Gates.Exponentiating = ExponentiatingGates;
Gates.FourierTransformGates = FourierTransformGates;
Gates.HalfTurns = HalfTurnGates;
Gates.IncrementGates = IncrementGates;
Gates.InputGates = InputGates;
Gates.InterleaveBitsGates = InterleaveBitsGates;
Gates.ModularIncrementGates = ModularIncrementGates;
Gates.ModularAdditionGates = ModularAdditionGates;
Gates.ModularMultiplicationGates = ModularMultiplicationGates;
Gates.ModularMultiplyAccumulateGates = ModularMultiplyAccumulateGates;
Gates.MultiplicationGates = MultiplicationGates;
Gates.MultiplyAccumulateGates = MultiplyAccumulateGates;
Gates.NeGate = NeGate;
Gates.OtherX = VariousXGates;
Gates.OtherY = VariousYGates;
Gates.OtherZ = VariousZGates;
Gates.ParametrizedRotationGates = ParametrizedRotationGates;
Gates.PhaseGradientGates = PhaseGradientGates;
Gates.PivotFlipGates = PivotFlipGates;
Gates.PostSelectionGates = PostSelectionGates;
Gates.Powering = PoweringGates;
Gates.QuarterTurns = QuarterTurnGates;
Gates.ReverseBitsGateFamily = ReverseBitsGateFamily;
Gates.Detector = Detector;
Gates.SpacerGate = SpacerGate;
Gates.UniversalNot = UniversalNotGate;
Gates.XorGates = XorGates;
Gates.ZeroGate = ZeroGate;

/** @type {!Array.<!Gate>} */
Gates.KnownToSerializer = [
    ...Controls.all,
    ...InputGates.all,
    MeasurementGate,
    Detector,
    SwapGateHalf,
    SpacerGate,
    UniversalNotGate,
    ErrorInjectionGate,
    ZeroGate,
    NeGate,

    ...AmplitudeDisplayFamily.all,
    ...ProbabilityDisplayFamily.all,
    ...SampleDisplayFamily.all,
    ...DensityMatrixDisplayFamily.all,
    BlochSphereDisplay,

    ...ArithmeticGates.all,
    ...BitCountGates.all,
    ...ComparisonGates.all,
    ...CountingGates.all,
    ...CycleBitsGates.all,
    ...ExponentiatingGates.all,
    ...FourierTransformGates.all,
    ...HalfTurnGates.all,
    ...IncrementGates.all,
    ...InterleaveBitsGates.all,
    ...ModularAdditionGates.all,
    ...ModularIncrementGates.all,
    ...ModularMultiplicationGates.all,
    ...ModularMultiplyAccumulateGates.all,
    ...MultiplicationGates.all,
    ...MultiplyAccumulateGates.all,
    ...QuarterTurnGates.all,
    ...ParametrizedRotationGates.all,
    ...PhaseGradientGates.all,
    ...PivotFlipGates.all,
    ...PostSelectionGates.all,
    ...PoweringGates.all,
    ...ReverseBitsGateFamily.all,
    ...VariousXGates.all,
    ...VariousYGates.all,
    ...VariousZGates.all,
    ...XorGates.all
];

let gatesById = seq(Gates.KnownToSerializer).keyedBy(g => g.serializedId);
/**
 * @param {!String} id
 * @param {!CustomGateSet} customGateSet
 * @returns {undefined|!Gate}
 */
Gates.findKnownGateById = (id, customGateSet) => {
    return gatesById.has(id) ? gatesById.get(id) : customGateSet.findGateWithSerializedId(id);
};

/** @type {!Array<!{hint: !string, gates: !Array<undefined|!Gate>}>} */
Gates.TopToolboxGroups = [
    {
        hint: "Probes",
        gates: [
            MeasurementGate,                  undefined,
            PostSelectionGates.PostSelectOff, PostSelectionGates.PostSelectOn,
            Controls.AntiControl,             Controls.Control
        ]
    },
    {
        hint: "Displays",
        gates: [
            SampleDisplayFamily.ofSize(3),        undefined,
            DensityMatrixDisplayFamily.ofSize(1), BlochSphereDisplay,
            ProbabilityDisplayFamily.ofSize(1),   AmplitudeDisplayFamily.ofSize(2)
        ]
    },
    {
        hint: "Half Turns",
        gates: [
            HalfTurnGates.Z, SwapGateHalf,
            HalfTurnGates.Y, undefined,
            HalfTurnGates.X, HalfTurnGates.H
        ]
    },
    {
        hint: "Quarter Turns",
        gates: [
            QuarterTurnGates.SqrtZForward, QuarterTurnGates.SqrtZBackward,
            QuarterTurnGates.SqrtYForward, QuarterTurnGates.SqrtYBackward,
            QuarterTurnGates.SqrtXForward, QuarterTurnGates.SqrtXBackward
        ]
    },
    {
        hint: "Eighth Turns",
        gates: [
            VariousZGates.Z4, VariousZGates.Z4i,
            VariousYGates.Y4, VariousYGates.Y4i,
            VariousXGates.X4, VariousXGates.X4i,
        ]
    },
    {
        hint: "Sixteenths",
        gates: [
            VariousZGates.Z8,  VariousZGates.Z8i,
            VariousYGates.Y8,  VariousYGates.Y8i,
            VariousXGates.X8,  VariousXGates.X8i,
        ]
    },
    {
        hint: "Spinning",
        gates: [
            PoweringGates.ZForward, PoweringGates.ZBackward,
            PoweringGates.YForward, PoweringGates.YBackward,
            PoweringGates.XForward, PoweringGates.XBackward,
        ]
    },
    {
        hint: "Parametrized",
        gates: [
            ParametrizedRotationGates.ZToA, ParametrizedRotationGates.ZToMinusA,
            ParametrizedRotationGates.YToA, ParametrizedRotationGates.YToMinusA,
            ParametrizedRotationGates.XToA, ParametrizedRotationGates.XToMinusA,
        ]
    },
    {
        hint: 'Silly',
        gates: [
            ZeroGate,   MysteryGateMaker(),
            NeGate,     undefined,
            SpacerGate, undefined
        ]
    }
];

/** @type {!Array<!{hint: !string, gates: !Array<undefined|!Gate>}>} */
Gates.BottomToolboxGroups = [
    {
        hint: "X/Y Probes",
        gates: [
            Controls.XAntiControl, Controls.XControl,
            Controls.YAntiControl, Controls.YControl,
            PostSelectionGates.PostSelectAntiX, PostSelectionGates.PostSelectX,
            PostSelectionGates.PostSelectAntiY, PostSelectionGates.PostSelectY,
        ]
    },
    {
        hint: "Order",
        gates: [
            CountingGates.CountingFamily.ofSize(3),          CountingGates.UncountingFamily.ofSize(3),
            ReverseBitsGateFamily.ofSize(2), undefined,
            CycleBitsGates.CycleBitsFamily.ofSize(3),        CycleBitsGates.ReverseCycleBitsFamily.ofSize(3),
            InterleaveBitsGates.InterleaveBitsGateFamily.ofSize(6),
            InterleaveBitsGates.DeinterleaveBitsGateFamily.ofSize(6),
        ]
    },
    {
        hint: 'Frequency',
        gates: [
            FourierTransformGates.FourierTransformFamily.ofSize(2),
                FourierTransformGates.InverseFourierTransformFamily.ofSize(2),
            undefined, undefined,
            PhaseGradientGates.PhaseGradientFamily.ofSize(2),
                PhaseGradientGates.PhaseDegradientFamily.ofSize(2),
            PhaseGradientGates.DynamicPhaseGradientFamily.ofSize(2),
                PhaseGradientGates.DynamicPhaseDegradientFamily.ofSize(2),
        ]
    },
    {
        hint: "Inputs",
        gates: [
            InputGates.InputAFamily.ofSize(2), InputGates.SetA,
            InputGates.InputBFamily.ofSize(2), InputGates.SetB,
            InputGates.InputRFamily.ofSize(2), InputGates.SetR,
            undefined, undefined,
        ]
    },
    {
        hint: 'Arithmetic',
        gates: [
            IncrementGates.IncrementFamily.ofSize(2), IncrementGates.DecrementFamily.ofSize(2),
            ArithmeticGates.PlusAFamily.ofSize(2), ArithmeticGates.MinusAFamily.ofSize(2),
            MultiplyAccumulateGates.MultiplyAddInputsFamily.ofSize(2),
                MultiplyAccumulateGates.MultiplySubtractInputsFamily.ofSize(2),
            MultiplicationGates.TimesAFamily.ofSize(2), MultiplicationGates.TimesAInverseFamily.ofSize(2),
        ]
    },
    {
        hint: "Compare",
        gates: [
            ComparisonGates.ALessThanB, ComparisonGates.AGreaterThanB,
            ComparisonGates.ALessThanOrEqualToB, ComparisonGates.AGreaterThanOrEqualToB,
            ComparisonGates.AEqualToB, ComparisonGates.ANotEqualToB,
            undefined, undefined,
        ]
    },
    {
        hint: "Modular",
        gates: [
            ModularIncrementGates.IncrementModRFamily.ofSize(2), ModularIncrementGates.DecrementModRFamily.ofSize(2),
            ModularAdditionGates.PlusAModRFamily.ofSize(2), ModularAdditionGates.MinusAModRFamily.ofSize(2),
            ModularMultiplicationGates.TimesAModRFamily.ofSize(2),
                ModularMultiplicationGates.TimesAModRInverseFamily.ofSize(2),
            ModularMultiplicationGates.TimesBToTheAModRFamily.ofSize(2),
                ModularMultiplicationGates.TimesInverseBToTheAModRFamily.ofSize(2),
        ]
    },
];

export {Gates}
