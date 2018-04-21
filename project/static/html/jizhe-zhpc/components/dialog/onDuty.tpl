<div class="model-bg" id="onDutyDialog">
      <div class="model-container">
        <div class="model-body">
          <div class="onDuty-header">
           <div class="no-data">本月暂无数据</div>
        <div class="victory-select-time">
            <ul class="default-time">
                <li class="start-time" id="start-time3">
                  <p><span class="ye" id="select-syear">2016</span>年</p>
                  <p><span class="mo" id="select-smonth">03</span>月</p>
                </li>
            </ul>
              <!-- 选择开始年下拉框 -->
              <div class="choose-box start-year">
                  <ul class="boxs" id="1"></ul>
              </div>

              <!-- 选择开始月下拉框 -->
              <div class="choose-box start-month">
                  <ul class="boxs" id="2"></ul>
              </div>
              <div class="sure-btn" id="zhiban-sure">确定</div>
        </div>
        <div class="title">每日值班</div>
        <div class="export"></div>
      </div>

    <div class="onDuty-content">
    <table width="4000"  border="0" align="center" cellpadding="0" cellspacing="0" id="tb" style="width:4000px;">
        
    <tr style="height:33px;" class="cdata" id="titletr">

      {{#each zhidui}}
        <td>{{name}}</td>
      {{/each}}

    </tr>

    {{#each data}}
    <tr type="data" class="cdata" >
        <td  width="160" align="left">
          <div class="item-left" >
            <div class="time">{{time}}</div>
            <i class="icon"></i>
            
              {{#compare isNull 1}}
                <div class="slide-btn slide-hide" isNull={{isNull}}>展开</div>
              {{/compare}}
        
             
          </div>
        </td>
    {{#each team}}
    <td >
    <ul class="item-right-list">
          <li>
            <!-- 渲染正班 -->
          {{#compare iszfb 1}}
            <span>正班</span>
            {{#compare zb ''}}
              <p class='zanwu'>暂无</p>
            {{/compare}}
          {{/compare}}
           <p>{{zb}}</p>
            
          </li>
          <!-- 渲染副班 -->
          <li>
            {{#compare iszfb 1}}
                <span>副班</span>
                 {{#compare zb ''}}
                  <p class='zanwu'>暂无</p>
                {{/compare}}
            {{/compare}}
            <p>{{fb}}</p>
          </li>
          <!-- 渲染其他 -->
          <li>
            {{#compare iszfb 1}}
              <span>其它</span>
              {{#compare other ''}}
                <p class='zanwu'>暂无</p>
              {{/compare}}
              <p>{{other}}</p>
            {{/compare}}
               <!-- 渲染没有正副班的数据 -->
            {{#compare iszfb 0}}
              {{#compare other ''}}
                <p class='zanwu'>暂无</p>
              {{/compare}}
              {{#each other}}
                <p>{{this}}</p>
              {{/each}}
            {{/compare}}

          </li>
        </ul>
      </td>
      {{/each}}

    </tr>

    {{/each}}
  </table>
   </div> 
  </div>
</div>
<div class="close"></div>
</div>





     