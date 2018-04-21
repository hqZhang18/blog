<li class="tab-title">
    <span>时间</span>
    <span>待检查</span>
    <span>整改中</span>
    <span>已检查</span>
    <span>已移交</span>
</li>
{{#each data}}
<li>
  <span class="day">{{name}}</span>
  <span>{{value1}}</span>
  <span><b>{{value2}}</b></span>
  <span>{{value3}}</span>
  <span>{{value4}}</span>
</li>
{{/each}}
