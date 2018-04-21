
 <table width="100%" border="0">
        <thead>
          <tr >
          <th class="w5 selectAll" ><i></i><!-- 全选 --></th>
          <th class="w8 ">序号</th>
          <th class="w15">词名</th>
          <th class="w15 frequency">次数</th>
          <th class="w8 weightOrder">权重</th>
          <th class="w18">来源</th>
          <th class="w8">状态</th>
          <th class="w21">操作时间</th>
        </tr>
        </thead>
        <tbody class="list">
        {{#each data}}
          <tr class="select" flag={{flag}}>
            <td class="w5"><input type="checkbox" name="checkbox" class="checkbox" flag={{flag}}></td>
            <td class="w8 cf id">{{addOne @index}}</td>
            <td class="w15 cf name">{{name}}</td>
            <td class="w15">{{fps}}</td>
            <td class="w8"><input type="text" class="weight" value={{weight}}%></td>
            <td class="w18 ssbflag" ssbFlag={{ssbFlag}}>{{ssb}}</td>
            <td class="w8 state" state={{stateFlag}}>{{state}}</td>
            <td class="w21">{{time}}</td>
          </tr>
           {{/each}}
        </tbody>
      </table>
       <div class="nullData">暂无数据</div>
      <div class="pageing" ></div>