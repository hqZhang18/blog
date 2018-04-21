{{#each this}}
<li>
    <span class="count-name">{{name}}</span>
    <span class="count-number">
        {{#each valueArr}}
        <em>{{this}}</em>
        {{/each}}
    </span>
</li>
{{/each}}