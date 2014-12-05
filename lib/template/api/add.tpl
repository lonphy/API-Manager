<h2>#{title}#<a href="#Api.list" class="title-button">Go Back</a></h2>
<form id="api-form" class="op-form">
    <p>
        <label>Name</label>
        <input type="text" name="name" class="long" placeholder="APIs 's project name" maxlength="64" value="#{info?info.name:""}#" required>
    </p>
    <p>
        <label>URL</label>
        <input type="url" name="baseURI" class="long" placeholder="API's base url" maxlength="128" value="#{info?info.baseUrl:""}#" required>
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

    <p class="high">
        <label>Desc</label>
        <textarea class="small" name="describe" placeholder="enter some desc. for your project." maxlength="1024" required>#{info?info.desc:""}#</textarea>
    </p>
    <p class="action">
        <button type="submit" class="form-button green">OK</button>
    </p>
</form>  