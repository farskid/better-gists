import { Feature } from "./types";
import { featureIds } from "./config";

export const storage = {
  getFeatures(): Promise<Feature> {
    return new Promise(resolve => {
      return chrome.storage.sync.get(featureIds, features => {
        console.log({ features });
        resolve(features);
      });
    });
  },
  setFeatures(items: Feature) {
    return new Promise(() => {
      chrome.storage.sync.set(items, () => {
        console.log(`set ${JSON.stringify(items)} successfully!`);
      });
    });
  }
};
