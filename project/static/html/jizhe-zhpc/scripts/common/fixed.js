var Create = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}
var Fixed = Create.create();

Fixed.prototype = {
	initialize:function(Options){
		this.table = getObj(Options.table);
		//加载前，不显示

	  this.table.style.visibility = "hidden";
		this.width = Options.width;
		this.height = Options.height;
		this.borderWidth = Options.borderWidth?Options.borderWidth:2;
		this.lineHeight = Options.lineHeight?Options.lineHeight:0;
		this.rows = Options.rows?Options.rows:0;
		this.cells = Options.cells?Options.cells:0;

		this.createExtDiv();
		this.fixScollSize();
		this.createCells();
		this.createRows();
		this.deleteExcCels();

		//加载完成，显示
		this.table.style.visibility = "visible";
		//清除空白节点
		this.cleanWhitespace(this.fixedTitleDiv);
	},
	createExtDiv:function(){
		this.fixedDiv = $DC("div");this.fixedTitleDiv = $DC("div");this.fixedCTContent = $DC("div");this.fixedColumnDiv = $DC("div");this.fixedTableDiv = $DC("div");
		with(this){
			fixedDiv.className = "fixedDiv";
			fixedTitleDiv.className = "fixedTitleDiv";
			fixedCTContent.className = "fixedCTContent";
			fixedColumnDiv.className = "fixedColumnDiv";
			fixedTableDiv.className = "fixedTableDiv";
			
			fixedDiv.appendChild(fixedTitleDiv);
			fixedDiv.appendChild(fixedCTContent);
			fixedCTContent.appendChild(fixedColumnDiv);
			fixedCTContent.appendChild(fixedTableDiv);

			table.parentNode.appendChild(fixedDiv);
			fixedTableDiv.appendChild(table);
			fixedTableDiv.onscroll = function(){
				 fixedTitleDiv.style.left=-this.scrollLeft+300+"px";
				for(var i = 0;i<rows;i++){
					for(var j = 0;j<cells;j++){
						 fixedTitleDiv.childNodes[i].childNodes[j].style.left = this.scrollLeft+300+"px";
					}
				}
				fixedColumnDiv.style.top=-this.scrollTop+"px";
			}
		}
	},
	fixScollSize:function(){with(this){
		table.setAttribute("border","0");
		fixedDiv.style.width=width+"px";
		fixedDiv.style.height=height+"px";
		fixedTableDiv.style.width=(width-getFixedCellsWidth() - borderWidth)-30+"px";
		fixedTableDiv.style.height=(height-getFixedRowsHeight() - borderWidth)-50+"px";
		
	}},
	createRows:function(){ with(this){
		//左边顶部导航
		fixedTitleDiv.style.width=(table.offsetWidth+12000)+"px";
		var newtit="";
		for(var i = 0;i<rows;i++){
			var titletr = table.rows[i];
			newtit += '<div style="width:'+(table.offsetWidth+12000)+'px">';
			for(var j=0;j<titletr.cells.length;j++){ 
				ttd=titletr.cells[j];
				newtit += "<div class='fixedTitle right-title'>"+ttd.innerHTML+"</div>\n"  
			}
			newtit += "</div>";
		}
		fixedTitleDiv.innerHTML=newtit;
		if(rows==0)fixedTitleDiv.style.display = "none";
	}},
	createCells:function(){ with(this){
		fixedTableDiv.style.marginLeft = fixedColumnDiv.style.width=300+"px";
		fixedColumnDiv.style.height=table.offsetHeight+"px";
		var newtit="";
		var ttd;
		
		for(var i=rows;i<table.rows.length;i++){ 
			newtit += "<div style='clear:both;'>";
			for(var j = 0;j<1;j++){
				ttd=table.rows[i].cells[j];
				newtit += "<div class='fixedTitle left-time' style='float:left;width:"+(ttd.offsetWidth-borderWidth)+"px;"+(lineHeight?"line-height:"+lineHeight+"px;":"")+"'>"+ttd.innerHTML+"</div>";
			}
			newtit += "</div>";
		}
		fixedColumnDiv.innerHTML=newtit;
	}},

	deleteExcCels:function(){with(this){
		for(var i = 0;i<rows&&table.rows.length;i++){
			var ttr = table.rows[i];
			ttr.parentNode.removeChild(ttr);
		}
		table.style.width = table.offsetWidth-getFixedCellsWidth()+"px";
		for(var i=0;i<table.rows.length;i++){ 
			for(var j = cells-1;j>=0;j--){
				var ttd=table.rows[i].cells[j];
				ttd.parentNode.removeChild(ttd);  
			}
		}
	}},
	getFixedRowsHeight:function(){with(this){
		var height = 0;
		for(var i = 0;i<rows&&table.rows.length;i++){
			height += table.rows[i].offsetHeight;
		}
		return height;
	}},
	getFixedCellsWidth:function(){with(this){
		var width = 0;
		for(var i = 0;i<cells;i++){

			width += table.rows[cells].cells[i].offsetWidth;
		}
		return width;
	}},
	cleanWhitespace:function(parentNode){
		for (var i = 0; i < parentNode.childNodes.length; i++) {
			var node = parentNode.childNodes[i];
			//判断是否是空白文本结点，如果是，则删除该结点
			if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) 
			node.parentNode.removeChild(node);
			//继续清子节点
			if(node.childNodes.length>0)this.cleanWhitespace(node);
		}
	}
}