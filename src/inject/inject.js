function copyToClipboard(text) {
  const copyFrom = document.createElement("textarea");
  copyFrom.style.position = "fixed";
  copyFrom.style.width = 0;
  copyFrom.style.height = 0;
  copyFrom.textContent = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand("copy");
  copyFrom.blur();
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
