// ==UserScript==
// @name         小黄书 xchina.co 去广告
// @namespace    https://xchina.co/adblock
// @version      1.1.0
// @description  只做站点自带的 window.__ad_free=true。core-runtime.js 自己拆广告容器，不改封面 DOM。
// @author       local
// @match        https://xchina.co/*
// @match        https://*.xchina.co/*
// @match        https://xchina.online/*
// @match        https://xchina.work/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

(function () {
    "use strict";

    // 必须进页面主世界。Tampermonkey @grant none 仍可能隔一层，用 <script> 文本注入。
    var PAGE_BOOT = "(" + function () {
        if (window.__XCHINA_ADFREE_BOOT__) return;
        window.__XCHINA_ADFREE_BOOT__ = true;
        try {
            Object.defineProperty(window, "__ad_free", {
                configurable: false,
                enumerable: true,
                get: function () { return true; },
                set: function () {}
            });
        } catch (e) {
            window.__ad_free = true;
        }
    } + ")();";

    var el = document.createElement("script");
    el.textContent = PAGE_BOOT;
    (document.documentElement || document.head || document).appendChild(el);
    el.remove();
})();
