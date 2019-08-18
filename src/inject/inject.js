function copyToClipboard(text) {
  const copyFrom = document.createElement("textarea");
  // We don't need to see it!
  copyFrom.style.position = "fixed";
  copyFrom.style.width = 0;
  copyFrom.style.height = 0;
  copyFrom.textContent = text;
  // Insert into dom
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand("copy");
  copyFrom.blur();
  // Remove after copy is done
  document.body.removeChild(copyFrom);
}

function copyText($file) {
  const text = $file.querySelector(`[name="gist[content]"]`).value;
  copyToClipboard(text);
  console.log(`✅ GistCopyButton: gist content is copied to the clipboard!`);
}

function CopyButton($file) {
  const $elem = document.createElement("a");
  $elem.classList.add("btn", "btn-sm");

  $elem.href = "#";

  $elem.onclick = e => {
    e.preventDefault();
    copyText($file);
    // Prepare tooltip data
    $elem.setAttribute("aria-label", "Copied to Clipboard!");
    $elem.classList.add("tooltipped", "tooltipped-s", "tooltipped-multiline");
    // Trigger hover
    const evt = new MouseEvent("mouseover", {
      view: window,
      bubbles: true,
      cancelable: true
    });
    $elem.dispatchEvent(evt);
  };
  $elem.innerText = "Copy";

  return $elem;
}

function addCopyButton($file) {
  $file
    .querySelector(".file-header > .file-actions")
    .appendChild(CopyButton($file));
}

window.addEventListener("DOMContentLoaded", () => {
  const files = document.querySelectorAll(".file");

  files.forEach($file => {
    addCopyButton($file);
  });
});
