/*global jQuery */
/*jshint multistr:true browser:true */
/*!
* FitVids 1.0
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    if(!document.getElementById('fit-vids-style')) {

      var div = document.createElement('div'),
          ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0],
          cssStyles = '&shy;<style>.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>';

      div.className = 'fit-vids-style';
      div.id = 'fit-vids-style';
      div.style.display = 'none';
      div.innerHTML = cssStyles;

      ref.parentNode.insertBefore(div,ref);

    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

function FastClick(a){"use strict";var b,c=this;if(this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=10,this.layer=a,!a||!a.nodeType)throw new TypeError("Layer must be a document node");this.onClick=function(){return FastClick.prototype.onClick.apply(c,arguments)},this.onMouse=function(){return FastClick.prototype.onMouse.apply(c,arguments)},this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(c,arguments)},this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(c,arguments)},this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(c,arguments)},this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(c,arguments)},FastClick.notNeeded(a)||(this.deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchmove",this.onTouchMove,!1),a.addEventListener("touchend",this.onTouchEnd,!1),a.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,d){var e=Node.prototype.removeEventListener;"click"===b?e.call(a,b,c.hijacked||c,d):e.call(a,b,c,d)},a.addEventListener=function(b,c,d){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(a,b,c,d)}),"function"==typeof a.onclick&&(b=a.onclick,a.addEventListener("click",function(a){b(a)},!1),a.onclick=null))}FastClick.prototype.deviceIsAndroid=navigator.userAgent.indexOf("Android")>0,FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),FastClick.prototype.needsClick=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(this.deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(a.className)},FastClick.prototype.needsFocus=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!this.deviceIsAndroid;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},FastClick.prototype.sendClick=function(a,b){"use strict";var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},FastClick.prototype.determineEventType=function(a){"use strict";return this.deviceIsAndroid&&"select"===a.tagName.toLowerCase()?"mousedown":"click"},FastClick.prototype.focus=function(a){"use strict";var b;this.deviceIsIOS&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},FastClick.prototype.updateScrollParent=function(a){"use strict";var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(a){"use strict";return a.nodeType===Node.TEXT_NODE?a.parentNode:a},FastClick.prototype.onTouchStart=function(a){"use strict";var b,c,d;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),c=a.targetTouches[0],this.deviceIsIOS){if(d=window.getSelection(),d.rangeCount&&!d.isCollapsed)return!0;if(!this.deviceIsIOS4){if(c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=c.pageX,this.touchStartY=c.pageY,a.timeStamp-this.lastClickTime<200&&a.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(a){"use strict";var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},FastClick.prototype.onTouchMove=function(a){"use strict";return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},FastClick.prototype.findControl=function(a){"use strict";return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(a){"use strict";var b,c,d,e,f,g=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<200)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=a.timeStamp,c=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,this.deviceIsIOSWithBadTarget&&(f=a.changedTouches[0],g=document.elementFromPoint(f.pageX-window.pageXOffset,f.pageY-window.pageYOffset)||g,g.fastClickScrollParent=this.targetElement.fastClickScrollParent),d=g.tagName.toLowerCase(),"label"===d){if(b=this.findControl(g)){if(this.focus(g),this.deviceIsAndroid)return!1;g=b}}else if(this.needsFocus(g))return a.timeStamp-c>100||this.deviceIsIOS&&window.top!==window&&"input"===d?(this.targetElement=null,!1):(this.focus(g),this.deviceIsIOS4&&"select"===d||(this.targetElement=null,a.preventDefault()),!1);return this.deviceIsIOS&&!this.deviceIsIOS4&&(e=g.fastClickScrollParent,e&&e.fastClickLastScrollTop!==e.scrollTop)?!0:(this.needsClick(g)||(a.preventDefault(),this.sendClick(g,a)),!1)},FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(a){"use strict";return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0:!0},FastClick.prototype.onClick=function(a){"use strict";var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},FastClick.prototype.destroy=function(){"use strict";var a=this.layer;this.deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(a){"use strict";var b,c;if("undefined"==typeof window.ontouchstart)return!0;if(c=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!FastClick.prototype.deviceIsAndroid)return!0;if(b=document.querySelector("meta[name=viewport]")){if(-1!==b.content.indexOf("user-scalable=no"))return!0;if(c>31&&window.innerWidth<=window.screen.width)return!0}}return"none"===a.style.msTouchAction?!0:!1},FastClick.attach=function(a){"use strict";return new FastClick(a)},"undefined"!=typeof define&&define.amd?define(function(){"use strict";return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick,function(a,b,c){"use strict";a.fn.backstretch=function(d,f){return(d===c||0===d.length)&&a.error("No images were supplied for Backstretch"),0===a(b).scrollTop()&&b.scrollTo(0,0),this.each(function(){var b=a(this),c=b.data("backstretch");if(c){if("string"==typeof d&&"function"==typeof c[d])return c[d](f),void 0;f=a.extend(c.options,f),c.destroy(!0)}c=new e(this,d,f),b.data("backstretch",c)})},a.backstretch=function(b,c){return a("body").backstretch(b,c).data("backstretch")},a.expr[":"].backstretch=function(b){return a(b).data("backstretch")!==c},a.fn.backstretch.defaults={centeredX:!0,centeredY:!0,duration:5e3,fade:0};var d={wrap:{left:0,top:0,overflow:"hidden",margin:0,padding:0,height:"100%",width:"100%",zIndex:-999999},img:{position:"absolute",display:"none",margin:0,padding:0,border:"none",width:"auto",height:"auto",maxHeight:"none",maxWidth:"none",zIndex:-999999}},e=function(c,e,g){this.options=a.extend({},a.fn.backstretch.defaults,g||{}),this.images=a.isArray(e)?e:[e],a.each(this.images,function(){a("<img />")[0].src=this}),this.isBody=c===document.body,this.$container=a(c),this.$root=this.isBody?f?a(b):a(document):this.$container;var h=this.$container.children(".backstretch").first();if(this.$wrap=h.length?h:a('<div class="backstretch"></div>').css(d.wrap).appendTo(this.$container),!this.isBody){var i=this.$container.css("position"),j=this.$container.css("zIndex");this.$container.css({position:"static"===i?"relative":i,zIndex:"auto"===j?0:j,background:"none"}),this.$wrap.css({zIndex:-999998})}this.$wrap.css({position:this.isBody&&f?"fixed":"absolute"}),this.index=0,this.show(this.index),a(b).on("resize.backstretch",a.proxy(this.resize,this)).on("orientationchange.backstretch",a.proxy(function(){this.isBody&&0===b.pageYOffset&&(b.scrollTo(0,1),this.resize())},this))};e.prototype={resize:function(){try{var a,c={left:0,top:0},d=this.isBody?this.$root.width():this.$root.innerWidth(),e=d,f=this.isBody?b.innerHeight?b.innerHeight:this.$root.height():this.$root.innerHeight(),g=e/this.$img.data("ratio");g>=f?(a=(g-f)/2,this.options.centeredY&&(c.top="-"+a+"px")):(g=f,e=g*this.$img.data("ratio"),a=(e-d)/2,this.options.centeredX&&(c.left="-"+a+"px")),this.$wrap.css({width:d,height:f}).find("img:not(.deleteable)").css({width:e,height:g}).css(c)}catch(h){}return this},show:function(b){if(!(Math.abs(b)>this.images.length-1)){var c=this,e=c.$wrap.find("img").addClass("deleteable"),f={relatedTarget:c.$container[0]};return c.$container.trigger(a.Event("backstretch.before",f),[c,b]),this.index=b,clearInterval(c.interval),c.$img=a("<img />").css(d.img).bind("load",function(d){var g=this.width||a(d.target).width(),h=this.height||a(d.target).height();a(this).data("ratio",g/h),a(this).fadeIn(c.options.speed||c.options.fade,function(){e.remove(),c.paused||c.cycle(),a(["after","show"]).each(function(){c.$container.trigger(a.Event("backstretch."+this,f),[c,b])})}),c.resize()}).appendTo(c.$wrap),c.$img.attr("src",c.images[b]),c}},next:function(){return this.show(this.index<this.images.length-1?this.index+1:0)},prev:function(){return this.show(0===this.index?this.images.length-1:this.index-1)},pause:function(){return this.paused=!0,this},resume:function(){return this.paused=!1,this.next(),this},cycle:function(){return this.images.length>1&&(clearInterval(this.interval),this.interval=setInterval(a.proxy(function(){this.paused||this.next()},this),this.options.duration)),this},destroy:function(c){a(b).off("resize.backstretch orientationchange.backstretch"),clearInterval(this.interval),c||this.$wrap.remove(),this.$container.removeData("backstretch")}};var f=function(){var a=navigator.userAgent,c=navigator.platform,d=a.match(/AppleWebKit\/([0-9]+)/),e=!!d&&d[1],f=a.match(/Fennec\/([0-9]+)/),g=!!f&&f[1],h=a.match(/Opera Mobi\/([0-9]+)/),i=!!h&&h[1],j=a.match(/MSIE ([0-9]+)/),k=!!j&&j[1];return!((c.indexOf("iPhone")>-1||c.indexOf("iPad")>-1||c.indexOf("iPod")>-1)&&e&&534>e||b.operamini&&"[object OperaMini]"==={}.toString.call(b.operamini)||h&&7458>i||a.indexOf("Android")>-1&&e&&533>e||g&&6>g||"palmGetResource"in b&&e&&534>e||a.indexOf("MeeGo")>-1&&a.indexOf("NokiaBrowser/8.5.0")>-1||k&&6>=k)}()}(jQuery,window),$(function(){FastClick.attach(document.body),console.log("fastclick in the house")}),$header=$("#page-header"),$shareButtons=$(".shareButtons"),$shareContainer=$(".shareContainer"),$("#mobileMenuToggle").on("click",function(){$header.toggleClass("active"),$(this).toggleClass("active")}),$(".shareToggle").on("click",function(a){a.preventDefault(),$toggle=$(this),$toggle.toggleClass("active"),$shareButtons.toggleClass("active")}),$(".home .big-image").on("click",function(){return window.location=window.location+"/work",!1});var previousScroll=0;if(isMobile===!0&&$(window).scroll(function(){var a=$(this).scrollTop();a>previousScroll?(console.log("down"),$shareContainer.fadeOut()):(console.log("up"),$shareContainer.fadeIn()),previousScroll=a}),$("body").hasClass("home")){var videoURL=$("#videoBG").attr("data-video");$bgImage=$(".big-image"),$src=$bgImage.attr("src"),$bgImage.hide(),$.backstretch($(".big-image").attr("src"))}
function loadActiveVideo() {
	$activeVideo = $('.project.active').attr('data-video');
	$activeProjectImage = $('.project.active').attr('data-large');
	$('#playArea').append("<img class='placeholder' src="+$activeProjectImage+" /><a href='#' class='playButton' style='display:none;'>Play</a>");
	$play = $('.playButton');
	setTimeout(function() { $play.fadeIn(200); }, 400);
	$play.on('click', function(e) {
		e.preventDefault();
		$('#playArea .placeholder, .playButton').remove();
		$('#playArea').append($activeVideo);
		$('#playArea').fitVids();

	});
}

function setActiveVideo(selection) {
	$('.project.active').removeClass('active');
	$(selection).addClass('active');
	window.history.pushState(selection, selection, selection);
	setShareUrls();
}

function setShareUrls() {
	$("#share-fb").attr('href', $('.project.active').attr('share-fb'));
	$("#share-twitter").attr('href', $('.project.active').attr('share-twitter'));
	$("#share-tumblr").attr('href', $('.project.active').attr('share-tumblr'));
	$("#share-email").attr('href', $('.project.active').attr('share-email'));
}


jQuery(function($){ $('#singleProjectVideo').fitVids(); });
jQuery(document).ready(function($) {
	$playArea = $('#playArea');
	

	if (window.location.hash) {
		window.scrollTo(0,0);
	}
	if (!window.location.hash) {
		//window.history.pushState($('.project.active').attr('id'), $('.project.active').attr('id'), '#' + $('.project.active').attr('id'));
		setShareUrls();
	} else {
		setActiveVideo('#' + window.location.hash.substr(1));
	}
	$playArea.css({opacity:0});
	loadActiveVideo();
	$playArea.animate({opacity:1}, 300);
	
	

	

	$('.series__Navigation a').click(function(e) {
		e.preventDefault();
		$playArea.css({opacity:0});
		setActiveVideo($(this).attr('href'));
		$('#playArea .placeholder, .playButton, .fluid-width-video-wrapper').remove();
		loadActiveVideo();
		$playArea.animate({opacity: 1}, 300);
		window.scrollTo(0,0);
	});

	$('.pop').click(function() {
		window.open($(this).attr('href'),'t','toolbar=0,resizable=1,status=0,width=640,height=528');
			return false;
	});
});
	