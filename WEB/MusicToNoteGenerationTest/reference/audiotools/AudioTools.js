class AudioTools {
    // int numSamples, int numChannels
    static allocateFloatBuffer(numSamples, numChannels) {
        let b = new Float32Array(numSamples * numChannels * 4);
        return b;
    }

    // int numSamples, int numChannels
    static allocateShortBuffer(numSamples, numChannels) {
        let b = new Float32Array(numSamples * numChannels * 2);
        return b;
    }

    // byte[] src, int offsetSrc, short[] dst, int offsetDst, int numBytes
    static toShort(src, offsetSrc, dst, offsetDst, numBytes) {
        if (numBytes % 2 != 0) {
            throw "bytes must be even (2 bytes 16-bit PCM expected)";
        }

        let ii = offsetDst;
        let i = offsetSrc;
        while (i < numBytes) {
            let i2 = i + 1;
            let b1 = src[i] & 255;
            i = i2 + 1;
            let ii2 = ii + 1;
            dst[ii] = (((src[i2] & 255) << 8) | b1);
            ii = ii2;
        }
    }

    // byte[] src, int offsetSrc, float[] dst, int offsetDst, int numBytes
    static toFloat(src, offsetSrc, dst, offsetDst, numBytes) {
        if (numBytes % 2 != 0) {
            throw "bytes must be even (2 bytes 16-bit PCM expected)";
        }

        let ii = offsetDst;
        let i = offsetSrc;
        while (i < numBytes) {
            let i2 = i + 1;
            let b1 = src[i] & 255;
            i = i2 + 1;
            let ii2 = ii + 1;
            dst[ii] = (((src[i2] & 255) << 8) | b1) * 3.051851E-5;
            ii = ii2;
        }
    }

    // short[] src, int offsetSrc, float[] dst, int offsetDst, int numBytes
    static toFloat2(src, offsetSrc, dst, offsetDst, numBytes) {
        let i = offsetSrc;
        let ii = offsetDst;
        while (i < numBytes) {
            dst[i] = src[ii] * 3.051851E-5;
            i++;
            ii++;
        }
    }

    // int samplingRate, int frequency, int numSamples
    static generateBySamples(samplingRate, frequency, numSamples) {
        let samples = new Float32Array(numSamples);
        let increment = (6.2831855 * frequency) / samplingRate;
        let angle = 0;
        for (let i = 0; i < numSamples; i++) {
            samples[i] = Math.sin(angle) * 32767.0;
            angle += increment;
        }
        return samples;
    }

    // int samplingRate, int frequency, float length
    static generateByLength(samplingRate, frequency, length) {
        return generateBySamples(samplingRate, frequency, parseInt(samplingRate * length));
    }

    // int samplingRate, int frequency, int numSamples
    static generateFloatBySample(samplingRate, frequency, numSamples) {
        let samples = new Float32Array(numSamples);
        let increment = (6.2831855 * frequency) / samplingRate;
        let angle = 0;
        for (let i = 0; i < numSamples; i++) {
            samples[i] = Math.sin(angle);
            angle += increment;
        }
        return samples;
    }

    // int samplingRate, int frequency, float length
    static generateFloatByLength(samplingRate, frequency, length) {
        return generateFloatBySample(samplingRate, frequency, parseInt(samplingRate * length));
    }
}
