public class Note {

    /* renamed from: id */
    public int f492id;
    private boolean isChecked;
    public boolean isSlideNote = false;
    public int placement;
    public float relativePosition;
    public SlideDirection slideDirection = null;

    /* renamed from: y */
    public float f493y;

    public enum SlideDirection {
        LEFT,
        RIGHT
    }

    public Note(int placement2, float relativePosition2, float y, boolean isSlideNote2, SlideDirection slideDirection2) {
        this.placement = placement2;
        this.relativePosition = relativePosition2;
        this.f493y = y;
        this.isSlideNote = isSlideNote2;
        this.isChecked = false;
        this.slideDirection = slideDirection2;
    }

    public Note getFeverNote() {
        return new Note(this.placement, this.relativePosition, this.f493y + 100.0f, false, null);
    }

    public boolean isChecked() {
        return this.isChecked;
    }

    public void setChecked() {
        this.isChecked = true;
    }
}
