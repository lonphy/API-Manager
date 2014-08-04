/**
 * 项目管理
 */
L5.Module.define("Project", function () {
    "use strict";

      return {

            // 获取项目列表
            list: function(data) {
                  console.log(data);
                  L5.ViewManager.showView("Project.list");
            },
            add : function() {

            },
            edit : function() {

            },
            remove: function() {

            },
            detail : function() {

            }
      };
});