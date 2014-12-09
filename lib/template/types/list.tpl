<h2>Types List <a href="#Types.add" class="title-button">New Type</a></h2>
<ul class="list-header">
    <li>ID</li>
    <li>Type Name</li>
    <li>RegExp</li>
    <li>Desc</li>
    <li>Operate</li>
</ul>

#{foreach list as idx => val}#
<ul class="list-item">
    <li>#{val['id']}#</li>
    <li>#{val['name']}#</li>
    <li>#{val['regexp']}#</li>
    <li>#{val['desc']}#</li>
    <li>
        <a href="#Types.edit?tid=#{val['id']}#">Edit</a> |
        <a href="#Types.remove?tid=#{val['id']}#">Remove</a>
    </li>
</ul>
#{/foreach}#

