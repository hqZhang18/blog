<div class="model-bg history-list" id="historyList">
  <div class="model-container">
    <div class="model-body">
      <div class="list-content">
        <div class="header">
          
          <!-- 选择时间 -->
          <div class="victory-select-time">
              <ul class="default-time">
                <li class="start-time" id="start-time">
                  <p><span class="ye" id="select-syear">2016</span>年</p>
                  <p><span class="mo" id="select-smonth">03</span>月</p>
                  <p><span class="day" id="select-sday">01</span>日</p>
                -</li>
                <li class="end-time" id="end-time">
                  <p><span class="ye" id="select-eyear">2016</span>年</p>
                  <p><span class="mo" id="select-emonth">03</span>月</p>
                  <p><span class="mo" id="select-eday">03</span>日</p>
                </li>
              </ul>

              <!-- 选择开始年下拉框 -->
              <div class="choose-box start-year">
                  <ul class="boxs" id="1"></ul>
              </div>


              <!-- 选择开始月下拉框 -->
              <div class="choose-box start-month" id="victoryMonth">
                  <ul class="boxs" id="2"></ul>
              </div>

              <!-- 选择开始日下拉框 -->
              <div class="choose-box start-day">
                  <ul class="boxs" id="3"></ul>
              </div>

            <!-- 选择结束年下拉框 -->
              <div class="choose-box end-year">
                  <ul class="boxs" id="4"></ul>
              </div>


              <!-- 选择结束月下拉框 -->
              <div class="choose-box end-month">
                  <ul class="boxs" id="5"></ul>
              </div>

              <!-- 选择结束日下拉框 -->
              <div class="choose-box end-day">
                  <ul class="boxs" id="6"></ul>
              </div>
    
              <div class="sure-btn" id="history-sure">确定</div>
          </div>
          <!-- 选择时间 end -->
          <div class="btn-group">
            <div class="btn btn-list"></div>
            <div class="btn btn-detail"></div>
          </div>
        </div>
        {{!--<div class="sub-list-container"></div>--}}
        <div class="no-data">暂无数据</div>
        <div class="sub-content detail"></div>
        <div class="sub-content list"></div>
        {{!--<div class="sub-content detail">
          {{#each list}}
            <div class="item">
              <div class="time">
                <span>{{date}}</span>
                <span>{{time}}</span>
              </div>
              <div class="zhidui-name">{{name}}</div>
              <div class="detail-content">
                <table>
                  <tr>
                    <td>侦破案件（起）</td>
                    <td>抓获人数（人）</td>
                    <td>涉案金额（元）</td>
                  </tr>
                  <tr>
                    <td>{{case}}</td>
                    <td>{{person}}</td>
                    <td>{{money}}</td>
                  </tr>
                  <tr>
                    <td>缴获毒品（公斤）</td>
                    <td>缴获枪支（支）</td>
                    <td>缴获子弹（颗）</td>
                  </tr>
                  <tr>
                    <td>{{drug}}</td>
                    <td>{{gun}}</td>
                    <td>{{bullet}}</td>
                  </tr>
                </table>
              </div>
            </div>
          {{/each}}
        </div>
        <div class="sub-content list ">
          {{#each detail}}
            <div class="item">
              <div class="time">
                <span>{{date}}</span>
                <span>{{time}}</span>
              </div>
              <div class="zhidui-name">{{name}}</div>
              <div class="detail-content">
                {{content}}
              </div>
            </div>
          {{/each}}
        </div>--}}
      </div>
    </div>
    <div class="close-model top130"></div>
  </div>
</div>