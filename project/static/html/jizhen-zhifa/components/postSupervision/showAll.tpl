<div class="model-bg enforceLaw-bg">
  <div class="model-container">
    <div class="model-body">
      <div class="title">{{title}}</div>
      <ul class="all-enforceLaw">
        <li class="second-title">标题<a>操作</a></li>
        {{#each data}}
          <li>{{name}} <a href="http://{{url}}" target="_blank">预览</a></li>
        {{/each}}
      </ul>
    </div>
        
    <div class="close-model"></div>
  </div>
</div>