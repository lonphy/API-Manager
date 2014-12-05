/*********************************
 * APP- API管理
 * @author lonphy
 * @version 0.1
 *********************************/
L5.Controller.define("Api", function (thread) {
    "use strict";

    return {
        // 获取API列表
        list: function (request) {
            L5.ViewManager.setTpl('api-list', 'api/list');
            thread.Send({run: "Api.gets", param: {offset:0}}, function(err, data){
                L5.ViewManager.assign('list', []);
                L5.ViewManager.display();
            }, this);
        },

        /**
         * 添加API
         */
        add: function () {
            // 显示视图
            var view = L5.ViewManager
                .setTpl('api-add', 'api/add')
                .assign('title', 'New API')
                .display();

            // 缓存UI控件
            var UIName = view.get("input[name='name']");
            var UIUrl = view.get("input[name='baseUrl']");
            var UIDesc = view.get("textarea");

            // 表单提交事件处理
            view.Listen("#api-form", "submit",  function(e){
                var data = {};
                data['name'] = UIName.value;
                data['baseUrl'] = UIUrl.value;
                data['desc'] = UIDesc.value;
                thread.Send({run: "Project.add", param: data}, function(err, newId){
                    if (null != err) {
                        L5.UI.Dialog.show(err.message, "error");
                        return;
                    }
                    L5.UI.Dialog.show("新项目添加成功", "");
                    L5.Controller.Redirect('#Project.list');
                });
            });
        },

        /**
         * 编辑API
         */
        edit: function (request) {
            // 显示视图
            var view = L5.ViewManager
                .setTpl('project-add', 'project/add')
                .assign('title', 'Edit Project')
                .getView('project-add');

            var projectId = parseInt(request['pid']) || 0;
            if (projectId > 0) {
                thread.Send({run: "Project.get", param: {id: projectId}}, function (err, data) {
                    if (null != err) {
                        L5.UI.Dialog.show("出错了：" + err.message);
                        return;
                    }
                    L5.ViewManager.assign('info', data).display();
                }, this);
            }

            // 表单提交事件处理
            view.Listen("#project-form", "submit",  function(e){
                var data = {};
                data['name'] = view.get("input[name='name']").value;
                data['baseUrl'] = view.get("input[name='baseUrl']").value;
                data['desc'] = view.get("textarea").value;
                data['id'] = projectId;

                thread.Send({run: "Project.edit", param: data}, function(err, newId){
                    console.log(err,newId);
                    if (null != err) {
                        L5.UI.Dialog.show(err.message, "error");
                        return;
                    }
                    L5.UI.Dialog.show("编辑成功", "");
                    L5.Controller.Redirect('#Project.list');
                });
            });
        },

        /**
         * 删除API
         */
        remove: function (request) {

        }
    };
});