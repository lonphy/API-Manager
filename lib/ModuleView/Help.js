/**
 * 帮助页面
 */
L5.Module.define("Help", function () {
      "use strict";

      return {

            // 获取项目列表
            list: function() {

                  L5.ViewManager.showView("Help");
            }
      };
});