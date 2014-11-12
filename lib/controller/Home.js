/*********************************
 * APP首页
 * @author lonphy
 * @version 0.1
*********************************/
L5.Controller.define("Home", function () {
    "use strict";

    return {
        // 首页
        list: function() {
            L5.ViewManager.display("Home", "index/index");
        }
    };
});