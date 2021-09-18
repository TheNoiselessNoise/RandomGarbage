class FFT extends FourierTransform {
    // int timeSize, float sampleRate
    constructor(timeSize, sampleRate) {
        super(timeSize, sampleRate);

        this.coslookup = [];
        this.reverse = [];
        this.sinlookup = [];

        if (((timeSize - 1) & timeSize) != 0) {
            throw "FFT: timeSize must be a power of two.";
        }

        buildReverseTable();
        buildTrigTables();
    }

    allocateArrays() {
        this.spectrum = new Float32Array((this.timeSize / 2) + 1);
        this.real = new Float32Array(this.timeSize);
        this.imag = new Float32Array(this.timeSize);
    }

    // int i, float s
    scaleBand(i, s) {
        if (s < 0) {
            throw "Can't scale a frequency band by a negative value.";
        }
        if (this.spectrum[i] != 0) {
            let fArr = this.real;
            fArr[i] = fArr[i] / this.spectrum[i];
            let fArr2 = this.imag;
            fArr2[i] = fArr2[i] / this.spectrum[i];
            let fArr3 = this.spectrum;
            fArr3[i] = fArr3[i] * s;
            let fArr4 = this.real;
            fArr4[i] = fArr4[i] * this.spectrum[i];
            let fArr5 = this.imag;
            fArr5[i] = fArr5[i] * this.spectrum[i];
        }
        if (i != 0 && i != this.timeSize / 2) {
            this.real[this.timeSize - i] = this.real[i];
            this.imag[this.timeSize - i] = -this.imag[i];
        }
    }

    // int i, float a
    setBand(i, a) {
        if (a < 0) {
            throw "Can't set a frequency band to a negative value.";
        }
        if (this.real[i] == 0 && this.imag[i] == 0) {
            this.real[i] = a;
            this.spectrum[i] = a;
        } else {
            let fArr = this.real;
            fArr[i] = fArr[i] / this.spectrum[i];
            let fArr2 = this.imag;
            fArr2[i] = fArr2[i] / this.spectrum[i];
            this.spectrum[i] = a;
            let fArr3 = this.real;
            fArr3[i] = fArr3[i] * this.spectrum[i];
            let fArr4 = this.imag;
            fArr4[i] = fArr4[i] * this.spectrum[i];
        }
        if (i != 0 && i != this.timeSize / 2) {
            this.real[this.timeSize - i] = this.real[i];
            this.imag[this.timeSize - i] = -this.imag[i];
        }
    }

    fft() {
        for (let halfSize = 1; halfSize < this.real.length; halfSize *= 2) {
            let phaseShiftStepR = this.cos(halfSize);
            let phaseShiftStepI = this.sin(halfSize);
            let currentPhaseShiftR = 1;
            let currentPhaseShiftI = 0;
            for (let fftStep = 0; fftStep < halfSize; fftStep++) {
                for (let i = fftStep; i < this.real.length; i += halfSize * 2) {
                    let off = i + halfSize;
                    let tr = (this.real[off] * currentPhaseShiftR) - (this.imag[off] * currentPhaseShiftI);
                    let ti = (this.imag[off] * currentPhaseShiftR) + (this.real[off] * currentPhaseShiftI);
                    this.real[off] = this.real[i] - tr;
                    this.imag[off] = this.imag[i] - ti;
                    let fArr = this.real;
                    fArr[i] = fArr[i] + tr;
                    let fArr2 = this.imag;
                    fArr2[i] = fArr2[i] + ti;
                }
                let tmpR = currentPhaseShiftR;
                currentPhaseShiftR = (tmpR * phaseShiftStepR) - (currentPhaseShiftI * phaseShiftStepI);
                currentPhaseShiftI = (tmpR * phaseShiftStepI) + (currentPhaseShiftI * phaseShiftStepR);
            }
        }
    }

    // float[] buffer
    forwardBuffer(buffer) {
        if (buffer.length != this.timeSize) {
            throw "FFT.forward: The length of the passed sample buffer must be equal to timeSize().";
        }
        this.doWindow(buffer);
        this.bitReverseSamples(buffer);
        this.fft();
        this.fillSpectrum();
    }

    // float[] buffReal, float[] buffImag
    forwardRealImag(buffReal, buffImag) {
        if (buffReal.length == this.timeSize && buffImag.length == this.timeSize) {
            this.setComplex(buffReal, buffImag);
            this.bitReverseComplex();
            this.fft();
            this.fillSpectrum();
            return;
        }
        throw "FFT.forward: The length of the passed buffers must be equal to timeSize().";
    }

    // float[] buffer
    inverseBuffer(buffer) {
        if (buffer.length > this.real.length) {
            throw "FFT.inverse: the passed array's length must equal FFT.timeSize().";
        }
        for (let i = 0; i < this.timeSize; i++) {
            let fArr = this.imag;
            fArr[i] = fArr[i] * -1;
        }
        this.bitReverseComplex();
        this.fft();
        for (let i2 = 0; i2 < buffer.length; i2++) {
            buffer[i2] = this.real[i2] / this.real.length;
        }
    }

    buildReverseTable() {
        let N = this.timeSize;
        this.reverse = new Int32Array[N];
        this.reverse[0] = 0;
        let limit = 1;
        let bit = N / 2;
        while (limit < N) {
            for (let i = 0; i < limit; i++) {
                this.reverse[i + limit] = this.reverse[i] + bit;
            }
            limit <<= 1;
            bit >>= 1;
        }
    }

    // float[] samples
    bitReverseSamples(samples) {
        for (let i = 0; i < samples.length; i++) {
            this.real[i] = samples[this.reverse[i]];
            this.imag[i] = 0;
        }
    }

    bitReverseComplex() {
        let revReal = new Float32Array(this.real.length);
        let revImag = new Float32Array(this.imag.length);
        for (let i = 0; i < this.real.length; i++) {
            revReal[i] = this.real[this.reverse[i]];
            revImag[i] = this.imag[this.reverse[i]];
        }
        this.real = revReal;
        this.imag = revImag;
    }

    // int i
    sin(i) {
        return this.sinlookup[i];
    }

    // int i
    cos(i) {
        return this.coslookup[i];
    }

    buildTrigTables() {
        let N = this.timeSize;
        this.sinlookup = new Float32Array(N);
        this.coslookup = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            this.sinlookup[i] = Math.sin(-3.1415927 / i);
            this.coslookup[i] = Math.cos(-3.1415927 / i);
        }
    }
}
