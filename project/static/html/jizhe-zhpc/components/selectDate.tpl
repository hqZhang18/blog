
<select class="init-date-list" id="startDate">
    {{#each this}}
		{{#compare lastDate 0}}
			<option value={{key}} {{selected}}>{{value}}</li>
		{{else}}
			<option value={{key}}>{{value}}</li>
		{{/compare}}
    {{/each}}
</select>

<select class="init-date-list" id="endDate">
    {{#each this}}
        <option value={{key}} {{selected}}>{{value}}</li>
    {{/each}}
</select>