{{#each this}}
    <li data-code ={{code}} data-order={{order}} class="library-list{{order}}">
        <span>{{code}}</span>
        <span>{{date}}</span>
        <span>{{time}}</span>
    </li>
{{/each}}