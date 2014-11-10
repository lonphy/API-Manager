<h2>New Project<a href="#Project.list" class="title-button">Go Back</a></h2>
<form>
    <p><label>Name</label><input type="text" placeholder="APIs 's project name" maxlength="64"></p>
    <p><label>Base URL</label><input type="url" placeholder="API's base url" maxlength="128"></p>
    <p>
        <label>Need Login</label>
        <input type="radio" name="login" value="10">Yes
        <input type="radio" name="login" value="20">No
        <label>Login URI</label><input type="text"  placeholder="login API URI (full uri)" maxlength="1024">
     </p>
    <p>
        <label>Key Name</label>
        <input type="text" maxlength="32">
        <label>Key Value</label>
        <input type="text" maxlength="64">
     </p>

     <p><label>Desc</label><textarea placeholder="enter some desc. for your project." maxlength="1024"></textarea></p>
     <p><button type="submit">Create Now!</button></p>
</form>