<h2>Project Lists <a href="#Project.add" class="title-button">New Project</a></h2>
<ul class="header">
    <li>ID</li>
    <li>Project Name</li>
    <li>Create Time</li>
    <li>Short Desc</li>
    <li>API Number</li>
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
        <a href="#Project.edit?pid=#{val['id']}#">Edit</a> | 
        <a href="#Project.apis?pid=#{val['id']}#">APIs</a> | 
        <a href="#Project.remove?pid=#{val['id']}#">Remove</a>
    </li>
</ul>
#{/foreach}#

