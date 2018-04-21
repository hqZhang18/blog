
{{#compare currentType 0}}
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
    {{else}}
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
{{/compare}}

