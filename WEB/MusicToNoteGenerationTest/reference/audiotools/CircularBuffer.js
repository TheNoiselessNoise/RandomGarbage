class CircularBuffer {
    // int size
    constructor(size) {
        this.buffer = new Float32Array(size);
        this.available = 0;
        this.readPosition = 0;
        this.writePosition = 0;
    }

    // short[] data, int offset, int count
    write(data, offset, count) {
        if (this.writePosition > this.readPosition || this.available == 0) {
            let copy = Math.min(this.buffer.length - this.writePosition, count);
            AdditionalFuncs.arraycopy(data, offset, this.buffer, this.writePosition, copy);
            this.writePosition = (this.writePosition + copy) % this.buffer.length;
            this.available += copy;
            count -= copy;
            if (count == 0) {
                return;
            }
        }
        let copy2 = Math.min(this.readPosition - this.writePosition, count);
        AdditionalFuncs.arraycopy(data, offset, this.buffer, this.writePosition, copy2);
        this.writePosition += copy2;
        this.available += copy2;
    }

    // short[] data, int offset, int count
    combine(data, offset, count) {
        if (this.writePosition > this.readPosition || this.available == 0) {
            let copy = Math.min(this.buffer.length - this.writePosition, count);
            AdditionalFuncs.combine(data, offset, this.buffer, this.writePosition, copy);
            this.writePosition = (this.writePosition + copy) % this.buffer.length;
            this.available += copy;
            count -= copy;
            if (count == 0) {
                return;
            }
        }
        let copy2 = Math.min(this.readPosition - this.writePosition, count);
        AdditionalFuncs.combine(data, offset, this.buffer, this.writePosition, copy2);
        this.writePosition += copy2;
        this.available += copy2;
    }

    // short[] data, int offset, int count
    // reads data from 'this.buffer' into 'data' from 'offset' to 'offset+count'
    read(data, offset, count) {
        if (this.available == 0) {
            return 0;
        }
        let count2 = Math.min(this.available, count);
        let total = count2;
        let copy = Math.min(this.buffer.length - this.readPosition, total);
        AdditionalFuncs.arraycopy(this.buffer, this.readPosition, data, offset, copy);
        this.readPosition = (this.readPosition + copy) % this.buffer.length;
        this.available -= copy;
        let count3 = count2 - copy;
        if (count3 <= 0 || this.available <= 0) {
            return total;
        }
        let copy2 = Math.min(this.buffer.length - this.available, count3);
        AdditionalFuncs.arraycopy(this.buffer, this.readPosition, data, offset, copy2);
        this.readPosition = (this.readPosition + copy2) % this.buffer.length;
        this.available -= copy2;
        return total;
    }

    clear() {
        let n = this.buffer.length;
        for (let i = 0; i < n; i++) {
            this.buffer[i] = 0;
        }
        this.readPosition = 0;
        this.writePosition = 0;
        this.available = 0;
    }

    setWritePosition(writePosition2) {
        this.writePosition = Math.abs(writePosition2) % this.buffer.length;
    }

    getWritePosition() {
        return this.writePosition;
    }

    setReadPosition(readPosition2) {
        this.readPosition = Math.abs(readPosition2) % this.buffer.length;
    }

    getReadPosition() {
        return this.readPosition;
    }
}
