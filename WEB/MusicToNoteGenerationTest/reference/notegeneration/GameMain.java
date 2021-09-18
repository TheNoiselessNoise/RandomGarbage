public class GameMain extends ApplicationAdapter {
    private static final String ADJUST_SAMPLE_FILE = "sample/adjust.mp3";
    public static final int NOTE_SPEED_1 = 2500;
    public static final int NOTE_SPEED_2 = 2100;
    public static final int NOTE_SPEED_3 = 1600;
    public static final int NOTE_SPEED_4 = 1300;
    public static final int NOTE_SPEED_5 = 1000;
    public static final int NOTE_SPEED_6 = 700;
    public static final int NOTE_SPEED_HALF = 2700;
    public static final int NOTE_UNIT_EASY = 400;
    public static final int NOTE_UNIT_EXTREME = 180;
    public static final int NOTE_UNIT_HARD = 250;
    public static final int NOTE_UNIT_NORMAL = 300;
    private static final String[] SAMPLE_FILES = {"sample/ocean-motion.mp3", "sample/new-life.mp3", "sample/rock-star.mp3", "sample/go-for-it.mp3", "sample/happy-digital-anthem.mp3", "sample/big-room.mp3", "sample/beautiful-moments.mp3", "sample/standalone.mp3"};
    private static final float[][] THEME_COLOR_ARRAY = {new float[]{0.0f, 0.0f, 0.0f, 1.0f}, new float[]{1.0f, 1.0f, 1.0f, 1.0f}, new float[]{0.2f, 0.2f, 0.2f, 1.0f}};
    private static final String[] THEME_NAME = {"default", "shadow", "jellypop"};
    /* access modifiers changed from: private */
    public static AudioFormat audioFormat = AudioFormat.MP3;
    public static int noteUnitLevel = 300;
    /* access modifiers changed from: private */
    public static Comparator<NoteCandidate> positionComparator = new Comparator<NoteCandidate>() {
        public int compare(NoteCandidate nc1, NoteCandidate nc2) {
            return (int) (nc1.position - nc2.position);
        }
    };
    /* access modifiers changed from: private */
    public static Comparator<NoteCandidate> relativeValueComparator = new Comparator<NoteCandidate>() {
        public int compare(NoteCandidate nc1, NoteCandidate nc2) {
            if (nc1.relativeValue == nc2.relativeValue) {
                return 0;
            }
            if (nc1.relativeValue > nc2.relativeValue) {
                return -1;
            }
            return 1;
        }
    };
    /* access modifiers changed from: private */
    public static Comparator<NoteCandidate> valueComparator = new Comparator<NoteCandidate>() {
        public int compare(NoteCandidate nc1, NoteCandidate nc2) {
            if (nc1.value == nc2.value) {
                return 0;
            }
            if (nc1.value > nc2.value) {
                return -1;
            }
            return 1;
        }
    };
    /* access modifiers changed from: private */
    public int NB_BARS;
    private final int SAMPLE_SIZE;
    private Sprite albumArtSprite;
    private Texture albumArtTexture;
    float avg1;
    /* access modifiers changed from: private */
    public Sprite backSprite;
    private Sprite badSprite;
    private SpriteBatch batch;
    private float bottomHeight;
    /* access modifiers changed from: private */
    public Sprite bottomSprite;

    /* renamed from: c */
    Color f485c;
    /* access modifiers changed from: private */
    public int channels;
    private ParticleEffect combo1Effect;
    private ParticleEffectPool combo1EffectPool;
    private BitmapFont comboFont;
    private float comboPositionY;
    /* access modifiers changed from: private */
    public ContinueButton continueButton;
    float curPosition;
    private ParticleEffect dustEffect;
    private ParticleEffectPool dustEffectPool;
    private GameEffect dustGameEffect;
    long effectTime;
    private Array<PooledEffect> effects;
    /* access modifiers changed from: private */
    public boolean enterPause;
    /* access modifiers changed from: private */
    public FileHandle externalFile;
    private ParticleEffect failEffect;
    private ParticleEffectPool failEffectPool;
    /* access modifiers changed from: private */
    public KissFFT fft;
    private float fontAdjustValue;
    /* access modifiers changed from: private */
    public GameResult gameResult;
    private ParticleEffect goodEffect;
    private ParticleEffectPool goodEffectPool;
    private Sprite goodSprite;
    private Sprite greatSprite;
    private long highScore;
    private Sprite hitBarSprite;
    private ParticleEffect hitEffect;
    private ParticleEffectPool hitEffectPool;
    private float hitMarkPositionY;
    private boolean isAlbumArtOn;
    /* access modifiers changed from: private */
    public boolean isBadFile;
    /* access modifiers changed from: private */
    public boolean isEnd;
    /* access modifiers changed from: private */
    public boolean isPause;
    /* access modifiers changed from: private */
    public boolean isPlaying;
    /* access modifiers changed from: private */
    public boolean isResume;
    public boolean isRetry;
    private Thread loadingThread;
    /* access modifiers changed from: private */
    public Thread mPlayThread;
    /* access modifiers changed from: private */
    public Camera mainCamera;
    /* access modifiers changed from: private */
    public Stage mainStage;
    private BitmapFont miniFont;
    private DelayMinusButton minusButton;
    private Sprite missBarSprite;
    private Sprite missSprite;

    /* renamed from: nb */
    int f486nb;
    /* access modifiers changed from: private */
    public ArrayDeque<NoteCandidate> noteCandidateQueue;
    private float noteHeightAdjustValue;
    /* access modifiers changed from: private */
    public int noteLifeTime;
    float noteOffset;
    private Sprite noteSlideLeftSprite;
    private Sprite noteSlideRightSprite;
    private Sprite noteSprite;
    long noteTime;
    private float noteWidthAdjustValue;
    /* access modifiers changed from: private */
    public OrthographicCamera orthCamera;
    private long pauseTime;
    private ParticleEffect perfectEffect;
    private ParticleEffectPool perfectEffectPool;
    private Sprite perfectSprite;
    /* access modifiers changed from: private */
    public PlayType playType;
    private DelayPlusButton plusButton;
    private long prevProgressTime;
    long prevReadSamples;
    private float progressMargin;
    private Sprite progressPastSprite;
    private Sprite progressPointSprite;
    int progressPosition;
    private Sprite progressTrackSprite;
    /* access modifiers changed from: private */
    public long readSamples;
    boolean reqScreenshot;
    private Sprite resultBackSprite;
    /* access modifiers changed from: private */
    public int samplePosition;
    /* access modifiers changed from: private */
    public int sampleRate;
    /* access modifiers changed from: private */
    public short[] samples;
    private DelaySaveButton saveButton;
    float scale;
    private BitmapFont scoreFont;
    private Sound scoreSound;
    /* access modifiers changed from: private */
    public ShareButton shareButton;
    private BitmapFont smallFont;
    /* access modifiers changed from: private */
    public Song song;
    /* access modifiers changed from: private */
    public float[] spectrum;
    float startPosition;
    /* access modifiers changed from: private */
    public long startTime;
    String strCombo;
    /* access modifiers changed from: private */
    public ArrayList<NoteCandidate> tempCandidateArray;
    private TextureAtlas textureAtlas;
    private String themeFolder;
    public int themeId;
    /* access modifiers changed from: private */
    public Sprite topSprite;
    /* access modifiers changed from: private */
    public float[] topValues;
    /* access modifiers changed from: private */
    public float totalLength;
    /* access modifiers changed from: private */
    public long totalSampleSize;
    private Sprite touchBarSprite;
    private Sound touchSound;
    float volumeAvg;
    /* access modifiers changed from: private */
    public ArrayDeque<Float> volumeList;
    long volumeTime;

    public enum PlayType {
        SAMPLE,
        LOCAL,
        ADJUST
    }

    public long getStartTime() {
        return this.startTime;
    }

    public PlayType getPlayType() {
        return this.playType;
    }

    public GameMain() {
        this(PlayType.SAMPLE, null, 0, 220, 2100, false, false, 0, 0, false, false);
        this.song = new Song();
        this.song.f753id = -8;
        this.song.album = null;
    }

    public GameMain(long delayTime) {
        this(PlayType.ADJUST, null, 0, 220, 1600, false, false, 0, delayTime, false, false);
    }

    public GameMain(PlayType playType2, Song song2, int themeId2, int levelInterval, int gameSpeed, boolean isAlbumArtOn2, boolean isSlideNoteOn, long highScore2, long delayTime, boolean isHighEffect, boolean isRetry2) {
        this.fontAdjustValue = 0.0f;
        this.isAlbumArtOn = false;
        this.isPlaying = false;
        this.isEnd = false;
        this.isPause = false;
        this.enterPause = false;
        this.isResume = true;
        this.startTime = 0;
        this.pauseTime = 0;
        this.highScore = 0;
        this.combo1EffectPool = null;
        this.effects = new Array<>();
        this.SAMPLE_SIZE = 2048;
        this.samples = new short[2048];
        this.spectrum = new float[2048];
        this.topValues = new float[2048];
        this.volumeList = new ArrayDeque<>();
        this.noteCandidateQueue = new ArrayDeque<>();
        this.tempCandidateArray = new ArrayList<>();
        this.NB_BARS = 4;
        this.samplePosition = 0;
        this.sampleRate = 0;
        this.channels = 0;
        this.readSamples = 0;
        this.totalSampleSize = 0;
        this.song = null;
        this.totalLength = 0.0f;
        this.isBadFile = false;
        this.comboPositionY = 0.0f;
        this.hitMarkPositionY = 0.0f;
        this.bottomHeight = 0.0f;
        this.noteHeightAdjustValue = 0.0f;
        this.noteWidthAdjustValue = 0.0f;
        this.progressMargin = 0.0f;
        this.prevReadSamples = 0;
        this.volumeTime = 0;
        this.noteTime = 0;
        this.volumeAvg = 0.0f;
        this.effectTime = 0;
        this.curPosition = 0.0f;
        this.startPosition = 0.0f;
        this.isRetry = false;
        this.themeId = 0;
        this.combo1Effect = null;
        this.dustGameEffect = null;
        this.strCombo = "";
        this.scale = 0.0f;
        this.noteOffset = 0.0f;
        this.reqScreenshot = false;
        this.progressPosition = 0;
        this.prevProgressTime = 0;
        this.f485c = new Color(1.0f, 1.0f, 1.0f, 0.8f);
        NoteManager.init();
        this.playType = playType2;
        this.song = song2;
        this.themeId = themeId2;
        this.highScore = highScore2;
        this.isRetry = isRetry2;
        this.isAlbumArtOn = isAlbumArtOn2;
        NoteManager.setLevelInterval(levelInterval);
        if (levelInterval == 100) {
            noteUnitLevel = 180;
        } else if (levelInterval == 150) {
            noteUnitLevel = 250;
        } else if (levelInterval == 300) {
            noteUnitLevel = 400;
        } else {
            noteUnitLevel = 300;
        }
        this.noteLifeTime = gameSpeed;
        this.themeFolder = THEME_NAME[themeId2] + "/";
        NoteManager.noteDelayTime = delayTime;
        NoteManager.isSlideNoteOn = isSlideNoteOn;
        GameManager.isHighSpec = isHighEffect;
    }

    public void initFont() {
        FreeTypeFontGenerator regularGenerator = new FreeTypeFontGenerator(Gdx.files.internal("font/TitilliumWeb-Regular.ttf"));
        this.smallFont = regularGenerator.generateFont(26);
        this.miniFont = regularGenerator.generateFont(24);
        FreeTypeFontGenerator italicGenerator = new FreeTypeFontGenerator(Gdx.files.internal("font/TitilliumWeb-Italic.ttf"));
        this.scoreFont = italicGenerator.generateFont(70);
        if (this.themeId == 0) {
            this.comboFont = italicGenerator.generateFont(70);
            this.fontAdjustValue = 10.0f;
        } else if (this.themeId == 1) {
            FreeTypeFontGenerator comboFontGenerator = new FreeTypeFontGenerator(Gdx.files.internal("font/Railway.ttf"));
            FreeTypeFontParameter parameter = new FreeTypeFontParameter();
            parameter.size = 56;
            parameter.characters = "1234567890";
            this.comboFont = comboFontGenerator.generateFont(parameter);
            comboFontGenerator.dispose();
        } else if (this.themeId == 2) {
            this.comboFont = regularGenerator.generateFont(50);
        }
        if (GameManager.isHighSpec) {
            this.comboFont.getRegion().getTexture().setFilter(TextureFilter.Linear, TextureFilter.Linear);
        } else {
            this.comboFont.getRegion().getTexture().setFilter(TextureFilter.Nearest, TextureFilter.Nearest);
        }
        this.scoreFont.getRegion().getTexture().setFilter(TextureFilter.Linear, TextureFilter.Linear);
        this.smallFont.getRegion().getTexture().setFilter(TextureFilter.Linear, TextureFilter.Linear);
        this.miniFont.getRegion().getTexture().setFilter(TextureFilter.Linear, TextureFilter.Linear);
        regularGenerator.dispose();
        italicGenerator.dispose();
    }

    public String getEffectFileName(String prefix) {
        String effectFileName = prefix;
        if (GameManager.isLandscapeMode) {
            effectFileName = effectFileName + "_l";
        }
        if (!GameManager.isHighSpec) {
            effectFileName = effectFileName + "_s";
        }
        return effectFileName + ".p";
    }

    public void initEffect() {
        this.dustEffect = new ParticleEffect();
        if (GameManager.isLandscapeMode) {
            this.dustEffect.load(Gdx.files.internal("data/" + this.themeFolder + "dust1_l.p"), this.textureAtlas, "");
        } else {
            this.dustEffect.load(Gdx.files.internal("data/" + this.themeFolder + "dust1.p"), this.textureAtlas, "");
        }
        this.dustEffect.setPosition(0.0f, 0.0f);
        this.dustEffectPool = new ParticleEffectPool(this.dustEffect, 5, 10);
        this.goodEffect = new ParticleEffect();
        this.goodEffect.load(Gdx.files.internal("data/" + this.themeFolder + getEffectFileName("good")), this.textureAtlas, "");
        this.goodEffect.setPosition(0.0f, 0.0f);
        this.goodEffectPool = new ParticleEffectPool(this.goodEffect, 5, 10);
        this.hitEffect = new ParticleEffect();
        this.hitEffect.load(Gdx.files.internal("data/" + this.themeFolder + getEffectFileName("hit")), this.textureAtlas, "");
        this.hitEffect.setPosition(0.0f, 0.0f);
        this.hitEffectPool = new ParticleEffectPool(this.hitEffect, 5, 10);
        this.perfectEffect = new ParticleEffect();
        this.perfectEffect.load(Gdx.files.internal("data/" + this.themeFolder + getEffectFileName("perfect")), this.textureAtlas, "");
        this.perfectEffect.setPosition(0.0f, 0.0f);
        this.perfectEffectPool = new ParticleEffectPool(this.perfectEffect, 5, 10);
        if (this.themeId == 0) {
            this.combo1Effect = new ParticleEffect();
            if (GameManager.isLandscapeMode) {
                this.combo1Effect.load(Gdx.files.internal("data/" + this.themeFolder + "combo1_l.p"), this.textureAtlas, "");
            } else {
                this.combo1Effect.load(Gdx.files.internal("data/" + this.themeFolder + "combo1.p"), this.textureAtlas, "");
            }
            this.combo1Effect.setPosition(0.0f, 0.0f);
            this.combo1EffectPool = new ParticleEffectPool(this.combo1Effect, 5, 10);
        }
        this.failEffect = new ParticleEffect();
        this.failEffect.load(Gdx.files.internal("data/" + this.themeFolder + getEffectFileName("fail")), this.textureAtlas, "");
        this.failEffect.setPosition(GameManager.WIDTH, GameManager.CHECK_HEIGHT);
        this.failEffectPool = new ParticleEffectPool(this.failEffect, 5, 10);
        if (this.themeId == 0) {
            this.dustGameEffect = new GameEffect(new Vector2(GameManager.WIDTH / 2.0f, GameManager.VIEW_HEIGHT / 2.0f), EffectType.DUST);
        }
    }

    public void initStage() {
        GameManager.CHECK_UNIT = (float) (22000 / this.noteLifeTime);
        if (GameManager.isLandscapeMode) {
            GameManager.CHECK_UNIT *= 1.25f;
        }
        FreeTypeFontGenerator regularGenerator = new FreeTypeFontGenerator(Gdx.files.internal("font/TitilliumWeb-Regular.ttf"));
        this.gameResult = new GameResult(this.resultBackSprite, this.scoreFont, this.smallFont, this.miniFont, this.highScore, this.scoreSound);
        this.shareButton = new ShareButton(this.touchSound, regularGenerator);
        this.continueButton = new ContinueButton(this.touchSound, regularGenerator);
        if (this.playType == PlayType.ADJUST) {
            this.minusButton = new DelayMinusButton(this.touchSound, regularGenerator);
            this.plusButton = new DelayPlusButton(this.touchSound, regularGenerator);
            this.saveButton = new DelaySaveButton(this.touchSound, regularGenerator);
            this.mainStage.addActor(this.minusButton);
            this.mainStage.addActor(this.plusButton);
            this.mainStage.addActor(this.saveButton);
        }
        regularGenerator.dispose();
    }

    private void initSprite() {
        this.textureAtlas = new TextureAtlas(Gdx.files.internal("data/" + THEME_NAME[this.themeId] + ".pack"));
        AtlasRegion region = this.textureAtlas.findRegion("bottom");
        if (this.themeId == 2) {
            region.getTexture().setFilter(TextureFilter.Linear, TextureFilter.Linear);
        }
        this.bottomSprite = new Sprite((TextureRegion) region);
        this.bottomSprite.setSize(GameManager.WIDTH, this.bottomHeight);
        this.bottomSprite.setOrigin(this.bottomSprite.getWidth() / 2.0f, 0.0f);
        this.bottomSprite.setPosition(0.0f, 0.0f);
        this.backSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("line_back"));
        this.backSprite.setSize(GameManager.WIDTH, (GameManager.HEIGHT - GameManager.CHECK_HEIGHT) - 5.0f);
        this.backSprite.setOrigin(this.backSprite.getWidth() / 2.0f, this.backSprite.getHeight() / 2.0f);
        this.backSprite.setAlpha(0.3f);
        if (this.themeId == 2) {
            if (GameManager.isLandscapeMode) {
                this.backSprite.setPosition(0.0f, GameManager.CHECK_HEIGHT + 45.0f);
            } else {
                this.backSprite.setPosition(0.0f, GameManager.CHECK_HEIGHT + 53.0f);
            }
            this.backSprite.setAlpha(0.2f);
        } else {
            this.backSprite.setPosition(0.0f, GameManager.CHECK_HEIGHT + 10.0f);
        }
        this.topSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("top"));
        if (GameManager.isLandscapeMode) {
            this.topSprite.setSize(GameManager.WIDTH, (80.0f * GameManager.HEIGHT) / 800.0f);
            this.topSprite.setOrigin(this.topSprite.getWidth() / 2.0f, this.topSprite.getHeight() / 2.0f);
            this.topSprite.setPosition(0.0f, (GameManager.VIEW_HEIGHT - this.topSprite.getHeight()) - 40.0f);
        } else {
            this.topSprite.setSize(GameManager.WIDTH, GameManager.HEIGHT / 3.0f);
            this.topSprite.setOrigin(this.topSprite.getWidth() / 2.0f, this.topSprite.getHeight() / 2.0f);
            this.topSprite.setPosition(0.0f, GameManager.VIEW_HEIGHT - this.topSprite.getHeight());
        }
        this.touchBarSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("touchbar"));
        this.touchBarSprite.setSize(GameManager.QUATER_WIDTH + 6.0f, GameManager.CHECK_HEIGHT + 19.0f);
        this.touchBarSprite.setOrigin(this.touchBarSprite.getWidth() / 2.0f, this.touchBarSprite.getHeight() / 2.0f);
        this.touchBarSprite.setAlpha(0.7f);
        if (this.themeId != 2) {
            GameManager.touchBarY = 0.0f;
        } else if (GameManager.isLandscapeMode) {
            GameManager.touchBarY = 24.0f;
        } else {
            GameManager.touchBarY = 31.0f;
        }
        this.hitBarSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("hit_bar"));
        this.hitBarSprite.setSize(GameManager.QUATER_WIDTH - 2.0f, GameManager.HEIGHT);
        this.hitBarSprite.setOrigin(this.hitBarSprite.getWidth() / 2.0f, this.hitBarSprite.getHeight() / 2.0f);
        this.hitBarSprite.setAlpha(0.5f);
        this.hitBarSprite.setPosition(0.0f, 0.0f);
        this.missBarSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("miss_bar"));
        this.missBarSprite.setSize(GameManager.QUATER_WIDTH - 2.0f, GameManager.HEIGHT);
        this.missBarSprite.setOrigin(this.missBarSprite.getWidth() / 2.0f, this.missBarSprite.getHeight() / 2.0f);
        this.missBarSprite.setAlpha(0.5f);
        this.missBarSprite.setPosition(0.0f, 0.0f);
        this.noteSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("note2"));
        this.noteSprite.setSize(GameManager.QUATER_WIDTH + (this.noteWidthAdjustValue * 2.0f), (GameManager.QUATER_WIDTH / 2.0f) + this.noteHeightAdjustValue);
        this.noteSprite.setOrigin(this.noteSprite.getWidth() / 2.0f, this.noteSprite.getHeight() / 2.0f);
        this.noteSprite.setPosition(0.0f, 0.0f);
        this.noteSlideLeftSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("note_slide_left"));
        this.noteSlideLeftSprite.setSize(GameManager.QUATER_WIDTH + (this.noteWidthAdjustValue * 2.0f), (GameManager.QUATER_WIDTH / 2.0f) + this.noteHeightAdjustValue);
        this.noteSlideLeftSprite.setOrigin(this.noteSlideLeftSprite.getWidth() / 2.0f, this.noteSlideLeftSprite.getHeight() / 2.0f);
        this.noteSlideLeftSprite.setPosition(0.0f, 0.0f);
        this.noteSlideRightSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("note_slide_right"));
        this.noteSlideRightSprite.setSize(GameManager.QUATER_WIDTH + (this.noteWidthAdjustValue * 2.0f), (GameManager.QUATER_WIDTH / 2.0f) + this.noteHeightAdjustValue);
        this.noteSlideRightSprite.setOrigin(this.noteSlideRightSprite.getWidth() / 2.0f, this.noteSlideRightSprite.getHeight() / 2.0f);
        this.noteSlideRightSprite.setPosition(0.0f, 0.0f);
        this.perfectSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("perfect"));
        if (GameManager.isLandscapeMode) {
            this.perfectSprite.setSize(288.0f, 72.0f);
        } else {
            this.perfectSprite.setSize(320.0f, 80.0f);
        }
        this.perfectSprite.setOrigin(this.perfectSprite.getWidth() / 2.0f, this.perfectSprite.getHeight() / 2.0f);
        this.perfectSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.perfectSprite.getWidth() / 2.0f), this.hitMarkPositionY - (this.perfectSprite.getHeight() / 2.0f));
        this.greatSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("great"));
        if (GameManager.isLandscapeMode) {
            this.greatSprite.setSize(288.0f, 72.0f);
        } else {
            this.greatSprite.setSize(320.0f, 80.0f);
        }
        this.greatSprite.setOrigin(this.greatSprite.getWidth() / 2.0f, this.greatSprite.getHeight() / 2.0f);
        this.greatSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.greatSprite.getWidth() / 2.0f), this.hitMarkPositionY - (this.greatSprite.getHeight() / 2.0f));
        this.goodSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("good"));
        if (GameManager.isLandscapeMode) {
            this.goodSprite.setSize(288.0f, 72.0f);
        } else {
            this.goodSprite.setSize(320.0f, 80.0f);
        }
        this.goodSprite.setOrigin(this.goodSprite.getWidth() / 2.0f, this.goodSprite.getHeight() / 2.0f);
        this.goodSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.goodSprite.getWidth() / 2.0f), this.hitMarkPositionY - (this.goodSprite.getHeight() / 2.0f));
        this.badSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("bad"));
        if (GameManager.isLandscapeMode) {
            this.badSprite.setSize(288.0f, 72.0f);
        } else {
            this.badSprite.setSize(320.0f, 80.0f);
        }
        this.badSprite.setOrigin(this.badSprite.getWidth() / 2.0f, this.badSprite.getHeight() / 2.0f);
        this.badSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.badSprite.getWidth() / 2.0f), this.hitMarkPositionY - (this.badSprite.getHeight() / 2.0f));
        this.missSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("miss"));
        if (GameManager.isLandscapeMode) {
            this.missSprite.setSize(288.0f, 72.0f);
        } else {
            this.missSprite.setSize(320.0f, 80.0f);
        }
        this.missSprite.setOrigin(this.missSprite.getWidth() / 2.0f, this.missSprite.getHeight() / 2.0f);
        this.missSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.missSprite.getWidth() / 2.0f), this.hitMarkPositionY - (this.missSprite.getHeight() / 2.0f));
        this.progressTrackSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("progress_track"));
        if (this.themeId == 2) {
            this.progressTrackSprite.setSize(GameManager.WIDTH - this.progressMargin, 5.0f);
            this.progressTrackSprite.setColor(1.0f, 1.0f, 1.0f, 0.1f);
        } else {
            this.progressTrackSprite.setSize(GameManager.WIDTH - this.progressMargin, 3.0f);
            this.progressTrackSprite.setColor(1.0f, 1.0f, 1.0f, 0.2f);
        }
        this.progressTrackSprite.setOrigin(this.progressTrackSprite.getWidth() / 2.0f, this.progressTrackSprite.getHeight() / 2.0f);
        this.progressTrackSprite.setPosition(this.progressMargin / 2.0f, (GameManager.VIEW_HEIGHT - 40.0f) - (this.progressTrackSprite.getHeight() / 2.0f));
        this.progressPastSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("progress_track"));
        if (this.themeId == 2) {
            this.progressPastSprite.setSize(GameManager.WIDTH - this.progressMargin, 5.0f);
            this.progressPastSprite.setColor(1.0f, 1.0f, 1.0f, 0.6f);
        } else {
            this.progressPastSprite.setSize(GameManager.WIDTH - this.progressMargin, 3.0f);
            this.progressPastSprite.setColor(1.0f, 1.0f, 1.0f, 0.7f);
        }
        this.progressPastSprite.setPosition(this.progressMargin / 2.0f, (GameManager.VIEW_HEIGHT - 40.0f) - (this.progressPastSprite.getHeight() / 2.0f));
        this.progressPointSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("progress_point"));
        this.progressPointSprite.setSize(16.0f, 16.0f);
        this.progressPointSprite.setOrigin(this.progressPointSprite.getWidth() / 2.0f, this.progressPointSprite.getHeight() / 2.0f);
        this.resultBackSprite = new Sprite((TextureRegion) this.textureAtlas.findRegion("black_back"));
        this.resultBackSprite.setSize(GameManager.WIDTH - 40.0f, GameManager.VIEW_HEIGHT - 85.0f);
        this.resultBackSprite.setOrigin(this.resultBackSprite.getWidth() / 2.0f, this.resultBackSprite.getHeight() / 2.0f);
        this.resultBackSprite.setColor(0.0f, 0.0f, 0.0f, 0.0f);
        this.resultBackSprite.setPosition(20.0f, 20.0f);
        if (this.themeId == 0) {
            this.perfectSprite.setColor(0.7f, 1.0f, 1.0f, 0.9f);
            this.greatSprite.setColor(0.65f, 0.85f, 1.0f, 0.9f);
            this.goodSprite.setColor(0.8f, 1.0f, 0.8f, 0.9f);
            this.badSprite.setColor(1.0f, 1.0f, 0.8f, 0.9f);
            this.missSprite.setColor(1.0f, 0.7f, 0.8f, 0.9f);
            this.comboFont.setColor(1.0f, 1.0f, 1.0f, 0.6f);
        } else if (this.themeId == 1) {
            this.perfectSprite.setColor(0.2f, 0.2f, 0.2f, 0.8f);
            this.greatSprite.setColor(0.2f, 0.2f, 0.2f, 0.8f);
            this.goodSprite.setColor(0.2f, 0.2f, 0.2f, 0.8f);
            this.badSprite.setColor(0.2f, 0.2f, 0.2f, 0.8f);
            this.missSprite.setColor(0.2f, 0.2f, 0.2f, 0.8f);
            this.comboFont.setColor(0.0f, 0.0f, 0.0f, 0.7f);
        } else if (this.themeId == 2) {
            this.perfectSprite.setColor(0.9f, 0.9f, 0.9f, 0.8f);
            this.greatSprite.setColor(0.9f, 0.9f, 0.9f, 0.8f);
            this.goodSprite.setColor(0.9f, 0.9f, 0.9f, 0.8f);
            this.badSprite.setColor(0.9f, 0.9f, 0.9f, 0.8f);
            this.missSprite.setColor(0.9f, 0.9f, 0.9f, 0.8f);
        }
        if (this.isAlbumArtOn && this.song != null && this.song.album != null && this.song.album.path != null) {
            try {
                this.albumArtTexture = new Texture(Gdx.files.absolute(this.song.album.path));
                this.albumArtSprite = new Sprite(new TextureRegion(this.albumArtTexture));
                if (!GameManager.isLandscapeMode) {
                    this.albumArtSprite.setOrigin(this.albumArtSprite.getWidth() / 2.0f, this.albumArtSprite.getHeight() / 2.0f);
                    this.albumArtSprite.setSize(480.0f, 480.0f);
                    if (this.themeId == 2) {
                        this.albumArtSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.albumArtSprite.getWidth() / 2.0f), this.bottomSprite.getHeight() - 20.0f);
                    } else {
                        this.albumArtSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.albumArtSprite.getWidth() / 2.0f), this.bottomSprite.getHeight() - 90.0f);
                    }
                } else if (this.themeId == 2) {
                    this.albumArtSprite.setSize(720.0f, 720.0f);
                    this.albumArtSprite.setOrigin(this.albumArtSprite.getWidth() / 2.0f, this.albumArtSprite.getHeight() / 2.0f);
                    this.albumArtSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.albumArtSprite.getWidth() / 2.0f), 183.0f);
                } else {
                    this.albumArtSprite.setSize(800.0f, 800.0f);
                    this.albumArtSprite.setOrigin(this.albumArtSprite.getWidth() / 2.0f, this.albumArtSprite.getHeight() / 2.0f);
                    this.albumArtSprite.setPosition((GameManager.WIDTH / 2.0f) - (this.albumArtSprite.getWidth() / 2.0f), 138.0f);
                }
                this.albumArtSprite.setAlpha(0.2f);
            } catch (GdxRuntimeException e) {
                this.albumArtSprite = null;
            }
        }
    }

    private void initSound() {
        this.touchSound = Gdx.audio.newSound(Gdx.files.internal("sound/beep29.wav"));
        this.scoreSound = Gdx.audio.newSound(Gdx.files.internal("sound/score.wav"));
    }

    public void create() {
        GameManager.displayWidth = (float) Gdx.graphics.getWidth();
        GameManager.displayHeight = (float) Gdx.graphics.getHeight();
        if (GameManager.isLandscapeMode) {
            this.comboPositionY = GameManager.VIEW_HEIGHT - 120.0f;
            this.hitMarkPositionY = GameManager.VIEW_HEIGHT - 85.0f;
            this.bottomHeight = GameManager.CHECK_HEIGHT + 80.0f;
            this.noteWidthAdjustValue = 40.0f;
            this.noteHeightAdjustValue = -30.0f;
            this.progressMargin = 30.0f;
        } else {
            this.comboPositionY = GameManager.HEIGHT - 170.0f;
            this.hitMarkPositionY = GameManager.HEIGHT - 260.0f;
            this.bottomHeight = GameManager.CHECK_HEIGHT + 95.0f;
            this.noteWidthAdjustValue = 26.0f;
            this.noteHeightAdjustValue = 26.0f;
            this.noteHeightAdjustValue = 26.0f;
            this.noteLifeTime = (int) (((double) this.noteLifeTime) * 1.5d);
            this.progressMargin = 10.0f;
        }
        this.batch = new SpriteBatch(1000);
        if (GameManager.isLandscapeMode) {
            this.mainCamera = new PerspectiveCamera(67.0f, GameManager.WIDTH, GameManager.HEIGHT);
            this.orthCamera = new OrthographicCamera();
            this.orthCamera.setToOrtho(false, GameManager.WIDTH, GameManager.VIEW_HEIGHT);
            this.orthCamera.update();
            this.mainStage = new Stage(new StretchViewport(GameManager.WIDTH, GameManager.VIEW_HEIGHT, this.mainCamera));
        } else {
            this.mainCamera = new OrthographicCamera(GameManager.WIDTH, GameManager.HEIGHT);
            this.orthCamera = new OrthographicCamera();
            this.orthCamera.setToOrtho(false, GameManager.WIDTH, GameManager.HEIGHT);
            this.orthCamera.update();
            this.mainStage = new Stage(new StretchViewport(GameManager.WIDTH, GameManager.VIEW_HEIGHT, this.mainCamera));
        }
        if (GameManager.isLandscapeMode) {
            this.mainCamera.translate(0.0f, -325.0f, 430.0f);
            this.mainCamera.rotate(45.0f, 1.0f, 0.0f, 0.0f);
            this.mainCamera.near = 1.0f;
            this.mainCamera.far = 1600.0f;
            this.mainCamera.update();
        }
        if (!this.isRetry && GameManager.myRequestHandler != null) {
            GameManager.myRequestHandler.loadingStep1();
        }
        if (this.playType == PlayType.ADJUST) {
            this.externalFile = Gdx.files.external(".handi/fom/temp.mp3");
            audioFormat = AudioFormat.MP3;
            try {
                Gdx.files.internal(ADJUST_SAMPLE_FILE).copyTo(this.externalFile);
            } catch (Exception e) {
                GameManager.myRequestHandler.showBadFileMessage();
            }
        } else if (this.song.data == null) {
            if (this.song.f753id > 0) {
                GameManager.myRequestHandler.showBadFileMessage();
            }
            this.song.album = null;
            this.externalFile = Gdx.files.external(".handi/fom/temp.mp3");
            audioFormat = AudioFormat.MP3;
            this.externalFile.delete();
            try {
                Gdx.files.internal(SAMPLE_FILES[(-this.song.f753id) - 1]).copyTo(this.externalFile);
            } catch (Exception e2) {
            }
        } else {
            FileHandle srcFile = Gdx.files.absolute(this.song.data);
            audioFormat = AudioFormat.getFormatFromExtension(srcFile.extension());
            if (audioFormat != null) {
                String tempExtension = "mp3";
                if (audioFormat == AudioFormat.FLAC) {
                    tempExtension = "flac";
                } else if (audioFormat == AudioFormat.WAV) {
                    tempExtension = "wav";
                } else if (audioFormat == AudioFormat.AAC) {
                    tempExtension = "aac";
                } else if (audioFormat == AudioFormat.M4A) {
                    tempExtension = "m4a";
                }
                if (audioFormat == AudioFormat.FLAC || audioFormat == AudioFormat.AAC || audioFormat == AudioFormat.M4A) {
                    this.externalFile = Gdx.files.external(".handi/fom/temp.wav");
                    this.externalFile.delete();
                }
                this.externalFile = Gdx.files.external(".handi/fom/temp." + tempExtension);
                this.externalFile.delete();
                try {
                    srcFile.copyTo(this.externalFile);
                } catch (Exception e3) {
                }
            } else if (GameManager.myRequestHandler != null) {
                GameManager.myRequestHandler.showBadFileMessage();
            }
        }
        initFont();
        initSprite();
        initEffect();
        initSound();
        initStage();
        this.isPlaying = true;
        this.loadingThread = new Thread(new Runnable() {
            public void run() {
                FileHandle preloadFile = null;
                boolean preLoaded = false;
                if (GameMain.this.isRetry) {
                    NoteManager.reset();
                    Iterator it = GameManager.retryCandidateQueue.iterator();
                    while (it.hasNext()) {
                        GameMain.this.noteCandidateQueue.add(((NoteCandidate) it.next()).getClone());
                    }
                    GameMain.this.totalLength = GameManager.retryTotalLength;
                    NoteManager.totalMinute = (GameMain.this.totalLength / 1000.0f) / 60.0f;
                } else {
                    GameManager.retryCandidateQueue.clear();
                    if (GameMain.this.playType != PlayType.ADJUST) {
                        preloadFile = Gdx.files.external(".handi/fom/preload/66_" + GameMain.this.song.f753id);
                    }
                    if (preloadFile != null && preloadFile.exists()) {
                        try {
                            PreloadData pd = (PreloadData) new ObjectInputStream(preloadFile.read()).readObject();
                            GameMain.this.tempCandidateArray.addAll(pd.noteCandidateArray);
                            GameMain.this.totalSampleSize = pd.sampleSize;
                            GameMain.this.samplePosition = pd.samplePosition;
                            GameMain.this.sampleRate = pd.sampleRate;
                            GameMain.this.channels = pd.channels;
                            pd.noteCandidateArray.clear();
                            pd.noteCandidateArray = null;
                            preLoaded = true;
                        } catch (IOException | ClassNotFoundException e) {
                        }
                    }
                    if (!preLoaded && GameMain.this.externalFile != null && GameMain.this.externalFile.exists()) {
                        if (GameMain.audioFormat == AudioFormat.FLAC) {
                            Decoder flacDecoder = new Decoder();
                            try {
                                flacDecoder.decode(Gdx.files.getExternalStoragePath() + GameMain.this.externalFile.path(), Gdx.files.getExternalStoragePath() + GameMain.this.externalFile.parent().path() + "/temp.wav");
                            } catch (Exception e2) {
                            }
                        } else {
                            if (GameMain.audioFormat == AudioFormat.AAC) {
                                try {
                                    AudioFormat.decodeAAC(Gdx.files.getExternalStoragePath() + GameMain.this.externalFile.path(), Gdx.files.getExternalStoragePath() + GameMain.this.externalFile.parent().path() + "/temp.wav");
                                } catch (Exception e3) {
                                }
                            } else {
                                if (GameMain.audioFormat == AudioFormat.M4A) {
                                    try {
                                        AudioFormat.decodeMP4(Gdx.files.getExternalStoragePath() + GameMain.this.externalFile.path(), Gdx.files.getExternalStoragePath() + GameMain.this.externalFile.parent().path() + "/temp.wav");
                                    } catch (Exception e4) {
                                    }
                                }
                            }
                        }
                    }
                    if (!preLoaded) {
                        com.badlogic.gdx.audio.p004io.Decoder decoder = null;
                        if (GameMain.this.externalFile == null || !GameMain.this.externalFile.exists()) {
                            decoder = null;
                        } else {
                            try {
                                if (GameMain.audioFormat == AudioFormat.MP3) {
                                    decoder = new Mpg123Decoder(GameMain.this.externalFile);
                                } else {
                                    GameMain.this.externalFile = Gdx.files.absolute(Gdx.files.getExternalStoragePath() + GameMain.this.externalFile.parent().path() + "/temp.wav");
                                    if (GameMain.this.externalFile.exists()) {
                                        decoder = new WavDecoder(GameMain.this.externalFile);
                                    }
                                }
                            } catch (Exception e5) {
                                decoder = null;
                            }
                        }
                        if ((decoder == null || !(decoder instanceof Mpg123Decoder) || ((Mpg123Decoder) decoder).handle == 0) && (!(decoder instanceof WavDecoder) || decoder.getLength() <= 0.0f)) {
                            GameMain.this.isBadFile = true;
                            GameMain.this.isPlaying = false;
                        } else {
                            GameMain.this.tempCandidateArray.clear();
                            GameMain.this.totalSampleSize = 0;
                            GameMain.this.sampleRate = decoder.getRate();
                            GameMain.this.channels = decoder.getChannels();
                            GameMain.this.samplePosition = 0;
                            GameMain.this.fft = new KissFFT(2048);
                            while (GameMain.this.isPlaying) {
                                if (GameMain.this.readSamples = (long) decoder.readSamples(GameMain.this.samples, 0, GameMain.this.samples.length) <= 0) {
                                    break;
                                }
                                GameMain.this.samplePosition = GameMain.this.samplePosition + 1;
                                GameMain.this.fft.spectrum(GameMain.this.samples, GameMain.this.spectrum);
                                GameMain.this.f486nb = (GameMain.this.samples.length / GameMain.this.NB_BARS) / 2;
                                GameMain.this.avg1 = GameMain.this.avg(0, GameMain.this.f486nb);
                                if (GameMain.this.samplePosition % 3 == 0) {
                                    GameMain.this.volumeList.add(Float.valueOf(GameMain.this.avg1));
                                    if (GameMain.this.volumeList.size() > 5) {
                                        GameMain.this.volumeList.removeFirst();
                                    }
                                    float volumeSum = 0.0f;
                                    Iterator it2 = GameMain.this.volumeList.iterator();
                                    while (it2.hasNext()) {
                                        volumeSum += ((Float) it2.next()).floatValue();
                                    }
                                    GameMain.this.volumeAvg = (volumeSum / ((float) GameMain.this.volumeList.size())) * 0.8f;
                                }
                                if (GameMain.this.avg1 > GameMain.this.topValues[0] && GameMain.this.avg1 > GameMain.this.volumeAvg && GameMain.this.avg1 > 1.0f) {
                                    GameMain.this.tempCandidateArray.add(new NoteCandidate((long) GameMain.this.samplePosition, GameMain.this.avg1, GameMain.this.avg1 - GameMain.this.volumeAvg));
                                    float prevSamplePosition = (float) GameMain.this.samplePosition;
                                    GameMain.this.topValues[0] = GameMain.this.avg1;
                                }
                                float[] access$1900 = GameMain.this.topValues;
                                access$1900[0] = access$1900[0] - 0.3f;
                                GameMain.this.totalSampleSize = GameMain.this.totalSampleSize + GameMain.this.readSamples;
                            }
                            GameMain.this.fft.dispose();
                            GameMain.this.volumeList.clear();
                            GameMain.this.fft = null;
                            GameMain.this.volumeList = null;
                            if (GameMain.this.playType != PlayType.ADJUST && GameMain.this.readSamples == 0) {
                                try {
                                    PreloadData pd2 = new PreloadData();
                                    pd2.noteCandidateArray = GameMain.this.tempCandidateArray;
                                    pd2.sampleSize = GameMain.this.totalSampleSize;
                                    pd2.samplePosition = GameMain.this.samplePosition;
                                    pd2.sampleRate = GameMain.this.sampleRate;
                                    pd2.channels = GameMain.this.channels;
                                    OutputStream os = preloadFile.write(false);
                                    ObjectOutputStream oos = new ObjectOutputStream(os);
                                    oos.writeObject(pd2);
                                    oos.close();
                                    os.close();
                                    pd2.noteCandidateArray = null;
                                } catch (IOException e6) {
                                    e6.printStackTrace();
                                } catch (GdxRuntimeException e7) {
                                    e7.printStackTrace();
                                    try {
                                        preloadFile.delete();
                                    } catch (Exception e8) {
                                    }
                                }
                            }
                            GameMain.this.samples = null;
                            GameMain.this.spectrum = null;
                            GameMain.this.topValues = null;
                            decoder.dispose();
                        }
                    }
                    if (GameManager.myRequestHandler != null) {
                        GameManager.myRequestHandler.loadingStep2();
                    }
                    try {
                        Thread.sleep(300);
                    } catch (InterruptedException e9) {
                        e9.printStackTrace();
                    }
                    if (GameMain.this.isPlaying) {
                        GameMain.this.totalLength = (float) (((GameMain.this.totalSampleSize / ((long) GameMain.this.sampleRate)) / ((long) GameMain.this.channels)) * 1000);
                        GameManager.retryTotalLength = GameMain.this.totalLength;
                        NoteManager.totalMinute = (GameMain.this.totalLength / 1000.0f) / 60.0f;
                        int maxNoteCount = ((int) GameMain.this.totalLength) / GameMain.noteUnitLevel;
                        ArrayList<NoteCandidate> arrayList = new ArrayList<>();
                        ArrayList<NoteCandidate> arrayList2 = new ArrayList<>();
                        if (GameMain.this.tempCandidateArray.size() > maxNoteCount) {
                            Collections.sort(GameMain.this.tempCandidateArray, GameMain.valueComparator);
                            int divideCount = maxNoteCount / 3;
                            int i = 0;
                            Iterator it3 = GameMain.this.tempCandidateArray.iterator();
                            while (it3.hasNext()) {
                                NoteCandidate nc = (NoteCandidate) it3.next();
                                if (i < maxNoteCount - divideCount) {
                                    arrayList.add(nc.getClone());
                                } else {
                                    arrayList2.add(nc.getClone());
                                }
                                i++;
                            }
                            Collections.sort(arrayList2, GameMain.relativeValueComparator);
                            int i2 = 0;
                            for (NoteCandidate nc2 : arrayList2) {
                                if (i2 < divideCount - 1) {
                                    arrayList.add(nc2.getClone());
                                }
                                i2++;
                            }
                            Collections.sort(arrayList, GameMain.positionComparator);
                            for (NoteCandidate nc3 : arrayList) {
                                GameMain.this.noteCandidateQueue.add(nc3.getClone());
                            }
                        } else {
                            Iterator it4 = GameMain.this.tempCandidateArray.iterator();
                            while (it4.hasNext()) {
                                GameMain.this.noteCandidateQueue.add(((NoteCandidate) it4.next()).getClone());
                            }
                        }
                        arrayList.clear();
                        arrayList2.clear();
                        GameMain.this.tempCandidateArray.clear();
                        GameMain.this.tempCandidateArray = null;
                        Iterator it5 = GameMain.this.noteCandidateQueue.iterator();
                        while (it5.hasNext()) {
                            NoteCandidate nc4 = (NoteCandidate) it5.next();
                            nc4.relativePosition = ((float) nc4.position) / ((float) GameMain.this.samplePosition);
                            GameManager.retryCandidateQueue.add(nc4.getClone());
                        }
                    }
                }
                if (GameMain.this.isBadFile) {
                    if (GameManager.myRequestHandler != null) {
                        GameManager.myRequestHandler.showBadFileMessage();
                    }
                } else if (GameMain.this.isPlaying) {
                    if (GameMain.this.playType == PlayType.ADJUST) {
                        InputMultiplexer multiInput = new InputMultiplexer();
                        multiInput.addProcessor(GameMain.this.mainStage);
                        multiInput.addProcessor(new NoteTouchProcessor(GameMain.this.mainCamera, 0));
                        Gdx.input.setInputProcessor(multiInput);
                    } else {
                        Gdx.input.setInputProcessor(new NoteTouchProcessor(GameMain.this.mainCamera, GameMain.this.themeId));
                    }
                    if (GameManager.myRequestHandler != null) {
                        while (!GameManager.isIntroEnd) {
                            try {
                                Thread.sleep(500);
                            } catch (InterruptedException e10) {
                                e10.printStackTrace();
                            }
                        }
                        GameManager.myRequestHandler.hideLoading();
                    }
                    GameMain.this.startTime = System.currentTimeMillis();
                    if (GameMain.this.mPlayThread != null) {
                        GameMain.this.mPlayThread.start();
                    }
                }
            }
        });
        this.mPlayThread = new Thread(new Runnable() {

            /* renamed from: m */
            private Music f487m;

            public void run() {
                try {
                    this.f487m = Gdx.audio.newMusic(GameMain.this.externalFile);
                    this.f487m.setLooping(false);
                } catch (GdxRuntimeException e) {
                    GameManager.myRequestHandler.showBadFileMessage();
                }
                while (System.currentTimeMillis() < GameMain.this.startTime + ((long) GameMain.this.noteLifeTime)) {
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e2) {
                        e2.printStackTrace();
                    }
                }
                GameMain.this.isPlaying = true;
                while (true) {
                    if (!GameMain.this.isPlaying) {
                        break;
                    }
                    if (GameMain.this.isPause) {
                        if (GameMain.this.enterPause) {
                            try {
                                if (this.f487m != null && this.f487m.isPlaying()) {
                                    this.f487m.pause();
                                }
                            } catch (IllegalStateException e3) {
                            }
                            GameMain.this.enterPause = false;
                        }
                    } else if (GameMain.this.isResume) {
                        long prepareTime = System.currentTimeMillis();
                        this.f487m.play();
                        GameMain.this.startTime = GameMain.this.startTime + (System.currentTimeMillis() - prepareTime);
                        GameMain.this.startPosition = ((float) ((System.currentTimeMillis() - GameMain.this.startTime) - NoteManager.noteDelayTime)) / GameMain.this.totalLength;
                        GameMain.this.isResume = false;
                    } else if (GameMain.this.totalLength + ((float) GameMain.this.noteLifeTime) < ((float) ((System.currentTimeMillis() - GameMain.this.startTime) - NoteManager.noteDelayTime))) {
                        if (this.f487m.isPlaying()) {
                            this.f487m.stop();
                        }
                    }
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e4) {
                        e4.printStackTrace();
                    }
                }
                if (this.f487m != null) {
                    this.f487m.dispose();
                }
                GameMain.this.externalFile = null;
                if (GameMain.this.isEnd || GameMain.this.playType == PlayType.ADJUST) {
                    NoteManager.reset();
                    return;
                }
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e5) {
                    e5.printStackTrace();
                }
                GameMain.this.mainStage.getViewport().setCamera(GameMain.this.orthCamera);
                GameMain.this.mainStage.addActor(GameMain.this.gameResult);
                GameMain.this.gameResult.init();
                Gdx.input.setInputProcessor(GameMain.this.mainStage);
                GameManager.retryCandidateQueue.clear();
                float backAlpha = 0.2f;
                while (backAlpha > 0.0f) {
                    backAlpha -= 0.01f;
                    try {
                        GameMain.this.backSprite.setAlpha(backAlpha);
                        GameMain.this.bottomSprite.setAlpha(backAlpha * 5.0f);
                        GameMain.this.topSprite.setAlpha(backAlpha * 5.0f);
                        try {
                            Thread.sleep(100);
                        } catch (InterruptedException e6) {
                            e6.printStackTrace();
                        }
                    } catch (NullPointerException e7) {
                        return;
                    }
                }
                GameMain.this.mainStage.addActor(GameMain.this.shareButton);
                GameMain.this.mainStage.addActor(GameMain.this.continueButton);
            }
        });
        this.loadingThread.start();
    }

    public void performPause() {
        if (this.startTime > 0) {
            this.isPause = true;
            this.isResume = false;
            this.enterPause = true;
            if (this.pauseTime == 0) {
                this.pauseTime = System.currentTimeMillis();
            }
        }
    }

    public void performResume() {
        if (this.startTime > 0) {
            this.isPause = false;
            this.isResume = true;
            if (this.pauseTime != 0) {
                this.startTime += System.currentTimeMillis() - this.pauseTime;
                this.pauseTime = 0;
            }
        }
    }

    public void dispose() {
        this.isPlaying = false;
        this.isEnd = true;
        GameManager.reset();
        GameManager.getEffectList().clear();
        this.effects.clear();
        this.dustEffectPool.clear();
        this.hitEffectPool.clear();
        this.goodEffectPool.clear();
        this.perfectEffectPool.clear();
        if (this.combo1EffectPool != null) {
            this.combo1EffectPool.clear();
        }
        this.noteCandidateQueue.clear();
        this.gameResult.clear();
        this.shareButton.clear();
        this.continueButton.clear();
        this.batch.dispose();
        this.textureAtlas.dispose();
        if (this.albumArtTexture != null) {
            this.albumArtTexture.dispose();
        }
        this.albumArtSprite = null;
        this.bottomSprite = null;
        this.backSprite = null;
        this.topSprite = null;
        this.hitBarSprite = null;
        this.missBarSprite = null;
        this.noteSprite = null;
        this.noteSlideLeftSprite = null;
        this.noteSlideRightSprite = null;
        this.perfectSprite = null;
        this.greatSprite = null;
        this.badSprite = null;
        this.missSprite = null;
        this.progressTrackSprite = null;
        this.progressPastSprite = null;
        this.progressPointSprite = null;
        this.comboFont.dispose();
        this.smallFont.dispose();
        this.scoreFont.dispose();
        this.miniFont.dispose();
        this.dustEffect.dispose();
        this.goodEffect.dispose();
        this.hitEffect.dispose();
        this.perfectEffect.dispose();
        if (this.combo1Effect != null) {
            this.combo1Effect.dispose();
        }
        this.touchSound.dispose();
        this.scoreSound.dispose();
        this.shareButton.clear();
        this.continueButton.clear();
        this.mainStage.clear();
        this.mainStage.dispose();
    }

    public void clear() {
        this.loadingThread = null;
        this.mPlayThread = null;
    }

    public void render() {
        if (!this.isBadFile && this.startTime != 0) {
            Gdx.f18gl.glClearColor(THEME_COLOR_ARRAY[this.themeId][0], THEME_COLOR_ARRAY[this.themeId][1], THEME_COLOR_ARRAY[this.themeId][2], THEME_COLOR_ARRAY[this.themeId][3]);
            Gdx.f18gl.glClear(16384);
            if (!this.isPause) {
                this.curPosition = ((float) ((System.currentTimeMillis() - this.startTime) - NoteManager.noteDelayTime)) / this.totalLength;
                if (this.noteCandidateQueue.size() > 0 && ((NoteCandidate) this.noteCandidateQueue.getFirst()).relativePosition <= this.curPosition) {
                    NoteCandidate nc = (NoteCandidate) this.noteCandidateQueue.pollFirst();
                    if (this.curPosition > this.startPosition && (System.currentTimeMillis() - this.startTime) - NoteManager.noteDelayTime > 500) {
                        NoteManager.addNewNote(nc);
                    }
                }
            }
            if (this.dustGameEffect != null && this.effectTime + ((long) (6000 - (NoteManager.getComboCount() * 5))) < System.currentTimeMillis()) {
                GameManager.getEffectList().add(this.dustGameEffect);
                this.effectTime = System.currentTimeMillis();
            }
            this.batch.setProjectionMatrix(this.mainCamera.combined);
            this.batch.begin();
            if (this.albumArtSprite != null) {
                this.albumArtSprite.draw(this.batch);
            }
            if (this.themeId == 2) {
                this.bottomSprite.draw(this.batch);
            }
            this.backSprite.draw(this.batch);
            if (!this.isPause) {
                this.noteOffset = ((GameManager.NOTE_RANGE - GameManager.CHECK_HEIGHT) / ((float) this.noteLifeTime)) * Gdx.graphics.getDeltaTime() * 1000.0f;
                for (Note note : NoteManager.getNoteList()) {
                    if (note.f493y < GameManager.NOTE_RANGE && !note.isChecked()) {
                        if (note.isSlideNote) {
                            float noteY = note.f493y;
                            if (note.f493y < GameManager.CHECK_HEIGHT + 6.0f) {
                                noteY = GameManager.CHECK_HEIGHT + 6.0f;
                            }
                            if (note.slideDirection == SlideDirection.LEFT) {
                                this.noteSlideLeftSprite.setPosition((((float) (note.placement - 1)) * GameManager.QUATER_WIDTH) - this.noteWidthAdjustValue, (noteY - (this.noteSprite.getHeight() / 2.0f)) + 5.0f);
                                this.noteSlideLeftSprite.draw(this.batch);
                            } else {
                                this.noteSlideRightSprite.setPosition((((float) (note.placement - 1)) * GameManager.QUATER_WIDTH) - this.noteWidthAdjustValue, (noteY - (this.noteSprite.getHeight() / 2.0f)) + 5.0f);
                                this.noteSlideRightSprite.draw(this.batch);
                            }
                        } else {
                            this.noteSprite.setPosition((((float) (note.placement - 1)) * GameManager.QUATER_WIDTH) - this.noteWidthAdjustValue, (note.f493y - (this.noteSprite.getHeight() / 2.0f)) + 5.0f);
                            this.noteSprite.draw(this.batch);
                        }
                    }
                    if (note.f493y < GameManager.CHECK_HEIGHT + 10.0f) {
                        note.f493y -= this.noteOffset / 3.0f;
                    } else {
                        note.f493y -= this.noteOffset;
                    }
                }
                NoteManager.cleanNotes();
            }
            if (this.themeId != 2) {
                this.bottomSprite.draw(this.batch);
            }
            while (!GameManager.getEffectList().isEmpty()) {
                GameEffect gameEffect = (GameEffect) GameManager.getEffectList().poll();
                PooledEffect effect = null;
                if (gameEffect.getType() == EffectType.DUST) {
                    effect = this.dustEffectPool.obtain();
                } else if (gameEffect.getType() == EffectType.HIT) {
                    effect = this.hitEffectPool.obtain();
                } else if (gameEffect.getType() == EffectType.PERFECT) {
                    effect = this.perfectEffectPool.obtain();
                } else if (gameEffect.getType() == EffectType.GOOD) {
                    effect = this.goodEffectPool.obtain();
                } else if (gameEffect.getType() == EffectType.COMBO1 && this.combo1EffectPool != null) {
                    effect = this.combo1EffectPool.obtain();
                } else if (gameEffect.getType() == EffectType.FAIL) {
                    effect = this.failEffectPool.obtain();
                }
                if (effect != null) {
                    effect.setPosition(gameEffect.getPosition().f207x, gameEffect.getPosition().f208y);
                    this.effects.add(effect);
                }
            }
            for (int i = 0; i < 4; i++) {
                if (GameManager.buttonOn[i]) {
                    this.hitBarSprite.setPosition(GameManager.QUATER_WIDTH * ((float) i), 0.0f);
                    this.hitBarSprite.draw(this.batch);
                }
                if (GameManager.buttonMissOn[i]) {
                    this.missBarSprite.setPosition(GameManager.QUATER_WIDTH * ((float) i), 0.0f);
                    this.missBarSprite.draw(this.batch);
                }
            }
            GameManager.getAlphaAnimator().step(Gdx.graphics.getDeltaTime(), this.batch, this.touchBarSprite);
            if (this.playType != PlayType.ADJUST && this.themeId == 2) {
                for (int i2 = this.effects.size - 1; i2 >= 0; i2--) {
                    PooledEffect effect2 = (PooledEffect) this.effects.get(i2);
                    effect2.draw(this.batch, Gdx.graphics.getDeltaTime());
                    if (effect2.isComplete()) {
                        effect2.free();
                        this.effects.removeIndex(i2);
                    }
                }
            }
            this.batch.end();
            this.batch.setProjectionMatrix(this.orthCamera.combined);
            this.batch.begin();
            this.topSprite.draw(this.batch);
            if (!(this.playType == PlayType.ADJUST || this.themeId == 2)) {
                for (int i3 = this.effects.size - 1; i3 >= 0; i3--) {
                    PooledEffect effect3 = (PooledEffect) this.effects.get(i3);
                    effect3.draw(this.batch, Gdx.graphics.getDeltaTime());
                    if (effect3.isComplete()) {
                        effect3.free();
                        this.effects.removeIndex(i3);
                    }
                }
            }
            if (GameManager.lastTouchStrTime != 0) {
                long touchDiff = System.currentTimeMillis() - GameManager.lastTouchStrTime;
                if (touchDiff > 600) {
                    GameManager.touchResult = TouchResult.NONE;
                    GameManager.lastTouchStrTime = 0;
                } else {
                    this.scale = (((float) touchDiff) / 200.0f) + 0.7f;
                    if (this.scale > 1.0f) {
                        this.scale = 1.0f;
                    }
                    if (this.playType != PlayType.ADJUST && NoteManager.getComboCount() > 1) {
                        this.strCombo = NumberFormat.getInstance().format((long) NoteManager.getComboCount());
                        float alpha = ((float) NoteManager.getComboCount()) * 0.06f;
                        if (alpha > 0.5f) {
                            alpha = 0.5f;
                        }
                        Color color = this.comboFont.getColor();
                        color.f69a = alpha;
                        this.comboFont.setColor(color);
                        this.comboFont.getData().setScale(this.scale);
                        this.comboFont.draw(this.batch, this.strCombo, 0.0f, this.comboPositionY, GameManager.WIDTH, 1, false);
                    }
                }
            }
            if (this.playType == PlayType.ADJUST) {
                NoteManager.setComboCount(0);
                this.comboFont.getData().setScale(0.6f);
                this.comboFont.setColor(1.0f, 1.0f, 1.0f, 0.6f);
                this.strCombo = Float.toString(((float) NoteManager.noteDelayTime) / 1000.0f) + " sec";
                if (NoteManager.noteDelayTime > 0) {
                    this.strCombo = "+" + this.strCombo;
                }
                this.comboFont.draw(this.batch, this.strCombo, 0.0f, this.comboPositionY - 120.0f, GameManager.WIDTH, 1, false);
            }
            this.progressTrackSprite.draw(this.batch);
            if (this.isPlaying && !this.isPause && this.prevProgressTime + 500 < System.currentTimeMillis()) {
                long curTime = System.currentTimeMillis();
                this.progressPosition = (int) (((GameManager.WIDTH - this.progressMargin) * ((float) ((curTime - this.startTime) - NoteManager.noteDelayTime))) / this.totalLength);
                if (((float) this.progressPosition) > GameManager.WIDTH - this.progressMargin) {
                    this.progressPosition = (int) (GameManager.WIDTH - this.progressMargin);
                }
                this.prevProgressTime = curTime;
            }
            this.progressPastSprite.setSize((GameManager.WIDTH - ((float) this.progressPosition)) - this.progressMargin, this.progressPastSprite.getHeight());
            this.progressPastSprite.setPosition((this.progressMargin / 2.0f) + ((float) this.progressPosition), (GameManager.VIEW_HEIGHT - 40.0f) - (this.progressPastSprite.getHeight() / 2.0f));
            this.progressPastSprite.draw(this.batch);
            this.progressPointSprite.setPosition(((this.progressMargin / 2.0f) + ((float) this.progressPosition)) - (this.progressPointSprite.getWidth() / 2.0f), (GameManager.VIEW_HEIGHT - 40.0f) - (this.progressPointSprite.getHeight() / 2.0f));
            this.progressPointSprite.draw(this.batch);
            if (this.scale > 0.0f) {
                switch (GameManager.touchResult) {
                    case PERFECT:
                        this.perfectSprite.setScale(this.scale);
                        this.perfectSprite.draw(this.batch);
                        break;
                    case GREAT:
                        this.greatSprite.setScale(this.scale);
                        this.greatSprite.draw(this.batch);
                        break;
                    case GOOD:
                        this.goodSprite.setScale(this.scale);
                        this.goodSprite.draw(this.batch);
                        break;
                    case BAD:
                        this.badSprite.setScale(this.scale);
                        this.badSprite.draw(this.batch);
                        break;
                    case MISS:
                        this.missSprite.setScale(this.scale);
                        this.missSprite.draw(this.batch);
                        break;
                }
            }
            this.batch.end();
            try {
                if (this.mainStage.getActors().size > 0) {
                    this.mainStage.draw();
                }
            } catch (NullPointerException e) {
                if (this.batch.isBlendingEnabled()) {
                    this.batch.end();
                }
            }
            if (this.reqScreenshot) {
                ScreenshotFactory.saveScreenshot();
                this.reqScreenshot = false;
            }
            try {
                Thread.sleep(1);
            } catch (InterruptedException e2) {
            }
        }
    }

    public void takeScreenshot() {
        this.reqScreenshot = true;
    }

    /* access modifiers changed from: private */
    public float avg(int pos, int nb) {
        int sum = 0;
        for (int i = 0; i < nb; i++) {
            sum = (int) (((float) sum) + this.spectrum[pos + i]);
        }
        return (float) (sum / nb);
    }
}
