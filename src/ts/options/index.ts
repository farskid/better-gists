import { featureIds } from "../config";
import { storage } from "../storage";

const $form = document.getElementById("settings-form") as HTMLFormElement;

// Initialize checkboxes with feature settings from storage
storage.getFeatures().then(features => {
  // Check the checkboxes respective to the feature object coming from storage
  for (let id of features.keys()) {
    ($form[id] as HTMLInputElement).checked = features.get(id) as boolean;
  }
});

// Register click handler to alter storage
featureIds.forEach(id => {
  const checkbox = $form[id];
  checkbox.onchange = () => {
    storage.setFeature(id, checkbox.checked);
  };
});
