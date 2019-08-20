import { storage } from "../storage";

(function() {
  function isSingleGistPage() {
    return /https:\/\/gist\.github\.com\/\w(-\w|\w\w|\w){0,19}\/\w+/gi.test(
      window.location.href
    );
  }

  const tooltipClassnames = {
    base: ["tooltipped", "tooltipped-n", "tooltipped-multiline"],
    error: ["tooltipped-error"],
    wrapped: ["tooltipped-wrapped"]
  };

  function createTooltipOnElement(
    $elem: Element,
    tooltipText: string,
    { error = false, wrapped = false } = {}
  ) {
    $elem.setAttribute("aria-label", tooltipText);
    $elem.classList.add(...tooltipClassnames.base);
    error && $elem.classList.add(...tooltipClassnames.error);
    wrapped && $elem.classList.add(...tooltipClassnames.wrapped);
  }

  function removeTooltipFromElement($elem: Element) {
    // const clone = $elem.cloneNode(true);
    $elem.removeAttribute("aria-label");
    $elem.classList.remove(...Object.values(tooltipClassnames).flat());
    // return clone;
  }

  /**
   * According to Github primer design system, tooltips only trigger on hover.
   */
  function triggerHover($elem: Element) {
    const evt = new MouseEvent("mouseover", {
      view: window,
      bubbles: true,
      cancelable: true
    });
    $elem.dispatchEvent(evt);
  }

  function copyToClipboard(text: string) {
    const copyFrom = document.createElement("textarea");
    // We don't need to see it!
    copyFrom.style.position = "fixed";
    copyFrom.style.width = "0";
    copyFrom.style.height = "0";
    copyFrom.textContent = text;
    // Insert into dom
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand("copy");
    copyFrom.blur();
    // Remove after copy is done
    document.body.removeChild(copyFrom);
  }

  function copyText($file: Element) {
    const text = ($file.querySelector(
      `[name="gist[content]"]`
    ) as HTMLTextAreaElement).value;
    copyToClipboard(text);
    console.log(`✅ GistCopyButton: gist content is copied to the clipboard!`);
  }

  function CopyButton($file: Element) {
    const $elem = document.createElement("a");
    $elem.classList.add("btn", "btn-sm");

    $elem.href = "#";

    try {
      $elem.onclick = e => {
        e.preventDefault();
        copyText($file);
        createTooltipOnElement($elem, "Copied to Clipboard!");
        triggerHover($elem);
      };
    } catch (err) {
      console.warn("GistCopyButton:", err);
      createTooltipOnElement(
        $elem,
        "Error copying gist text, see console for more info",
        { error: true, wrapped: true }
      );
      triggerHover($elem);
    } finally {
      setTimeout(() => {
        removeTooltipFromElement($elem);
      }, 2000);
    }

    $elem.innerText = "Copy";

    return $elem;
  }

  function addCopyButton($file: Element) {
    const $fileActions = $file.querySelector(".file-header > .file-actions");
    if ($fileActions !== null) {
      $fileActions.appendChild(CopyButton($file));
    }
  }

  function convertToDetails($file: Element) {
    const $fileHeader = $file.querySelector(".file-header") as Element;
    const $fileBody = $file.querySelector(".Box-body") as Element;

    const $details = document.createElement("details");
    $details.classList.add("details-overlay");

    const $summary = document.createElement("summary");
    const $body = document.createElement("div");

    $summary.appendChild($fileHeader);
    $body.appendChild($fileBody);

    $details.appendChild($summary);
    $details.appendChild($body);

    $file.appendChild($details);
  }

  // Run on content loaded
  window.addEventListener("DOMContentLoaded", async () => {
    if (!isSingleGistPage()) {
      return;
    }
    try {
      let features = await storage.getFeatures();
      console.log({ features });

      const files = document.querySelectorAll(".file");
      const numberOfFiles = files.length;

      files.forEach($file => {
        // Wrap each feature in a separate try-catch
        // we don't want failure in one break others too!
        if (features.get("copy-button") === true) {
          try {
            addCopyButton($file);
          } catch (err) {
            console.warn("GistCopyButton: add-copy-button:", err);
          }
        }

        // Do not convert a single file in Gist
        if (features.get("expandable-detail") && numberOfFiles > 1) {
          try {
            convertToDetails($file);
          } catch (err) {
            console.warn("GistCopyButton: convert-to-details:", err);
          }
        }
      });
    } catch (err) {
      console.warn("GistCopyButton:", err);
    }
  });
})();
