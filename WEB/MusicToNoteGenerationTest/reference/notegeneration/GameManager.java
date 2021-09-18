public enum GameManager {
    INSTANCE;
    
    public static float CHECK_HEIGHT;
    public static float CHECK_UNIT;
    public static float EFFECT_ADJUST;
    public static float HEIGHT;
    public static float HITLINE_SPACE;
    public static float HITLINE_WIDTH;
    public static float NOTE_RANGE;
    public static float QUATER_WIDTH;
    public static float RESULT_TOP;
    public static float VIEW_HEIGHT;
    public static float WIDTH;
    private static SpriteAlphaAnimator alphaAnimator;
    public static boolean[] buttonMissOn;
    public static boolean[] buttonOn;
    public static float displayHeight;
    public static float displayWidth;
    private static Deque<GameEffect> effectList;
    public static boolean isEnd;
    public static boolean isHighSpec;
    public static boolean isIntroEnd;
    public static boolean isLandscapeMode;
    public static long lastTouchStrTime;
    public static IActivityRequestHandler myRequestHandler;
    public static ArrayDeque<NoteCandidate> retryCandidateQueue;
    public static float retryTotalLength;
    public static float touchBarY;
    public static TouchResult touchResult;
    public static Sprite touchResultSprite;
    public static String touchStr;

    static {
        WIDTH = 480.0f;
        QUATER_WIDTH = 120.0f;
        HITLINE_WIDTH = 120.0f;
        HITLINE_SPACE = 0.0f;
        HEIGHT = 800.0f;
        VIEW_HEIGHT = 800.0f;
        RESULT_TOP = 800.0f;
        CHECK_HEIGHT = 160.0f;
        NOTE_RANGE = 800.0f;
        EFFECT_ADJUST = 0.0f;
        touchBarY = 0.0f;
        isLandscapeMode = false;
        isHighSpec = true;
        isIntroEnd = false;
        retryCandidateQueue = new ArrayDeque<>();
        retryTotalLength = 0.0f;
        buttonOn = new boolean[]{false, false, false, false};
        buttonMissOn = new boolean[]{false, false, false, false};
        lastTouchStrTime = 0;
        effectList = new ArrayDeque();
        alphaAnimator = new SpriteAlphaAnimator();
        myRequestHandler = null;
        isEnd = false;
        CHECK_UNIT = 0.0f;
    }

    public static void setLandscapeMode() {
        WIDTH = 800.0f;
        QUATER_WIDTH = 200.0f;
        HITLINE_WIDTH = 155.0f;
        HITLINE_SPACE = 90.0f;
        HEIGHT = 1300.0f;
        VIEW_HEIGHT = 480.0f;
        RESULT_TOP = 585.0f;
        NOTE_RANGE = 1300.0f;
        CHECK_HEIGHT = 125.0f;
        EFFECT_ADJUST = 10.0f;
        isLandscapeMode = true;
    }

    public static void setPortraitMode() {
        WIDTH = 480.0f;
        QUATER_WIDTH = 120.0f;
        HITLINE_WIDTH = 120.0f;
        HITLINE_SPACE = 0.0f;
        HEIGHT = 800.0f;
        VIEW_HEIGHT = 800.0f;
        RESULT_TOP = 820.0f;
        NOTE_RANGE = 800.0f;
        CHECK_HEIGHT = 160.0f;
        EFFECT_ADJUST = 0.0f;
        isLandscapeMode = false;
    }

    public static Deque<GameEffect> getEffectList() {
        return effectList;
    }

    public static SpriteAlphaAnimator getAlphaAnimator() {
        return alphaAnimator;
    }

    public static void reset() {
        effectList.clear();
        isEnd = false;
        isIntroEnd = false;
        touchResultSprite = null;
        touchBarY = 0.0f;
    }
}
