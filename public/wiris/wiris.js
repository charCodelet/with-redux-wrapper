(function () {
    console.log("WIRIS")

    // URL to WIRIS offline library
    const LOCAL_WIRIS_URL = "assets/lib/wiris/offline/editor_offline.js";
    // URL to WIRIS server-side component library
    const EXTERNAL_WIRIS_URL = "https://wiris2019-external.naepims.org/editorservice.aspx/editor?lang=en";

    const com = window.com || {};
    if (!com.wiris) {
        var ec = document.createElement("script");
        ec.src = resolveWIRISLibraryPath();
        document.documentElement.appendChild(ec);
    }

    window.enaepPlatform = Object.assign((window.enaepPlatform || {}), { resolveWIRISLibraryPath });

    function resolveWIRISLibraryPath() {
        if (window.location.href.indexOf("http") !== 0 ||
            document.domain === "localhost" ||
            /127\.\d+\.\d+\.\d+/.test(document.domain) ||
            document.domain.lastIndexOf(".localdomain") === document.domain.length - ".localdomain".length) {
            return resolveURL(LOCAL_WIRIS_URL);
        } else {
            return EXTERNAL_WIRIS_URL;
        }
    }

    function resolveURL(url) {
        return new URL(url, window.location.href).toString();
    }

})();
