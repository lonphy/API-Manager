<h2>New Project<a href="#Project.list" class="title-button">Go Back</a></h2>
<form>
    <p>
        <label>Name</label>
        <input type="text" class="long" placeholder="APIs 's project name" maxlength="64" required>
    </p>
    <p>
        <label>Base URL</label>
        <input type="url" class="long" placeholder="API's base url" maxlength="128" required>
    </p>
    <p>
        <label>Need Login</label>
        <span><input type="radio" name="login" value="10">Yes</span>
        <span><input type="radio" name="login" value="20">No</span>
    </p>
    <p>
        <label>Login URI</label>
        <input type="text" class="long"  placeholder="login API URI (full uri)" maxlength="1024">
    </p>
    <p>
        <label>Key Name</label>
        <input type="text" class="short" maxlength="32">
        <label style="width:6em">Key Value</label>
        <input type="text" class="short" maxlength="64">
     </p>

    <p class="high">
        <label>Desc</label>
        <textarea class="small" placeholder="enter some desc. for your project." maxlength="1024" required></textarea>
    </p>
    <p class="action">
        <button type="submit" class="form-button green">Create Now!</button>
    </p>
</form>