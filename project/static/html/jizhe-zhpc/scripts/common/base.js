
window.onerror = function(){
	//return true;
}
// function $(obj,extend){
// 	if(typeof(obj)=="string"){
// 		obj = document.getElementById(obj);
// 	}
// 	return obj;
// }
function $EX(obj,extend){
	obj = $(obj);
	if(!obj.HTMLNode){
		SCRIPTLoader.Load(SCRIPTLoader.DEFAULT_PACKAGE+".dom.HTMLNode");
		Object.extend(obj,HTMLNode);
	}
	return obj;
}
function $DC(str){
	return document.createElement(str);
}
function w(str){return document.write(str);}

function isChild(parentNode){
	var e = event.srcElement;
	var parent = e.parentNode;
	while(parent){
		if(parent == parentNode){
			return true;
			break;
		}
		parent = parent.parentNode;
	}
	return false;
}

function fixTitle(str,len,ext){
	return strlen(str)>len?str.substring(0,strlen(str,len)/2-2)+ext:str;
}

function setStyle(o,style){
	for(property in style){
		o.style[property] = style[property];
	}
}
function getObj(o){
	if(typeof(o) == "undefined"){
		return null;
	}
	o = typeof(o) == "string"?document.getElementById(o):o;
	return o;
}
/**
@ o
将传入的参数转成整型
*/
function getInt(o){
	o = typeof(o)=="string"?parseInt(o):o;
	return o;
}
/**
类的创建，new时会自动执行initialize方法
*/
var $C = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}
/**
@ destination 要继承方法
@ source 来源
静态继承
*/
Object.extend = function(destination, source) {
  for (property in source) {
    destination[property] = source[property];
  }
  return destination;
}

var $A = function(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) {
    return iterable.toArray();
  } else {
    var results = [];
    for (var i = 0; i < iterable.length; i++)
      results.push(iterable[i]);
    return results;
  }
}
Function.prototype.bind = function() {
	var __method = this, args = $A(arguments), object = args.shift();
	return function() {
		return __method.apply(object, args.concat($A(arguments)));
	}
}

var loadComplete=function(element,func){
	if(element.addEventListener){
		element.addEventListener("load",func,true);
	}else{
		element.attachEvent("onload",func,true);
	}
	
}

function addEvent(element,Event,func,cauture){
	if(element.addEventListener){
		element.addEventListener(Event,func,cauture);
	}else{
		element.attachEvent("on"+Event,func,cauture);
	}
}

function getFormPars(form){
	var elements = form.elements;
	var pars = "";
	for(var i = 0; i<elements.length;i++){
		if(elements[i].type == "radio"&&!elements[i].checked){
			continue;
		}
		pars += elements[i].name+"="+escape(elements[i].value);
		if(i!=elements.length-1){
			pars += "&";
		}
	}
	if(pars.endsWith("&")){
		pars = pars.substring(0,pars.length-1);
	}
	return pars;
}

function returnFunc(callback){
	try{
		callback = callback?callback:null;
		if(typeof(callback)=="string") callback = eval(callback);
		if(typeof(callback)=="function"){
			callback();
		}
	}catch(e){
	}
}

function setAlpha(source,al){
	var al1 = 0,al2 = 0;
	if(al>1&&al<100){
		al1 = al;
		al2 = al/100;
	}else if(al>0&&al<=1){
		al1 = al*100;
		al2 = al;
	}else{
		al1 = 100;
		al2 = 1.0;
	}
	if(isIE){
		source.style.filter = "Alpha(opacity="+al1+")";
	}else{
		source.style.opacity = al2;
	}
}

function adjacentIframe(obj){
	if(obj.ifm)return;
	
	if(isIE){
		//css操作类
		SCRIPTLoader.Load(SCRIPTLoader.DEFAULT_PACKAGE+".css.cssRule");
		var css = new cssRule();
		var boderWidth = 0;
		var boderHeight = 0;
		try{
			if(obj.className){
				var boder = css.getCssValue("."+obj.className,"borderWidth").toLowerCase();
				boder = boder.replaceAll("px","");
				var BA = boder.split(" ");
				boderHeight += parseInt(BA[0]);
				boderWidth += parseInt(BA[1]);
				boderHeight += parseInt(BA[2]);
				boderWidth += parseInt(BA[3]);
			}
		}catch(e){}
	
		var ifm = $DC("iframe");
		var s = ifm.style;
		ifm.frameBorder = 0;
		ifm.height = obj.offsetHeight + "px";
		s.visibility = "inherit";
		s.filter = "alpha(opacity=0)";
		s.position = "absolute";
		s.top = "-"+boderHeight+"px";//不能占据页面空间
		s.left = "-"+boderWidth+"px";//不能占据页面空间
		s.width = obj.offsetWidth + "px";
		s.zIndex = -1;
		obj.insertAdjacentElement("afterBegin",ifm);
		obj.ifm = true;
	}
}

function getOs() 
{ 
    var OsObject = ""; 
   if(navigator.userAgent.indexOf("MSIE")>0) { 
        return "MSIE"; 
   } 
   if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){ 
        return "Firefox"; 
   } 
   if(isSafari=navigator.userAgent.indexOf("Safari")>0) { 
        return "Safari"; 
   }  
   if(isCamino=navigator.userAgent.indexOf("Camino")>0){ 
        return "Camino"; 
   } 
   if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0){ 
        return "Gecko"; 
   } 
   
}

//js控制flash
function thisMovie(movieName) {
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return window[movieName]
	}
	else {
		return document[movieName]
	}
}

//form添加不可见提交按钮
function addFormSubmitButton(obj){
	obj = getObj(obj);
	var __div = $DC("div");
	__div.innerHTML = "<input type=\"submit\" name=\"Submit\" value=\"提交\" />";
	setStyle(__div,{width:"0px",height:"0px",overflow:"hidden"});
	obj.appendChild(__div);
}

function setFormElementsDisabled(form,disabled){
	var elements = form.elements;
	for(var i = 0;i<elements.length;i++){
		elements[i].disabled = disabled;
	}
	window.FORMSUBMITING = disabled;
}

/*执行ajax取回来的script代码*/
var setInnerHTML = function (el, htmlCode) {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0) {
		htmlCode = '<div style="display:none">for IE</div>' + htmlCode;
		htmlCode = htmlCode.replace(/<script([^>]*)>/gi,
		'<script$1 defer>');
		el.innerHTML = htmlCode;
		el.removeChild(el.firstChild);
	} else {
		var el_next = el.nextSibling;
		var el_parent = el.parentNode;
		el_parent.removeChild(el);
		el.innerHTML = htmlCode;
		if (el_next) {
			el_parent.insertBefore(el, el_next)
		} else {
			el_parent.appendChild(el);
		}
	}
}

var FlashControls = thisMovie("externalInterfaceExample");
var isIE = /msie/i.test(navigator.userAgent);


