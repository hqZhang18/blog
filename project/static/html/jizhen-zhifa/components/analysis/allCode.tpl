<div class="model-bg allCode-bg enforceLaw-bg">
  <div class="model-container">
    <div class="model-body">
      <div class="title">{{title}}</div>
      <ul class="all-enforceLaw">
        <li class="second-title">标识码<a>入库时间</a></li>
        {{#each data}}
          <li>{{code}} <span>{{date}} {{time}}</span></li>
        {{/each}}
      </ul>
    </div>
        
    <div class="close-model"></div>
  </div>
</div>