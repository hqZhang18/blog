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