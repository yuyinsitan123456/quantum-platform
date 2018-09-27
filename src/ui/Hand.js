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

import {describe} from "src/base/Describe.js"
import {DetailedError} from "src/base/DetailedError.js"
import {Gate} from "src/circuit/Gate.js"
import {GateColumn} from "src/circuit/GateColumn.js"
import {Point} from "src/math/Point.js"
import {Util} from "src/base/Util.js"

class Hand {
    /**
     * @param {undefined|!Point} pos
     * @param {undefined|!Gate} heldGate
     * @param {undefined|!Point} holdOffset
     * @param {undefined|!GateColumn} heldColumn
     * @param {undefined|!Point} resizingGateSlot
     */
    constructor(pos, heldGate, holdOffset, heldColumn, resizingGateSlot) {
        if (pos !== undefined && !(pos instanceof Point)) {
            throw new DetailedError("Bad pos", {pos, heldGate, holdOffset, heldColumn, resizingGateSlot});
        }
        if (heldGate !== undefined && !(heldGate instanceof Gate)) {
            throw new DetailedError("Bad heldGate", {pos, heldGate, holdOffset, heldColumn, resizingGateSlot});
        }
        if (holdOffset !== undefined && !(holdOffset instanceof Point)) {
            throw new DetailedError("Bad holdOffset", {pos, heldGate, holdOffset, heldColumn, resizingGateSlot});
        }
        if (resizingGateSlot !== undefined && !(resizingGateSlot instanceof Point)) {
            throw new DetailedError("Bad resizingGateSlot", {pos, heldGate, holdOffset, heldColumn, resizingGateSlot});
        }
        if (heldColumn !== undefined && !(heldColumn instanceof GateColumn)) {
            throw new DetailedError("Bad heldColumn", {pos, heldGate, holdOffset, heldColumn, resizingGateSlot});
        }
        if (heldGate !== undefined && this.resizingGateSlot !== undefined) {
            throw new DetailedError("Holding AND resizing", {pos, heldGate, holdOffset, heldColumn, resizingGateSlot});
        }

        /** @type {undefined|!Point} */
        this.pos = pos;
        /** @type {undefined|!Gate} */
        this.heldGate = heldGate;
        /** @type {undefined|!Point} */
        this.holdOffset = holdOffset;
        /** @type {undefined|!GateColumn} */
        this.heldColumn = heldColumn;
        /** @type {undefined|!Point} */
        this.resizingGateSlot = resizingGateSlot;
    }

    /**
     * @param {!Painter} painter
     */
    paintCursor(painter) {
        if (this.heldGate !== undefined || this.heldColumn !== undefined) {
            painter.setDesiredCursor('move');
        } else if (this.resizingGateSlot !== undefined) {
            painter.setDesiredCursor('ns-resize');
        }
    }

    /**
     * @returns {!boolean}
     */
    isBusy() {
        return this.heldGate !== undefined || this.heldColumn !== undefined || this.resizingGateSlot !== undefined;
    }

    /**
     * @returns {!Array.<!Point>}
     */
    hoverPoints() {
        return this.pos === undefined || this.isBusy() ? [] : [this.pos];
    }

    /**
     * @param {!Hand|*} other
     * @returns {!boolean}
     */
    isEqualTo(other) {
        if (this === other) {
            return true;
        }
        return other instanceof Hand &&
            Util.CUSTOM_IS_EQUAL_TO_EQUALITY(this.pos, other.pos) &&
            Util.CUSTOM_IS_EQUAL_TO_EQUALITY(this.holdOffset, other.holdOffset) &&
            Util.CUSTOM_IS_EQUAL_TO_EQUALITY(this.heldGate, other.heldGate) &&
            Util.CUSTOM_IS_EQUAL_TO_EQUALITY(this.heldColumn, other.heldColumn) &&
            Util.CUSTOM_IS_EQUAL_TO_EQUALITY(this.resizingGateSlot, other.resizingGateSlot);
    }

    /**
     * @returns {!string}
     */
    toString() {
        return `Hand(${describe({
            pos: this.pos,
            heldGate: this.heldGate,
            holdOffset: this.holdOffset,
            heldColumn: this.heldColumn,
            resizingGateSlot: this.resizingGateSlot
        })}`;
    }

    /**
     * @param {undefined|!Point} newPos
     * @returns {!Hand}
     */
    withPos(newPos) {
        return new Hand(newPos, this.heldGate, this.holdOffset, this.heldColumn, this.resizingGateSlot);
    }

    /**
     * @returns {!Hand}
     */
    withDrop() {
        return new Hand(this.pos, undefined, undefined, undefined, undefined);
    }

    /**
     * @param {!Gate} heldGate
     * @param {!Point} heldGateOffset
     * @returns {!Hand}
     */
    withHeldGate(heldGate, heldGateOffset) {
        return new Hand(this.pos, heldGate, heldGateOffset, undefined, undefined);
    }

    /**
     * @param {!GateColumn} heldGateColumn
     * @param {!Point} heldGateOffset
     * @returns {!Hand}
     */
    withHeldGateColumn(heldGateColumn, heldGateOffset) {
        return new Hand(this.pos, undefined, heldGateOffset, heldGateColumn, undefined);
    }

    /**
     * @param {!Point} resizeSlot
     * @param {!Point} resizeTabOffset
     * @returns {!Hand}
     */
    withResizeSlot(resizeSlot, resizeTabOffset) {
        return new Hand(this.pos, undefined, resizeTabOffset, undefined, resizeSlot);
    }

    /**
     * @returns {Infinity|!number}
     */
    stableDuration() {
        return this.heldGate !== undefined ? this.heldGate.stableDuration() :
            this.heldColumn !== undefined ? this.heldColumn.stableDuration() :
            Infinity;
    }
}

Hand.EMPTY = new Hand(undefined, undefined, undefined, undefined, undefined);

export {Hand}
