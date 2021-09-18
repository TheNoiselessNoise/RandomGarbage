public class NoteButton extends Actor {
    /* access modifiers changed from: private */
    public boolean dragChecked = false;
    private Sprite hitSprite;
    /* access modifiers changed from: private */
    public boolean isHit = false;
    /* access modifiers changed from: private */
    public boolean isMiss = false;
    private Sprite missSprite;
    /* access modifiers changed from: private */
    public int notePlacement;

    public void draw(Batch batch, float parentAlpha) {
        if (this.isHit) {
            this.hitSprite.setPosition(getX() + 1.0f, getY());
            this.hitSprite.draw(batch);
        } else if (this.isMiss) {
            this.missSprite.setPosition(getX() + 1.0f, getY());
            this.missSprite.draw(batch);
        }
        super.draw(batch, parentAlpha);
    }

    public NoteButton(int placement, Sprite hitSprite2, Sprite missSprite2) {
        this.notePlacement = placement;
        this.hitSprite = hitSprite2;
        this.missSprite = missSprite2;
        super.setTouchable(Touchable.enabled);
        addListener(new InputListener() {
            public void touchDragged(InputEvent event, float x, float y, int pointer) {
                if (NoteButton.this.dragChecked) {
                    return;
                }
                if (x > GameManager.QUATER_WIDTH) {
                    int nextNotePlacement = NoteButton.this.notePlacement + ((int) (x / GameManager.QUATER_WIDTH));
                    checkNearestNote(nextNotePlacement, true);
                    GameManager.getEffectList().add(new GameEffect(new Vector2((((float) (nextNotePlacement - 1)) * GameManager.QUATER_WIDTH) + (GameManager.QUATER_WIDTH / 2.0f), 81.0f), EffectType.TOUCH));
                    NoteButton.this.isHit = false;
                    NoteButton.this.isMiss = false;
                } else if (x < 0.0f) {
                    int prevNotePlacement = (NoteButton.this.notePlacement + ((int) (x / GameManager.QUATER_WIDTH))) - 1;
                    checkNearestNote(prevNotePlacement, true);
                    GameManager.getEffectList().add(new GameEffect(new Vector2((((float) (prevNotePlacement - 1)) * GameManager.QUATER_WIDTH) + (GameManager.QUATER_WIDTH / 2.0f), 81.0f), EffectType.TOUCH));
                    NoteButton.this.isHit = false;
                    NoteButton.this.isMiss = false;
                }
            }

            public boolean touchDown(InputEvent event, float x, float y, int pointer, int button) {
                GameManager.getEffectList().add(new GameEffect(new Vector2((((float) (NoteButton.this.notePlacement - 1)) * GameManager.QUATER_WIDTH) + (GameManager.QUATER_WIDTH / 2.0f), 81.0f), EffectType.TOUCH));
                NoteButton.this.dragChecked = false;
                NoteButton.this.isMiss = true;
                checkNearestNote(NoteButton.this.notePlacement, false);
                if (NoteButton.this.isMiss) {
                    NoteManager.miss();
                }
                GameManager.lastTouchStrTime = System.currentTimeMillis();
                return true;
            }

            public void touchUp(InputEvent event, float x, float y, int pointer, int button) {
                NoteButton.this.isHit = false;
                NoteButton.this.isMiss = false;
            }

            private void checkNearestNote(int placement, boolean isSlideNote) {
                float checkUnit = GameManager.CHECK_UNIT;
                if (isSlideNote) {
                    checkUnit = (float) (((double) checkUnit) * 2.5d);
                }
                Note nearestNote = null;
                float nearestDistance = 0.0f;
                for (Note note : NoteManager.getNoteList()) {
                    if (note.placement == placement && note.isSlideNote == isSlideNote) {
                        float distance = Math.abs(note.f493y - GameManager.CHECK_HEIGHT);
                        if (nearestNote == null || distance < nearestDistance) {
                            nearestNote = note;
                            nearestDistance = distance;
                        }
                    }
                }
                if (nearestNote != null && nearestDistance < 50.0f && !nearestNote.isChecked()) {
                    NoteButton.this.isMiss = false;
                    NoteButton.this.isHit = true;
                    if (isSlideNote) {
                        nearestNote.f493y = GameManager.CHECK_HEIGHT;
                    }
                    if (((double) nearestDistance) < ((double) checkUnit) / 1.5d) {
                        GameManager.getEffectList().add(new GameEffect(new Vector2((((float) (nearestNote.placement - 1)) * GameManager.QUATER_WIDTH) + (GameManager.QUATER_WIDTH / 2.0f), nearestNote.f493y), EffectType.PERFECT));
                        NoteManager.perfect(nearestNote.placement - 1);
                        if (GameManager.myRequestHandler != null) {
                            GameManager.myRequestHandler.vibrateLong();
                        }
                    } else if (nearestDistance < checkUnit * 2.0f) {
                        GameManager.getEffectList().add(new GameEffect(new Vector2((((float) (nearestNote.placement - 1)) * GameManager.QUATER_WIDTH) + (GameManager.QUATER_WIDTH / 2.0f), nearestNote.f493y), EffectType.HIT));
                        NoteManager.great();
                        if (GameManager.myRequestHandler != null) {
                            GameManager.myRequestHandler.vibrateLong();
                        }
                    } else if (nearestDistance < 4.0f * checkUnit) {
                        GameManager.getEffectList().add(new GameEffect(new Vector2((((float) (nearestNote.placement - 1)) * GameManager.QUATER_WIDTH) + (GameManager.QUATER_WIDTH / 2.0f), nearestNote.f493y), EffectType.GOOD));
                        NoteManager.good();
                        if (GameManager.myRequestHandler != null) {
                            GameManager.myRequestHandler.vibrateShort();
                        }
                    } else if (nearestDistance < 6.0f * checkUnit) {
                        NoteManager.bad();
                        if (GameManager.myRequestHandler != null) {
                            GameManager.myRequestHandler.vibrateShort();
                        }
                    }
                    nearestNote.setChecked();
                }
            }
        });
        setBounds(GameManager.QUATER_WIDTH * ((float) (placement - 1)), 0.0f, GameManager.QUATER_WIDTH, GameManager.CHECK_HEIGHT);
    }
}
