/**
 * 插件管理
 */
L5.Controller.define("Plugins", function () {
    "use strict";

      return {

            list: function() {
                  L5.ViewManager.showView("Plugins.list");
            }
      };
});