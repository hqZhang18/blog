<div class="model-bg jlfb" id="showAll">
  <div class="model-container">
    <div class="model-body">
      <div class="model-title">{{title}}</div>
      <div class="release-state">
        <p>未签收<span>{{signNum}}</span></p>
        <p>未按时签收<span>{{zwSignNum}}</span></p>
      </div>
      <div class="release-lists">
          {{#each data}}
            <li class="{{class}}" details={{details}}><i class="icon">{{addOne @index}}</i>
              <span >{{title}}</span>
             {{#compare state 0}}
                <a href="http://12.4.0.126/wccp/wccp/serviceoffice.do?method=receivePlccommand" target="_blank">签收</a>
              {{/compare}}
              <div class="all-details{{addOne @index}}"></div>
            </li>
          {{/each}}
      </div>
    </div>
    <div class="close-model"></div>
  </div>
</div>