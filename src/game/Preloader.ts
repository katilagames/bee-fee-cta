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

  public async load(onProgress?: (progress: number) => void) {
    Assets.add(this.manifest);

    const aliases = this.manifest.map((asset) => asset.alias);

    await Assets.load(
      aliases,
      (progress) => {
        onProgress?.(progress);
      }
    );
  }
}