{{!--<li>
    <span>模型总数</span>
    <span>
        <em style="width: 100%"></em>
    </span>
    <span></span>
</li>
<li>
    <span>告警总数</span>
    <span>
        <em style="width: 50%"></em>
    </span>
    <span></span>
</li>--}}

{{#each this}}
<li>
    <span>{{name}}</span>
    <span>
        <em style="width: {{barWidth}}%"></em>
    </span>
    <span>{{total}}</span>
</li>
{{/each}}