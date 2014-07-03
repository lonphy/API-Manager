(function(C){
    "use strict";
    if (C['ProjectControl']) return;
    function ProjectControl() {

    }

    ProjectControl.prototype = {
        constructor: ProjectControl,
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
    }
}(API.Control));