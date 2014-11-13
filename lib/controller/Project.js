/*********************************
* APP- 项目管理
* @author lonphy
* @version 0.1
*********************************/
L5.Controller.define("Project", function (thread) {
    "use strict";

    return {
        // 获取项目列表
        list: function (request) {
            L5.ViewManager.setTpl('project-list', 'project/list');
            thread.Send({run: "Project.gets", param: {offset:0}}, function(data){
                L5.ViewManager.assign('list', data);
                L5.ViewManager.display();
            }, this);
        },

        /**
        * 添加项目
        */
        add: function () {
            // 显示视图
            var view = L5.ViewManager.display('project-add', 'project/add');

            // 缓存UI控件
            var UIName = view.get("input[name='name']");
            var UIUrl = view.get("input[name='baseUrl']");
            var UINeedLogin = view.get("input[name='needLogin']");
            var UIDesc = view.get('textarea');

            // 表单提交事件处理
            view.Listen("#project-form", "submit",  function(e){
                console.log(UIName.value, UIUrl.value, UINeedLogin.value, UIDesc.value);
            });
        },
        edit: function () {

        },
        remove: function () {

        },
        detail: function (request) {
            var projectId = parseInt(request['pid']) || 0;
            if (projectId > 0) {
                thread.Send({run: "Project.get", param: {_id: projectId}}, function (data) {
                    L5.Dialog.show("获取数据成功：<br/>名称" + data.name);
                }, this);
            }
        }
    };
});