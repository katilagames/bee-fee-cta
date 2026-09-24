import { Assets } from "pixi.js";

export type AssetManifestEntry = {
  alias: string;
  src: string;
};

export default class Preloader {
  private manifest: AssetManifestEntry[];

  constructor(manifest: AssetManifestEntry[]) {
    this.manifest = manifest;
  }

  public async load() {
    Assets.add(this.manifest);
    await Assets.load(this.manifest.map((asset) => asset.alias));
  }
}
