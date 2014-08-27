/**
 * 项目管理
 */
L5.Module.define("Project", function (thread) {
    "use strict";

      return {

            // 获取项目列表
            list: function(request) {
                  console.log(request);
                  L5.ViewManager.showView("Project.list").setLoading(true);
                  document.getElementById("Project.list").innerHTML = "<a href='#Project.detail?pid=1'>详细</a>";
            },
            add : function() {

            },
            edit : function() {

            },
            remove: function() {

            },
            detail : function(request) {
                  var projectId = parseInt(request['pid']) || 0;
                  if (projectId > 0) {
                        thread.send({run:"Project.get", param:{_id:projectId}}, function(data){
                              L5.Dialog.show("获取数据成功：<br/>名称"+data.name);
                        }, this);
                  }
            }
      };
});