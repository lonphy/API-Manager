/**
 * DOM加载完成处理
 *
 * @author lonphy
 * @version 0.1
 */
(function ($) {
    "use strict";

    var domReady = [],
        isReady = false;

    function handle() {
        window.removeEventListener('DOMContentLoaded', handle, false);

        $.Ready = function (fn) {
            typeof fn === 'function' && fn.call(null);
        };

        domReady.slice() // use slice function canbe faster?
            .forEach(function (func) {
                func.call(null);
            });

        isReady = true;
        domReady = null;    // GC?
    };
    window.addEventListener('DOMContentLoaded', handle, false);

    $.Ready = function (fn) {
        return typeof fn === 'function' && (isReady ? fn.call(null) : domReady.push(fn));
    };
})(L5);