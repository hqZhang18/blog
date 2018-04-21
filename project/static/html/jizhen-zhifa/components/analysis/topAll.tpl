<div class="model-bg allTop-bg enforceLaw-bg">
  <div class="model-container">
    <div class="model-body">
      <div class="title two-type">{{title}} 
       
        <span >部门</span>
         <span class="cur">案件</span>
        
      </div>
      <ul class="all-enforceLaw all-case all-cases">
        <li class="second-title">
          <span>序号</span>
          <span>案件名</span>
          <span>数量</span></li>
        {{#each case}}
            <li><span>{{addOne @index}}</span> <span>{{name}}</span> <span>{{value}}</span></li>
        {{/each}}
      </ul>

      <ul class="all-enforceLaw all-department all-cases">
        <li class="second-title">
          <span>序号</span>
          <span>案件名</span>
          <span>数量</span></li>
        {{#each department}}
            <li><span>{{addOne @index}}</span> <span>{{name}}</span> <span>{{value}}</span></li>
        {{/each}}
      </ul>
    </div>
        
    <div class="close-model"></div>
  </div>
</div>