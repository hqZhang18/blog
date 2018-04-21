<div class="model-bg">
    <div class="model-container">
        <i class="close"></i>
        <div class="model-body">
        <div class="edit-row">
            <span class="font-name ml-30">词名：</span><input class="hot-input" />
        </div>
        <div class="edit-row">
            <span class="font-name ml-30">来源：</span>
            <div class="inline-source first-source">
                <span class="source-span firstSource" lymc={{lymc}}>{{first}}</span>
                <i class="select-icon"></i>
                <ul class="list sourceList1">
                    {{#each firstData}}
                        <li lymc={{lymc}}>{{ssb}}</li>
                    {{/each}}
                </ul>
            </div>
            <div class="inline-source ml-30 second-source">
                <span class="source-span secondSource" ssbId={{ssbId}}>{{second}}</span>
                <i class="select-icon" ></i>
                <ul class="list sourceList2">
                 {{#each secondData}}
                    <li ssbId={{id}}>{{ssb_child}}</li>
                 {{/each}}
                </ul>
            </div>
           <!--  <div class="inline-source1 ml-30">
                <span class="source-span">无</span>
                <i class="select-icon"></i>
            </div> -->
        </div>
        <div class="edit-row">
            <span class="font-name ml-30 ">权重：</span>
            <input class="source-span weight2"  />
        </div>
       <!--  <div class="edit-row">
            <span class="font-name">添加日期：</span>
            <span class="date-span">2017年10月12日</span>
            <i class="select-date-icon"></i>
            </div> -->
        </div>
        <div class="model-footer">
        <div class="btn btn-save">保存</div>
        <div class="btn btn-cancel">取消</div>
        </div>
    </div>
</div>