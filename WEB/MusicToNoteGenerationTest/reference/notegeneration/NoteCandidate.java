public class NoteCandidate implements Serializable {
    private static final long serialVersionUID = -7031190042826937455L;
    public boolean isLongNote = false;
    public long position;
    public float relativePosition;
    public float relativeValue;
    public float value;

    public NoteCandidate(long position2, float value2, float relativeValue2) {
        this.position = position2;
        this.value = value2;
        this.relativeValue = relativeValue2;
    }

    public NoteCandidate getClone() {
        NoteCandidate cloneCandidate = new NoteCandidate(this.position, this.value, this.relativeValue);
        cloneCandidate.relativePosition = this.relativePosition;
        cloneCandidate.isLongNote = this.isLongNote;
        return cloneCandidate;
    }
}
