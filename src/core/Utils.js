/******************************************************************************
 * Spine Runtimes Software License v2.5
 *
 * Copyright (c) 2013-2016, Esoteric Software
 * All rights reserved.
 *
 * You are granted a perpetual, non-exclusive, non-sublicensable, and
 * non-transferable license to use, install, execute, and perform the Spine
 * Runtimes software and derivative works solely for personal or internal
 * use. Without the written permission of Esoteric Software (see Section 2 of
 * the Spine Software License Agreement), you may not (a) modify, translate,
 * adapt, or develop new applications using the Spine Runtimes or otherwise
 * create derivative works or improvements of the Spine Runtimes or (b) remove,
 * delete, alter, or obscure any trademarks or any copyright, trademark, patent,
 * or other intellectual property or proprietary rights notices on or in the
 * Software, including any copy thereof. Redistributions in binary or source
 * form must include this license and terms.
 *
 * THIS SOFTWARE IS PROVIDED BY ESOTERIC SOFTWARE "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
 * EVENT SHALL ESOTERIC SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, BUSINESS INTERRUPTION, OR LOSS OF
 * USE, DATA, OR PROFITS) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

export class IntSet {
    array = [];

    add(value) {
        let contains = this.contains(value);
        this.array[value | 0] = value | 0;
        return !contains;
    }

    contains(value) {
        return this.array[value | 0] != undefined;
    }

    remove(value) {
        this.array[value | 0] = undefined;
    }

    clear() {
        this.array.length = 0;
    }
}

export class Disposable {
    dispose() {
    }
}

export class Restorable {
    restore() {
    }
}

export class Color {
    static WHITE = new Color(1, 1, 1, 1);
    static RED = new Color(1, 0, 0, 1);
    static GREEN = new Color(0, 1, 0, 1);
    static BLUE = new Color(0, 0, 1, 1);
    static MAGENTA = new Color(1, 0, 1, 1);

    r;
    g;
    b;
    a;

    constructor(r = 0, g = 0, b = 0, a = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    set(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.clamp();
        return this;
    }

    setFromColor(c) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
        return this;
    }

    setFromString(hex) {
        hex = hex.charAt(0) == '#' ? hex.substr(1) : hex;
        this.r = parseInt(hex.substr(0, 2), 16) / 255.0;
        this.g = parseInt(hex.substr(2, 2), 16) / 255.0;
        this.b = parseInt(hex.substr(4, 2), 16) / 255.0;
        this.a = (hex.length != 8 ? 255 : parseInt(hex.substr(6, 2), 16)) / 255.0;
        return this;
    }

    add(r, g, b, a) {
        this.r += r;
        this.g += g;
        this.b += b;
        this.a += a;
        this.clamp();
        return this;
    }

    clamp() {
        if (this.r < 0) {
            this.r = 0;
        } else if (this.r > 1) {
            this.r = 1;
        }

        if (this.g < 0) {
            this.g = 0;
        } else if (this.g > 1) {
            this.g = 1;
        }

        if (this.b < 0) {
            this.b = 0;
        } else if (this.b > 1) {
            this.b = 1;
        }

        if (this.a < 0) {
            this.a = 0;
        } else if (this.a > 1) {
            this.a = 1;
        }
        return this;
    }

    static rgba8888ToColor(color, value) {
        color.r = ((value & 0xff000000) >>> 24) / 255;
        color.g = ((value & 0x00ff0000) >>> 16) / 255;
        color.b = ((value & 0x0000ff00) >>> 8) / 255;
        color.a = ((value & 0x000000ff)) / 255;
    }

    static rgb888ToColor(color, value) {
        color.r = ((value & 0x00ff0000) >>> 16) / 255;
        color.g = ((value & 0x0000ff00) >>> 8) / 255;
        color.b = ((value & 0x000000ff)) / 255;
    }
}

export class MathUtils {
    static PI = 3.1415927;
    static PI2 = MathUtils.PI * 2;
    static radiansToDegrees = 180 / MathUtils.PI;
    static radDeg = MathUtils.radiansToDegrees;
    static degreesToRadians = MathUtils.PI / 180;
    static degRad = MathUtils.degreesToRadians;

    static clamp(value, min, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    static cosDeg(degrees) {
        return Math.cos(degrees * MathUtils.degRad);
    }

    static sinDeg(degrees) {
        return Math.sin(degrees * MathUtils.degRad);
    }

    static signum(value) {
        return value > 0 ? 1 : value < 0 ? -1 : 0;
    }

    static toInt(x) {
        return x > 0 ? Math.floor(x) : Math.ceil(x);
    }

    static cbrt(x) {
        let y = Math.pow(Math.abs(x), 1 / 3);
        return x < 0 ? -y : y;
    }

    static randomTriangular(min, max) {
        return MathUtils.randomTriangularWith(min, max, (min + max) * 0.5);
    }

    static randomTriangularWith(min, max, mode) {
        let u = Math.random();
        let d = max - min;
        if (u <= (mode - min) / d) {
            return min + Math.sqrt(u * d * (mode - min));
        }
        return max - Math.sqrt((1 - u) * d * (max - mode));
    }
}

export class Interpolation {
    applyInternal(a) {
    }

    apply(start, end, a) {
        return start + (end - start) * this.applyInternal(a);
    }
}

export class Pow extends Interpolation {
    power = 2;

    constructor(power) {
        super();
        this.power = power;
    }

    applyInternal(a) {
        if (a <= 0.5) {
            return Math.pow(a * 2, this.power) / 2;
        }
        return Math.pow((a - 1) * 2, this.power) / (this.power % 2 == 0 ? -2 : 2) + 1;
    }
}

export class PowOut extends Pow {
    constructor(power) {
        super(power);
    }

    applyInternal(a) {
        return Math.pow(a - 1, this.power) * (this.power % 2 == 0 ? -1 : 1) + 1;
    }
}

export class Utils {
    static SUPPORTS_TYPED_ARRAYS = typeof (Float32Array) !== "undefined";

    static arrayCopy(source, sourceStart, dest, destStart, numElements) {
        for (let i = sourceStart, j = destStart; i < sourceStart + numElements; i++, j++) {
            dest[j] = source[i];
        }
    }

    static setArraySize(array, size, value = 0) {
        let oldSize = array.length;
        if (oldSize == size) {
            return array;
        }
        array.length = size;
        if (oldSize < size) {
            for (let i = oldSize; i < size; i++) {
                array[i] = value;
            }
        }
        return array;
    }

    static ensureArrayCapacity(array, size, value = 0) {
        if (array.length >= size) {
            return array;
        }
        return Utils.setArraySize(array, size, value);
    }

    static newArray(size, defaultValue) {
        let array = Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = defaultValue;
        }
        return array;
    }

    static newFloatArray(size) {
        if (Utils.SUPPORTS_TYPED_ARRAYS) {
            return new Float32Array(size)
        } else {
            let array = Array(size);
            for (let i = 0; i < array.length; i++) {
                array[i] = 0;
            }
            return array;
        }
    }

    static newShortArray(size) {
        if (Utils.SUPPORTS_TYPED_ARRAYS) {
            return new Int16Array(size)
        } else {
            let array = Array(size);
            for (let i = 0; i < array.length; i++) {
                array[i] = 0;
            }
            return array;
        }
    }

    static toFloatArray(array) {
        return Utils.SUPPORTS_TYPED_ARRAYS ? new Float32Array(array) : array;
    }

    static toSinglePrecision(value) {
        return Utils.SUPPORTS_TYPED_ARRAYS ? Math.fround(value) : value;
    }

    // This function is used to fix WebKit 602 specific issue described at http://esotericsoftware.com/forum/iOS-10-disappearing-graphics-10109
    static webkit602BugfixHelper(alpha, blend) {

    }

    static contains(array, element, identity = true) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] == element) {
                return true;
            }
        }
        return false;
    }
}

export class DebugUtils {
    static logBones(skeleton) {
        for (let i = 0; i < skeleton.bones.length; i++) {
            let bone = skeleton.bones[i];
            let mat = bone.matrix;
            console.log(bone.data.name + ", " + mat.a + ", " + mat.b + ", " + mat.c + ", " + mat.d + ", " + mat.tx + ", " + mat.ty);
        }
    }
}

export class Pool {
    items = [];
    instantiator;

    constructor(instantiator) {
        this.instantiator = instantiator;
    }

    obtain() {
        return this.items.length > 0 ? this.items.pop() : this.instantiator();
    }

    free(item) {
        if (item.reset) {
            item.reset();
        }
        this.items.push(item);
    }

    freeAll(items) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].reset) {
                items[i].reset();
            }
            this.items[i] = items[i];
        }
    }

    clear() {
        this.items.length = 0;
    }
}

export class Vector2 {
    x;
    y;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    length() {
        let x = this.x;
        let y = this.y;
        return Math.sqrt(x * x + y * y);
    }

    normalize() {
        let len = this.length();
        if (len != 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }
}

export class TimeKeeper {
    maxDelta = 0.064;
    framesPerSecond = 0;
    delta = 0;
    totalTime = 0;

    lastTime = Date.now() / 1000;
    frameCount = 0;
    frameTime = 0;

    update() {
        let now = Date.now() / 1000;
        this.delta = now - this.lastTime;
        this.frameTime += this.delta;
        this.totalTime += this.delta;
        if (this.delta > this.maxDelta) {
            this.delta = this.maxDelta;
        }
        this.lastTime = now;

        this.frameCount++;
        if (this.frameTime > 1) {
            this.framesPerSecond = this.frameCount / this.frameTime;
            this.frameTime = 0;
            this.frameCount = 0;
        }
    }
}

export class WindowedMean {
    values;
    addedValues = 0;
    lastValue = 0;
    mean = 0;
    dirty = true;

    constructor(windowSize = 32) {
        this.values = Array(windowSize);
    }

    hasEnoughData() {
        return this.addedValues >= this.values.length;
    }

    addValue(value) {
        if (this.addedValues < this.values.length) {
            this.addedValues++;
        }
        this.values[this.lastValue++] = value;
        if (this.lastValue > this.values.length - 1) {
            this.lastValue = 0;
        }
        this.dirty = true;
    }

    getMean() {
        if (this.hasEnoughData()) {
            if (this.dirty) {
                let mean = 0;
                for (let i = 0; i < this.values.length; i++) {
                    mean += this.values[i];
                }
                this.mean = mean / this.values.length;
                this.dirty = false;
            }
            return this.mean;
        } else {
            return 0;
        }
    }
}
