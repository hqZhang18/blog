{{!--
过程监督页面中间部分
渲染相应执法分析模型名称的详情
--}}
<div class="detail-wrap" template='0'>
    <div class="skill">
        <ul class="total-list">
            <li>
                <span>通用类</span>
                <span></span>
            </li>
            <li>
                <span>手段类</span>
                <span></span>
            </li>
            <li>
                <span>提请量</span>
                <span></span>
            </li>
        </ul>
        <p class="step">各手段提请量统计</p>
        <div class="skill-detail">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="100%" height="100%" style="position: absolute;top: 14px;left: 19px">
                <defs>
                    <linearGradient id="PSgrad_0" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="0%" stop-color="rgb(68,14,123)" stop-opacity="1" />
                        <stop offset="100%" stop-color="rgb(14,40,100)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad_1" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="0%" stop-color="rgb(20,23,101)" stop-opacity="1" />
                        <stop offset="100%" stop-color="rgb(8,68,112)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad_2" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="0%" stop-color="rgb(54,15,137)" stop-opacity="1" />
                        <stop offset="100%" stop-color="rgb(10,23,136)" stop-opacity="1" />
                    </linearGradient>
                    <filter id="Filter_0">
                        <feOffset in="SourceAlpha" dx="0" dy="0" />
                        <feGaussianBlur result="blurOut" stdDeviation="4" />
                        <feFlood flood-color="rgb(2, 14, 86)" result="floodOut" />
                        <feComposite operator="out" in="floodOut" in2="blurOut" result="compOut" />
                        <feComposite operator="in" in="compOut" in2="SourceAlpha" />
                        <feComponentTransfer><feFuncA type="linear" slope="1"/></feComponentTransfer>
                        <feBlend mode="normal" in2="SourceGraphic" />
                    </filter>
                    <linearGradient id="PSgrad_3" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="0%" stop-color="rgb(54,82,252)" stop-opacity="0" />
                        <stop offset="23%" stop-color="rgb(54,82,252)" stop-opacity="0.23" />
                        <stop offset="53%" stop-color="rgb(91,20,236)" stop-opacity="0.53" />
                        <stop offset="100%" stop-color="rgb(161,78,255)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad_4" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="0%" stop-color="rgb(10,74,111)" stop-opacity="1" />
                        <stop offset="100%" stop-color="rgb(26,24,102)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad_5" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="0%" stop-color="rgb(11,23,136)" stop-opacity="1" />
                        <stop offset="100%" stop-color="rgb(52,15,137)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad_6" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="0%" stop-color="rgb(7,21,119)" stop-opacity="1" />
                        <stop offset="100%" stop-color="rgb(9,94,122)" stop-opacity="1" />
                    </linearGradient>

                    <linearGradient id="PSgrad0" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="100%" stop-color="rgb(68,14,123)" stop-opacity="1" />
                        <stop offset="0%" stop-color="rgb(14,40,100)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad1" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="100%" stop-color="rgb(20,23,101)" stop-opacity="1" />
                        <stop offset="0%" stop-color="rgb(8,68,112)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad2" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="100%" stop-color="rgb(54,15,137)" stop-opacity="1" />
                        <stop offset="0%" stop-color="rgb(10,23,136)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad3" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="100%" stop-color="rgb(54,82,252)" stop-opacity="1" />
                        <stop offset="0%" stop-color="rgb(161,78,255)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad4" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="100%" stop-color="rgb(10,74,111)" stop-opacity="1" />
                        <stop offset="0%" stop-color="rgb(26,24,102)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad5" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="100%" stop-color="rgb(11,23,136)" stop-opacity="1" />
                        <stop offset="0%" stop-color="rgb(52,15,137)" stop-opacity="1" />
                    </linearGradient>
                    <linearGradient id="PSgrad6" x1="0%" x2="0%" y1="100%" y2="0%">
                        <stop offset="100%" stop-color="rgb(7,21,119)" stop-opacity="1" />
                        <stop offset="0%" stop-color="rgb(9,94,122)" stop-opacity="1" />
                    </linearGradient>
                </defs>
                <path id="path1" fill-rule="evenodd" stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0.702" fill="url(#PSgrad_4)"
                    d="M214.428,6.246 L285.564,6.246 L321.132,68.000 L285.564,129.754 L214.428,129.754 L178.860,68.000 L214.428,6.246 Z"/>

                <path class="path2" fill-rule="evenodd" stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0.702" fill="url(#PSgrad_1)"
                    d="M573.165,7.304 L647.821,7.304 L685.148,71.499 L647.821,135.694 L573.165,135.694 L535.838,71.499 L573.165,7.304 Z"/>

                <path class="path3" fill-rule="evenodd" stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0.702" fill="url(#PSgrad_0)"
                    d="M364.980,28.955 L489.040,28.955 L551.070,134.982 L489.040,241.008 L364.980,241.008 L302.950,134.982 L364.980,28.955 Z"/>

                <path class="path4" fill-rule="evenodd" stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0.702" fill="url(#PSgrad_6)"
                    d="M79.731,77.456 L153.254,77.456 L190.015,141.010 L153.254,204.565 L79.731,204.565 L42.969,141.010 L79.731,77.456 Z"/>

                <path class="path5" fill-rule="evenodd" stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0.702" fill="url(#PSgrad_2)"
                    d="M205.885,153.444 L293.124,153.444 L336.744,228.504 L293.124,303.564 L205.885,303.564 L162.265,228.504 L205.885,153.444 Z"/>

                <path class="path6" fill-rule="evenodd" stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" fill="url(#PSgrad_3)"
                    d="M562.993,154.986 L661.003,154.986 L710.008,239.999 L661.003,325.011 L562.993,325.011 L513.988,239.999 L562.993,154.986 Z"/>
                
                <path class="path7" fill-rule="evenodd" stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0.702" fill="url(#PSgrad_5)"
                    d="M139.887,382.800 L51.114,382.800 L6.728,306.500 L51.114,230.200 L139.887,230.200 L184.274,306.500 L139.887,382.800 Z"/>

               <!--  <path style="transform: translate(330px,250px);" class="path8" fill-rule="evenodd"  stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" fill-opacity="0.702" fill="url(#PSgrad_0)"
                    d="M139.887,158.800 L51.114,158.800 L6.728,82.500 L51.114,6.200 L139.887,6.200 L184.274,82.500 L139.887,158.800 Z"/> -->

                <!--path动画-->
                <path id="movePath1" stroke-width="4px" stroke-linecap="round" stroke-linejoin="miter" fill="none" stroke="url(#PSgrad4)" 
                    d="M214.428,6.246 L285.564,6.246 L321.132,68.000 L285.564,129.754 L214.428,129.754 L178.860,68.000 L214.428,6.246 Z" />

                <path id="movePath2" stroke-width="4px" stroke-linecap="round" stroke-linejoin="miter" fill="none" stroke="url(#PSgrad1)"
                    d="M573.165,7.304 L647.821,7.304 L685.148,71.499 L647.821,135.694 L573.165,135.694 L535.838,71.499 L573.165,7.304 Z">
                </path>
                <path id="movePath3" stroke-width="4px" stroke-linecap="round" stroke-linejoin="miter" fill="none" stroke="url(#PSgrad0)"
                    d="M364.980,28.955 L489.040,28.955 L551.070,134.982 L489.040,241.008 L364.980,241.008 L302.950,134.982 L364.980,28.955 Z">
                </path>
                <path id="movePath4" stroke-width="4px" stroke-linecap="round" stroke-linejoin="miter" fill="none" stroke="url(#PSgrad6)"
                    d="M79.731,77.456 L153.254,77.456 L190.015,141.010 L153.254,204.565 L79.731,204.565 L42.969,141.010 L79.731,77.456 Z">
                </path>
                <path id="movePath5" stroke-width="4px" stroke-linecap="round" stroke-linejoin="miter" fill="none" stroke="url(#PSgrad2)"
                    d="M205.885,153.444 L293.124,153.444 L336.744,228.504 L293.124,303.564 L205.885,303.564 L162.265,228.504 L205.885,153.444 Z">
                </path>
                <path id="movePath6" stroke-width="4px" stroke-linecap="round" stroke-linejoin="miter" fill="none" stroke="url(#PSgrad3)"
                    d="M562.993,154.986 L661.003,154.986 L710.008,239.999 L661.003,325.011 L562.993,325.011 L513.988,239.999 L562.993,154.986 Z">
                </path>
                <path id="movePath7" stroke-width="4px" stroke-linecap="round" stroke-linejoin="miter" fill="none" stroke="url(#PSgrad5)"
                    d="M139.887,382.800 L51.114,382.800 L6.728,306.500 L51.114,230.200 L139.887,230.200 L184.274,306.500 L139.887,382.800 Z">
                </path>
               <!--  <path id="movePath8" style="transform: translate(330px,24px);" stroke-width="4px" stroke-linecap="round" stroke-linejoin="miter" fill="none" stroke="url(#PSgrad5)"
                    d="M139.887,382.800 L51.114,382.800 L6.728,306.500 L51.114,230.200 L139.887,230.200 L184.274,306.500 L139.887,382.800 Z">
                </path> -->

            </svg>
        <ul>
            
        </ul>
        <div class="animateWrap">
            
        </div>
    </div>
</div>
<div class="business">
    <p class="step">业务维度统计</p>

    <div class="business-circle circle-chart-inbg"></div>
    <div class="business-circle circle-chart-outbg"></div>
    <div id="circleChart" class="circle-chart">
        
    </div>
</div>
<div class="operation">
    <p class="step">操作行为统计</p>
    <div class="czxwCount" id="czxwCount">
        
    </div>
</div>
</div>