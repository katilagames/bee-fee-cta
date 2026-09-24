import { Assets } from "pixi.js";

export type ItemsSettings = {
  speed: number;
  types: string[];
  maxAtOnce: number;
  spawnItemEveryMs: number;
};

export type HeroSettings = {
  speed: number;
};

export type LevelSettings = {
  items: ItemsSettings;
  hero: HeroSettings;
  background: string;
  pointsToLevelUp: number;
};

export type LevelsSettings = Record<string, LevelSettings>;

export default class LevelsManager {
  getLevelsNum() {
    const settings = Assets.get("levels_config") as LevelsSettings | undefined;
    if (!settings) return 1;
    return Object.keys(settings).filter((k) => k.startsWith("level")).length;
  }
  getSettings(level: number): LevelSettings {
    const settings = Assets.get("levels_config") as LevelsSettings | undefined;
    if (!settings) {
      throw Error("Missing levels_config asset");
    }
    const key = "level" + level;
    const levelSetting: LevelSettings | undefined = settings[key];
    if (!levelSetting) {
      throw Error(`Missing settings for level ${level}`);
    }

    return levelSetting;
  }
}
