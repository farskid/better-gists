import { Feature } from "../types";
import { featureIds } from "../config";

console.log("options page");

const $form = document.getElementById("settings-form") as HTMLFormElement;

const storage = {
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

// Initialize checkboxes with feature settings from storage
storage.getFeatures().then(features => {
  // First time before user sets anything to the storage, features is an empty object
  if (Object.keys(features).length === 0) {
    console.log("first time setting options");
    // Set all checkboxes to true
    for (let id in featureIds) {
      ($form[id] as HTMLInputElement).checked = true;
    }
    // Set features to true in storage
    console.log("setting all features to true in storage");
    const newFeatures = Object.values(featureIds).reduce((total, current) => {
      return { ...total, [current]: true };
    }, {});
    console.log({ newFeatures });
    storage.setFeatures(newFeatures);
  } else {
    console.log("storage has already been used before");
    // Check the checkboxes respective to the feature object coming from storage
    for (let id in features) {
      ($form[id] as HTMLInputElement).checked = features[id];
    }
  }
});

// Register click handler to alter storage
featureIds.forEach(id => {
  const checkbox = $form[id];
  checkbox.onchange = () => {
    const feature = {
      [id]: checkbox.checked
    };
    console.log(`set ${id} to ${checkbox.checked}`);
    storage.setFeatures(feature);
  };
});
