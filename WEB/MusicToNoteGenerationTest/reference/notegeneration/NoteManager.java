public class NoteManager {
    public static final int INTERVAL_EASY = 300;
    public static final int INTERVAL_EXTREME = 100;
    public static final int INTERVAL_HARD = 150;
    public static final int INTERVAL_NORMAL = 220;
    private static boolean alreadyMerged;
    private static int badCount = 0;
    private static long combiInterval;
    private static int combiMode;
    private static long combo1Time;
    private static int comboCount = 0;
    private static int comboPerfectCount = 0;
    private static long comboPerfectStartTime = 0;
    public static boolean doublePerfect = false;
    private static long finalScore = 0;
    private static int goodCount = 0;
    private static int greatCount = 0;
    public static int hitRate100Count = 0;
    public static NoteManager instance = new NoteManager();
    private static boolean isSlideMerged = false;
    public static boolean isSlideNoteOn = true;
    private static long lastAddedTime;
    private static Note lastNote;
    private static long lastNotePosition = 0;
    private static long lastSlideTime = 0;
    private static long levelInterval;
    private static int levelNoteCount;
    private static long levelTime;
    private static int maxComboCount = 0;
    private static long mergeInterval;
    private static int missCount = 0;
    private static int nextId = 1;
    private static SlideDirection nextSlideDirection = SlideDirection.LEFT;
    private static int nextSlidePlace = 0;
    public static long noteDelayTime = 0;
    public static List<Note> noteList = new ArrayList();
    private static int perfectCount = 0;
    private static Random random = new Random();
    public static float totalMinute = 0.0f;

    public static void setMaxComboCount(int maxComboCount2) {
        maxComboCount = maxComboCount2;
    }

    public static long getFinalScore() {
        finalScore = (long) (getPerfectCount() * 30);
        finalScore = (long) (((float) finalScore) * (((float) getMaxComboCount()) / totalMinute));
        finalScore += (long) (getGreatCount() * 100);
        finalScore += (long) (getGoodCount() * 50);
        finalScore -= (long) (getMissCount() * 1000);
        finalScore = (long) (((float) finalScore) / totalMinute);
        return finalScore;
    }

    private NoteManager() {
        mergeInterval = 50;
        combiInterval = 200;
        levelInterval = 220;
        init();
    }

    public static void setLevelInterval(int interval) {
        levelInterval = (long) interval;
    }

    public static void init() {
        lastAddedTime = 0;
        combiMode = 0;
        alreadyMerged = false;
        levelNoteCount = 0;
        doublePerfect = false;
    }

    public static int getPerfectCount() {
        return perfectCount;
    }

    public static int getGreatCount() {
        return greatCount;
    }

    public static int getGoodCount() {
        return goodCount;
    }

    public static int getBadCount() {
        return badCount;
    }

    public static int getMissCount() {
        return missCount;
    }

    public static int getComboCount() {
        return comboCount;
    }

    public static void setComboCount(int count) {
        comboCount = count;
    }

    public static int getMaxComboCount() {
        return maxComboCount;
    }

    public static int getNextId() {
        return nextId;
    }

    public static List<Note> getNoteList() {
        return noteList;
    }

    public static Note getLastNote() {
        return lastNote;
    }

    public static void setLastNote(Note note) {
        lastNote = note;
    }

    public static long getLastAddedTime() {
        return lastAddedTime;
    }

    public static void setLastAddedTime(long time) {
        lastAddedTime = time;
    }

    public static long getNoteInterval() {
        return mergeInterval;
    }

    public static void setNoteInterval(long interval) {
        mergeInterval = interval;
    }

    public static void addNewNote(NoteCandidate nc) {
        Note newNote = generateNewNote(nc);
        if (newNote != null) {
            lastNote = newNote;
            lastAddedTime = System.currentTimeMillis();
            lastNotePosition = nc.position;
            newNote.f492id = nextId;
            nextId++;
            noteList.add(newNote);
            if (levelInterval == 100 && getRandomBoolean()) {
                Note newNote2 = generateNewNote(nc);
                if (newNote2 != null) {
                    lastNote = newNote2;
                    lastAddedTime = System.currentTimeMillis();
                    lastNotePosition = nc.position;
                    newNote2.f492id = nextId;
                    nextId++;
                    noteList.add(newNote2);
                }
            }
        }
    }

    public static boolean isMergeToPrev() {
        if (lastAddedTime + mergeInterval < System.currentTimeMillis()) {
            return false;
        }
        return true;
    }

    public static boolean isMergeToPrev(long position) {
        if (position <= 100 || lastNotePosition == 0 || System.currentTimeMillis() - lastAddedTime >= mergeInterval) {
            return false;
        }
        return true;
    }

    public static boolean isCombiToPrev() {
        if (lastAddedTime + combiInterval < System.currentTimeMillis()) {
            return false;
        }
        return true;
    }

    public static boolean isCombiToPrev(long position) {
        if (lastNotePosition == 0 || System.currentTimeMillis() - lastAddedTime >= combiInterval) {
            return false;
        }
        return true;
    }

    public static void cleanNotes() {
        for (int i = 0; i < noteList.size(); i++) {
            Note note = (Note) noteList.get(i);
            if (note.f493y <= GameManager.CHECK_HEIGHT - 70.0f && !note.isChecked()) {
                if (note.isSlideNote) {
                    GameManager.getEffectList().add(new GameEffect(new Vector2((((float) (note.placement - 1)) * NoteTouchProcessor.effectMultiflyer) + NoteTouchProcessor.effectAdjustment, GameManager.CHECK_HEIGHT - GameManager.EFFECT_ADJUST), EffectType.FAIL));
                } else {
                    GameManager.getEffectList().add(new GameEffect(new Vector2((((float) (note.placement - 1)) * NoteTouchProcessor.effectMultiflyer) + NoteTouchProcessor.effectAdjustment, note.f493y - GameManager.EFFECT_ADJUST), EffectType.FAIL));
                }
                miss();
                note.setChecked();
                noteList.remove(i);
                GameManager.lastTouchStrTime = System.currentTimeMillis();
            }
        }
    }

    public static boolean getRandomBoolean() {
        return random.nextBoolean();
    }

    public static int getRandomPosition() {
        return ((int) (Math.random() * 4.0d)) + 1;
    }

    public static Note generateNewNote(NoteCandidate nc) {
        int placement;
        float newY;
        int placement2;
        SlideDirection slideDirection = null;
        float newY2 = GameManager.NOTE_RANGE;
        if (isMergeToPrev(nc.position)) {
            if (isSlideMerged && nextSlidePlace != 0) {
                Note slideNote = new Note(nextSlidePlace, nc.relativePosition, lastNote.f493y + 10.0f, isSlideMerged, nextSlideDirection);
                if (nextSlidePlace == 2 && nextSlideDirection == SlideDirection.LEFT) {
                    nextSlidePlace = 1;
                } else if (nextSlidePlace == 3 && nextSlideDirection == SlideDirection.RIGHT) {
                    nextSlidePlace = 4;
                } else {
                    nextSlidePlace = 0;
                }
                float f = newY2;
                return slideNote;
            } else if (lastSlideTime + 700 > System.currentTimeMillis()) {
                float f2 = newY2;
                return null;
            } else {
                isSlideMerged = false;
                nextSlidePlace = 0;
                lastSlideTime = System.currentTimeMillis();
                if (alreadyMerged) {
                    float f3 = newY2;
                    return null;
                }
                int mergeType = ((int) (Math.random() * 3.0d)) + 1;
                boolean slideLevel = false;
                if (getRandomBoolean()) {
                    slideLevel = true;
                } else if (levelInterval >= 220 && getRandomBoolean()) {
                    float f4 = newY2;
                    return null;
                }
                if (!isSlideNoteOn) {
                    slideLevel = false;
                }
                if (mergeType != 1) {
                    if (mergeType != 2) {
                        if (mergeType == 3) {
                            switch (lastNote.placement) {
                                case 1:
                                    placement = 2;
                                    if (!slideLevel) {
                                        newY = lastNote.f493y;
                                        break;
                                    } else {
                                        newY = lastNote.f493y + 10.0f;
                                        isSlideMerged = true;
                                        slideDirection = SlideDirection.RIGHT;
                                        nextSlidePlace = 3;
                                        nextSlideDirection = slideDirection;
                                        break;
                                    }
                                case 2:
                                    placement = 1;
                                    if (!slideLevel) {
                                        newY = lastNote.f493y;
                                        break;
                                    } else {
                                        newY = lastNote.f493y + 10.0f;
                                        isSlideMerged = true;
                                        slideDirection = SlideDirection.LEFT;
                                        nextSlidePlace = 0;
                                        break;
                                    }
                                case 3:
                                    placement = 4;
                                    if (!slideLevel) {
                                        newY = lastNote.f493y;
                                        break;
                                    } else {
                                        newY = lastNote.f493y + 10.0f;
                                        isSlideMerged = true;
                                        nextSlidePlace = 0;
                                        slideDirection = SlideDirection.RIGHT;
                                        break;
                                    }
                                case 4:
                                    placement = 3;
                                    if (!slideLevel) {
                                        newY = lastNote.f493y;
                                        break;
                                    } else {
                                        newY = lastNote.f493y + 10.0f;
                                        isSlideMerged = true;
                                        slideDirection = SlideDirection.LEFT;
                                        nextSlidePlace = 2;
                                        nextSlideDirection = slideDirection;
                                        break;
                                    }
                            }
                        }
                    } else {
                        switch (lastNote.placement) {
                            case 1:
                                placement = 3;
                                newY = lastNote.f493y;
                                break;
                            case 2:
                                placement = 4;
                                newY = lastNote.f493y;
                                break;
                            case 3:
                                placement = 1;
                                newY = lastNote.f493y;
                                break;
                            case 4:
                                placement = 2;
                                newY = lastNote.f493y;
                                break;
                        }
                    }
                } else {
                    switch (lastNote.placement) {
                        case 1:
                            placement = 4;
                            newY = lastNote.f493y;
                            break;
                        case 2:
                            placement = 3;
                            if (!slideLevel) {
                                newY = lastNote.f493y;
                                break;
                            } else {
                                newY = lastNote.f493y + 10.0f;
                                isSlideMerged = true;
                                slideDirection = SlideDirection.RIGHT;
                                nextSlidePlace = 4;
                                nextSlideDirection = slideDirection;
                                break;
                            }
                        case 3:
                            placement = 2;
                            if (!slideLevel) {
                                newY = lastNote.f493y;
                                break;
                            } else {
                                newY = lastNote.f493y + 10.0f;
                                nextSlidePlace = 1;
                                slideDirection = SlideDirection.LEFT;
                                isSlideMerged = true;
                                nextSlideDirection = slideDirection;
                                break;
                            }
                        case 4:
                            placement = 1;
                            newY = lastNote.f493y;
                            break;
                    }
                }
                newY = newY2;
                placement = 0;
                alreadyMerged = true;
            }
        } else if (isCombiToPrev(nc.position)) {
            isSlideMerged = false;
            nextSlidePlace = 0;
            if (combiMode == 0) {
                if (getRandomBoolean()) {
                    combiMode = 1;
                } else {
                    combiMode = 2;
                }
            }
            if (combiMode != 1) {
                if (combiMode == 2) {
                    switch (lastNote.placement) {
                        case 1:
                            combiMode = 1;
                            placement2 = 2;
                            break;
                        case 2:
                            placement2 = 1;
                            break;
                        case 3:
                            placement2 = 2;
                            break;
                        case 4:
                            placement2 = 3;
                            break;
                    }
                }
            } else {
                switch (lastNote.placement) {
                    case 1:
                        placement2 = 2;
                        break;
                    case 2:
                        placement2 = 3;
                        break;
                    case 3:
                        placement2 = 4;
                        break;
                    case 4:
                        combiMode = 2;
                        placement2 = 3;
                        break;
                }
            }
            placement2 = 0;
            alreadyMerged = false;
            newY = newY2;
        } else {
            isSlideMerged = false;
            nextSlidePlace = 0;
            placement = getRandomPosition();
            alreadyMerged = false;
            newY = newY2;
        }
        combiMode = 0;
        levelNoteCount++;
        if (levelTime + levelInterval <= System.currentTimeMillis()) {
            levelTime = System.currentTimeMillis();
            levelNoteCount = 0;
            alreadyMerged = false;
        } else if (!alreadyMerged) {
            return null;
        }
        return new Note(placement, nc.relativePosition, newY, isSlideMerged, slideDirection);
    }

    public static void perfect(int position) {
        GameManager.touchResult = TouchResult.PERFECT;
        perfectCount++;
        comboCount++;
        if (comboPerfectStartTime + 200 > System.currentTimeMillis()) {
            comboPerfectCount++;
            if (comboPerfectCount > 3) {
                doublePerfect = true;
            }
        } else {
            comboPerfectCount = 0;
        }
        if (comboCount > 9 && combo1Time + 4000 < System.currentTimeMillis()) {
            combo1Time = System.currentTimeMillis();
            if (GameManager.isHighSpec) {
                GameManager.getEffectList().add(comboEffect);
            }
        }
        if (maxComboCount < comboCount) {
            maxComboCount = comboCount;
        }
        comboPerfectStartTime = System.currentTimeMillis();
    }

    public static void great() {
        GameManager.touchResult = TouchResult.GREAT;
        greatCount++;
        comboCount++;
        if (maxComboCount < comboCount) {
            maxComboCount = comboCount;
        }
    }

    public static void good() {
        GameManager.touchResult = TouchResult.GOOD;
        goodCount++;
        comboCount++;
        if (maxComboCount < comboCount) {
            maxComboCount = comboCount;
        }
    }

    public static void bad() {
        GameManager.touchResult = TouchResult.BAD;
        badCount++;
        comboCount = 0;
    }

    public static void miss() {
        GameManager.touchResult = TouchResult.MISS;
        missCount++;
        comboCount = 0;
    }

    public static void reset() {
        perfectCount = 0;
        greatCount = 0;
        goodCount = 0;
        badCount = 0;
        missCount = 0;
        comboCount = 0;
        maxComboCount = 0;
        lastNote = null;
        lastSlideTime = 0;
        lastNotePosition = 0;
        nextId = 1;
        totalMinute = 0.0f;
        init();
        noteList.clear();
    }
}
