/**
 * APP首页
 */
L5.Module.define("Home", function () {
      "use strict";

      return {

            // 首页
            list: function() {

                  L5.ViewManager.showView("Home");
            }
      };
});