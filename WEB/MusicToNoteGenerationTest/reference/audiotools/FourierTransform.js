class FourierTransform {
    // int timeSize, float sampleRate
    constructor(ts, sr){
        this.HAMMING = 1;
        this.LINAVG = 2;
        this.LOGAVG = 3;
        this.NOAVG = 4;
        this.NONE = 0;
        this.TWO_PI = 6.2831855;
        this.averages = [];
        this.avgPerOctave = 0;
        this.imag = [];
        this.octaves = 0;
        this.real = [];
        this.spectrum = [];
        this.whichAverage = 0;
        this.timeSize = ts;
        this.sampleRate = sr;
        this.bandWidth = (2 / this.timeSize) * (this.sampleRate / 2);
        noAverages();
        allocateArrays();
        this.whichWindow = 0;
    }

    // float[] r, float[] i
    setComplex(r, i) {
        if (this.real.length == r.length || this.imag.length == i.length) {
            AdditionalFuncs.arraycopy(r, 0, this.real, 0, r.length);
            AdditionalFuncs.arraycopy(i, 0, this.imag, 0, i.length);
            return;
        }
        throw "This won't work";
    }

    fillSpectrum() {
        let lowFreq;
        for (let i = 0; i < this.spectrum.length; i++) {
            this.spectrum[i] = Math.sqrt((this.real[i] * this.real[i]) + (this.imag[i] * this.imag[i]));
        }
        if (this.whichAverage == 2) {
            let avgWidth = this.spectrum.length / this.averages.length;
            for (let i2 = 0; i2 < this.averages.length; i2++) {
                let avg = 0;
                let j = 0;
                while (j < avgWidth) {
                    let offset = j + (i2 * avgWidth);
                    if (offset >= this.spectrum.length) {
                        break;
                    }
                    avg += this.spectrum[offset];
                    j++;
                }
                this.averages[i2] = avg / (j + 1);
            }
        } else if (this.whichAverage == 3) {
            for (let i3 = 0; i3 < this.octaves; i3++) {
                if (i3 == 0) {
                    lowFreq = 0;
                } else {
                    lowFreq = (this.sampleRate / 2) / Math.pow(2, (this.octaves - i3));
                }
                let freqStep = (((this.sampleRate / 2) / Math.pow(2, this.octaves - i3 - 1)) - lowFreq) / this.avgPerOctave;
                let f = lowFreq;
                for (let j2 = 0; j2 < this.avgPerOctave; j2++) {
                    this.averages[j2 + (this.avgPerOctave * i3)] = this.calcAvg(f, f + freqStep);
                    f += freqStep;
                }
            }
        }
    }

    noAverages() {
        this.averages = new Float32Array(0);
        this.whichAverage = 4;
    }

    // int numAvg
    linAverages(numAvg) {
        if (numAvg > this.spectrum.length / 2) {
            throw "The number of averages for this transform can be at most " + (this.spectrum.length / 2) + ".";
        }
        this.averages = new Float32Array(numAvg);
        this.whichAverage = 2;
    }

    // int minBandwidth, int bandsPerOctave
    logAverages(minBandwidth, bandsPerOctave) {
        let nyq = this.sampleRate / 2;
        this.octaves = 1;
        while (true) {
            nyq /= 2;
            if (nyq > minBandwidth) {
                this.octaves++;
            } else {
                this.avgPerOctave = bandsPerOctave;
                this.averages = new Float32Array(this.octaves * bandsPerOctave);
                this.whichAverage = 3;
                return;
            }
        }
    }

    // int which
    window(which) {
        if (which < 0 || which > 1) {
            throw "Invalid window type.";
        }
        this.whichWindow = which;
    }

    // float[] samples
    doWindow(samples) {
        switch (this.whichWindow) {
            case 1:
                this.hamming(samples);
                return;
            default:
                return;
        }
    }

    // float[] samples
    hamming(samples) {
        for (let i = 0; i < samples.length; i++) {
            samples[i] = samples[i] * (0.5400000214576721 - (0.46000000834465027 * Math.cos((6.2831855 * i) / (samples.length - 1))));
        }
    }

    getTimeSize() {
        return this.timeSize;
    }

    specSize() {
        return this.spectrum.length;
    }

    // int i
    getBand(i) {
        if (i < 0) {
            i = 0;
        }
        if (i > this.spectrum.length - 1) {
            i = this.spectrum.length - 1;
        }
        return this.spectrum[i];
    }

    getBandWidth() {
        return this.bandWidth;
    }

    // float freq
    freqToIndex(freq) {
        if (freq < this.getBandWidth() / 2) {
            return 0;
        }
        if (freq > (this.sampleRate / 2) - (this.getBandWidth() / 2)) {
            return this.spectrum.length - 1;
        }
        return Math.round(this.timeSize * (freq / this.sampleRate));
    }

    // int i
    indexToFreq(i) {
        let bw = this.getBandWidth();
        if (i == 0) {
            return bw * 0.25;
        }
        if (i == this.spectrum.length - 1) {
            return ((this.sampleRate / 2) - (bw / 2)) + (bw * 0.25);
        }
        return i * bw;
    }

    // int i
    getAverageCenterFrequency(i) {
        let lowFreq;
        if (this.whichAverage == 2) {
            let avgWidth = this.spectrum.length / this.averages.length;
            return this.indexToFreq((i * avgWidth) + (avgWidth / 2));
        } else if (this.whichAverage != 3) {
            return 0;
        } else {
            let octave = i / this.avgPerOctave;
            let offset = i % this.avgPerOctave;
            if (octave == 0) {
                lowFreq = 0;
            } else {
                lowFreq = (this.sampleRate / 2) / Math.pow(2, this.octaves - octave);
            }
            let freqStep = ((this.sampleRate / 2) / (Math.pow(2, this.octaves - octave - 1)) - lowFreq) / this.avgPerOctave;
            return (freqStep / 2) + lowFreq + (offset * freqStep);
        }
    }

    // float freq
    getFreq(freq) {
        return this.getBand(this.freqToIndex(freq));
    }

    // float freq, float a
    setFreq(freq, a) {
        this.setBand(this.freqToIndex(freq), a);
    }

    // float freq, float s
    scaleFreq(freq, s) {
        this.scaleBand(this.freqToIndex(freq), s);
    }

    avgSize() {
        return this.averages.length;
    }

    // int i
    getAvg(i) {
        if (this.averages.length > 0) {
            return this.averages[i];
        }
        return 0;
    }

    // float lowFreq, float hiFreq
    calcAvg(lowFreq, hiFreq) {
        let lowBound = this.freqToIndex(lowFreq);
        let hiBound = this.freqToIndex(hiFreq);
        let avg = 0;
        for (let i = lowBound; i <= hiBound; i++) {
            avg += this.spectrum[i];
        }
        return avg / ((hiBound - lowBound) + 1);
    }

    // float[] buffer, int startAt
    forward(buffer, startAt) {
        if (buffer.length - startAt < this.timeSize) {
            throw "FourierTransform.forward: not enough samples in the buffer between " + startAt + " and " + buffer.length + " to perform a transform.";
        }
        let section = new Float32Array(this.timeSize);
        AdditionalFuncs.arraycopy(buffer, startAt, section, 0, section.length);
        this.forwardBuffer(section);
    }

    // float[] freqReal, float[] freqImag, float[] buffer
    inverse(freqReal, freqImag, buffer) {
        this.setComplex(freqReal, freqImag);
        this.inverseBuffer(buffer);
    }

    getSpectrum() {
        return this.spectrum;
    }

    getRealPart() {
        return this.real;
    }

    getImaginaryPart() {
        return this.imag;
    }
}
