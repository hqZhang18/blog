<div class="model-bg" id="showAll">
  <div class="model-container">
    <div class="model-body">
      <div class="model-title">{{title}}</div>
      <ul class="ranking-lists" id="caseRanking">
      {{#each data}}
         <li><i class="icon icon{{@index}}">{{addOne @index}}</i><span class="name" id="rankingName">{{name}}</span>
            <p class="value-box">
              <span class="value-bg"></span>
              <span class="value-data" style="width: {{dataW}}px"></span>
            </p>
            <p class="number">{{value}}</p>
          </li>
         {{/each}}
         <li class="pageNext"></li>

      </ul>
      <div class="no-data">暂无数据</div>
    </div>
    <div class="close-model "></div>
  </div>
</div>