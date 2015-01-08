/**
 * 视图管理
 *
 * @author lonphy
 * @version 0.1
 */
(function ($, View) {
    "use strict";
    var _views = new Map;   // 管理所有视图
    var _container = null;  // 视图父容器
    var _dataCache = new Map;   // 视图模板赋值容器
    var __TEMPLATE__ = '';      // 当前模板路径
    var __VIEW_ID__ = '';    // 当前显示的视图ID

    // DOM 加载完成时赋值视图容器
    $.Ready(function () {
        _container = document.getElementById('views');
    });

    /******************* 私有方法 ******************************/
    /**
     * 创建视图对象
     * @param viewID {String} 视图ID
     * @param {boolean} isNeedDraw 是否需要加入DOM树中
     * @return {L5.UI.View|null}
     */
    function createView(viewID, isNeedDraw) {
        var v = document.createElement('l5-view');
        v.id = viewID;
        var view = new View(v);
        if (isNeedDraw) {
            if (view.isOpen) {
                view.hide();
            }
            _container.appendChild(view.context);
        }

        _views.set(view.id, view);
        return view;
    }

    /**
     * 获取视图对象
     * @param {string} viewID 视图对象ID
     * @return {L5.UI.View}
     */
    function getView(viewID) {
        var view = _views.get(viewID);
        if (!view && viewID) {
            view = createView(viewID, true);    // 创建一个View
        }
        return view;
    }

    /**
     * 切换视图对象
     * @param {string} viewID 视图对象名称
     * @return {L5.UI.View}
     */
    function switchView(viewID) {
        var view = getView(viewID);
        if (__VIEW_ID__ !== viewID) {
            var oldView = getView(__VIEW_ID__);
            oldView && oldView.Hide();
            view.Show();
            view.DoLoading(true);
            __VIEW_ID__ = viewID;
        }

        return view;
    }

    /**
     * 设置视图模板
     * @param {String} viewId 视图ID
     * @param {String} tpl 模板名称, 选填
     * @return {L5.UI.View}
     */
    function setTpl(viewID, tpl) {
        if (!viewID) {
            throw $.Error("ViewManager::CreateView() : View ID can't be empty.");
        }
        var view = switchView(viewID);
        __TEMPLATE__ = tpl;
        return view;
    }

    /**
     * 模板赋值
     * @param key {String} 键名
     * @param data {*} 值
     * @return void
     */
    function assign(key, data) {
        _dataCache.set(key, data);
    }

    /**
     * 显示视图
     * @param {String} viewId 视图ID
     * @param {String} tpl 模板名称, 选填
     * @return void
     */
    function display(/*viewID, tpl*/) {
        var viewID = arguments[0], tpl = arguments[1];
        var view = viewID && tpl ? setTpl(viewID, tpl) : switchView(__VIEW_ID__);
        var result = $.ViewManager.Template(__TEMPLATE__, _dataCache);
        _dataCache.clear();
        view.Render(result);
    }

    $.ViewManager = {
        InitView: setTpl,
        Assign: assign,
        Display: display
    };
})(L5, L5.UI.View);