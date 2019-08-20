import { Feature } from "./types";
import { featureIds } from "./config";
import { mapToObject } from "./utils";

export const storage = {
  _store: new Map<string, boolean>(),
  getFeatures(): Promise<Feature> {
    return new Promise(resolve => {
      return chrome.storage.sync.get(featureIds, features => {
        // First time loading extension, it's an empty object
        if (Object.keys(features).length === 0) {
          featureIds.forEach(id => {
            // Set all features to true
            this._store.set(id, true);
          });
          // Persist new store to chrome storage
          chrome.storage.sync.set(this._store, () => {
            console.log("built chrome storage successfully!");
          });
        } else {
          featureIds.forEach(id => {
            // Set features to value in storage
            this._store.set(id, features[id]);
          });
        }
        resolve(this._store);
      });
    });
  },
  setFeature(id: string, value: boolean) {
    return new Promise(() => {
      this._store.set(id, value);
      chrome.storage.sync.set(mapToObject(this._store), () => {
        console.log(`set ${JSON.stringify({ [id]: value })} successfully!`);
      });
    });
  }
};
