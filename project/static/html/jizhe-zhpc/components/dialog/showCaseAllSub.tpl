
{{#each data}}
   <li><i class="icon icon{{@index}}">{{addOne @index}}</i><span class="name" id="rankingName">{{name}}</span>
      <p class="value-box">
        <span class="value-bg"></span>
        <span class="value-data" style="width: {{dataW}}px"></span>
      </p>
      <p class="number">{{value}}</p>
    </li>
{{/each}}

