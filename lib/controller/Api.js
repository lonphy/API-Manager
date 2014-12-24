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
            L5.ViewManager.InitView('api-list', 'api/list');
            L5.ViewManager.Assign('projectId', request['pid']|0);
            var projectId = request['pid']|0;
            thread.Send({run: "Api.gets", param: {offset:0, projectId:projectId}})
                .then(function(data){
                    L5.ViewManager.Assign('list', data);
                    L5.ViewManager.Display();
                });
        },

        /**
         * 添加API
         */
        add: function (request) {
            // 显示视图
            var view = L5.ViewManager.InitView('api-add', 'api/add');
            L5.ViewManager.Assign('title', 'New API');

            var projectId = request['pid']|0;
            if (projectId > 0) {
                thread.Send({run: "Project.get", param: {id: projectId}})
                    .then(function (data) {
                        L5.ViewManager.Assign('project', data);
                        L5.ViewManager.Display();
                    });
            }

            var listView;
            thread.Send({run:"Types.gets", param:{offset:0}})
                .then(function(data){
                    listView = new L5.UI.ListView({
                        header: "<span>name</span><span>type</span><span>default</span><span>Option</span>",
                        container: "#api-list-view",
                        rowTpl: "<span><input type='text'></span>" +
                                "<span><select id='types'></select></span><span><input type='text'></span>" +
                                "<span><input type='checkbox'></span>",
                        data: []
                    });
                    console.log(listView);
                    /*
                    var html = "";
                    data.forEach(function(item){
                        html += "<option value='"+item['id']+"' data-regexp='"+item["regexp"]+"'>"+item["name"]+"</option>";
                    });
                    view.get("#types").innerHTML = html;
                    */
                    window.listView = listView;
                });

            // 表单提交事件处理
            view.Listen("#api-form", "submit",  function(e){
                var data = {};
                data['name'] = view.get("input[name='title']").value;
                data['uri'] = view.get("input[name='uri']").value;
                data['method'] = view.get("select[name='method']").value;
                data['desc'] = view.get("textarea").value;
                thread.Send({run: "Api.add", param: data})
                    .then(function(newId){
                        L5.UI.Dialog.Show("接口添加成功");
                        L5.Controller.Redirect('#Api.list?pid='+projectId);
                    });
            });
        },

        /**
         * 编辑API
         */
        edit: function (request) {
            // 显示视图
            var view = L5.ViewManager.InitView('api-add', 'api/add');
            L5.ViewManager.Assign('title', 'Edit API');

            var id = request['id']|0,
                projectId;

            if (id > 0) {
                thread.Send({run: "Api.get", param: {id: id}})
                    .then(function (data) {
                        projectId = data.projectId;
                        L5.ViewManager.Assign('info', data);
                        L5.ViewManager.Display();
                    });
            }

            // 表单提交事件处理
            view.Listen("#api-form", "submit",  function(e){
                var data = {};
                data['name'] = view.get("input[name='name']").value;
                data['uri'] = view.get("input[name='uri']").value;
                data['desc'] = view.get("textarea").value;

                thread.Send({run: "Api.edit", param: data})
                    .then(function(newId){
                        L5.UI.Dialog.Show("编辑成功");
                        L5.Controller.Redirect('#Api.list?pid='+projectId);
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