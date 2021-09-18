class Decoder {
    getChannels(){ return 0; } // obvious
    getLength(){ return 0; } // probably length of whole AudioBuffer
    getRate(){ return 0; } // sampleRate ??

    // short[] sArr, int i, int i2
    readSamples(sArr, i, i2){ return 0; } // like CircularBuffer.read() ??

    readAllSamples() {
        let out_length = parseInt(Math.ceil(this.getLength() * this.getRate() * this.getChannels()));
        let out = new Float32Array(out_length);
        let buffer = new Float32Array(AdditionalFuncs.GL_BYTE);
        let totalSamples = 0;
        while (true) {
            let readSamples = this.readSamples(buffer, 0, buffer.length);
            if (readSamples <= 0) {
                break;
            }
            if (readSamples + totalSamples >= out.length) {
                let tmp = new Float32Array(readSamples + totalSamples);
                AdditionalFuncs.arraycopy(out, 0, tmp, 0, totalSamples);
                out = tmp;
            }
            AdditionalFuncs.arraycopy(buffer, 0, out, totalSamples, readSamples);
            totalSamples += readSamples;
        }
        if (out.length == totalSamples) {
            return out;
        }
        let tmp2 = new Float32Array(totalSamples);
        AdditionalFuncs.arraycopy(out, 0, tmp2, 0, totalSamples);
        return tmp2;
    }
}
