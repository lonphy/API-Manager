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
            L5.ViewManager.OpenView('project-list', 'project/list');

            thread.Send({run: "Project.gets", param: {offset:0}})
                .then(function(data){
                    console.log(data);
                    L5.ViewManager.Assign('list', data);
                    L5.ViewManager.Display();
                }).catch(function(e){
                    console.log(e);
                    L5.UI.Dialog.showErr(e.message);
                });
        },

        /**
        * 添加项目
        */
        add: function () {
            // 显示视图
            var view = L5.ViewManager.OpenView('project-add', 'project/add');
            L5.ViewManager.Assign('title', 'New Project')
            L5.ViewManager.Display();

            // 缓存UI控件
            var UIName = view.get("input[name='name']");
            var UIUrl = view.get("input[name='baseUrl']");
            var UIDesc = view.get("textarea");

            // 表单提交事件处理
            view.Listen("#project-form", "submit",  function(e){
                var data = {};
                data['name'] = UIName.value;
                data['baseUrl'] = UIUrl.value;
                data['desc'] = UIDesc.value;
                thread.Send({run: "Project.add", param: data})
                    .then(function(err, newId){
                        L5.UI.Dialog.show("新项目添加成功");
                        L5.Controller.Redirect('#Project.list');
                    });
            });
        },

        /**
         * 编辑项目
         */
        edit: function (request) {
            // 显示视图
            var view = L5.ViewManager.OpenView('project-add', 'project/add');
            L5.ViewManager.Assign('title', 'Edit Project');

            var projectId = request['pid']|0;
            if (projectId > 0) {
                thread.Send({run: "Project.get", param: {id: projectId}})
                    .then(function (data) {
                        L5.ViewManager.Assign('info', data);
                        L5.ViewManager.Display();
                    });
            }

            // 表单提交事件处理
            view.Listen("#project-form", "submit",  function(e){
                var data = {};
                data['name'] = view.get("input[name='name']").value;
                data['baseUrl'] = view.get("input[name='baseUrl']").value;
                data['desc'] = view.get("textarea").value;
                data['id'] = projectId;

                thread.Send({run: "Project.edit", param: data})
                    .then(function(newId){
                        L5.UI.Dialog.show("编辑成功");
                        L5.Controller.Redirect('#Project.list');
                    });
            });
        },
        remove: function (request) {

        }
    };
});