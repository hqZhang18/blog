<div class="nature-box">
    <div class="caseNatureName">今日在监人数</div>
    <div class="caseNatureValue">
        <span>{{offendersNumber.supervisorsNumber}}</span>
        <span>人</span>
    </div>
</div>
<div class="nature-box">
    <div class="caseNatureName">今日收监人数</div>
    <div class="caseNatureValue">
        <span>{{offendersNumber.imprisonedNumber}}</span>
        <span>人</span>
    </div>
</div>
<div class="nature-box">
    <div class="caseNatureName">今日释放人数</div>
    <div class="caseNatureValue">
        <span>{{offendersNumber.releaseNumber}}</span>
        <span>人</span>
    </div>
</div>
<p class="sex">在押人员性别比例</p>
<div class="nature-box">
    <div class="caseNatureName">女性占比 {{sex.perFemale}}%</div>
    <div class="pro female"><span style="width: {{sex.perFemaleValue}}px"></span></div>
    <div class="caseNatureValue pro-filter"></div>
</div>
<div class="nature-box">
    <div class="caseNatureName">男性占比 {{sex.perMale}}%</div>
    <div class="pro male"><span style="width: {{sex.perMaleValue}}px"></span></div>
    <div class="caseNatureValue pro-filter"></div>
</div>
