/**
 * 主题管理
 */
L5.Controller.define("Theme", function () {
    "use strict";

      return {

            // 获取可用主题
            list: function() {
                  L5.UI.Dialog.show("Theme Controller output.");
            }
      };
});