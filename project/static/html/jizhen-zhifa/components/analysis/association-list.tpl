{{!--
<div class="association-big"><span>三·二六案件</span></div>
    <ul class="association-small">
        <li><span>查询</span></li>
        <li><span>定位</span></li>
        <li><span>审批</span></li>
        <li><span>听音</span></li>
        <li><span>分析</span></li>
        <li><span>其他</span></li>
    </ul>
--}}

{{#each this}}
<div class="association-big" data-id={{id}} title={{name}}><span>{{name}}</span></div>
    <ul class="association-small">
        {{#with value}}
          {{#each this}}
            <li title={{msg}}><span>{{msg}}</span></li>
          {{/each}}
        {{/with}}
    </ul>
{{/each}}