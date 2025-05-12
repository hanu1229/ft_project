package devconnect.util;

public class ExpCalculator {

    public static int getExpForLevel(int level) {
        return 100 + (level - 1) * 50;
    }

    public static int[] calculateLevelAndExp(int currentLevel, int currentExp, int expChange) {
        int newExp = currentExp + expChange;

        while (newExp >= getExpForLevel(currentLevel)) {
            newExp -= getExpForLevel(currentLevel);
            currentLevel++;
        }

        while (newExp < 0 && currentLevel > 1) {
            currentLevel--;
            newExp += getExpForLevel(currentLevel);
        }

        return new int[]{currentLevel, Math.max(0, newExp)};
    }
}
