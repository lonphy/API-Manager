<h2>#{title}#<a href="#Api.list" class="title-button">Go Back</a></h2>
<form id="api-form" class="op-form">
    <p>
        <label>Name</label>
        <input type="text" name="title" class="long" placeholder="APIs 's name" maxlength="64" value="#{info?info.name:""}#" required>
    </p>
    <p>
        <label>URL</label>
        <span>#{project.baseUrl}#</span>
        <input type="text" name="uri" class="long" placeholder="API's uri" maxlength="128" value="#{info?info.uri:""}#" required>
    </p>

    <p>
        <label>Request Method</label>
        <select name="method">
            <option value="GET">GET</option>
            <option value="GET">POST</option>
            <option value="GET">PUT</option>
            <option value="GET">DELETE</option>
            <option value="GET">HEAD</option>
        </select>
    </p>
    <div>
        <label>Params</label>
        <dl>
            <dt><span>name</span><span>type</span><span>default</span><span>Option</span><span>action</span></dt>
            <dd>
                <span><input type="text"></span>
                <span><select><option>Int8</option></select></span>
                <span><input type="text"></span>
                <span><input type="checkbox"></span>
                <span><input type="button" value="Add"></span>
            </dd>
        </dl>
    </div>
    <p class="high">
        <label>Desc</label>
        <textarea class="small" name="describe" placeholder="enter some desc. for your project." maxlength="1024" required>#{info?info.desc:""}#</textarea>
    </p>
    <p class="action">
        <button type="submit" class="form-button green">OK</button>
    </p>
</form>  