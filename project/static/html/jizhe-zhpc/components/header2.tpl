
<div class="nav">
  <a class="cur"><i></i>大数据业务系统</a>
  <a><i></i>系统工具</a>
  <a class="addressBook"  target="_blank"></a>
  <div class="log-out">退出</div>
</div>
<div class="current-time"><span></span></div>
<div class="sub-nav ywxt-nav">
  {{#each operSystem}}
    <a href="{{url}}" target="_blank">{{name}}</a>
  {{/each}}
</div>

<div class="sub-nav xtgj-nav">
    {{#each systemTools}}
    <a href="{{url}}" target="_blank">{{name}}</a>
  {{/each}}
</div>

<!-- 更多应用 -->
<div class="all-application">
   <div class="more-nav">
      {{#each moreApp}}
        <a href="{{url}}" target="_blank">{{name}}</a>
      {{/each}}
   </div>
   <!-- 分页 -->
   <div class="pageing"></div>
</div>
