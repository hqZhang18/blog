{{#each data}}
<li>
  <span>{{name}}</span>   
  <span><em class="groove" style="width:{{barWidth}}%" ></em></span>
  <span >{{value}}</span>
  <!-- <span style="margin-left: {{barWidth}}%">{{value}}</span> -->
</li>
{{/each}}