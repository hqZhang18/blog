<div class="model-bg">
    <div class="update-model">
        <i class="close"></i>
        <div class="model-body">

        <div class="conter">
           <div class="edit-row updataS">
            <span class="font-name ml-30">更新来源：</span>
            <div class="inline-source">
                <span class="source-span updateSource" lymc={{lymc}}></span>
                <i class="select-icon"></i>
                <ul class="list all-source">
                    {{#each data}}
                        <li lymc={{lymc}}>{{ssb}}</li>
                    {{/each}}
                </ul>
            </div>
         </div>

        <div class="model-footer">
        <div class="btn btn-sure" id="sure1">确定</div>
        <div class="btn btn-cancel">取消</div>
        </div>
    </div>
</div>