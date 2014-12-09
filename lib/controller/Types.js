/**
 * 数据类型管理
 */
L5.Controller.define("Types", function (thread) {
      "use strict";

      return {

            // 获取类型列表
            list: function(request) {
                L5.ViewManager.OpenView('type-list', 'types/list');

                thread.Send({run: "Types.gets", param: {offset:0}})
                    .then(function(data){
                        L5.ViewManager.Assign('list', data);
                        L5.ViewManager.Display();
                    });
            },

            add : function() {
                // 显示视图
                var view = L5.ViewManager.OpenView('type-add', 'types/add');
                L5.ViewManager.Assign('title', 'New Type');
                L5.ViewManager.Display();

                // 缓存UI控件
                var UIName = view.get("input[name='name']");
                var UIRegExp = view.get("input[name='regexp']");
                var UICategory = view.get("select[name='category']");
                var UIDesc = view.get("textarea");

                // 表单提交事件处理
                view.Listen("#type-form", "submit",  function(e){
                    var data = {};
                    data['name'] = UIName.value;
                    data['regexp'] = UIRegExp.value;
                    data['desc'] = UIDesc.value;
                    data['category'] = UICategory.value;
                    thread.Send({run: "Types.add", param: data})
                        .then(function(newId){
                            L5.UI.Dialog.show("Success");
                            L5.Controller.Redirect('#Types.list');
                        });
                });
            },
            edit : function(request) {
                // 显示视图
                var view = L5.ViewManager.OpenView('type-add', 'types/add');
                L5.ViewManager.Assign('title', 'Edit Type');

                var typeId = request['tid']|0;
                if (typeId > 0) {
                    thread.Send({run: "Types.get", param: {id: typeId}})
                        .then(function (data) {
                            L5.ViewManager.Assign('info', data);
                            L5.ViewManager.Display();
                        });
                }

                // 表单提交事件处理
                view.Listen("#type-form", "submit",  function(e){
                    var data = {};
                    data['name'] = view.get("input[name='name']").value;
                    data['regexp'] = view.get("input[name='regexp']").value;
                    data['desc'] = view.get("textarea").value;
                    data['category'] = view.get("select[name='category']").value;
                    data['id'] = typeId;

                    thread.Send({run: "Types.edit", param: data})
                        .then(function(result){
                            L5.UI.Dialog.show("Success");
                            L5.Controller.Redirect('#Types.list');
                        });
                });
            },
            remove: function() {

            }
      };
});