{{!--
      过程监督页面中间部分
  渲染页面初始加载后的默认页面
--}}

<div class="module-wrap" template='1'>
  <div class="chart-top">
      <h2 class="center-til"></h2>
      <p class="step" id="modelName"></p>
      <div class="statistics" id="statistics">
         <div class="no-data"></div> 
      </div>
  </div>
  <div class="chart-foot">
      <div class="foot-left">
          <p class="step">案件触及模型数量TOP10</p>
          
          <div class="case-top" id="caseTop">
              <div class="no-data">暂无数据</div>
          </div>
      </div>
      <div class="foot-right">
          <p class="step">部门触及模型数量TOP10</p>
          <div class="department-top" id="departmentTop">
              <div class="no-data">暂无数据</div>
          </div>
      </div>
  </div>
</div>