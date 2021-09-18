public class NoteTouchProcessor implements InputProcessor {
    public static float effectAdjustment = 0.0f;
    public static float effectMultiflyer = 0.0f;
    private Camera camera;
    private boolean[] isMissArray = {false, false, false, false};
    private int[] lastTouchPlacementArray = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

    public NoteTouchProcessor(Camera camera2, int themeId) {
        this.camera = camera2;
        if (themeId == 2) {
            effectMultiflyer = GameManager.QUATER_WIDTH;
            if (GameManager.isLandscapeMode) {
                effectAdjustment = 100.0f;
            } else {
                effectAdjustment = 60.0f;
            }
        } else {
            effectMultiflyer = GameManager.HITLINE_WIDTH;
            effectAdjustment = GameManager.HITLINE_SPACE + (GameManager.HITLINE_WIDTH / 2.0f);
            if (GameManager.isLandscapeMode) {
            }
        }
    }

    public boolean keyDown(int keycode) {
        return false;
    }

    public boolean keyUp(int keycode) {
        return false;
    }

    public boolean keyTyped(char character) {
        return false;
    }

    public Vector2 convertToViewCord(Vector2 vector) {
        return new Vector2((vector.f207x / ((float) Gdx.graphics.getWidth())) * GameManager.WIDTH, (vector.f208y / ((float) Gdx.graphics.getHeight())) * GameManager.HEIGHT);
    }

    public boolean touchDown(int screenX, int screenY, int pointer, int button) {
        if (clicked.y < GameManager.CHECK_HEIGHT + 60.0f) {
            int touchedPlacement = ((int) (clicked.x / GameManager.QUATER_WIDTH)) + 1;
            if (touchedPlacement >= 1 && touchedPlacement <= 4) {
                this.isMissArray[touchedPlacement - 1] = false;
                checkNearestNote(touchedPlacement, false, null);
                if (this.isMissArray[touchedPlacement - 1]) {
                    GameManager.lastTouchStrTime = System.currentTimeMillis();
                    NoteManager.miss();
                    GameManager.buttonMissOn[touchedPlacement - 1] = true;
                } else {
                    GameManager.buttonOn[touchedPlacement - 1] = true;
                }
                try {
                    this.lastTouchPlacementArray[pointer] = touchedPlacement;
                } catch (ArrayIndexOutOfBoundsException e) {
                }
            }
        }
        return true;
    }

    public boolean touchUp(int screenX, int screenY, int pointer, int button) {
        if (clicked.y < GameManager.CHECK_HEIGHT + 60.0f) {
            int touchedPlacement = ((int) (clicked.x / GameManager.QUATER_WIDTH)) + 1;
            if (touchedPlacement >= 1 && touchedPlacement <= 4) {
                GameManager.buttonOn[touchedPlacement - 1] = false;
                GameManager.buttonMissOn[touchedPlacement - 1] = false;
                if (this.lastTouchPlacementArray[pointer] == touchedPlacement) {
                    this.lastTouchPlacementArray[pointer] = 0;
                }
            }
        }
        return true;
    }

    public boolean touchDragged(int screenX, int screenY, int pointer) {
        if (clicked.y < GameManager.CHECK_HEIGHT + 60.0f) {
            int touchedPlacement = ((int) (clicked.x / GameManager.QUATER_WIDTH)) + 1;
            if (this.lastTouchPlacementArray[pointer] != touchedPlacement && touchedPlacement >= 1 && touchedPlacement <= 4) {
                if (this.lastTouchPlacementArray[pointer] < touchedPlacement) {
                    checkNearestNote(touchedPlacement, true, SlideDirection.RIGHT);
                } else {
                    checkNearestNote(touchedPlacement, true, SlideDirection.LEFT);
                }
                this.lastTouchPlacementArray[pointer] = touchedPlacement;
            }
            if (touchedPlacement >= 2 && touchedPlacement <= 5) {
                GameManager.buttonOn[touchedPlacement - 2] = false;
                GameManager.buttonMissOn[touchedPlacement - 2] = false;
            }
            if (touchedPlacement <= 3 && touchedPlacement >= 1) {
                GameManager.buttonOn[touchedPlacement] = false;
                GameManager.buttonMissOn[touchedPlacement] = false;
            }
        } else {
            int touchedPlacement2 = ((int) (clicked.x / GameManager.QUATER_WIDTH)) + 1;
            if (touchedPlacement2 >= 1 && touchedPlacement2 <= 4) {
                GameManager.buttonOn[touchedPlacement2 - 1] = false;
                GameManager.buttonMissOn[touchedPlacement2 - 1] = false;
            }
        }
        return true;
    }

    private void checkNearestNote(int placement, boolean isSlideNote, SlideDirection slideDirection) {
        float checkUnit = GameManager.CHECK_UNIT;
        Note nearestNote = null;
        for (Note note : NoteManager.getNoteList()) {
            if (note.placement == placement && !note.isChecked() && note.isSlideNote == isSlideNote && note.slideDirection == slideDirection) {
                if (nearestNote == null || note.f493y < nearestNote.f493y) {
                    nearestNote = note;
                }
            }
        }
        if (nearestNote != null) {
            float nearestDistance = Math.abs(nearestNote.f493y - GameManager.CHECK_HEIGHT);
            if (isSlideNote) {
                checkUnit = (float) (((double) checkUnit) * 1.7d);
                if (nearestNote.f493y > GameManager.CHECK_HEIGHT + checkUnit) {
                    return;
                }
            }
            if (nearestNote != null && nearestDistance < checkUnit * 7.0f && !nearestNote.isChecked()) {
                GameManager.lastTouchStrTime = System.currentTimeMillis();
                this.isMissArray[placement - 1] = false;
                if (((double) nearestDistance) < ((double) checkUnit) / 1.3d) {
                    NoteManager.perfect(nearestNote.placement - 1);
                } else if (((double) nearestDistance) < ((double) checkUnit) * 1.4d) {
                    NoteManager.great();
                } else if (nearestDistance < 4.0f * checkUnit) {
                    NoteManager.good();
                } else if (nearestDistance < checkUnit * 7.0f) {
                    NoteManager.bad();
                }
                nearestNote.setChecked();
            }
        }
    }
}
