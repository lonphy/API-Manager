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
            var view = 'project-list';
            L5.ViewManager.showView(view).setLoading(true);

            thread.send({run: "Project.gets", param: {offset:0}}, function(data){
                L5(view).innerHTML = L5.T('project/list', {list:data});
                L5.ViewManager.setLoading(false);
            }, this);
        },

        /**
        * 添加项目
        */
        add: function () {
            var view = 'project-add';
            L5.ViewManager.showView(view).setLoading(true);
            L5(view).innerHTML = L5.T('project/add',{});
            L5.ViewManager.setLoading(false);
        },
        edit: function () {

        },
        remove: function () {

        },
        detail: function (request) {
            var projectId = parseInt(request['pid']) || 0;
            if (projectId > 0) {
                thread.send({run: "Project.get", param: {_id: projectId}}, function (data) {
                    L5.Dialog.show("获取数据成功：<br/>名称" + data.name);
                }, this);
            }
        }
    };
});