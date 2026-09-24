import { Assets } from "pixi.js";


export type ItemsSettings = {
  speed: number,
  types: string[],
  maxAtOnce: number
  spawnItemEveryMs: number
}

export type HeroSettings = {
  speed: number;
}

export type LevelSettings = {
  items: ItemsSettings,
  hero: HeroSettings,
  background: string,
}

export default class LevelsManager {
  getSettings(level: number): LevelSettings {
    const settings = Assets.get("levels_config");
    const levelSetting: LevelSettings | undefined = settings['level' + level];
    if (!levelSetting) {
      throw Error(`Missing settings for level ${level}`);
    }

    return levelSetting;
  }
}