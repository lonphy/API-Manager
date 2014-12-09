<h2>#{title}#<a href="#Types.list" class="title-button">Go Back</a></h2>
<form id="type-form" class="op-form">
    <p>
        <label>Name</label>
        <input type="text" name="name" class="long" placeholder="Type's name" maxlength="64" value="#{info?info.name:""}#" required>
    </p>
    <p>
        <label>Category</label>
        <select name="category">
            <option value="number">Number</option>
            <option value="number">Char</option>
            <option value="number" selected>String</option>
            <option value="number">Other</option>
        </select>
    </p>
    <p>
        <label>RegExp</label>
        <input type="text" name="regexp" class="long" placeholder="RegExp for Type" maxlength="128" value="#{info?info.regexp:""}#" required>
    </p>
    <p class="high">
        <label>Desc</label>
        <textarea class="small" name="describe" placeholder="enter some desc. for custom type." maxlength="1024" required>#{info?info.desc:""}#</textarea>
    </p>
    <p class="action">
        <button type="submit" class="form-button green">OK</button>
    </p>
</form>