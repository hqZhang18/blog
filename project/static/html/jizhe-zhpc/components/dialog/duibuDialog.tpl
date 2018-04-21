<div class="model-bg" id="duibuDialog">
  <div class="model-container">
    <div class="model-body">
      <div class="duibu-title">{{title}} <span>{{total}}</span></div>
      <ul class="ranking-lists">
      {{#each data}}
         <li><span class="name" id="rankingName">{{name}}</span>
            <p class="value-box">
              <span class="value-bg"></span>
              <span class="value-data" style="width: {{dataW}}px"></span>
            </p>
            <p class="number">{{value}}</p>
          </li>
         {{/each}}
      </ul>
      <div class="no-data">暂无数据</div>
    </div>
    <div class="close-model"></div>
  </div>
</div>