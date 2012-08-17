(function () {
    "use strict";
    var page = WinJS.UI.Pages.define("default.html", {
        ready: function (element, options) {
            document.getElementById("cmdBlack")
                .addEventListener("click", blackCircle, false);
            document.getElementById("cmdColor")
                .addEventListener("click", colorCircle, false);
            document.getElementById("cmdClear")
                 .addEventListener("click", clearCanvas, false);
        },
    });
})();