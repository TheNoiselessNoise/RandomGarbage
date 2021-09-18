public class GameRecord extends ApplicationAdapter {
    private static final String ADJUST_SAMPLE_FILE = "sample/adjust.mp3";
    private static final String[] SAMPLE_FILES = {"sample/ocean-motion.mp3", "sample/new-life.mp3", "sample/rock-star.mp3", "sample/go-for-it.mp3", "sample/happy-digital-anthem.mp3", "sample/big-room.mp3", "sample/beautiful-moments.mp3", "sample/standalone.mp3"};
    private static final float[][] THEME_COLOR_ARRAY = {new float[]{0.0f, 0.0f, 0.0f, 1.0f}};
    private static final String[] THEME_NAME = {"default"};
    /* access modifiers changed from: private */
    public static AudioFormat audioFormat = AudioFormat.MP3;
    private int NB_BARS = 4;
    private Sprite albumArtSprite;
    private Texture albumArtTexture;
    float avg1;
    /* access modifiers changed from: private */
    public Sprite backSprite;
    private Sprite badSprite;
    private SpriteBatch batch;
    private float bottomHeight = 0.0f;
    /* access modifiers changed from: private */
    public Sprite bottomSprite;

    /* renamed from: c */
    Color f488c = new Color(1.0f, 1.0f, 1.0f, 0.8f);
    /* access modifiers changed from: private */
    public int channels = 0;
    private ParticleEffect combo1Effect = null;
    private float comboPositionY = 0.0f;
    float curPosition = 0.0f;
    private ParticleEffect dustEffect;
    private GameEffect dustGameEffect = null;
    long effectTime = 0;
    /* access modifiers changed from: private */
    public boolean enterPause = false;
    /* access modifiers changed from: private */
    public FileHandle externalFile;
    private ParticleEffect failEffect;
    private float fontAdjustValue = 0.0f;
    /* access modifiers changed from: private */
    public GameResult gameResult;
    private ParticleEffect goodEffect;
    private Sprite goodSprite;
    private Sprite greatSprite;
    private Sprite hitBarSprite;
    private ParticleEffect hitEffect;
    private float hitMarkPositionY = 0.0f;
    public boolean isAdjustMode = false;
    private boolean isAlbumArtOn = false;
    /* access modifiers changed from: private */
    public boolean isBadFile = false;
    /* access modifiers changed from: private */
    public boolean isEnd = false;
    /* access modifiers changed from: private */
    public boolean isPause = false;
    /* access modifiers changed from: private */
    public boolean isPlaying = false;
    /* access modifiers changed from: private */
    public boolean isResume = true;
    public boolean isRetry = false;
    private Thread loadingThread;
    /* access modifiers changed from: private */
    public Thread mPlayThread;
    /* access modifiers changed from: private */
    public Camera mainCamera;
    /* access modifiers changed from: private */
    public Stage mainStage;
    private BitmapFont miniFont;
    private Sprite missBarSprite;
    private Sprite missSprite;

    /* renamed from: nb */
    int f489nb;
    /* access modifiers changed from: private */
    public ArrayDeque<NoteCandidate> noteCandidateQueue = new ArrayDeque<>();
    private float noteHeightAdjustValue = 0.0f;
    /* access modifiers changed from: private */
    public int noteLifeTime;
    float noteOffset = 0.0f;
    private Sprite noteSlideLeftSprite;
    private Sprite noteSlideRightSprite;
    private Sprite noteSprite;
    private float noteWidthAdjustValue = 0.0f;
    /* access modifiers changed from: private */
    public OrthographicCamera orthCamera;
    private long pauseTime = 0;
    private ParticleEffect perfectEffect;
    private Sprite perfectSprite;
    private long prevProgressTime = 0;
    private float progressMargin = 0.0f;
    private Sprite progressPastSprite;
    private Sprite progressPointSprite;
    int progressPosition = 0;
    private Sprite progressTrackSprite;
    private long readSamples = 0;
    boolean reqScreenshot = false;
    private Sprite resultBackSprite;
    /* access modifiers changed from: private */
    public int samplePosition = 0;
    /* access modifiers changed from: private */
    public int sampleRate = 0;
    private DelaySaveButton saveButton;
    float scale = 0.0f;
    private Sound scoreSound;
    private BitmapFont smallFont;
    /* access modifiers changed from: private */
    public Song song = null;
    float startPosition = 0.0f;
    /* access modifiers changed from: private */
    public long startTime = 0;
    String strCombo = "";
    /* access modifiers changed from: private */
    public ArrayList<NoteCandidate> tempCandidateArray = new ArrayList<>();
    private TextureAtlas textureAtlas;
    private String themeFolder;
    public int themeId = 0;
    /* access modifiers changed from: private */
    public Sprite topSprite;
    /* access modifiers changed from: private */
    public float totalLength = 0.0f;
    /* access modifiers changed from: private */
    public long totalSampleSize = 0;
    private Sprite touchBarSprite;
    private Sound touchSound;
    private ArrayDeque<Float> volumeList = new ArrayDeque<>();

    public long getStartTime() {
        return this.startTime;
    }

    public GameRecord(Song song2, int themeId2, int levelInterval, int gameSpeed, boolean isSlideNoteOn, long delayTime, boolean isHighEffect) {
        this.song = song2;
        this.themeId = themeId2;
        NoteManager.setLevelInterval(levelInterval);
        this.noteLifeTime = gameSpeed;
        this.themeFolder = THEME_NAME[themeId2] + "/";
        NoteManager.noteDelayTime = delayTime;
        NoteManager.isSlideNoteOn = isSlideNoteOn;
    }

    public void initFont() {
        FreeTypeFontGenerator regularGenerator = new FreeTypeFontGenerator(Gdx.files.internal("font/TitilliumWeb-Regular.ttf"));
        this.smallFont = regularGenerator.generateFont(26);
        this.miniFont = regularGenerator.generateFont(24);
        FreeTypeFontGenerator italicGenerator = new FreeTypeFontGenerator(Gdx.files.internal("font/TitilliumWeb-Italic.ttf"));
        if (this.themeId == 0) {
            this.fontAdjustValue = 10.0f;
        } else if (this.themeId == 1) {
            FreeTypeFontGenerator comboFontGenerator = new FreeTypeFontGenerator(Gdx.files.internal("font/Railway.ttf"));
            FreeTypeFontParameter parameter = new FreeTypeFontParameter();
            parameter.size = 56;
            parameter.characters = "1234567890";
            comboFontGenerator.dispose();
        }
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

    public void initStage() {
        GameManager.CHECK_UNIT = (float) (22000 / this.noteLifeTime);
        if (GameManager.isLandscapeMode) {
            GameManager.CHECK_UNIT *= 1.25f;
        }
        FreeTypeFontGenerator regularGenerator = new FreeTypeFontGenerator(Gdx.files.internal("font/TitilliumWeb-Regular.ttf"));
        this.saveButton = new DelaySaveButton(this.touchSound, regularGenerator);
        this.mainStage.addActor(this.saveButton);
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
            this.topSprite.setSize(GameManager.WIDTH, (GameManager.HEIGHT * 80.0f) / 800.0f);
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
        if (this.isAdjustMode) {
            this.externalFile = Gdx.files.external(".handi/fom/temp.mp3");
            audioFormat = AudioFormat.MP3;
            try {
                Gdx.files.internal(ADJUST_SAMPLE_FILE).copyTo(this.externalFile);
            } catch (Exception e) {
                GameManager.myRequestHandler.showBadFileMessage();
            }
        } else if (this.song.data == null) {
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
        initSound();
        initStage();
        this.isPlaying = true;
        this.loadingThread = new Thread(new Runnable() {
            public void run() {
                FileHandle preloadFile = null;
                boolean preLoaded = false;
                if (GameRecord.this.isRetry) {
                    NoteManager.reset();
                    Iterator it = GameManager.retryCandidateQueue.iterator();
                    while (it.hasNext()) {
                        GameRecord.this.noteCandidateQueue.add(((NoteCandidate) it.next()).getClone());
                    }
                    GameRecord.this.totalLength = GameManager.retryTotalLength;
                    NoteManager.totalMinute = (GameRecord.this.totalLength / 1000.0f) / 60.0f;
                } else {
                    GameManager.retryCandidateQueue.clear();
                    if (!GameRecord.this.isAdjustMode) {
                        preloadFile = Gdx.files.external(".handi/fom/preload/46_" + GameRecord.this.song.f753id);
                    }
                    if (preloadFile != null && preloadFile.exists()) {
                        try {
                            PreloadData pd = (PreloadData) new ObjectInputStream(preloadFile.read()).readObject();
                            GameRecord.this.tempCandidateArray.addAll(pd.noteCandidateArray);
                            GameRecord.this.totalSampleSize = pd.sampleSize;
                            GameRecord.this.samplePosition = pd.samplePosition;
                            GameRecord.this.sampleRate = pd.sampleRate;
                            GameRecord.this.channels = pd.channels;
                            pd.noteCandidateArray.clear();
                            pd.noteCandidateArray = null;
                            preLoaded = true;
                        } catch (IOException | ClassNotFoundException e) {
                        }
                    }
                    if (!preLoaded && GameRecord.this.externalFile != null && GameRecord.this.externalFile.exists()) {
                        if (GameRecord.audioFormat == AudioFormat.FLAC) {
                            try {
                                new Decoder().decode(Gdx.files.getExternalStoragePath() + GameRecord.this.externalFile.path(), Gdx.files.getExternalStoragePath() + GameRecord.this.externalFile.parent().path() + "/temp.wav");
                            } catch (Exception e2) {
                            }
                        } else if (GameRecord.audioFormat == AudioFormat.AAC) {
                            try {
                                AudioFormat.decodeAAC(Gdx.files.getExternalStoragePath() + GameRecord.this.externalFile.path(), Gdx.files.getExternalStoragePath() + GameRecord.this.externalFile.parent().path() + "/temp.wav");
                            } catch (Exception e3) {
                            }
                        } else if (GameRecord.audioFormat == AudioFormat.M4A) {
                            try {
                                AudioFormat.decodeMP4(Gdx.files.getExternalStoragePath() + GameRecord.this.externalFile.path(), Gdx.files.getExternalStoragePath() + GameRecord.this.externalFile.parent().path() + "/temp.wav");
                            } catch (Exception e4) {
                            }
                        }
                    }
                    if (!preLoaded) {
                        com.badlogic.gdx.audio.p004io.Decoder decoder = null;
                        if (GameRecord.this.externalFile == null || !GameRecord.this.externalFile.exists()) {
                            decoder = null;
                        } else {
                            try {
                                if (GameRecord.audioFormat == AudioFormat.MP3) {
                                    decoder = new Mpg123Decoder(GameRecord.this.externalFile);
                                } else {
                                    GameRecord.this.externalFile = Gdx.files.absolute(Gdx.files.getExternalStoragePath() + GameRecord.this.externalFile.parent().path() + "/temp.wav");
                                    if (GameRecord.this.externalFile.exists()) {
                                        decoder = new WavDecoder(GameRecord.this.externalFile);
                                    }
                                }
                            } catch (Exception e5) {
                                decoder = null;
                            }
                        }
                        if ((decoder == null || !(decoder instanceof Mpg123Decoder) || ((Mpg123Decoder) decoder).handle == 0) && (!(decoder instanceof WavDecoder) || decoder.getLength() <= 0.0f)) {
                            GameRecord.this.isBadFile = true;
                            GameRecord.this.isPlaying = false;
                        } else {
                            GameRecord.this.totalSampleSize = 0;
                            GameRecord.this.sampleRate = decoder.getRate();
                            GameRecord.this.channels = decoder.getChannels();
                            GameRecord.this.samplePosition = 0;
                            try {
                                PreloadData pd2 = new PreloadData();
                                pd2.noteCandidateArray = GameRecord.this.tempCandidateArray;
                                pd2.sampleSize = GameRecord.this.totalSampleSize;
                                pd2.samplePosition = GameRecord.this.samplePosition;
                                pd2.sampleRate = GameRecord.this.sampleRate;
                                pd2.channels = GameRecord.this.channels;
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
                    if (GameRecord.this.isPlaying) {
                        GameRecord.this.totalLength = (float) (((GameRecord.this.totalSampleSize / ((long) GameRecord.this.sampleRate)) / ((long) GameRecord.this.channels)) * 1000);
                        GameManager.retryTotalLength = GameRecord.this.totalLength;
                        NoteManager.totalMinute = (GameRecord.this.totalLength / 1000.0f) / 60.0f;
                    }
                }
                if (GameRecord.this.isBadFile) {
                    if (GameManager.myRequestHandler != null) {
                        GameManager.myRequestHandler.showBadFileMessage();
                    }
                } else if (GameRecord.this.isPlaying) {
                    if (GameRecord.this.isAdjustMode) {
                        InputMultiplexer multiInput = new InputMultiplexer();
                        multiInput.addProcessor(GameRecord.this.mainStage);
                        multiInput.addProcessor(new NoteTouchProcessor(GameRecord.this.mainCamera, 0));
                        Gdx.input.setInputProcessor(multiInput);
                    } else {
                        Gdx.input.setInputProcessor(new NoteTouchProcessor(GameRecord.this.mainCamera, GameRecord.this.themeId));
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
                    GameRecord.this.startTime = System.currentTimeMillis();
                    if (GameRecord.this.mPlayThread != null) {
                        GameRecord.this.mPlayThread.start();
                    }
                }
            }
        });
        this.mPlayThread = new Thread(new Runnable() {

            /* renamed from: m */
            private Music f490m;

            public void run() {
                try {
                    this.f490m = Gdx.audio.newMusic(GameRecord.this.externalFile);
                    this.f490m.setLooping(false);
                } catch (GdxRuntimeException e) {
                    GameManager.myRequestHandler.showBadFileMessage();
                }
                while (System.currentTimeMillis() < GameRecord.this.startTime + ((long) GameRecord.this.noteLifeTime)) {
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e2) {
                        e2.printStackTrace();
                    }
                }
                GameRecord.this.isPlaying = true;
                while (true) {
                    if (!GameRecord.this.isPlaying) {
                        break;
                    }
                    if (GameRecord.this.isPause) {
                        if (GameRecord.this.enterPause) {
                            try {
                                if (this.f490m != null && this.f490m.isPlaying()) {
                                    this.f490m.pause();
                                }
                            } catch (IllegalStateException e3) {
                            }
                            GameRecord.this.enterPause = false;
                        }
                    } else if (GameRecord.this.isResume) {
                        long prepareTime = System.currentTimeMillis();
                        this.f490m.play();
                        GameRecord.this.startTime = GameRecord.this.startTime + (System.currentTimeMillis() - prepareTime);
                        GameRecord.this.startPosition = ((float) ((System.currentTimeMillis() - GameRecord.this.startTime) - NoteManager.noteDelayTime)) / GameRecord.this.totalLength;
                        GameRecord.this.isResume = false;
                    } else if (GameRecord.this.totalLength + ((float) GameRecord.this.noteLifeTime) < ((float) ((System.currentTimeMillis() - GameRecord.this.startTime) - NoteManager.noteDelayTime))) {
                        if (this.f490m.isPlaying()) {
                            this.f490m.stop();
                        }
                    }
                    try {
                        Thread.sleep(10);
                    } catch (InterruptedException e4) {
                        e4.printStackTrace();
                    }
                }
                if (this.f490m != null) {
                    this.f490m.dispose();
                }
                GameRecord.this.externalFile = null;
                if (GameRecord.this.isEnd || GameRecord.this.isAdjustMode) {
                    NoteManager.reset();
                    return;
                }
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e5) {
                    e5.printStackTrace();
                }
                GameRecord.this.mainStage.getViewport().setCamera(GameRecord.this.orthCamera);
                GameRecord.this.mainStage.addActor(GameRecord.this.gameResult);
                GameRecord.this.gameResult.init();
                Gdx.input.setInputProcessor(GameRecord.this.mainStage);
                GameManager.retryCandidateQueue.clear();
                float backAlpha = 0.2f;
                while (backAlpha > 0.0f) {
                    backAlpha -= 0.01f;
                    try {
                        GameRecord.this.backSprite.setAlpha(backAlpha);
                        GameRecord.this.bottomSprite.setAlpha(backAlpha * 5.0f);
                        GameRecord.this.topSprite.setAlpha(backAlpha * 5.0f);
                        try {
                            Thread.sleep(100);
                        } catch (InterruptedException e6) {
                            e6.printStackTrace();
                        }
                    } catch (NullPointerException e7) {
                        return;
                    }
                }
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
        this.noteCandidateQueue.clear();
        this.gameResult.clear();
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
        this.smallFont.dispose();
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
            this.batch.end();
            this.batch.setProjectionMatrix(this.orthCamera.combined);
            this.batch.begin();
            this.topSprite.draw(this.batch);
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
                    if (!this.isAdjustMode && NoteManager.getComboCount() > 1) {
                        this.strCombo = NumberFormat.getInstance().format((long) NoteManager.getComboCount());
                        if (((float) NoteManager.getComboCount()) * 0.06f > 0.5f) {
                        }
                    }
                }
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
}
