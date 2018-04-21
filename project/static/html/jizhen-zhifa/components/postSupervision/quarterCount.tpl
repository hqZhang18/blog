<div class="fl sup-num">
  <p class="sup-num-name">
    <span>监督总量</span>
  </p>
  <p class="sup-num-val">
    <span>{{total}}</span>
  </p>
</div>
<ul class="fl time-month">
  <li class="tab-title">
      <span>时间</span>
      <span>部门</span>
      <span>阵地</span>
  </li>
  {{#each data}}
  <li>
    <span class="day">{{name}}</span>
    <span>{{depCount}}</span>
    <span>{{zhendiCount}}</span>
  </li>
  {{/each}}
</ul>