<h2>APIs | <a href="#Api.add?pid=#{projectId}#">New API</a>
<a href="#Project.list" class="title-button">Go Back</a></h2>
<ul class="list-header">
    <li>ID</li>
    <li>API Name</li>
    <li>Create Time</li>
    <li>Short Desc</li>
    <li>Param Number</li>
    <li>Operate</li>
</ul>

#{foreach list as idx => val}#
<ul class="list-item">
    <li>#{val['id']}#</li>
    <li>#{val['name']}#</li>
    <li>#{val['_time']}#</li>
    <li>#{val['desc']}#</li>
    <li>#{val['api_number']}#</li>
    <li>
        <a href="#Api.edit?id=#{val['id']}#">Edit</a> | 
        <a href="#Api.remove?id=#{val['id']}#">Remove</a> |
        <a href="#Debug.single?aid=#{val['id']}#">Debug</a>
    </li>
</ul>
#{/foreach}#

