/**
 * 调试管理
 */
L5.Module.define("Debug", function () {
    "use strict";

      return {

            // 获取项目API列表
            list: function(projectId) {
                  L5.ViewManager.showView("Debug.list");
            }
      };
});