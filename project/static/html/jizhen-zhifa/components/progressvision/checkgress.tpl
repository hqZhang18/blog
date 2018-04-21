{{!--<li>
  <span>四支队</span>
  <span>
    <em class="groove">
      <em style="width:27%"></em>
    </em>25
  </span>
  <span>44%</span>
  <span>56%</span>
</li>--}}

{{#each this}}
<li>
  <span>{{name}}</span>
  <span>
    <em class="groove">
      <em style="width:{{barWidth}}%"></em>
    </em>{{value}}
  </span>
  <span>{{returnRote}}</span>
  <span>{{endRate}}</span>
</li>
{{/each}}