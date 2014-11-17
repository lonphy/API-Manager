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
            thread.Send({run: "Project.gets", param: {offset:0}}, function(err, data){
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
            var UIDesc = view.get("textarea");
            var UILoginUIR = view.get("input[name='loginURI']");

            // 表单提交事件处理
            view.Listen("#project-form", "submit",  function(e){
                var data = {};
                data['name'] = UIName.value;
                data['baseUrl'] = UIUrl.value;
                data['desc'] = UIDesc.value;
                data['isNeedLogin'] = UINeedLogin.checked;
                if (data['isNeedLogin']) {
                    data['loginURI'] = UILoginUIR.value;
                }
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
        edit: function () {

        },
        remove: function () {

        },
        detail: function (request) {
            var projectId = parseInt(request['pid']) || 0;
            if (projectId > 0) {
                thread.Send({run: "Project.get", param: {id: projectId}}, function (err, data) {
                    if (null != err) {
                        L5.UI.Dialog.show("出错了：" + err.message);
                        return;
                    }
                    L5.UI.Dialog.show(data.name);
                }, this);
            }
        }
    };
});