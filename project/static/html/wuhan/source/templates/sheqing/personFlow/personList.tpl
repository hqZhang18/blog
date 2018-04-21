<table>
  <tbody>
  {{#each data}}
  <tr>
    <td>NO.{{addOne @index}}</td>
    <td>{{name}}</td>
    <td><span style="width:{{barWidth}}%"></span></td>
    <td>{{value}}<span>人</span></td>
  </tr>
  {{/each}}
  </tbody>
</table>