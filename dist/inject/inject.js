"use strict";
(function () {
    function withCatchError(func, onError) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                func.apply(void 0, args);
            }
            catch (err) {
                onError(err);
            }
        };
    }
    var tooltipClassnames = {
        base: ["tooltipped", "tooltipped-n", "tooltipped-multiline"],
        error: ["tooltipped-error"],
        wrapped: ["tooltipped-wrapped"]
    };
    function createTooltipOnElement($elem, tooltipText, _a) {
        var _b, _c, _d;
        var _e = _a === void 0 ? {} : _a, _f = _e.error, error = _f === void 0 ? false : _f, _g = _e.wrapped, wrapped = _g === void 0 ? false : _g;
        $elem.setAttribute("aria-label", tooltipText);
        (_b = $elem.classList).add.apply(_b, tooltipClassnames.base);
        error && (_c = $elem.classList).add.apply(_c, tooltipClassnames.error);
        wrapped && (_d = $elem.classList).add.apply(_d, tooltipClassnames.wrapped);
    }
    function removeTooltipFromElement($elem) {
        var _a;
        $elem.removeAttribute("aria-label");
        (_a = $elem.classList).remove.apply(_a, Object.values(tooltipClassnames).flat());
    }
    function triggerHover($elem) {
        var evt = new MouseEvent("mouseover", {
            view: window,
            bubbles: true,
            cancelable: true
        });
        $elem.dispatchEvent(evt);
    }
    function copyToClipboard(text) {
        var copyFrom = document.createElement("textarea");
        copyFrom.style.position = "fixed";
        copyFrom.style.width = "0";
        copyFrom.style.height = "0";
        copyFrom.textContent = text;
        document.body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand("copy");
        copyFrom.blur();
        document.body.removeChild(copyFrom);
    }
    function copyText($file) {
        var text = $file.querySelector("[name=\"gist[content]\"]").value;
        copyToClipboard(text);
        console.log("\u2705 GistCopyButton: gist content is copied to the clipboard!");
    }
    function CopyButton($file) {
        var $elem = document.createElement("a");
        $elem.classList.add("btn", "btn-sm");
        $elem.href = "#";
        $elem.onclick = withCatchError(function (e) {
            e.preventDefault();
            copyText($file);
            createTooltipOnElement($elem, "Copied to Clipboard!");
            triggerHover($elem);
            setTimeout(function () {
                removeTooltipFromElement($elem);
            }, 2000);
        }, function (err) {
            console.warn("GistCopyButton:", err);
            createTooltipOnElement($elem, "Error copying gist text, see console for more info", { error: true, wrapped: true });
            triggerHover($elem);
        });
        $elem.innerText = "Copy";
        return $elem;
    }
    function addCopyButton($file) {
        var $fileActions = $file.querySelector(".file-header > .file-actions");
        if ($fileActions !== null) {
            $fileActions.appendChild(CopyButton($file));
        }
    }
    window.addEventListener("DOMContentLoaded", function () {
        withCatchError(function () {
            var files = document.querySelectorAll(".file");
            files.forEach(function ($file) {
                addCopyButton($file);
            });
        }, function (err) {
            console.warn("GistCopyButton:", err);
        })();
    });
})();
//# sourceMappingURL=inject.js.map