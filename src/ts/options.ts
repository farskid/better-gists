console.log("options page");

const $form = document.getElementById("settings-form") as HTMLFormElement;

type Feature = "copy-button" | "expandable-detail";
const features: Feature[] = ["copy-button", "expandable-detail"];

type Features = Record<Feature, boolean>;

const storage = {
  _cache: {},
  _hasFetchedFeatures: false,
  getFeatures(): Promise<Features> {
    return new Promise(resolve => {
      if (this._hasFetchedFeatures) {
        return this._cache;
      }

      return chrome.storage.sync.get(features, items => {
        console.log(items);
        this._cache = items;
        this._hasFetchedFeatures = true;
        resolve(items as Features);
      });
    });
  },
  setFeature(id: Feature, value: boolean): Promise<void> {
    return new Promise(() => {
      chrome.storage.sync.set({ [id]: value }, () => {
        console.log(`set ${id} to ${value} successfully!`);
      });
    });
  }
};

// Initialize checkboxes with feature settings from storage
storage.getFeatures().then(features => {
  for (let id in features) {
    $form[id].checked = features[id as Feature];
  }
});

// Register click handler to alter storage
features.forEach(id => {
  const checkbox = $form[id];
  checkbox.onchange = () => {
    storage.setFeature(id, checkbox.checked);
  };
});
