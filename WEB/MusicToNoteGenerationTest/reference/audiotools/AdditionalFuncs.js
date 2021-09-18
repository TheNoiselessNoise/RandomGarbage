class AdditionalFuncs {
    static GL_BYTE = 5120;
    static SHORT_MIN_VALUE = -32768;
    static SHORT_MAX_VALUE = 32767;
    static USHORT_MAX_VALUE = 65535;

    // short[] src_arr, int src_pos, short[] dst_arr, int dst_pos, int len
    static arraycopy(src_arr, src_pos, dst_arr, dst_pos, len){
        for(let l = 0; l < len; l++){
            dst_arr[dst_pos+l] = src_arr[src_pos+l];
        }
    }

    // short[] src, int srcPos, short[] dest, int destPos, int length
    static combine(src, srcPos, dest, destPos, length) {
        for (let i = 0; i < length; i++) {
            let a = src[srcPos + i];
            let b = dest[destPos + i];
            dest[destPos + i] = this.clamp(((a + b) - ((a * b) / 32767)), 0, this.SHORT_MAX_VALUE);
        }
    }

    static clamp(val, min, max){
        if(val < min) return min;
        if(val > max) return max;
        return val;
    }
}