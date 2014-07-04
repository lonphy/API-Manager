(function(C, util){
    "use strict";
    if (C['ProjectControl']) return;
    /**
     * 项目控制器
     */
    function ProjectControl() {
    	// 验证URL
    	if(!util.checkView(this)) {
    		throw new Error("Load ProjectControl not allowed.");
    	}
    }

    ProjectControl.prototype = {
        constructor: ProjectControl,
        name:'project',
        /**
         * 获取一条记录
         * @param projectId 项目ID
         */
        get: function(projectId){

        },

        /**
         * 保存
         */
        save:function(){},
        toList: function() {
            var html = '<tr><td>'+this.name+'</td>';
            html += '<td>'+this.modules +'</td>';
            html += '<td>'+this.apis+'</td>';
            html += '<td>' + this.lastModify + '</td>';
            html += '<td><a href="#">Edit</a><a href="#">Debug</a><a href="#">Delete</a> ;';
            return html;
        }
    };

    Object.defineProperty(C, 'ProjectControl', {value:new ProjectControl});
}(L5.Controls, L5.util));