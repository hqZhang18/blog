<div class="model-bg allZhidui-bg enforceLaw-bg">
  <div class="model-container">
    <div class="model-body">
      <div class="title">{{title}}</div>
      <ul class="all-enforceLaw all-zhidui">
        <li class="second-title">
          <span>部门</span>
          <span>总数量</span> 
          <span>退回率</span>
          <span>终止率</span>
        </li>
        {{#each data}}
          <li>
            <span>{{name}}</span>
            <span>{{value}}</span> 
            <span>{{endRate}}</span>
            <span>{{returnRote}}</span>
          </li>
        {{/each}}
      </ul>
    </div>
        
    <div class="close-model"></div>
  </div>
</div>