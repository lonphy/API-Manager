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
            console.log(thread);
            thread.Send({run: "Project.gets", param: {offset:0}}, function(data){
                L5.ViewManager.assign('list', data);
                L5.ViewManager.display();
            }, this);
        },

        /**
        * 添加项目
        */
        add: function () {
            L5.ViewManager.display('project-add', 'project/add');
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