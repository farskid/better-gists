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

  // Run on content loaded
  window.addEventListener("DOMContentLoaded", () => {
    if (!isSingleGistPage) {
      return;
    }
    try {
      const files = document.querySelectorAll(".file");

      files.forEach($file => {
        addCopyButton($file);
      });
    } catch (err) {
      console.warn("GistCopyButton:", err);
    }
  });
})();
