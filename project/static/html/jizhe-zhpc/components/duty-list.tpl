<a class="title" href="http://12.4.0.126/wccp/wccp/dutyAppointment.do?method=index" target="_blank"></a>
<div class="all"></div>
<div class="details">
 
  <p class="leader">总队领导正班
    <span>
     {{#compare data.zdldzb ''}}
        无
      {{/compare}}
      {{data.zdldzb}}
      
    </span>
  </p>

  <p class="leader">总队领导副班
    <span>
    {{#compare data.zdldfb ''}}
        无
      {{/compare}}
      {{data.zdldfb}}
    </span>
  </p>

  <p class="leader">值班长
    <span>
    {{#compare data.zbz ''}}
        无
      {{/compare}}
      {{data.zbz}}
    </span>
  </p>

  <p class="leader">值班员
    <span>
    {{#compare data.zdzb ''}}
        无
      {{/compare}}
      {{data.zdzb}}
    </span>
  </p>

  <p class="leader">指挥中心
    <span>
      {{#compare data.bgs ''}}
        无
      {{/compare}}
      {{data.bgs}}
      
    </span>
  </p>

  <p class="leader">车班
    <span>
    {{#compare data.zdcb ''}}
        无
      {{/compare}}
      {{data.zdcb}}
    </span>
  </p>

  <div class="leader2">
    <p>应急支队正班</p>
    {{#each data.yjzdzb}}
    <span>
      {{this}}
    </span>
    {{/each}}
  </div>
  
</div>