<h2>#{title}#<a href="#Project.list" class="title-button">Go Back</a></h2>
<form id="project-form">
    <p>
        <label>Name</label>
        <input type="text" name="name" class="long" placeholder="APIs 's project name" maxlength="64" value="#{info.name}#" required>
    </p>
    <p>
        <label>Base URL</label>
        <input type="url" name="baseUrl" class="long" placeholder="API's base url" maxlength="128" value="#{info.baseUrl}#" required>
    </p>
    <p class="high">
        <label>Desc</label>
        <textarea class="small" name="describe" placeholder="enter some desc. for your project." maxlength="1024" required>#{info.desc}#</textarea>
    </p>
    <p class="action">
        <button type="submit" class="form-button green">OK</button>
    </p>
</form>  