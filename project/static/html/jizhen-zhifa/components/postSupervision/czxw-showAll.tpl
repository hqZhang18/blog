<div class="model-bg czxw-bg">
  <div class="model-container">
    <div class="model-body">
      <div class="title">{{title}} <span>{{total}}</span></div>
      <ul class="czxw-ul">
        <li class="second-title">名称<span>扣分数</span></li>
        {{#each left}}
          <li>{{name}} <span>{{value}}</span></li>
        {{/each}}
      </ul>

      <ul class="czxw-ul">
        <li class="second-title">名称<span>扣分数</span></li>
        {{#each right}}
          <li>{{name}} <span>{{value}}</span></li>
        {{/each}}
      </ul>
    </div>
        
    <div class="close-model"></div>
  </div>
</div>