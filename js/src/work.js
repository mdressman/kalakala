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

/*! Backstretch - v2.0.4 - 2013-06-19
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2013 Scott Robbin; Licensed MIT */

;(function ($, window, undefined) {
  'use strict';

  /* PLUGIN DEFINITION
   * ========================= */

  $.fn.backstretch = function (images, options) {
    // We need at least one image or method name
    if (images === undefined || images.length === 0) {
      $.error("No images were supplied for Backstretch");
    }

    /*
     * Scroll the page one pixel to get the right window height on iOS
     * Pretty harmless for everyone else
    */
    if ($(window).scrollTop() === 0 ) {
      window.scrollTo(0, 0);
    }

    return this.each(function () {
      var $this = $(this)
        , obj = $this.data('backstretch');

      // Do we already have an instance attached to this element?
      if (obj) {

        // Is this a method they're trying to execute?
        if (typeof images == 'string' && typeof obj[images] == 'function') {
          // Call the method
          obj[images](options);

          // No need to do anything further
          return;
        }

        // Merge the old options with the new
        options = $.extend(obj.options, options);

        // Remove the old instance
        obj.destroy(true);
      }

      obj = new Backstretch(this, images, options);
      $this.data('backstretch', obj);
    });
  };

  // If no element is supplied, we'll attach to body
  $.backstretch = function (images, options) {
    // Return the instance
    return $('body')
            .backstretch(images, options)
            .data('backstretch');
  };

  // Custom selector
  $.expr[':'].backstretch = function(elem) {
    return $(elem).data('backstretch') !== undefined;
  };

  /* DEFAULTS
   * ========================= */

  $.fn.backstretch.defaults = {
      centeredX: true   // Should we center the image on the X axis?
    , centeredY: true   // Should we center the image on the Y axis?
    , duration: 5000    // Amount of time in between slides (if slideshow)
    , fade: 0           // Speed of fade transition between slides
  };

  /* STYLES
   * 
   * Baked-in styles that we'll apply to our elements.
   * In an effort to keep the plugin simple, these are not exposed as options.
   * That said, anyone can override these in their own stylesheet.
   * ========================= */
  var styles = {
      wrap: {
          left: 0
        , top: 0
        , overflow: 'hidden'
        , margin: 0
        , padding: 0
        , height: '100%'
        , width: '100%'
        , zIndex: -999999
      }
    , img: {
          position: 'absolute'
        , display: 'none'
        , margin: 0
        , padding: 0
        , border: 'none'
        , width: 'auto'
        , height: 'auto'
        , maxHeight: 'none'
        , maxWidth: 'none'
        , zIndex: -999999
      }
  };

  /* CLASS DEFINITION
   * ========================= */
  var Backstretch = function (container, images, options) {
    this.options = $.extend({}, $.fn.backstretch.defaults, options || {});

    /* In its simplest form, we allow Backstretch to be called on an image path.
     * e.g. $.backstretch('/path/to/image.jpg')
     * So, we need to turn this back into an array.
     */
    this.images = $.isArray(images) ? images : [images];

    // Preload images
    $.each(this.images, function () {
      $('<img />')[0].src = this;
    });    

    // Convenience reference to know if the container is body.
    this.isBody = container === document.body;

    /* We're keeping track of a few different elements
     *
     * Container: the element that Backstretch was called on.
     * Wrap: a DIV that we place the image into, so we can hide the overflow.
     * Root: Convenience reference to help calculate the correct height.
     */
    this.$container = $(container);
    this.$root = this.isBody ? supportsFixedPosition ? $(window) : $(document) : this.$container;

    // Don't create a new wrap if one already exists (from a previous instance of Backstretch)
    var $existing = this.$container.children(".backstretch").first();
    this.$wrap = $existing.length ? $existing : $('<div class="backstretch"></div>').css(styles.wrap).appendTo(this.$container);

    // Non-body elements need some style adjustments
    if (!this.isBody) {
      // If the container is statically positioned, we need to make it relative,
      // and if no zIndex is defined, we should set it to zero.
      var position = this.$container.css('position')
        , zIndex = this.$container.css('zIndex');

      this.$container.css({
          position: position === 'static' ? 'relative' : position
        , zIndex: zIndex === 'auto' ? 0 : zIndex
        , background: 'none'
      });
      
      // Needs a higher z-index
      this.$wrap.css({zIndex: -999998});
    }

    // Fixed or absolute positioning?
    this.$wrap.css({
      position: this.isBody && supportsFixedPosition ? 'fixed' : 'absolute'
    });

    // Set the first image
    this.index = 0;
    this.show(this.index);

    // Listen for resize
    $(window).on('resize.backstretch', $.proxy(this.resize, this))
             .on('orientationchange.backstretch', $.proxy(function () {
                // Need to do this in order to get the right window height
                if (this.isBody && window.pageYOffset === 0) {
                  window.scrollTo(0, 1);
                  this.resize();
                }
             }, this));
  };

  /* PUBLIC METHODS
   * ========================= */
  Backstretch.prototype = {
      resize: function () {
        try {
          var bgCSS = {left: 0, top: 0}
            , rootWidth = this.isBody ? this.$root.width() : this.$root.innerWidth()
            , bgWidth = rootWidth
            , rootHeight = this.isBody ? ( window.innerHeight ? window.innerHeight : this.$root.height() ) : this.$root.innerHeight()
            , bgHeight = bgWidth / this.$img.data('ratio')
            , bgOffset;

            // Make adjustments based on image ratio
            if (bgHeight >= rootHeight) {
                bgOffset = (bgHeight - rootHeight) / 2;
                if(this.options.centeredY) {
                  bgCSS.top = '-' + bgOffset + 'px';
                }
            } else {
                bgHeight = rootHeight;
                bgWidth = bgHeight * this.$img.data('ratio');
                bgOffset = (bgWidth - rootWidth) / 2;
                if(this.options.centeredX) {
                  bgCSS.left = '-' + bgOffset + 'px';
                }
            }

            this.$wrap.css({width: rootWidth, height: rootHeight})
                      .find('img:not(.deleteable)').css({width: bgWidth, height: bgHeight}).css(bgCSS);
        } catch(err) {
            // IE7 seems to trigger resize before the image is loaded.
            // This try/catch block is a hack to let it fail gracefully.
        }

        return this;
      }

      // Show the slide at a certain position
    , show: function (newIndex) {

        // Validate index
        if (Math.abs(newIndex) > this.images.length - 1) {
          return;
        }

        // Vars
        var self = this
          , oldImage = self.$wrap.find('img').addClass('deleteable')
          , evtOptions = { relatedTarget: self.$container[0] };

        // Trigger the "before" event
        self.$container.trigger($.Event('backstretch.before', evtOptions), [self, newIndex]); 

        // Set the new index
        this.index = newIndex;

        // Pause the slideshow
        clearInterval(self.interval);

        // New image
        self.$img = $('<img />')
                      .css(styles.img)
                      .bind('load', function (e) {
                        var imgWidth = this.width || $(e.target).width()
                          , imgHeight = this.height || $(e.target).height();
                        
                        // Save the ratio
                        $(this).data('ratio', imgWidth / imgHeight);

                        // Show the image, then delete the old one
                        // "speed" option has been deprecated, but we want backwards compatibilty
                        $(this).fadeIn(self.options.speed || self.options.fade, function () {
                          oldImage.remove();

                          // Resume the slideshow
                          if (!self.paused) {
                            self.cycle();
                          }

                          // Trigger the "after" and "show" events
                          // "show" is being deprecated
                          $(['after', 'show']).each(function () {
                            self.$container.trigger($.Event('backstretch.' + this, evtOptions), [self, newIndex]);
                          });
                        });

                        // Resize
                        self.resize();
                      })
                      .appendTo(self.$wrap);

        // Hack for IE img onload event
        self.$img.attr('src', self.images[newIndex]);
        return self;
      }

    , next: function () {
        // Next slide
        return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0);
      }

    , prev: function () {
        // Previous slide
        return this.show(this.index === 0 ? this.images.length - 1 : this.index - 1);
      }

    , pause: function () {
        // Pause the slideshow
        this.paused = true;
        return this;
      }

    , resume: function () {
        // Resume the slideshow
        this.paused = false;
        this.next();
        return this;
      }

    , cycle: function () {
        // Start/resume the slideshow
        if(this.images.length > 1) {
          // Clear the interval, just in case
          clearInterval(this.interval);

          this.interval = setInterval($.proxy(function () {
            // Check for paused slideshow
            if (!this.paused) {
              this.next();
            }
          }, this), this.options.duration);
        }
        return this;
      }

    , destroy: function (preserveBackground) {
        // Stop the resize events
        $(window).off('resize.backstretch orientationchange.backstretch');

        // Clear the interval
        clearInterval(this.interval);

        // Remove Backstretch
        if(!preserveBackground) {
          this.$wrap.remove();          
        }
        this.$container.removeData('backstretch');
      }
  };

  /* SUPPORTS FIXED POSITION?
   *
   * Based on code from jQuery Mobile 1.1.0
   * http://jquerymobile.com/
   *
   * In a nutshell, we need to figure out if fixed positioning is supported.
   * Unfortunately, this is very difficult to do on iOS, and usually involves
   * injecting content, scrolling the page, etc.. It's ugly.
   * jQuery Mobile uses this workaround. It's not ideal, but works.
   *
   * Modified to detect IE6
   * ========================= */

  var supportsFixedPosition = (function () {
    var ua = navigator.userAgent
      , platform = navigator.platform
        // Rendering engine is Webkit, and capture major version
      , wkmatch = ua.match( /AppleWebKit\/([0-9]+)/ )
      , wkversion = !!wkmatch && wkmatch[ 1 ]
      , ffmatch = ua.match( /Fennec\/([0-9]+)/ )
      , ffversion = !!ffmatch && ffmatch[ 1 ]
      , operammobilematch = ua.match( /Opera Mobi\/([0-9]+)/ )
      , omversion = !!operammobilematch && operammobilematch[ 1 ]
      , iematch = ua.match( /MSIE ([0-9]+)/ )
      , ieversion = !!iematch && iematch[ 1 ];

    return !(
      // iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
      ((platform.indexOf( "iPhone" ) > -1 || platform.indexOf( "iPad" ) > -1  || platform.indexOf( "iPod" ) > -1 ) && wkversion && wkversion < 534) ||
      
      // Opera Mini
      (window.operamini && ({}).toString.call( window.operamini ) === "[object OperaMini]") ||
      (operammobilematch && omversion < 7458) ||
      
      //Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
      (ua.indexOf( "Android" ) > -1 && wkversion && wkversion < 533) ||
      
      // Firefox Mobile before 6.0 -
      (ffversion && ffversion < 6) ||
      
      // WebOS less than 3
      ("palmGetResource" in window && wkversion && wkversion < 534) ||
      
      // MeeGo
      (ua.indexOf( "MeeGo" ) > -1 && ua.indexOf( "NokiaBrowser/8.5.0" ) > -1) ||
      
      // IE6
      (ieversion && ieversion <= 6)
    );
  }());

}(jQuery, window));
/*
 * Swiper 2.4+ - Mobile Touch Slider
 * http://www.idangero.us/sliders/swiper/
 *
 * Copyright 2012-2013, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under GPL & MIT
 *
 * Updated on: December 6, 2013
*/
var Swiper = function (selector, params) {
    /*=========================
      A little bit dirty but required part for IE8 and old FF support
      ===========================*/
    if (document.body.__defineGetter__) {
        if (HTMLElement) {
            var element = HTMLElement.prototype;
            if (element.__defineGetter__) {
                element.__defineGetter__("outerHTML", function () { return new XMLSerializer().serializeToString(this); } );
            }
        }
    }

    if (!window.getComputedStyle) {
        window.getComputedStyle = function (el, pseudo) {
            this.el = el;
            this.getPropertyValue = function (prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop === 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            }
            return this;
        }
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        }
    }
    if (!document.querySelectorAll) {
        if (!window.jQuery) return;
    }
    function $$(selector, context) {
        if (document.querySelectorAll)
            return (context || document).querySelectorAll(selector);
        else
            return jQuery(selector, context);
    }

    /*=========================
      Check for correct selector
      ===========================*/
    if(typeof selector === 'undefined') return;

    if(!(selector.nodeType)){
        if ($$(selector).length === 0) return;
    }

     /*=========================
      _this
      ===========================*/
    var _this = this;

     /*=========================
      Default Flags and vars
      ===========================*/
    _this.touches = {
        start:0,
        startX:0,
        startY:0,
        current:0,
        currentX:0,
        currentY:0,
        diff:0,
        abs:0
    };
    _this.positions = {
        start:0,
        abs:0,
        diff:0,
        current:0
    };
    _this.times = {
        start:0,
        end:0
    };

    _this.id = (new Date()).getTime();
    _this.container = (selector.nodeType) ? selector : $$(selector)[0];
    _this.isTouched = false;
    _this.isMoved = false;
    _this.activeIndex = 0;
    _this.centerIndex = 0;
    _this.activeLoaderIndex = 0;
    _this.activeLoopIndex = 0;
    _this.previousIndex = null;
    _this.velocity = 0;
    _this.snapGrid = [];
    _this.slidesGrid = [];
    _this.imagesToLoad = [];
    _this.imagesLoaded = 0;
    _this.wrapperLeft=0;
    _this.wrapperRight=0;
    _this.wrapperTop=0;
    _this.wrapperBottom=0;
    var wrapper, slideSize, wrapperSize, direction, isScrolling, containerSize;

    /*=========================
      Default Parameters
      ===========================*/
    var defaults = {
        mode : 'horizontal', // or 'vertical'
        touchRatio : 1,
        speed : 300,
        freeMode : false,
        freeModeFluid : false,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        slidesPerView : 1,
        slidesPerGroup : 1,
        simulateTouch : true,
        followFinger : true,
        shortSwipes : true,
        moveStartThreshold:false,
        onlyExternal : false,
        createPagination : true,
        pagination : false,
        paginationElement: 'span',
        paginationClickable: false,
        paginationAsRange: true,
        resistance : true, // or false or 100%
        scrollContainer : false,
        preventLinks : true,
        noSwiping : false, // or class
        noSwipingClass : 'swiper-no-swiping', //:)
        initialSlide: 0,
        keyboardControl: false,
        mousewheelControl : false,
        useCSS3Transforms : true,
        // Autoplay
        autoplay: false,
        autoplayDisableOnInteraction: true,
        //Loop mode
        loop:false,
        loopAdditionalSlides:0,
        //Auto Height
        calculateHeight: false,
        cssWidthAndHeight: false,
        //Images Preloader
        updateOnImagesReady : true,
        //Form elements
        releaseFormElements : true,
        //Watch for active slide, useful when use effects on different slide states
        watchActiveIndex: false,
        //Slides Visibility Fit
        visibilityFullFit : false,
        //Slides Offset
        offsetPxBefore : 0,
        offsetPxAfter : 0,
        offsetSlidesBefore : 0,
        offsetSlidesAfter : 0,
        centeredSlides: false,
        //Queue callbacks
        queueStartCallbacks : false,
        queueEndCallbacks : false,
        //Auto Resize
        autoResize : true,
        resizeReInit : false,
        //DOMAnimation
        DOMAnimation : true,
        //Slides Loader
        loader: {
            slides:[], //array with slides
            slidesHTMLType:'inner', // or 'outer'
            surroundGroups: 1, //keep preloaded slides groups around view
            logic: 'reload', //or 'change'
            loadAllSlides: false
        },
        //Namespace
        slideElement : 'div',
        slideClass : 'swiper-slide',
        slideActiveClass : 'swiper-slide-active',
        slideVisibleClass : 'swiper-slide-visible',
        wrapperClass : 'swiper-wrapper',
        paginationElementClass: 'swiper-pagination-switch',
        paginationActiveClass : 'swiper-active-switch',
        paginationVisibleClass : 'swiper-visible-switch'
    }
    params = params || {};
    for (var prop in defaults) {
        if (prop in params && typeof params[prop]==='object') {
            for (var subProp in defaults[prop]) {
                if (! (subProp in params[prop])) {
                    params[prop][subProp] = defaults[prop][subProp];
                }
            }
        }
        else if (! (prop in params)) {
            params[prop] = defaults[prop]
        }
    }
    _this.params = params;
    if (params.scrollContainer) {
        params.freeMode = true;
        params.freeModeFluid = true;
    }
    if (params.loop) {
        params.resistance = '100%';
    }
    var isH = params.mode==='horizontal';

    /*=========================
      Define Touch Events
      ===========================*/

    _this.touchEvents = {
        touchStart : _this.support.touch || !params.simulateTouch  ? 'touchstart' : (_this.browser.ie10 ? 'MSPointerDown' : 'mousedown'),
        touchMove : _this.support.touch || !params.simulateTouch ? 'touchmove' : (_this.browser.ie10 ? 'MSPointerMove' : 'mousemove'),
        touchEnd : _this.support.touch || !params.simulateTouch ? 'touchend' : (_this.browser.ie10 ? 'MSPointerUp' : 'mouseup')
    };

    /*=========================
      Wrapper
      ===========================*/
    for (var i = _this.container.childNodes.length - 1; i >= 0; i--) {
        if (_this.container.childNodes[i].className) {
            var _wrapperClasses = _this.container.childNodes[i].className.split(' ')
            for (var j = 0; j < _wrapperClasses.length; j++) {
                if (_wrapperClasses[j]===params.wrapperClass) {
                    wrapper = _this.container.childNodes[i];
                }
            };
        }
    };

    _this.wrapper = wrapper;
    /*=========================
      Slide API
      ===========================*/
    _this._extendSwiperSlide = function  (el) {
        el.append = function () {
            if (params.loop) {
                el.insertAfter(_this.slides.length-_this.loopedSlides);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                _this.wrapper.appendChild(el);
            }

            _this.reInit();
            return el;
        }
        el.prepend = function () {
            if (params.loop) {
                _this.wrapper.insertBefore(el, _this.slides[_this.loopedSlides]);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                _this.wrapper.insertBefore(el, _this.wrapper.firstChild);
            }
            _this.reInit();
            return el;
        }
        el.insertAfter = function (index) {
            if(typeof index === 'undefined') return false;
            var beforeSlide;

            if (params.loop) {
                beforeSlide = _this.slides[index + 1 + _this.loopedSlides];
                _this.wrapper.insertBefore(el, beforeSlide);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                beforeSlide = _this.slides[index + 1];
                _this.wrapper.insertBefore(el, beforeSlide)
            }
            _this.reInit();
            return el;
        }
        el.clone = function () {
            return _this._extendSwiperSlide(el.cloneNode(true))
        }
        el.remove = function () {
            _this.wrapper.removeChild(el);
            _this.reInit();
        }
        el.html = function (html) {
            if (typeof html === 'undefined') {
                return el.innerHTML;
            }
            else {
                el.innerHTML = html;
                return el;
            }
        }
        el.index = function () {
            var index;
            for (var i = _this.slides.length - 1; i >= 0; i--) {
                if(el === _this.slides[i]) index = i;
            }
            return index;
        }
        el.isActive = function () {
            if (el.index() === _this.activeIndex) return true;
            else return false;
        }
        if (!el.swiperSlideDataStorage) el.swiperSlideDataStorage={};
        el.getData = function (name) {
            return el.swiperSlideDataStorage[name];
        }
        el.setData = function (name, value) {
            el.swiperSlideDataStorage[name] = value;
            return el;
        }
        el.data = function (name, value) {
            if (!value) {
                return el.getAttribute('data-'+name);
            }
            else {
                el.setAttribute('data-'+name,value);
                return el;
            }
        }
        el.getWidth = function (outer) {
            return _this.h.getWidth(el, outer);
        }
        el.getHeight = function (outer) {
            return _this.h.getHeight(el, outer);
        }
        el.getOffset = function() {
            return _this.h.getOffset(el);
        }
        return el;
    }

    //Calculate information about number of slides
    _this.calcSlides = function (forceCalcSlides) {
        var oldNumber = _this.slides ? _this.slides.length : false;
        _this.slides = [];
        _this.displaySlides = [];
        for (var i = 0; i < _this.wrapper.childNodes.length; i++) {
            if (_this.wrapper.childNodes[i].className) {
                var _className = _this.wrapper.childNodes[i].className;
                var _slideClasses = _className.split(' ');
                for (var j = 0; j < _slideClasses.length; j++) {
                    if(_slideClasses[j]===params.slideClass) {
                        _this.slides.push(_this.wrapper.childNodes[i]);
                    }
                }
            }
        }
        for (i = _this.slides.length - 1; i >= 0; i--) {
            _this._extendSwiperSlide(_this.slides[i]);
        }
        if (oldNumber===false) return;
        if(oldNumber!==_this.slides.length || forceCalcSlides) {
            // Number of slides has been changed
            removeSlideEvents();
            addSlideEvents();
            _this.updateActiveSlide();
            if (_this.params.pagination) _this.createPagination();
            _this.callPlugins('numberOfSlidesChanged');
        }
    }

    //Create Slide
    _this.createSlide = function (html, slideClassList, el) {
        var slideClassList = slideClassList || _this.params.slideClass;
        var el = el||params.slideElement;
        var newSlide = document.createElement(el);
        newSlide.innerHTML = html||'';
        newSlide.className = slideClassList;
        return _this._extendSwiperSlide(newSlide);
    }

    //Append Slide
    _this.appendSlide = function (html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).append()
        }
        else {
            return _this.createSlide(html, slideClassList, el).append()
        }
    }
    _this.prependSlide = function (html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).prepend()
        }
        else {
            return _this.createSlide(html, slideClassList, el).prepend()
        }
    }
    _this.insertSlideAfter = function (index, html, slideClassList, el) {
        if (typeof index === 'undefined') return false;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).insertAfter(index);
        }
        else {
            return _this.createSlide(html, slideClassList, el).insertAfter(index);
        }
    }
    _this.removeSlide = function (index) {
        if (_this.slides[index]) {
            if (params.loop) {
                if (!_this.slides[index+_this.loopedSlides]) return false;
                _this.slides[index+_this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else _this.slides[index].remove();
            return true;
        }
        else return false;
    }
    _this.removeLastSlide = function () {
        if (_this.slides.length>0) {
            if (params.loop) {
                _this.slides[_this.slides.length - 1 - _this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else _this.slides[ (_this.slides.length-1) ].remove();
            return true;
        }
        else {
            return false;
        }
    }
    _this.removeAllSlides = function () {
        for (var i = _this.slides.length - 1; i >= 0; i--) {
            _this.slides[i].remove()
        }
    }
    _this.getSlide = function (index) {
        return _this.slides[index]
    }
    _this.getLastSlide = function () {
        return _this.slides[ _this.slides.length-1 ]
    }
    _this.getFirstSlide = function () {
        return _this.slides[0]
    }

    //Currently Active Slide
    _this.activeSlide = function () {
        return _this.slides[_this.activeIndex]
    }

    /*=========================
      Plugins API
      ===========================*/
    var _plugins = [];
    for (var plugin in _this.plugins) {
        if (params[plugin]) {
            var p = _this.plugins[plugin](_this, params[plugin]);
            if (p) _plugins.push( p );
        }
    }
    _this.callPlugins = function(method, args) {
        if (!args) args = {}
        for (var i=0; i<_plugins.length; i++) {
            if (method in _plugins[i]) {
                _plugins[i][method](args);
            }
        }
    }

    /*=========================
     Wrapper for Callbacks : Allows additive callbacks via function arrays
     ===========================*/
    _this.fireCallback = function() {
        var callback = arguments[0];
        if( Object.prototype.toString.call( callback ) === '[object Array]' ) {
            for (var i = 0; i < callback.length; i++) {
                if (typeof callback[i] === 'function') {
                    callback[i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
                }
            }
        } else {
            callback(arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
    }
    function isArray (obj) {
        "use strict";
        if (Object.prototype.toString.apply( obj ) === '[object Array]') return true;
        return false;
    }

    /**
     * Allows user to add callbacks, rather than replace them
     * @param callback
     * @param func
     * @return {*}
     */
    _this.addCallback = function (callback, func) {
        "use strict";
        var _this = this, tempFunc;
        if (_this.params['on' + callback]) {
            if (isArray(this.params['on' + callback])) {
                return this.params['on' + callback].push(func);
            } else if (typeof this.params['on' + callback] === 'function') {
                tempFunc = this.params['on' + callback];
                this.params['on' + callback] = [];
                this.params['on' + callback].push(tempFunc);
                return this.params['on' + callback].push(func);
            }
        } else {
            this.params['on' + callback] = [];
            return this.params['on' + callback].push(func);
        }
    }
    _this.removeCallbacks = function (callback) {
        if (_this.params['on' + callback]) {
            return _this.params['on' + callback] = null;
        }
    }

    /*=========================
      WP8 Fix
      ===========================*/
    if (_this.browser.ie10 && !params.onlyExternal) {
        _this.wrapper.classList.add('swiper-wp8-' + (isH ? 'horizontal' : 'vertical'));
    }

    /*=========================
      Free Mode Class
      ===========================*/
    if (params.freeMode) {
        _this.container.className+=' swiper-free-mode';
    }

    /*==================================================
        Init/Re-init/Resize Fix
    ====================================================*/
    _this.initialized = false;
    _this.init = function(force, forceCalcSlides) {
        var _width = _this.h.getWidth(_this.container);
        var _height = _this.h.getHeight(_this.container);
        if (_width===_this.width && _height===_this.height && !force) return;
        _this.width = _width;
        _this.height = _height;

        containerSize = isH ? _width : _height;
        var wrapper = _this.wrapper;

        if (force) {
            _this.calcSlides(forceCalcSlides);
        }

        if (params.slidesPerView==='auto') {
            //Auto mode
            var slidesWidth = 0;
            var slidesHeight = 0;

            //Unset Styles
            if (params.slidesOffset>0) {
                wrapper.style.paddingLeft = '';
                wrapper.style.paddingRight = '';
                wrapper.style.paddingTop = '';
                wrapper.style.paddingBottom = '';
            }
            wrapper.style.width = '';
            wrapper.style.height = '';
            if (params.offsetPxBefore>0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore;
                else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter>0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter;
                else _this.wrapperBottom = params.offsetPxAfter;
            }

            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - this.slides[0].getWidth(true) )/2;
                    _this.wrapperRight = (containerSize - _this.slides[ _this.slides.length-1 ].getWidth(true))/2;
                }
                else {
                    _this.wrapperTop = (containerSize - _this.slides[0].getHeight(true))/2;
                    _this.wrapperBottom = (containerSize - _this.slides[ _this.slides.length-1 ].getHeight(true))/2;
                }
            }

            if (isH) {
                if (_this.wrapperLeft>=0) wrapper.style.paddingLeft = _this.wrapperLeft+'px';
                if (_this.wrapperRight>=0) wrapper.style.paddingRight = _this.wrapperRight+'px';
            }
            else {
                if (_this.wrapperTop>=0) wrapper.style.paddingTop = _this.wrapperTop+'px';
                if (_this.wrapperBottom>=0) wrapper.style.paddingBottom = _this.wrapperBottom+'px';
            }
            var slideLeft = 0;
            var centeredSlideLeft=0;
            _this.snapGrid = [];
            _this.slidesGrid = [];

            var slideMaxHeight = 0;
            for(var i = 0; i<_this.slides.length; i++) {
                var slideWidth = _this.slides[i].getWidth(true);
                var slideHeight = _this.slides[i].getHeight(true);
                if (params.calculateHeight) {
                    slideMaxHeight = Math.max(slideMaxHeight, slideHeight)
                }
                var _slideSize = isH ? slideWidth : slideHeight;
                if (params.centeredSlides) {
                    var nextSlideWidth = i === _this.slides.length-1 ? 0 : _this.slides[i+1].getWidth(true);
                    var nextSlideHeight = i === _this.slides.length-1 ? 0 : _this.slides[i+1].getHeight(true);
                    var nextSlideSize = isH ? nextSlideWidth : nextSlideHeight;
                    if (_slideSize>containerSize) {
                        for (var j=0; j<=Math.floor(_slideSize/(containerSize+_this.wrapperLeft)); j++) {
                            if (j === 0) _this.snapGrid.push(slideLeft+_this.wrapperLeft);
                            else _this.snapGrid.push(slideLeft+_this.wrapperLeft+containerSize*j);
                        }
                        _this.slidesGrid.push(slideLeft+_this.wrapperLeft);
                    }
                    else {
                        _this.snapGrid.push(centeredSlideLeft);
                        _this.slidesGrid.push(centeredSlideLeft);
                    }

                    centeredSlideLeft += _slideSize/2 + nextSlideSize/2;

                }
                else {
                    if (_slideSize>containerSize) {
                        for (var j=0; j<=Math.floor(_slideSize/containerSize); j++) {
                            _this.snapGrid.push(slideLeft+containerSize*j);
                        }
                    }
                    else {
                        _this.snapGrid.push(slideLeft);
                    }
                    _this.slidesGrid.push(slideLeft);
                }

                slideLeft += _slideSize;

                slidesWidth += slideWidth;
                slidesHeight += slideHeight;
            }
            if (params.calculateHeight) _this.height = slideMaxHeight;
            if(isH) {
                wrapperSize = slidesWidth + _this.wrapperRight + _this.wrapperLeft;
                wrapper.style.width = (slidesWidth)+'px';
                wrapper.style.height = (_this.height)+'px';
            }
            else {
                wrapperSize = slidesHeight + _this.wrapperTop + _this.wrapperBottom;
                wrapper.style.width = (_this.width)+'px';
                wrapper.style.height = (slidesHeight)+'px';
            }

        }
        else if (params.scrollContainer) {
            //Scroll Container
            wrapper.style.width = '';
            wrapper.style.height = '';
            var wrapperWidth = _this.slides[0].getWidth(true);
            var wrapperHeight = _this.slides[0].getHeight(true);
            wrapperSize = isH ? wrapperWidth : wrapperHeight;
            wrapper.style.width = wrapperWidth+'px';
            wrapper.style.height = wrapperHeight+'px';
            slideSize = isH ? wrapperWidth : wrapperHeight;

        }
        else {
            //For usual slides
            if (params.calculateHeight) {
                var slideMaxHeight = 0;
                var wrapperHeight = 0;
                //ResetWrapperSize
                if (!isH) _this.container.style.height= '';
                wrapper.style.height='';

                for (var i=0; i<_this.slides.length; i++) {
                    //ResetSlideSize
                    _this.slides[i].style.height='';
                    slideMaxHeight = Math.max( _this.slides[i].getHeight(true), slideMaxHeight );
                    if (!isH) wrapperHeight+=_this.slides[i].getHeight(true);
                }
                var slideHeight = slideMaxHeight;
                _this.height = slideHeight;

                if (isH) wrapperHeight = slideHeight;
                else containerSize = slideHeight, _this.container.style.height= containerSize+'px';
            }
            else {
                var slideHeight = isH ? _this.height : _this.height/params.slidesPerView;
                var wrapperHeight = isH ? _this.height : _this.slides.length*slideHeight;
            }
            var slideWidth = isH ? _this.width/params.slidesPerView : _this.width;
            var wrapperWidth = isH ? _this.slides.length*slideWidth : _this.width;
            slideSize = isH ? slideWidth : slideHeight;

            if (params.offsetSlidesBefore>0) {
                if (isH) _this.wrapperLeft = slideSize*params.offsetSlidesBefore;
                else _this.wrapperTop = slideSize*params.offsetSlidesBefore;
            }
            if (params.offsetSlidesAfter>0) {
                if (isH) _this.wrapperRight = slideSize*params.offsetSlidesAfter;
                else _this.wrapperBottom = slideSize*params.offsetSlidesAfter;
            }
            if (params.offsetPxBefore>0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore;
                else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter>0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter;
                else _this.wrapperBottom = params.offsetPxAfter;
            }
            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - slideSize)/2;
                    _this.wrapperRight = (containerSize - slideSize)/2;
                }
                else {
                    _this.wrapperTop = (containerSize - slideSize)/2;
                    _this.wrapperBottom = (containerSize - slideSize)/2;
                }
            }
            if (isH) {
                if (_this.wrapperLeft>0) wrapper.style.paddingLeft = _this.wrapperLeft+'px';
                if (_this.wrapperRight>0) wrapper.style.paddingRight = _this.wrapperRight+'px';
            }
            else {
                if (_this.wrapperTop>0) wrapper.style.paddingTop = _this.wrapperTop+'px';
                if (_this.wrapperBottom>0) wrapper.style.paddingBottom = _this.wrapperBottom+'px';
            }

            wrapperSize = isH ? wrapperWidth + _this.wrapperRight + _this.wrapperLeft : wrapperHeight + _this.wrapperTop + _this.wrapperBottom;
            if (!params.cssWidthAndHeight) {
                if (parseFloat(wrapperWidth) > 0) {
                    wrapper.style.width = wrapperWidth+'px';
                }
                if (parseFloat(wrapperHeight) > 0) {
                    wrapper.style.height = wrapperHeight+'px';
                }
            }
            var slideLeft = 0;
            _this.snapGrid = [];
            _this.slidesGrid = [];
            for (var i=0; i<_this.slides.length; i++) {
                _this.snapGrid.push(slideLeft);
                _this.slidesGrid.push(slideLeft);
                slideLeft+=slideSize;
                if (!params.cssWidthAndHeight) {
                    if (parseFloat(slideWidth) > 0) {
                        _this.slides[i].style.width = slideWidth+'px';
                    }
                    if (parseFloat(slideHeight) > 0) {
                        _this.slides[i].style.height = slideHeight+'px';
                    }
                }
            }

        }

        if (!_this.initialized) {
            _this.callPlugins('onFirstInit');
            if (params.onFirstInit) _this.fireCallback(params.onFirstInit,_this);
        }
        else {
            _this.callPlugins('onInit');
            if (params.onInit) _this.fireCallback(params.onInit,_this);
        }
        _this.initialized = true;
    }
    
    _this.reInit = function (forceCalcSlides) {
        _this.init(true, forceCalcSlides);
    }
    
    _this.resizeFix = function (reInit) {
        _this.callPlugins('beforeResizeFix');
        
        _this.init(params.resizeReInit || reInit);
        
        // swipe to active slide in fixed mode
        if (!params.freeMode) {
            _this.swipeTo((params.loop ? _this.activeLoopIndex : _this.activeIndex), 0, false);
        }
        
        // move wrapper to the beginning in free mode
        else if (_this.getWrapperTranslate() < -maxWrapperPosition()) {
            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(-maxWrapperPosition());
        }
        
        _this.callPlugins('afterResizeFix');
    }

    /*==========================================
        Max and Min Positions
    ============================================*/
    function maxWrapperPosition() {
        var a = (wrapperSize - containerSize);
        if (params.freeMode) {
            a = wrapperSize - containerSize;
        }
        // if (params.loop) a -= containerSize;
        if (params.slidesPerView > _this.slides.length) a = 0;
        if (a<0) a = 0;
        return a;
    }
    function minWrapperPosition() {
        var a = 0;
        // if (params.loop) a = containerSize;
        return a;
    }

    /*==========================================
        Event Listeners
    ============================================*/
    function initEvents() {
        var bind = _this.h.addEventListener;
        
        //Touch Events
        if (!_this.browser.ie10) {
            if (_this.support.touch) {
                bind(_this.wrapper, 'touchstart', onTouchStart);
                bind(_this.wrapper, 'touchmove', onTouchMove);
                bind(_this.wrapper, 'touchend', onTouchEnd);
            }
            if (params.simulateTouch) {
                bind(_this.wrapper, 'mousedown', onTouchStart);
                bind(document, 'mousemove', onTouchMove);
                bind(document, 'mouseup', onTouchEnd);
            }
        }
        else {
            bind(_this.wrapper, _this.touchEvents.touchStart, onTouchStart);
            bind(document, _this.touchEvents.touchMove, onTouchMove);
            bind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }

        //Resize Event
        if (params.autoResize) {
            bind(window, 'resize', _this.resizeFix);
        }
        //Slide Events
        addSlideEvents();
        //Mousewheel
        _this._wheelEvent = false;
        if (params.mousewheelControl) {
            if ( document.onmousewheel !== undefined ) {
                _this._wheelEvent = "mousewheel";
            }
            try {
                WheelEvent("wheel");
                _this._wheelEvent = "wheel";
            } catch (e) {}
            if ( !_this._wheelEvent ) {
                _this._wheelEvent = "DOMMouseScroll";
            }

            if (_this._wheelEvent) {
                bind(_this.container, _this._wheelEvent, handleMousewheel);
            }
        }

        //Keyboard
        if (params.keyboardControl) {
            bind(document, 'keydown', handleKeyboardKeys);
        }
        if (params.updateOnImagesReady) {
            _this.imagesToLoad = $$('img', _this.container);

            for (var i=0; i<_this.imagesToLoad.length; i++) {
                _loadImage(_this.imagesToLoad[i].getAttribute('src'))
            }
        }
        function _loadImage(src) {
            var image = new Image();
            image.onload = function(){
                _this.imagesLoaded++;
                if (_this.imagesLoaded==_this.imagesToLoad.length) {
                    _this.reInit();
                    if (params.onImagesReady) _this.fireCallback(params.onImagesReady, _this);
                }
            }
            image.src = src;
        }
    }

    //Remove Event Listeners
    _this.destroy = function(removeResizeFix){
        var unbind = _this.h.removeEventListener;
        
        //Touch Events
        if (!_this.browser.ie10) {
            if (_this.support.touch) {
                unbind(_this.wrapper, 'touchstart', onTouchStart);
                unbind(_this.wrapper, 'touchmove', onTouchMove);
                unbind(_this.wrapper, 'touchend', onTouchEnd);
            }
            if (params.simulateTouch) {
                unbind(_this.wrapper, 'mousedown', onTouchStart);
                unbind(document, 'mousemove', onTouchMove);
                unbind(document, 'mouseup', onTouchEnd);
            }
        }
        else {
            unbind(_this.wrapper, _this.touchEvents.touchStart, onTouchStart);
            unbind(document, _this.touchEvents.touchMove, onTouchMove);
            unbind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }

        //Resize Event
        if (params.autoResize) {
            unbind(window, 'resize', _this.resizeFix);
        }
        
        //Init Slide Events
        removeSlideEvents();

        //Pagination
        if (params.paginationClickable) {
            removePaginationEvents();
        }

        //Mousewheel
        if (params.mousewheelControl && _this._wheelEvent) {
           unbind(_this.container, _this._wheelEvent, handleMousewheel);
        }

        //Keyboard
        if (params.keyboardControl) {
            unbind(document, 'keydown', handleKeyboardKeys);
        }

        //Stop autoplay
        if (params.autoplay) {
            _this.stopAutoplay();
        }
        _this.callPlugins('onDestroy');

        //Destroy variable
        _this = null;
    }
    function addSlideEvents() {
        var bind = _this.h.addEventListener,
            i;

        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$('a', _this.container);
            for (i=0; i<links.length; i++) {
                bind(links[i], 'click', preventClick);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$('input, textarea, select', _this.container);
            for (i=0; i<formElements.length; i++) {
                bind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
            }
        }

        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i=0; i<_this.slides.length; i++) {
                bind(_this.slides[i], 'click', slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i=0; i<_this.slides.length; i++) {
                bind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
    }
    function removeSlideEvents() {
        var unbind = _this.h.removeEventListener,
            i;

        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i=0; i<_this.slides.length; i++) {
                unbind(_this.slides[i], 'click', slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i=0; i<_this.slides.length; i++) {
                unbind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$('input, textarea, select', _this.container);
            for (i=0; i<formElements.length; i++) {
                unbind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
            }
        }
        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$('a', _this.container);
            for (i=0; i<links.length; i++) {
                unbind(links[i], 'click', preventClick);
            }
        }
    }
    /*==========================================
        Keyboard Control
    ============================================*/
    function handleKeyboardKeys (e) {
        var kc = e.keyCode || e.charCode;
        if (kc==37 || kc==39 || kc==38 || kc==40) {
            var inView = false;
            //Check that swiper should be inside of visible area of window
            var swiperOffset = _this.h.getOffset( _this.container );
            var scrollLeft = _this.h.windowScroll().left;
            var scrollTop = _this.h.windowScroll().top;
            var windowWidth = _this.h.windowWidth();
            var windowHeight = _this.h.windowHeight();
            var swiperCoord = [
                [swiperOffset.left, swiperOffset.top],
                [swiperOffset.left + _this.width, swiperOffset.top],
                [swiperOffset.left, swiperOffset.top + _this.height],
                [swiperOffset.left + _this.width, swiperOffset.top + _this.height]
            ]
            for (var i=0; i<swiperCoord.length; i++) {
                var point = swiperCoord[i];
                if (
                    point[0]>=scrollLeft && point[0]<=scrollLeft+windowWidth &&
                    point[1]>=scrollTop && point[1]<=scrollTop+windowHeight
                ) {
                    inView = true;
                }

            }
            if (!inView) return;
        }
        if (isH) {
            if (kc==37 || kc==39) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
            if (kc == 39) _this.swipeNext();
            if (kc == 37) _this.swipePrev();
        }
        else {
            if (kc==38 || kc==40) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
            if (kc == 40) _this.swipeNext();
            if (kc == 38) _this.swipePrev();
        }
    }

    /*==========================================
        Mousewheel Control
    ============================================*/
    var lastScrollTime = (new Date()).getTime();
    function handleMousewheel (e) {
        var we = _this._wheelEvent;
        var delta = 0;
        
        //Opera & IE
        if (e.detail) delta = -e.detail;
        //WebKits
        else if (we == 'mousewheel') {
            if (isH) {
                if (Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX;
                else return;
            }
            else {
                if (Math.abs(e.wheelDeltaY)>Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY;
                else return;
            }
        }
        //Old FireFox
        else if (we == 'DOMMouseScroll') delta = -e.detail;
        //New FireFox
        else if (we == 'wheel') {
            if (isH) {
                if (Math.abs(e.deltaX)>Math.abs(e.deltaY)) delta = -e.deltaX;
                else return;
            }
            else {
                if (Math.abs(e.deltaY)>Math.abs(e.deltaX)) delta = -e.deltaY;
                else return;
            }
        }

        if (!params.freeMode) {
            if ((new Date()).getTime() - lastScrollTime > 60) {
                if(delta<0) _this.swipeNext();
                else _this.swipePrev();
            }
            lastScrollTime = (new Date()).getTime();    
            
        }
        else {
            //Freemode or scrollContainer:
            var position = _this.getWrapperTranslate() + delta;
            
            if (position > 0) position = 0;
            if (position < -maxWrapperPosition()) position = -maxWrapperPosition();
            
            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(position);
            _this.updateActiveSlide(position);

            // Return page scroll on edge positions
            if (position == 0 || position == -maxWrapperPosition()) return;
        }
        if (params.autoplay) _this.stopAutoplay(true);

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
        return false;
    }

    /*=========================
      Grab Cursor
      ===========================*/
    if (params.grabCursor) {
        var containerStyle = _this.container.style;
        containerStyle.cursor = 'move';
        containerStyle.cursor = 'grab';
        containerStyle.cursor = '-moz-grab';
        containerStyle.cursor = '-webkit-grab';
    }

    /*=========================
      Slides Events Handlers
      ===========================*/
    
    _this.allowSlideClick = true;
    function slideClick(event) {
        if (_this.allowSlideClick) {
            setClickedSlide(event);
            _this.fireCallback(params.onSlideClick, _this, event);
        }
    }
    
    function slideTouch(event) {
        setClickedSlide(event);
        _this.fireCallback(params.onSlideTouch, _this, event);
    }
    
    function setClickedSlide(event) {
        
        // IE 6-8 support
        if (!event.currentTarget) {
            var element = event.srcElement;
            do {
                if (element.className.indexOf(params.slideClass) > -1) {
                    break;
                }
            }
            while (element = element.parentNode);
            _this.clickedSlide = element;
        }
        else {
            _this.clickedSlide = event.currentTarget;
        }
        
        _this.clickedSlideIndex     = _this.slides.indexOf(_this.clickedSlide);
        _this.clickedSlideLoopIndex = _this.clickedSlideIndex - (_this.loopedSlides || 0);
    }
    
    _this.allowLinks = true;
    function preventClick(e) {
        if (!_this.allowLinks) {
            if(e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return false;
        }
    }
    function releaseForms(e) {
        if (e.stopPropagation) e.stopPropagation();
        else e.returnValue = false;
        return false;
        
    }

    /*==================================================
        Event Handlers
    ====================================================*/
    var isTouchEvent = false;
    var allowThresholdMove;
    var allowMomentumBounce = true;
    function onTouchStart(event) {
        if (params.preventLinks) _this.allowLinks = true;
        //Exit if slider is already was touched
        if (_this.isTouched || params.onlyExternal) {
            return false;
        }

        if (params.noSwiping && (event.target || event.srcElement) && noSwipingSlide(event.target || event.srcElement)) return false;
        allowMomentumBounce = false;

        //Check For Nested Swipers
        _this.isTouched = true;
        isTouchEvent = event.type=='touchstart';

        if (!isTouchEvent || event.targetTouches.length == 1 ) {
            _this.callPlugins('onTouchStartBegin');

            if(!isTouchEvent) {
                if(event.preventDefault) event.preventDefault();
                else event.returnValue = false;
            }
            
            var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
            var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

            //Start Touches to check the scrolling
            _this.touches.startX = _this.touches.currentX = pageX;
            _this.touches.startY = _this.touches.currentY = pageY;

            _this.touches.start = _this.touches.current = isH ? pageX : pageY;

            //Set Transition Time to 0
            _this.setWrapperTransition(0);

            //Get Start Translate Position
            _this.positions.start = _this.positions.current = _this.getWrapperTranslate();

            //Set Transform
            _this.setWrapperTranslate(_this.positions.start);

            //TouchStartTime
            _this.times.start = (new Date()).getTime();

            //Unset Scrolling
            isScrolling = undefined;

            //Set Treshold
            if (params.moveStartThreshold>0) allowThresholdMove = false;

            //CallBack
            if (params.onTouchStart) _this.fireCallback(params.onTouchStart, _this);
            _this.callPlugins('onTouchStartEnd');

        }
    }
    var velocityPrevPosition, velocityPrevTime;
    function onTouchMove(event) {
        // If slider is not touched - exit
        if (!_this.isTouched || params.onlyExternal) return;
        if (isTouchEvent && event.type=='mousemove') return;

        var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
        var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

        //check for scrolling
        if ( typeof isScrolling === 'undefined' && isH) {
          isScrolling = !!( isScrolling || Math.abs(pageY - _this.touches.startY) > Math.abs( pageX - _this.touches.startX ) );
        }
        if ( typeof isScrolling === 'undefined' && !isH) {
          isScrolling = !!( isScrolling || Math.abs(pageY - _this.touches.startY) < Math.abs( pageX - _this.touches.startX ) );
        }
        if (isScrolling ) {
            _this.isTouched = false;
            return;
        }

        //Check For Nested Swipers
        if (event.assignedToSwiper) {
            _this.isTouched = false;
            return;
        }
        event.assignedToSwiper = true;

        //Block inner links
        if (params.preventLinks) {
            _this.allowLinks = false;
        }
        if (params.onSlideClick) {
            _this.allowSlideClick = false;
        }

        //Stop AutoPlay if exist
        if (params.autoplay) {
            _this.stopAutoplay(true);
        }
        if (!isTouchEvent || event.touches.length == 1) {

            //Moved Flag
            if (!_this.isMoved) {
                _this.callPlugins('onTouchMoveStart');
                
                if (params.loop) {
                    _this.fixLoop();
                    _this.positions.start = _this.getWrapperTranslate();
                }
                if (params.onTouchMoveStart) _this.fireCallback(params.onTouchMoveStart, _this);
            }
            _this.isMoved = true;
            
            // cancel event
            if(event.preventDefault) event.preventDefault();
            else event.returnValue = false;

            _this.touches.current = isH ? pageX : pageY ;

            _this.positions.current = (_this.touches.current - _this.touches.start) * params.touchRatio + _this.positions.start;

            //Resistance Callbacks
            if(_this.positions.current > 0 && params.onResistanceBefore) {
                _this.fireCallback(params.onResistanceBefore, _this, _this.positions.current);
            }
            if(_this.positions.current < -maxWrapperPosition() && params.onResistanceAfter) {
                _this.fireCallback(params.onResistanceAfter, _this, Math.abs(_this.positions.current + maxWrapperPosition()));
            }
            //Resistance
            if (params.resistance && params.resistance!='100%') {
                //Resistance for Negative-Back sliding
                if(_this.positions.current > 0) {
                    var resistance = 1 - _this.positions.current/containerSize/2;
                    if (resistance < 0.5)
                        _this.positions.current = (containerSize/2);
                    else
                        _this.positions.current = _this.positions.current * resistance;
                }
                //Resistance for After-End Sliding
                if ( _this.positions.current < -maxWrapperPosition() ) {

                    var diff = (_this.touches.current - _this.touches.start)*params.touchRatio + (maxWrapperPosition()+_this.positions.start);
                    var resistance = (containerSize+diff)/(containerSize);
                    var newPos = _this.positions.current-diff*(1-resistance)/2;
                    var stopPos = -maxWrapperPosition() - containerSize/2;

                    if (newPos < stopPos || resistance<=0)
                        _this.positions.current = stopPos;
                    else
                        _this.positions.current = newPos;
                }
            }
            if (params.resistance && params.resistance=='100%') {
                //Resistance for Negative-Back sliding
                if(_this.positions.current > 0 && !(params.freeMode&&!params.freeModeFluid)) {
                    _this.positions.current = 0;
                }
                //Resistance for After-End Sliding
                if ( (_this.positions.current) < -maxWrapperPosition() && !(params.freeMode&&!params.freeModeFluid)) {
                    _this.positions.current = -maxWrapperPosition();
                }
            }
            //Move Slides
            if (!params.followFinger) return;

            if (!params.moveStartThreshold) {
                _this.setWrapperTranslate(_this.positions.current);
            }
            else {
                if ( Math.abs(_this.touches.current - _this.touches.start)>params.moveStartThreshold || allowThresholdMove) {
                    allowThresholdMove = true;
                    _this.setWrapperTranslate(_this.positions.current);
                }
                else {
                    _this.positions.current = _this.positions.start;
                }
            }

            if (params.freeMode || params.watchActiveIndex) {
                _this.updateActiveSlide(_this.positions.current);
            }

            //Grab Cursor
            if (params.grabCursor) {
                _this.container.style.cursor = 'move';
                _this.container.style.cursor = 'grabbing';
                _this.container.style.cursor = '-moz-grabbin';
                _this.container.style.cursor = '-webkit-grabbing';
            }
            //Velocity
            if (!velocityPrevPosition) velocityPrevPosition = _this.touches.current;
            if (!velocityPrevTime) velocityPrevTime = (new Date).getTime();
            _this.velocity = (_this.touches.current - velocityPrevPosition)/((new Date).getTime() - velocityPrevTime)/2;
            if (Math.abs(_this.touches.current - velocityPrevPosition)<2) _this.velocity=0;
            velocityPrevPosition = _this.touches.current;
            velocityPrevTime = (new Date).getTime();
            //Callbacks
            _this.callPlugins('onTouchMoveEnd');
            if (params.onTouchMove) _this.fireCallback(params.onTouchMove, _this);

            return false;
        }
    }
    function onTouchEnd(event) {
        //Check For scrolling
        if (isScrolling) {
            _this.swipeReset();
        }
        // If slider is not touched exit
        if ( params.onlyExternal || !_this.isTouched ) return;
        _this.isTouched = false

        //Return Grab Cursor
        if (params.grabCursor) {
            _this.container.style.cursor = 'move';
            _this.container.style.cursor = 'grab';
            _this.container.style.cursor = '-moz-grab';
            _this.container.style.cursor = '-webkit-grab';
        }

        //Check for Current Position
        if (!_this.positions.current && _this.positions.current!==0) {
            _this.positions.current = _this.positions.start
        }

        //For case if slider touched but not moved
        if (params.followFinger) {
            _this.setWrapperTranslate(_this.positions.current);
        }

        // TouchEndTime
        _this.times.end = (new Date()).getTime();

        //Difference
        _this.touches.diff = _this.touches.current - _this.touches.start
        _this.touches.abs = Math.abs(_this.touches.diff)

        _this.positions.diff = _this.positions.current - _this.positions.start
        _this.positions.abs = Math.abs(_this.positions.diff)

        var diff = _this.positions.diff ;
        var diffAbs =_this.positions.abs ;
        var timeDiff = _this.times.end - _this.times.start

        if(diffAbs < 5 && (timeDiff) < 300 && _this.allowLinks == false) {
            if (!params.freeMode && diffAbs!=0) _this.swipeReset()
            //Release inner links
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }
        
        setTimeout(function () {
            //Release inner links
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }, 100);

        var maxPosition = maxWrapperPosition();

        //Not moved or Prevent Negative Back Sliding/After-End Sliding
        if (!_this.isMoved && params.freeMode) {
            _this.isMoved = false;
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this);
            _this.callPlugins('onTouchEnd');
            return;   
        }
        if (!_this.isMoved || _this.positions.current > 0 || _this.positions.current < -maxPosition) {
            _this.swipeReset();
            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this);
            _this.callPlugins('onTouchEnd');
            return;
        }

        _this.isMoved = false;

        //Free Mode
        if (params.freeMode) {
            if ( params.freeModeFluid ) {
                var momentumDuration = 1000*params.momentumRatio;
                var momentumDistance = _this.velocity*momentumDuration;
                var newPosition = _this.positions.current + momentumDistance
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs( _this.velocity )*20*params.momentumBounceRatio;
                if (newPosition < -maxPosition) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition + maxPosition < -bounceAmount) newPosition = -maxPosition-bounceAmount;
                        afterBouncePosition = -maxPosition;
                        doBounce=true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = -maxPosition;
                }
                if (newPosition > 0) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition>bounceAmount) newPosition = bounceAmount;
                        afterBouncePosition = 0
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = 0;
                }
                //Fix duration
                if (_this.velocity!=0) momentumDuration = Math.abs((newPosition - _this.positions.current)/_this.velocity)

                _this.setWrapperTranslate(newPosition);

                _this.setWrapperTransition( momentumDuration );

                if (params.momentumBounce && doBounce) {
                    _this.wrapperTransitionEnd(function () {
                        if (!allowMomentumBounce) return;
                        if (params.onMomentumBounce) _this.fireCallback(params.onMomentumBounce, _this);
                        _this.callPlugins('onMomentumBounce');
                        
                        _this.setWrapperTranslate(afterBouncePosition);
                        _this.setWrapperTransition(300);
                    })
                }

                _this.updateActiveSlide(newPosition)
            }
            if (!params.freeModeFluid || timeDiff >= 300) _this.updateActiveSlide(_this.positions.current)

            if (params.onTouchEnd) _this.fireCallback(params.onTouchEnd, _this);
            _this.callPlugins('onTouchEnd');
            return;
        }

        //Direction
        direction = diff < 0 ? "toNext" : "toPrev"

        //Short Touches
        if (direction=="toNext" && ( timeDiff <= 300 ) ) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset()
            else _this.swipeNext(true);
        }

        if (direction=="toPrev" && ( timeDiff <= 300 ) ) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset()
            else _this.swipePrev(true);
        }

        //Long Touches
        var targetSlideSize = 0;
        if(params.slidesPerView == 'auto') {
            //Define current slide's width
            var currentPosition = Math.abs(_this.getWrapperTranslate());
            var slidesOffset = 0;
            var _slideSize;
            for (var i=0; i<_this.slides.length; i++) {
                _slideSize = isH ? _this.slides[i].getWidth(true) : _this.slides[i].getHeight(true);
                slidesOffset+= _slideSize;
                if (slidesOffset>currentPosition) {
                    targetSlideSize = _slideSize;
                    break;
                }
            }
            if (targetSlideSize>containerSize) targetSlideSize = containerSize;
        }
        else {
            targetSlideSize = slideSize * params.slidesPerView;
        }
        if (direction=="toNext" && ( timeDiff > 300 ) ) {
            if (diffAbs >= targetSlideSize*0.5) {
                _this.swipeNext(true)
            }
            else {
                _this.swipeReset()
            }
        }
        if (direction=="toPrev" && ( timeDiff > 300 ) ) {
            if (diffAbs >= targetSlideSize*0.5) {
                _this.swipePrev(true);
            }
            else {
                _this.swipeReset()
            }
        }
        if (params.onTouchEnd) params.onTouchEnd(_this)
        _this.callPlugins('onTouchEnd');
    }


    /*==================================================
        noSwiping Bubble Check by Isaac Strack
    ====================================================*/
    function noSwipingSlide(el){
        /*This function is specifically designed to check the parent elements for the noSwiping class, up to the wrapper.
        We need to check parents because while onTouchStart bubbles, _this.isTouched is checked in onTouchStart, which stops the bubbling.
        So, if a text box, for example, is the initial target, and the parent slide container has the noSwiping class, the _this.isTouched
        check will never find it, and what was supposed to be noSwiping is able to be swiped.
        This function will iterate up and check for the noSwiping class in parents, up through the wrapperClass.*/

        // First we create a truthy variable, which is that swiping is allowd (noSwiping = false)
        var noSwiping = false;
    
        // Now we iterate up (parentElements) until we reach the node with the wrapperClass.
        do{

            // Each time, we check to see if there's a 'swiper-no-swiping' class (noSwipingClass).
            if (el.className.indexOf(params.noSwipingClass)>-1)
            {
                noSwiping = true; // If there is, we set noSwiping = true;
            }

            el = el.parentElement;  // now we iterate up (parent node)

        } while(!noSwiping && el.parentElement && el.className.indexOf(params.wrapperClass)==-1); // also include el.parentElement truthy, just in case.

        // because we didn't check the wrapper itself, we do so now, if noSwiping is false:
        if (!noSwiping && el.className.indexOf(params.wrapperClass)>-1 && el.className.indexOf(params.noSwipingClass)>-1)
            noSwiping = true; // if the wrapper has the noSwipingClass, we set noSwiping = true;

        return noSwiping;
    }

    /*==================================================
        Swipe Functions
    ====================================================*/
    _this.swipeNext = function(internal){
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins('onSwipeNext');
        var currentPosition = _this.getWrapperTranslate();
        var newPosition = currentPosition;
        if (params.slidesPerView=='auto') {
            for (var i=0; i<_this.snapGrid.length; i++) {
                if (-currentPosition >= _this.snapGrid[i] && -currentPosition<_this.snapGrid[i+1]) {
                    newPosition = -_this.snapGrid[i+1]
                    break;
                }
            }
        }
        else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.floor(Math.abs(currentPosition)/Math.floor(groupSize))*groupSize + groupSize);
        }
        if (newPosition < - maxWrapperPosition()) {
            newPosition = - maxWrapperPosition()
        };
        if (newPosition == currentPosition) return false;
        swipeToPosition(newPosition, 'next');
        return true
    }
    _this.swipePrev = function(internal){
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins('onSwipePrev');

        var currentPosition = Math.ceil(_this.getWrapperTranslate());
        var newPosition;
        if (params.slidesPerView=='auto') {
            newPosition = 0;
            for (var i=1; i<_this.snapGrid.length; i++) {
                if (-currentPosition == _this.snapGrid[i]) {
                    newPosition = -_this.snapGrid[i-1]
                    break;
                }
                if (-currentPosition > _this.snapGrid[i] && -currentPosition<_this.snapGrid[i+1]) {
                    newPosition = -_this.snapGrid[i]
                    break;
                }
            }
        }
        else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.ceil(-currentPosition/groupSize)-1)*groupSize;
        }

        if (newPosition > 0) newPosition = 0;

        if (newPosition == currentPosition) return false;
        swipeToPosition(newPosition, 'prev');
        return true;

    }
    _this.swipeReset = function(){
        _this.callPlugins('onSwipeReset');
        var currentPosition = _this.getWrapperTranslate();
        var groupSize = slideSize * params.slidesPerGroup;
        var newPosition;
        var maxPosition = -maxWrapperPosition();
        if (params.slidesPerView=='auto') {
            newPosition = 0;
            for (var i=0; i<_this.snapGrid.length; i++) {
                if (-currentPosition===_this.snapGrid[i]) return;
                if (-currentPosition >= _this.snapGrid[i] && -currentPosition<_this.snapGrid[i+1]) {
                    if(_this.positions.diff>0) newPosition = -_this.snapGrid[i+1]
                    else newPosition = -_this.snapGrid[i]
                    break;
                }
            }
            if (-currentPosition >= _this.snapGrid[_this.snapGrid.length-1]) newPosition = -_this.snapGrid[_this.snapGrid.length-1];
            if (currentPosition <= -maxWrapperPosition()) newPosition = -maxWrapperPosition()
        }
        else {
            newPosition = currentPosition<0 ? Math.round(currentPosition/groupSize)*groupSize : 0
        }
        if (params.scrollContainer)  {
            newPosition = currentPosition<0 ? currentPosition : 0;
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition()
        }
        if (params.scrollContainer && (containerSize>slideSize)) {
            newPosition = 0;
        }

        if (newPosition == currentPosition) return false;

        swipeToPosition(newPosition, 'reset');
        return true;
    }
    
    _this.swipeTo = function(index, speed, runCallbacks) {
        index = parseInt(index, 10);
        _this.callPlugins('onSwipeTo', {index:index, speed:speed});
        if (params.loop) index = index + _this.loopedSlides;
        var currentPosition = _this.getWrapperTranslate();
        if (index > (_this.slides.length-1) || index < 0) return;
        var newPosition
        if (params.slidesPerView=='auto') {
            newPosition = -_this.slidesGrid[ index ];
        }
        else {
            newPosition =  -index*slideSize;
        }
        if (newPosition < - maxWrapperPosition()) {
            newPosition = - maxWrapperPosition();
        };

        if (newPosition == currentPosition) return false;

        runCallbacks = runCallbacks===false ? false : true;
        swipeToPosition(newPosition, 'to', {index:index, speed:speed, runCallbacks:runCallbacks});
        return true;
    }
    
    function swipeToPosition(newPosition, action, toOptions) {
        var speed = (action=='to' && toOptions.speed >= 0) ? toOptions.speed : params.speed;
        
        if (_this.support.transitions || !params.DOMAnimation) {
            _this.setWrapperTranslate(newPosition);
            _this.setWrapperTransition(speed);
        }
        else {
            //Try the DOM animation
            var currentPosition = _this.getWrapperTranslate();
            var animationStep = Math.ceil( (newPosition - currentPosition)/speed*(1000/60) );
            var direction = currentPosition > newPosition ? 'toNext' : 'toPrev';
            var condition = direction=='toNext' ? currentPosition > newPosition : currentPosition < newPosition;
            if (_this._DOMAnimating) return;

            anim();
        }
        function anim(){
            currentPosition += animationStep;
            condition = direction=='toNext' ? currentPosition > newPosition : currentPosition < newPosition;
            if (condition) {
                _this.setWrapperTranslate(Math.round(currentPosition));
                _this._DOMAnimating = true
                window.setTimeout(function(){
                    anim()
                }, 1000 / 60)
            }
            else {
                if (params.onSlideChangeEnd) _this.fireCallback(params.onSlideChangeEnd, _this);
                _this.setWrapperTranslate(newPosition);
                _this._DOMAnimating = false;
            }
        }

        //Update Active Slide Index
        _this.updateActiveSlide(newPosition);

        //Callbacks
        if (params.onSlideNext && action=='next') {
            _this.fireCallback(params.onSlideNext, _this, newPosition);
        }
        if (params.onSlidePrev && action=='prev') {
            _this.fireCallback(params.onSlidePrev, _this, newPosition);
        }
        //"Reset" Callback
        if (params.onSlideReset && action=='reset') {
            _this.fireCallback(params.onSlideReset, _this, newPosition);
        }

        //"Next", "Prev" and "To" Callbacks
        if (action=='next' || action=='prev' || (action=='to' && toOptions.runCallbacks==true))
            slideChangeCallbacks(action);
    }
    /*==================================================
        Transition Callbacks
    ====================================================*/
    //Prevent Multiple Callbacks
    _this._queueStartCallbacks = false;
    _this._queueEndCallbacks = false;
    function slideChangeCallbacks(direction) {
        //Transition Start Callback
        _this.callPlugins('onSlideChangeStart');
        if (params.onSlideChangeStart) {
            if (params.queueStartCallbacks && _this.support.transitions) {
                if (_this._queueStartCallbacks) return;
                _this._queueStartCallbacks = true;
                _this.fireCallback(params.onSlideChangeStart, _this, direction)
                _this.wrapperTransitionEnd(function(){
                    _this._queueStartCallbacks = false;
                })
            }
            else _this.fireCallback(params.onSlideChangeStart, _this, direction)
        }
        //Transition End Callback
        if (params.onSlideChangeEnd) {
            if (_this.support.transitions) {
                if (params.queueEndCallbacks) {
                    if (_this._queueEndCallbacks) return;
                    _this._queueEndCallbacks = true;
                    _this.wrapperTransitionEnd(function(swiper){_this.fireCallback(params.onSlideChangeEnd, swiper, direction)})
                }
                else _this.wrapperTransitionEnd(function(swiper){_this.fireCallback(params.onSlideChangeEnd, swiper, direction)})
            }
            else {
                if (!params.DOMAnimation) {
                    setTimeout(function(){
                        _this.fireCallback(params.onSlideChangeStart, _this, direction)
                    },10)
                }
            }
        }
    }
    
    /*==================================================
        Update Active Slide Index
    ====================================================*/
    _this.updateActiveSlide = function(position) {
        if (!_this.initialized) return;
        if (_this.slides.length==0) return;
        _this.previousIndex = _this.activeIndex;
        if (typeof position=='undefined') position = _this.getWrapperTranslate();
        if (position>0) position=0;
        
        if (params.slidesPerView == 'auto') {
            var slidesOffset = 0;
            _this.activeIndex = _this.slidesGrid.indexOf(-position);
            if (_this.activeIndex<0) {
                for (var i=0; i<_this.slidesGrid.length-1; i++) {
                    if (-position>_this.slidesGrid[i] && -position<_this.slidesGrid[i+1]) {
                        break;
                    }
                }
                var leftDistance = Math.abs( _this.slidesGrid[i] + position )
                var rightDistance = Math.abs( _this.slidesGrid[i+1] + position )
                if (leftDistance<=rightDistance) _this.activeIndex = i;
                else _this.activeIndex = i+1;
            }
        }
        else {
            _this.activeIndex = Math[params.visibilityFullFit ? 'ceil' : 'round']( -position/slideSize );
        }
        
        if (_this.activeIndex == _this.slides.length ) _this.activeIndex = _this.slides.length - 1;
        if (_this.activeIndex < 0) _this.activeIndex = 0;
        
        // Check for slide
        if (!_this.slides[_this.activeIndex]) return;
        
        // Calc Visible slides
        _this.calcVisibleSlides(position);

        // Mark visible and active slides with additonal classes
        var activeClassRegexp = new RegExp( "\\s*" + params.slideActiveClass );
        var inViewClassRegexp = new RegExp( "\\s*" + params.slideVisibleClass );

        for (var i = 0; i < _this.slides.length; i++) {
            _this.slides[ i ].className = _this.slides[ i ].className.replace( activeClassRegexp, '' ).replace( inViewClassRegexp, '' );
            if ( _this.visibleSlides.indexOf( _this.slides[ i ] )>=0 ) {
                _this.slides[ i ].className += ' ' + params.slideVisibleClass;
            }

        }
        _this.slides[ _this.activeIndex ].className += ' ' + params.slideActiveClass;

        //Update loop index
        if (params.loop) {
            var ls = _this.loopedSlides;
            _this.activeLoopIndex = _this.activeIndex - ls;
            if (_this.activeLoopIndex >= _this.slides.length - ls*2 ) {
                _this.activeLoopIndex = _this.slides.length - ls*2 - _this.activeLoopIndex;
            }
            if (_this.activeLoopIndex<0) {
                _this.activeLoopIndex = _this.slides.length - ls*2 + _this.activeLoopIndex;
            }
        }
        else {
            _this.activeLoopIndex = _this.activeIndex;
        }
        //Update Pagination
        if (params.pagination) {
            _this.updatePagination(position);
        }
    }
    /*==================================================
        Pagination
    ====================================================*/
    _this.createPagination = function (firstInit) {
        if (params.paginationClickable && _this.paginationButtons) {
            removePaginationEvents();
        }
        _this.paginationContainer = params.pagination.nodeType ? params.pagination : $$(params.pagination)[0];
        if (params.createPagination) {
            var paginationHTML = "";
            var numOfSlides = _this.slides.length;
            var numOfButtons = numOfSlides;
            if (params.loop) numOfButtons -= _this.loopedSlides*2
            for (var i = 0; i < numOfButtons; i++) {
                paginationHTML += '<'+params.paginationElement+' class="'+params.paginationElementClass+'"></'+params.paginationElement+'>'
            }
            _this.paginationContainer.innerHTML = paginationHTML;    
        }
        _this.paginationButtons = $$('.'+params.paginationElementClass, _this.paginationContainer);
        if (!firstInit) _this.updatePagination()
        _this.callPlugins('onCreatePagination');
        if (params.paginationClickable) {
            addPaginationEvents();
        }
    }
    function removePaginationEvents() {
        var pagers = _this.paginationButtons;
        for (var i=0; i<pagers.length; i++) {
            _this.h.removeEventListener(pagers[i], 'click', paginationClick);
        }
    }
    function addPaginationEvents() {
        var pagers = _this.paginationButtons;
        for (var i=0; i<pagers.length; i++) {
            _this.h.addEventListener(pagers[i], 'click', paginationClick);
        }
    }
    function paginationClick(e){
        var index;
        var target = e.target || e.srcElement;
        var pagers = _this.paginationButtons;
        for (var i=0; i<pagers.length; i++) {
            if (target===pagers[i]) index = i;
        }
        _this.swipeTo(index)
    }
    _this.updatePagination = function(position) {
        if (!params.pagination) return;
        if (_this.slides.length<1) return;
        var activePagers = $$('.'+params.paginationActiveClass, _this.paginationContainer);
        if(!activePagers) return;

        //Reset all Buttons' class to not active
        var pagers = _this.paginationButtons;
        if (pagers.length==0) return;
        for (var i=0; i < pagers.length; i++) {
            pagers[i].className = params.paginationElementClass
        }

        var indexOffset = params.loop ? _this.loopedSlides : 0;
        if (params.paginationAsRange) {
            if (!_this.visibleSlides) _this.calcVisibleSlides(position)
            //Get Visible Indexes
            var visibleIndexes = [];
            for (var i = 0; i < _this.visibleSlides.length; i++) {
                var visIndex = _this.slides.indexOf( _this.visibleSlides[i] ) - indexOffset

                if (params.loop && visIndex<0) {
                    visIndex = _this.slides.length - _this.loopedSlides*2 + visIndex;
                }
                if (params.loop && visIndex>=_this.slides.length-_this.loopedSlides*2) {
                    visIndex = _this.slides.length - _this.loopedSlides*2 - visIndex;
                    visIndex = Math.abs(visIndex)
                }
                visibleIndexes.push( visIndex )
            }
            
            for (i=0; i<visibleIndexes.length; i++) {
                if (pagers[ visibleIndexes[i] ]) pagers[ visibleIndexes[i] ].className += ' ' + params.paginationVisibleClass;
            }
            
            if (params.loop) {
                pagers[ _this.activeLoopIndex ].className += ' ' + params.paginationActiveClass;
            }
            else {
                pagers[ _this.activeIndex ].className += ' ' + params.paginationActiveClass;
            }
            
        }
        else {
            if (params.loop) {
                pagers[ _this.activeLoopIndex ].className+=' '+params.paginationActiveClass+' '+params.paginationVisibleClass;
            }
            else {
                pagers[ _this.activeIndex ].className+=' '+params.paginationActiveClass+' '+params.paginationVisibleClass;
            }

        }

    }
    _this.calcVisibleSlides = function(position){
        var visibleSlides = [];
        var _slideLeft = 0, _slideSize = 0, _slideRight = 0;
        if (isH && _this.wrapperLeft>0) position = position+_this.wrapperLeft;
        if (!isH && _this.wrapperTop>0) position = position+_this.wrapperTop;

        for (var i=0; i<_this.slides.length; i++) {
            _slideLeft += _slideSize;
            if (params.slidesPerView == 'auto')
                _slideSize  = isH ? _this.h.getWidth(_this.slides[i],true) : _this.h.getHeight(_this.slides[i],true);
            else _slideSize = slideSize;

            _slideRight = _slideLeft + _slideSize;
            var isVisibile = false;
            if (params.visibilityFullFit) {
                if (_slideLeft >= -position && _slideRight <= -position+containerSize) isVisibile = true;
                if (_slideLeft <= -position && _slideRight >= -position+containerSize) isVisibile = true;
            }
            else {

                if (_slideRight > -position && _slideRight <= ((-position+containerSize))) isVisibile = true;
                if (_slideLeft >= -position && _slideLeft < ((-position+containerSize))) isVisibile = true;
                if (_slideLeft < -position && _slideRight > ((-position+containerSize))) isVisibile = true;
            }

            if (isVisibile) visibleSlides.push(_this.slides[i])

        }
        if (visibleSlides.length==0) visibleSlides = [ _this.slides[ _this.activeIndex ] ]

        _this.visibleSlides = visibleSlides;
    }

    /*==========================================
        Autoplay
    ============================================*/
    var autoplayTimeoutId = undefined;
    _this.startAutoplay = function () {
        if (typeof autoplayTimeoutId !== 'undefined') return false;
        if (!params.autoplay) return;
        _this.callPlugins('onAutoplayStart');
        autoplay();
    }
    _this.stopAutoplay = function (internal) {
        if (autoplayTimeoutId) clearTimeout(autoplayTimeoutId);
        autoplayTimeoutId = undefined;
        if (internal && !params.autoplayDisableOnInteraction) {
            _this.wrapperTransitionEnd(function(){
                autoplay();
            })
        }
        _this.callPlugins('onAutoplayStop');
    }
    function autoplay(){
        autoplayTimeoutId = setTimeout(function(){
            if(params.loop) {
                _this.fixLoop();
                _this.swipeNext(true);
            }
            else if (!_this.swipeNext(true)) _this.swipeTo(0);
            _this.wrapperTransitionEnd(function(){
                if (typeof autoplayTimeoutId !== 'undefined') autoplay();
            })
        },params.autoplay)
    }
    /*==================================================
        Loop
    ====================================================*/
    _this.loopCreated = false;
    _this.removeLoopedSlides = function(){
        if (_this.loopCreated) {
            for (var i=0; i<_this.slides.length; i++) {
                if (_this.slides[i].getData('looped')===true) _this.wrapper.removeChild(_this.slides[i]);
            }
        }
    }
    
    _this.createLoop = function() {
        if (_this.slides.length==0) return;
        if (params.slidesPerView=='auto') {
            _this.loopedSlides = params.loopedSlides||1;
        }
        else {
            _this.loopedSlides = params.slidesPerView + params.loopAdditionalSlides;    
        }
        
        if (_this.loopedSlides > _this.slides.length) {
            _this.loopedSlides = _this.slides.length;
        }
        
        var slideFirstHTML = '',
            slideLastHTML = '',
            i;
        var slidesSetFullHTML = '';
        /**
                loopedSlides is too large if loopAdditionalSlides are set.
                Need to divide the slides by maximum number of slides existing.
                
                @author        Tomaz Lovrec <tomaz.lovrec@blanc-noir.at>
        */
        var numSlides = _this.slides.length;
        var fullSlideSets = Math.floor(_this.loopedSlides / numSlides);
        var remainderSlides = _this.loopedSlides % numSlides;
        // assemble full sets of slides
        for (i = 0; i<(fullSlideSets*numSlides);i++) {
                var j = i;
                if (i >= numSlides) {
                        var over = Math.floor(i / numSlides);
                        j = i - (numSlides * over);
                }
                slidesSetFullHTML+=_this.slides[j].outerHTML;
        }
        // assemble remainder slides
        // assemble remainder appended to existing slides
        for(i = 0;i<remainderSlides;i++) {
                slideLastHTML+=_this.slides[i].outerHTML;
        }
        // assemble slides that get preppended to existing slides
        for(i = numSlides - remainderSlides;i<numSlides;i++) {
                slideFirstHTML+=_this.slides[i].outerHTML;
        }
        // assemble all slides
        var slides = slideFirstHTML + slidesSetFullHTML + wrapper.innerHTML + slidesSetFullHTML + slideLastHTML;
        // set the slides
        wrapper.innerHTML = slides;

        _this.loopCreated = true;
        _this.calcSlides();

        //Update Looped Slides with special class
        for (i=0; i<_this.slides.length; i++) {
            if (i<_this.loopedSlides || i>=_this.slides.length-_this.loopedSlides) _this.slides[i].setData('looped', true);
        }
        _this.callPlugins('onCreateLoop');

    }
    
    _this.fixLoop = function() {
        var newIndex;
        //Fix For Negative Oversliding
        if (_this.activeIndex < _this.loopedSlides) {
            newIndex = _this.slides.length - _this.loopedSlides*3 + _this.activeIndex;
            _this.swipeTo(newIndex, 0, false);
        }
        //Fix For Positive Oversliding
        else if (_this.activeIndex > _this.slides.length - params.slidesPerView*2) {
            newIndex = -_this.slides.length + _this.activeIndex + _this.loopedSlides
            _this.swipeTo(newIndex, 0, false);
        }
    }
    
    /*==================================================
        Slides Loader
    ====================================================*/
    _this.loadSlides = function(){
        var slidesHTML = '';
        _this.activeLoaderIndex = 0;
        var slides = params.loader.slides;
        var slidesToLoad = params.loader.loadAllSlides ? slides.length : params.slidesPerView*(1+params.loader.surroundGroups);
        for (var i=0; i< slidesToLoad; i++) {
            if (params.loader.slidesHTMLType=='outer') slidesHTML+=slides[i];
            else {
                slidesHTML+='<'+params.slideElement+' class="'+params.slideClass+'" data-swiperindex="'+i+'">'+slides[i]+'</'+params.slideElement+'>';
            }
        }
        _this.wrapper.innerHTML = slidesHTML;
        _this.calcSlides(true);
        //Add permanent transitionEnd callback
        if (!params.loader.loadAllSlides) {
            _this.wrapperTransitionEnd(_this.reloadSlides, true);
        }
    }
    
    _this.reloadSlides = function(){
        var slides = params.loader.slides;
        var newActiveIndex = parseInt(_this.activeSlide().data('swiperindex'),10)
        if (newActiveIndex<0 || newActiveIndex>slides.length-1) return //<-- Exit
        _this.activeLoaderIndex = newActiveIndex;
        var firstIndex = Math.max(0, newActiveIndex - params.slidesPerView*params.loader.surroundGroups)
        var lastIndex = Math.min(newActiveIndex+params.slidesPerView*(1+params.loader.surroundGroups)-1, slides.length-1)
        //Update Transforms
        if (newActiveIndex>0) {
            var newTransform = -slideSize*(newActiveIndex-firstIndex)
            _this.setWrapperTranslate(newTransform);
            _this.setWrapperTransition(0);
        }
        //New Slides
        if (params.loader.logic==='reload') {
            _this.wrapper.innerHTML = '';
            var slidesHTML = '';
            for (var i = firstIndex; i<=lastIndex; i++) {
                slidesHTML += params.loader.slidesHTMLType == 'outer' ? slides[i] : '<'+params.slideElement+' class="'+params.slideClass+'" data-swiperindex="'+i+'">'+slides[i]+'</'+params.slideElement+'>';
            }
            _this.wrapper.innerHTML = slidesHTML;
        }
        else {
            var minExistIndex=1000;
            var maxExistIndex=0;
            for (var i=0; i<_this.slides.length; i++) {
                var index = _this.slides[i].data('swiperindex');
                if (index<firstIndex || index>lastIndex) {
                    _this.wrapper.removeChild(_this.slides[i]);
                }
                else {
                    minExistIndex = Math.min(index, minExistIndex)
                    maxExistIndex = Math.max(index, maxExistIndex)
                }
            }
            for (var i=firstIndex; i<=lastIndex; i++) {
                if (i<minExistIndex) {
                    var newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute('data-swiperindex',i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.insertBefore(newSlide, _this.wrapper.firstChild);
                }
                if (i>maxExistIndex) {
                    var newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute('data-swiperindex',i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.appendChild(newSlide);
                }
            }
        }
        //reInit
        _this.reInit(true);
    }
    
    /*==================================================
        Make Swiper
    ====================================================*/
    function makeSwiper(){
        _this.calcSlides();
        if (params.loader.slides.length>0 && _this.slides.length==0) {
            _this.loadSlides();
        }
        if (params.loop) {
            _this.createLoop();
        }
        _this.init();
        initEvents();
        if (params.pagination) {
            _this.createPagination(true);
        }

        if (params.loop || params.initialSlide>0) {
            _this.swipeTo( params.initialSlide, 0, false );
        }
        else {
            _this.updateActiveSlide(0);
        }
        if (params.autoplay) {
            _this.startAutoplay();
        }
        /**
         * Set center slide index.
         * 
         * @author        Tomaz Lovrec <tomaz.lovrec@gmail.com> 
         */
        _this.centerIndex = _this.activeIndex;

        // Callbacks
        if (params.onSwiperCreated) _this.fireCallback(params.onSwiperCreated, _this);
        _this.callPlugins('onSwiperCreated');
    }
    
    makeSwiper();
}

Swiper.prototype = {
    plugins : {},
    
    /*==================================================
        Wrapper Operations
    ====================================================*/
    wrapperTransitionEnd : function(callback, permanent) {
        var a = this,
            el = a.wrapper,
            events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i;
        
        function fireCallBack() {
            callback(a);
            if (a.params.queueEndCallbacks) a._queueEndCallbacks = false;
            if (!permanent) {
                for (i=0; i<events.length; i++) {
                    a.h.removeEventListener(el, events[i], fireCallBack);
                }
            }
        }
        
        if (callback) {
            for (i=0; i<events.length; i++) {
                a.h.addEventListener(el, events[i], fireCallBack);
            }
        }
    },

    getWrapperTranslate : function (axis) {
        var el = this.wrapper,
            matrix, curTransform, curStyle, transformMatrix;
        
        // automatic axis detection
        if (typeof axis == 'undefined') {
            axis = this.params.mode == 'horizontal' ? 'x' : 'y';
        }
        
        if (this.support.transforms && this.params.useCSS3Transforms) {
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
                matrix = transformMatrix.toString().split(',');
            }
            
            if (axis=='x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length==16)
                    curTransform = parseFloat( matrix[12] );
                //Normal Browsers
                else
                    curTransform = parseFloat( matrix[4] );
            }
            if (axis=='y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length==16)
                    curTransform = parseFloat( matrix[13] );
                //Normal Browsers
                else
                    curTransform = parseFloat( matrix[5] );
            }
        }
        else {
            if (axis=='x') curTransform = parseFloat(el.style.left,10) || 0;
            if (axis=='y') curTransform = parseFloat(el.style.top,10) || 0;
        }
        return curTransform || 0;
    },

    setWrapperTranslate : function (x, y, z) {
        var es = this.wrapper.style,
            coords = {x: 0, y: 0, z: 0},
            translate;

        // passed all coordinates
        if (arguments.length == 3) {
            coords.x = x;
            coords.y = y;
            coords.z = z;
        }
        
        // passed one coordinate and optional axis
        else {
            if (typeof y == 'undefined') {
                y = this.params.mode == 'horizontal' ? 'x' : 'y';
            }
            coords[y] = x;
        }

        if (this.support.transforms && this.params.useCSS3Transforms) {
            translate = this.support.transforms3d ? 'translate3d(' + coords.x + 'px, ' + coords.y + 'px, ' + coords.z + 'px)' : 'translate(' + coords.x + 'px, ' + coords.y + 'px)';
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translate;
        }
        else {
            es.left = coords.x + 'px';
            es.top  = coords.y + 'px';
        }
        this.callPlugins('onSetWrapperTransform', coords);
        if (this.params.onSetWrapperTransform) this.fireCallback(this.params.onSetWrapperTransform, this, coords);
    },

    setWrapperTransition : function (duration) {
        var es = this.wrapper.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = (duration / 1000) + 's';
        this.callPlugins('onSetWrapperTransition', {duration: duration});
        if (this.params.onSetWrapperTransition) this.fireCallback(this.params.onSetWrapperTransition, this, duration);
        
    },

    /*==================================================
        Helpers
    ====================================================*/
    h : {
        getWidth: function (el, outer) {
            var width = window.getComputedStyle(el, null).getPropertyValue('width')
            var returnWidth = parseFloat(width);
            //IE Fixes
            if(isNaN(returnWidth) || width.indexOf('%')>0) {
                returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            }
            if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'))

            return returnWidth;
        },
        getHeight: function(el, outer) {
            if (outer) return el.offsetHeight;

            var height = window.getComputedStyle(el, null).getPropertyValue('height')
            var returnHeight = parseFloat(height);
            //IE Fixes
            if(isNaN(returnHeight) || height.indexOf('%')>0) {
                returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
            }
            if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'))
            return returnHeight;
        },
        getOffset: function(el) {
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop  = el.clientTop  || body.clientTop  || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop  = window.pageYOffset || el.scrollTop;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            if (document.documentElement && !window.pageYOffset) {
                //IE7-8
                scrollTop  = document.documentElement.scrollTop;
                scrollLeft = document.documentElement.scrollLeft;
            }
            return {
                top: box.top  + scrollTop  - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        },
        windowWidth : function() {
            if (window.innerWidth) return window.innerWidth
            else if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
        },
        windowHeight : function() {
            if (window.innerHeight) return window.innerHeight
            else if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
        },
        windowScroll : function() {
            var left=0, top=0;
            if (typeof pageYOffset != 'undefined') {
                return {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                }
            }
            else if (document.documentElement) {
                return {
                    left: document.documentElement.scrollLeft,
                    top: document.documentElement.scrollTop
                }
            }
        },

        addEventListener : function (el, event, listener, useCapture) {
            if (typeof useCapture == 'undefined') {
                useCapture = false;
            }
            
            if (el.addEventListener) {
                el.addEventListener(event, listener, useCapture);
            }
            else if (el.attachEvent) {
                el.attachEvent('on' + event, listener);
            }
        },
        
        removeEventListener : function (el, event, listener, useCapture) {
            if (typeof useCapture == 'undefined') {
                useCapture = false;
            }
            
            if (el.removeEventListener) {
                el.removeEventListener(event, listener, useCapture);
            }
            else if (el.detachEvent) {
                el.detachEvent('on' + event, listener);
            }
        }
    },
    setTransform : function (el, transform) {
        var es = el.style
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transform
    },
    setTranslate : function (el, translate) {
        var es = el.style
        var pos = {
            x : translate.x || 0,
            y : translate.y || 0,
            z : translate.z || 0
        };
        var transformString = this.support.transforms3d ? 'translate3d('+(pos.x)+'px,'+(pos.y)+'px,'+(pos.z)+'px)' : 'translate('+(pos.x)+'px,'+(pos.y)+'px)';
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
        if (!this.support.transforms) {
            es.left = pos.x+'px'
            es.top = pos.y+'px'
        }
    },
    setTransition : function (el, duration) {
        var es = el.style
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration+'ms';
    },
    /*==================================================
        Feature Detection
    ====================================================*/
    support: {

        touch : (window.Modernizr && Modernizr.touch===true) || (function() {
            return !!(("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),

        transforms3d : (window.Modernizr && Modernizr.csstransforms3d===true) || (function() {
            var div = document.createElement('div').style;
            return ("webkitPerspective" in div || "MozPerspective" in div || "OPerspective" in div || "MsPerspective" in div || "perspective" in div);
        })(),

        transforms : (window.Modernizr && Modernizr.csstransforms===true) || (function(){
            var div = document.createElement('div').style;
            return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
        })(),

        transitions : (window.Modernizr && Modernizr.csstransitions===true) || (function(){
            var div = document.createElement('div').style;
            return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
        })()
    },

    browser : {

        ie8 : (function(){
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat(RegExp.$1);
            }
            return rv != -1 && rv < 9;
        })(),

        ie10 : window.navigator.msPointerEnabled
    }
}

/*=========================
  jQuery & Zepto Plugins
  ===========================*/
if (window.jQuery||window.Zepto) {
    (function($){
        $.fn.swiper = function(params) {
            var s = new Swiper($(this)[0], params)
            $(this).data('swiper',s);
            return s;
        }
    })(window.jQuery||window.Zepto)
}

// component
if ( typeof( module ) !== 'undefined' )
{
    module.exports = Swiper;
}

/*
 * jQuery Approach 1.01
 * https://github.com/srobbin/jquery-approach/
 *
 * A plugin that lets you animate based on radial distance from an object.
 *
 * Copyright (c) 2009 Scott Robbin (srobbin.com)
 * Dual licensed under the MIT and GPL licenses.
 */
 
(function($) {
  
  $.fn.approach = function(styles, distance, callback) {
    var settings = {
          "interval" : 50,    // Used to throttle action on mousemove events
          "distance" : 400},  // Minimum distance in pixels within which we start to animate
        lastRun,              // When the proxanimation was last run
        elements = [];        // Holds the elements that we'll perform animations on
    
    // Extend the settings with those the user has provided
    if(distance) $.extend(settings, {"distance": distance});
    
    // Add the elements to our array
    this.each(function(i, obj) {
      // Save the style data we'll need for proxanimations
      var proxStyles = [],
          colorStyles = ['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'];
      
      $.each(styles, function(style, val) {
        var from, to, unit;
        
        // If the style is color-based and jQuery Effects Core is installed, let's animate...with color!
        if($.inArray(style, colorStyles) > -1 && $.fx.step[style]) {
          // Rut Roh
          from = {"number": getRGB($(obj).css(style))};
          to = {"number": getRGB(val)};
        } else if(style == "opacity" && !jQuery.support.opacity) {
          // We have to treat opacity differently, since IE stores it as a filter
          // Bug reported, and patch created, by Már Örlygsson (http://mar.eplica.is/ie-opacity-fixed.html)
          opacity = $(obj).css("filter").match(/opacity=(\d+)/) ? RegExp.$1/100 : "";
          opacity = opacity === "" ? "1" : opacity;
          from = getParts(opacity);
          to = getParts(val);
        } else {
          // Try to parse out units, etc (taken from jQuery animate)
          from = getParts($(obj).css(style)),
          to = getParts(val);
        }
					
        if(from && to) {
          // If a +=/-= token was provided, we're doing a relative animation (taken from jQuery animate)
          if ( to.relative )
            to.number = ((to.relative == "-=" ? -1 : 1) * to.number) + from.number;
          
          // Making an assumption that the units are the same for from/to. Bad assumption. TODO: Be more intelligent.
          unit = to.unit || "";
          proxStyles.push({
            "name": style,
            "from": from.number,
            "to": to.number,
            "unit": unit
          });
        }
      });
      $(obj).data("jquery-approach", proxStyles);
      elements.push(obj);
    });
    
    // Listen for the mousemove event
    $(document).bind("mousemove", function(e) {
      
      // Check for throttling
      var thisRun = new Date().getTime();
      if(thisRun - lastRun < settings.interval)
        return;
      
      lastRun = thisRun;

      // Loop through the elements, calculate the values (based on distance), then animate
      $.each(elements, function() {
          var self = this,
              center = getCenter(self),
              distance = parseInt(Math.sqrt(Math.pow(e.pageX-center.x,2) + Math.pow(e.pageY-center.y,2))),
              distanceRatio = (settings.distance - distance) / settings.distance,
              calcStyles = {};
           	          
          $.each($(self).data("jquery-approach"), function() {	        
            var style = this,
                calcVal,
                color; 
  
            // We have to calculate colors differently from dimension-based styles 	        
            if($.isArray(style.to)) {
              color = (distance > settings.distance) ? style.from : $.map(style.from, function(v, k) {
                return parseInt((distanceRatio * (style.to[k] - style.from[k])) + style.from[k]);
              });
            
              calcVal = "rgb(" + color.join(",") + ")";
            
            } else {
              calcVal = (distance > settings.distance) ? style.from : (distanceRatio * (style.to - style.from)) + style.from;
              calcVal += style.unit;
            }

            calcStyles[style.name] = calcVal;
            
          });

          $(self).animate(calcStyles, settings.interval - 1);
          
      });
        
    });

      // Get the center of the object
    function getCenter(obj) {
      var offset = $(obj).offset();
      return {
        x:offset.left+ ($(obj).width() / 2),
        y:offset.top + ($(obj).height() / 2)
      }
    };
    
    // Separate the string into parts (based on the parser in jQuery animate)
    function getParts(val) {
      var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
      relative, number, unit;
      
      if(parts) {
        relative = parts[1];
        number = parseFloat(parts[2]);
        unit = parts[3];
      }
      
      return {
        "relative": relative, // Is this += or -=
        "number": number, // The float value
        "unit": unit  // The units: px or em
      }
    };
    
    // Callback, if necessary
    if(callback) callback();
  
    // For chaining
    return this;
  };
  
  // From jQuery UI Effects Core (http://jqueryui.com/)
  // This will likely be unnecessary in jQuery UI 1.8, when these functions are unprivatized
  // http://dev.jqueryui.com/ticket/3806
  //
  // If file size is a concern, you can remove getRBG and getColor functions
  //
  // Parse strings looking for color tuples [255,255,255]
  function getRGB(color) {
  		var result;

  		// Check if we're already dealing with an array of colors
  		if ( color && color.constructor == Array && color.length == 3 )
  				return color;

  		// Look for rgb(num,num,num)
  		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
  				return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];

  		// Look for rgb(num%,num%,num%)
  		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
  				return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

  		// Look for #a0b1c2
  		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
  				return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

  		// Look for #fff
  		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
  				return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

  		// Look for rgba(0, 0, 0, 0) == transparent in Safari 3
  		if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
  				return colors['transparent'];

  		// Otherwise, we're most likely dealing with a named color
  		return colors[$.trim(color).toLowerCase()];
  };
  
  // Some named colors to work with
  // From Interface by Stefan Petre
  // http://interface.eyecon.ro/
  var colors = {
  	aqua:[0,255,255],
  	azure:[240,255,255],
  	beige:[245,245,220],
  	black:[0,0,0],
  	blue:[0,0,255],
  	brown:[165,42,42],
  	cyan:[0,255,255],
  	darkblue:[0,0,139],
  	darkcyan:[0,139,139],
  	darkgrey:[169,169,169],
  	darkgreen:[0,100,0],
  	darkkhaki:[189,183,107],
  	darkmagenta:[139,0,139],
  	darkolivegreen:[85,107,47],
  	darkorange:[255,140,0],
  	darkorchid:[153,50,204],
  	darkred:[139,0,0],
  	darksalmon:[233,150,122],
  	darkviolet:[148,0,211],
  	fuchsia:[255,0,255],
  	gold:[255,215,0],
  	green:[0,128,0],
  	indigo:[75,0,130],
  	khaki:[240,230,140],
  	lightblue:[173,216,230],
  	lightcyan:[224,255,255],
  	lightgreen:[144,238,144],
  	lightgrey:[211,211,211],
  	lightpink:[255,182,193],
  	lightyellow:[255,255,224],
  	lime:[0,255,0],
  	magenta:[255,0,255],
  	maroon:[128,0,0],
  	navy:[0,0,128],
  	olive:[128,128,0],
  	orange:[255,165,0],
  	pink:[255,192,203],
  	purple:[128,0,128],
  	violet:[128,0,128],
  	red:[255,0,0],
  	silver:[192,192,192],
  	white:[255,255,255],
  	yellow:[255,255,0],
  	transparent: [255,255,255]
  };
  /* End jQuery Effects Core */
  
})(jQuery);
function FastClick(a){"use strict";var b,c=this;if(this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=10,this.layer=a,!a||!a.nodeType)throw new TypeError("Layer must be a document node");this.onClick=function(){return FastClick.prototype.onClick.apply(c,arguments)},this.onMouse=function(){return FastClick.prototype.onMouse.apply(c,arguments)},this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(c,arguments)},this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(c,arguments)},this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(c,arguments)},this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(c,arguments)},FastClick.notNeeded(a)||(this.deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchmove",this.onTouchMove,!1),a.addEventListener("touchend",this.onTouchEnd,!1),a.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,d){var e=Node.prototype.removeEventListener;"click"===b?e.call(a,b,c.hijacked||c,d):e.call(a,b,c,d)},a.addEventListener=function(b,c,d){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(a,b,c,d)}),"function"==typeof a.onclick&&(b=a.onclick,a.addEventListener("click",function(a){b(a)},!1),a.onclick=null))}!function(a,b){function c(a){var b=a.length,c=ib.type(a);return ib.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||"function"!==c&&(0===b||"number"==typeof b&&b>0&&b-1 in a)}function d(a){var b=xb[a]={};return ib.each(a.match(kb)||[],function(a,c){b[c]=!0}),b}function e(a,c,d,e){if(ib.acceptData(a)){var f,g,h=ib.expando,i="string"==typeof c,j=a.nodeType,k=j?ib.cache:a,l=j?a[h]:a[h]&&h;if(l&&k[l]&&(e||k[l].data)||!i||d!==b)return l||(j?a[h]=l=_.pop()||ib.guid++:l=h),k[l]||(k[l]={},j||(k[l].toJSON=ib.noop)),("object"==typeof c||"function"==typeof c)&&(e?k[l]=ib.extend(k[l],c):k[l].data=ib.extend(k[l].data,c)),f=k[l],e||(f.data||(f.data={}),f=f.data),d!==b&&(f[ib.camelCase(c)]=d),i?(g=f[c],null==g&&(g=f[ib.camelCase(c)])):g=f,g}}function f(a,b,c){if(ib.acceptData(a)){var d,e,f,g=a.nodeType,i=g?ib.cache:a,j=g?a[ib.expando]:ib.expando;if(i[j]){if(b&&(f=c?i[j]:i[j].data)){ib.isArray(b)?b=b.concat(ib.map(b,ib.camelCase)):b in f?b=[b]:(b=ib.camelCase(b),b=b in f?[b]:b.split(" "));for(d=0,e=b.length;e>d;d++)delete f[b[d]];if(!(c?h:ib.isEmptyObject)(f))return}(c||(delete i[j].data,h(i[j])))&&(g?ib.cleanData([a],!0):ib.support.deleteExpando||i!=i.window?delete i[j]:i[j]=null)}}}function g(a,c,d){if(d===b&&1===a.nodeType){var e="data-"+c.replace(zb,"-$1").toLowerCase();if(d=a.getAttribute(e),"string"==typeof d){try{d="true"===d?!0:"false"===d?!1:"null"===d?null:+d+""===d?+d:yb.test(d)?ib.parseJSON(d):d}catch(f){}ib.data(a,c,d)}else d=b}return d}function h(a){var b;for(b in a)if(("data"!==b||!ib.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function i(){return!0}function j(){return!1}function k(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}function l(a,b,c){if(b=b||0,ib.isFunction(b))return ib.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return ib.grep(a,function(a){return a===b===c});if("string"==typeof b){var d=ib.grep(a,function(a){return 1===a.nodeType});if(Rb.test(b))return ib.filter(b,d,!c);b=ib.filter(b,d)}return ib.grep(a,function(a){return ib.inArray(a,b)>=0===c})}function m(a){var b=Ub.split("|"),c=a.createDocumentFragment();if(c.createElement)for(;b.length;)c.createElement(b.pop());return c}function n(a,b){return a.getElementsByTagName(b)[0]||a.appendChild(a.ownerDocument.createElement(b))}function o(a){var b=a.getAttributeNode("type");return a.type=(b&&b.specified)+"/"+a.type,a}function p(a){var b=ec.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function q(a,b){for(var c,d=0;null!=(c=a[d]);d++)ib._data(c,"globalEval",!b||ib._data(b[d],"globalEval"))}function r(a,b){if(1===b.nodeType&&ib.hasData(a)){var c,d,e,f=ib._data(a),g=ib._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)ib.event.add(b,c,h[c][d])}g.data&&(g.data=ib.extend({},g.data))}}function s(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!ib.support.noCloneEvent&&b[ib.expando]){e=ib._data(b);for(d in e.events)ib.removeEvent(b,d,e.handle);b.removeAttribute(ib.expando)}"script"===c&&b.text!==a.text?(o(b).text=a.text,p(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),ib.support.html5Clone&&a.innerHTML&&!ib.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&bc.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}function t(a,c){var d,e,f=0,g=typeof a.getElementsByTagName!==V?a.getElementsByTagName(c||"*"):typeof a.querySelectorAll!==V?a.querySelectorAll(c||"*"):b;if(!g)for(g=[],d=a.childNodes||a;null!=(e=d[f]);f++)!c||ib.nodeName(e,c)?g.push(e):ib.merge(g,t(e,c));return c===b||c&&ib.nodeName(a,c)?ib.merge([a],g):g}function u(a){bc.test(a.type)&&(a.defaultChecked=a.checked)}function v(a,b){if(b in a)return b;for(var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=yc.length;e--;)if(b=yc[e]+c,b in a)return b;return d}function w(a,b){return a=b||a,"none"===ib.css(a,"display")||!ib.contains(a.ownerDocument,a)}function x(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=ib._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&w(d)&&(f[g]=ib._data(d,"olddisplay",B(d.nodeName)))):f[g]||(e=w(d),(c&&"none"!==c||!e)&&ib._data(d,"olddisplay",e?c:ib.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function y(a,b,c){var d=rc.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function z(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=ib.css(a,c+xc[f],!0,e)),d?("content"===c&&(g-=ib.css(a,"padding"+xc[f],!0,e)),"margin"!==c&&(g-=ib.css(a,"border"+xc[f]+"Width",!0,e))):(g+=ib.css(a,"padding"+xc[f],!0,e),"padding"!==c&&(g+=ib.css(a,"border"+xc[f]+"Width",!0,e)));return g}function A(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=kc(a),g=ib.support.boxSizing&&"border-box"===ib.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=lc(a,b,f),(0>e||null==e)&&(e=a.style[b]),sc.test(e))return e;d=g&&(ib.support.boxSizingReliable||e===a.style[b]),e=parseFloat(e)||0}return e+z(a,b,c||(g?"border":"content"),d,f)+"px"}function B(a){var b=W,c=uc[a];return c||(c=C(a,b),"none"!==c&&c||(jc=(jc||ib("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(b.documentElement),b=(jc[0].contentWindow||jc[0].contentDocument).document,b.write("<!doctype html><html><body>"),b.close(),c=C(a,b),jc.detach()),uc[a]=c),c}function C(a,b){var c=ib(b.createElement(a)).appendTo(b.body),d=ib.css(c[0],"display");return c.remove(),d}function D(a,b,c,d){var e;if(ib.isArray(b))ib.each(b,function(b,e){c||Ac.test(a)?d(a,e):D(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==ib.type(b))d(a,b);else for(e in b)D(a+"["+e+"]",b[e],c,d)}function E(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(kb)||[];if(ib.isFunction(c))for(;d=f[e++];)"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function F(a,b,c,d){function e(h){var i;return f[h]=!0,ib.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||g||f[j]?g?!(i=j):void 0:(b.dataTypes.unshift(j),e(j),!1)}),i}var f={},g=a===Rc;return e(b.dataTypes[0])||!f["*"]&&e("*")}function G(a,c){var d,e,f=ib.ajaxSettings.flatOptions||{};for(e in c)c[e]!==b&&((f[e]?a:d||(d={}))[e]=c[e]);return d&&ib.extend(!0,a,d),a}function H(a,c,d){var e,f,g,h,i=a.contents,j=a.dataTypes,k=a.responseFields;for(h in k)h in d&&(c[k[h]]=d[h]);for(;"*"===j[0];)j.shift(),f===b&&(f=a.mimeType||c.getResponseHeader("Content-Type"));if(f)for(h in i)if(i[h]&&i[h].test(f)){j.unshift(h);break}if(j[0]in d)g=j[0];else{for(h in d){if(!j[0]||a.converters[h+" "+j[0]]){g=h;break}e||(e=h)}g=g||e}return g?(g!==j[0]&&j.unshift(g),d[g]):void 0}function I(a,b){var c,d,e,f,g={},h=0,i=a.dataTypes.slice(),j=i[0];if(a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i[1])for(e in a.converters)g[e.toLowerCase()]=a.converters[e];for(;d=i[++h];)if("*"!==d){if("*"!==j&&j!==d){if(e=g[j+" "+d]||g["* "+d],!e)for(c in g)if(f=c.split(" "),f[1]===d&&(e=g[j+" "+f[0]]||g["* "+f[0]])){e===!0?e=g[c]:g[c]!==!0&&(d=f[0],i.splice(h--,0,d));break}if(e!==!0)if(e&&a["throws"])b=e(b);else try{b=e(b)}catch(k){return{state:"parsererror",error:e?k:"No conversion from "+j+" to "+d}}}j=d}return{state:"success",data:b}}function J(){try{return new a.XMLHttpRequest}catch(b){}}function K(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function L(){return setTimeout(function(){$c=b}),$c=ib.now()}function M(a,b){ib.each(b,function(b,c){for(var d=(ed[b]||[]).concat(ed["*"]),e=0,f=d.length;f>e;e++)if(d[e].call(a,b,c))return})}function N(a,b,c){var d,e,f=0,g=dd.length,h=ib.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=$c||L(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:ib.extend({},b),opts:ib.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:$c||L(),duration:c.duration,tweens:[],createTween:function(b,c){var d=ib.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(O(k,j.opts.specialEasing);g>f;f++)if(d=dd[f].call(j,a,k,j.opts))return d;return M(j,k),ib.isFunction(j.opts.start)&&j.opts.start.call(a,j),ib.fx.timer(ib.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}function O(a,b){var c,d,e,f,g;for(e in a)if(d=ib.camelCase(e),f=b[d],c=a[e],ib.isArray(c)&&(f=c[1],c=a[e]=c[0]),e!==d&&(a[d]=c,delete a[e]),g=ib.cssHooks[d],g&&"expand"in g){c=g.expand(c),delete a[d];for(e in c)e in a||(a[e]=c[e],b[e]=f)}else b[d]=f}function P(a,b,c){var d,e,f,g,h,i,j,k,l,m=this,n=a.style,o={},p=[],q=a.nodeType&&w(a);c.queue||(k=ib._queueHooks(a,"fx"),null==k.unqueued&&(k.unqueued=0,l=k.empty.fire,k.empty.fire=function(){k.unqueued||l()}),k.unqueued++,m.always(function(){m.always(function(){k.unqueued--,ib.queue(a,"fx").length||k.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[n.overflow,n.overflowX,n.overflowY],"inline"===ib.css(a,"display")&&"none"===ib.css(a,"float")&&(ib.support.inlineBlockNeedsLayout&&"inline"!==B(a.nodeName)?n.zoom=1:n.display="inline-block")),c.overflow&&(n.overflow="hidden",ib.support.shrinkWrapBlocks||m.always(function(){n.overflow=c.overflow[0],n.overflowX=c.overflow[1],n.overflowY=c.overflow[2]}));for(e in b)if(g=b[e],ad.exec(g)){if(delete b[e],i=i||"toggle"===g,g===(q?"hide":"show"))continue;p.push(e)}if(f=p.length){h=ib._data(a,"fxshow")||ib._data(a,"fxshow",{}),"hidden"in h&&(q=h.hidden),i&&(h.hidden=!q),q?ib(a).show():m.done(function(){ib(a).hide()}),m.done(function(){var b;ib._removeData(a,"fxshow");for(b in o)ib.style(a,b,o[b])});for(e=0;f>e;e++)d=p[e],j=m.createTween(d,q?h[d]:0),o[d]=h[d]||ib.style(a,d),d in h||(h[d]=j.start,q&&(j.end=j.start,j.start="width"===d||"height"===d?1:0))}}function Q(a,b,c,d,e){return new Q.prototype.init(a,b,c,d,e)}function R(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=xc[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function S(a){return ib.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}var T,U,V=typeof b,W=a.document,X=a.location,Y=a.jQuery,Z=a.$,$={},_=[],ab="1.9.1",bb=_.concat,cb=_.push,db=_.slice,eb=_.indexOf,fb=$.toString,gb=$.hasOwnProperty,hb=ab.trim,ib=function(a,b){return new ib.fn.init(a,b,U)},jb=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,kb=/\S+/g,lb=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,mb=/^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,nb=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,ob=/^[\],:{}\s]*$/,pb=/(?:^|:|,)(?:\s*\[)+/g,qb=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,rb=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,sb=/^-ms-/,tb=/-([\da-z])/gi,ub=function(a,b){return b.toUpperCase()},vb=function(a){(W.addEventListener||"load"===a.type||"complete"===W.readyState)&&(wb(),ib.ready())},wb=function(){W.addEventListener?(W.removeEventListener("DOMContentLoaded",vb,!1),a.removeEventListener("load",vb,!1)):(W.detachEvent("onreadystatechange",vb),a.detachEvent("onload",vb))};ib.fn=ib.prototype={jquery:ab,constructor:ib,init:function(a,c,d){var e,f;if(!a)return this;if("string"==typeof a){if(e="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:mb.exec(a),!e||!e[1]&&c)return!c||c.jquery?(c||d).find(a):this.constructor(c).find(a);if(e[1]){if(c=c instanceof ib?c[0]:c,ib.merge(this,ib.parseHTML(e[1],c&&c.nodeType?c.ownerDocument||c:W,!0)),nb.test(e[1])&&ib.isPlainObject(c))for(e in c)ib.isFunction(this[e])?this[e](c[e]):this.attr(e,c[e]);return this}if(f=W.getElementById(e[2]),f&&f.parentNode){if(f.id!==e[2])return d.find(a);this.length=1,this[0]=f}return this.context=W,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):ib.isFunction(a)?d.ready(a):(a.selector!==b&&(this.selector=a.selector,this.context=a.context),ib.makeArray(a,this))},selector:"",length:0,size:function(){return this.length},toArray:function(){return db.call(this)},get:function(a){return null==a?this.toArray():0>a?this[this.length+a]:this[a]},pushStack:function(a){var b=ib.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return ib.each(this,a,b)},ready:function(a){return ib.ready.promise().done(a),this},slice:function(){return this.pushStack(db.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},map:function(a){return this.pushStack(ib.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:cb,sort:[].sort,splice:[].splice},ib.fn.init.prototype=ib.fn,ib.extend=ib.fn.extend=function(){var a,c,d,e,f,g,h=arguments[0]||{},i=1,j=arguments.length,k=!1;for("boolean"==typeof h&&(k=h,h=arguments[1]||{},i=2),"object"==typeof h||ib.isFunction(h)||(h={}),j===i&&(h=this,--i);j>i;i++)if(null!=(f=arguments[i]))for(e in f)a=h[e],d=f[e],h!==d&&(k&&d&&(ib.isPlainObject(d)||(c=ib.isArray(d)))?(c?(c=!1,g=a&&ib.isArray(a)?a:[]):g=a&&ib.isPlainObject(a)?a:{},h[e]=ib.extend(k,g,d)):d!==b&&(h[e]=d));return h},ib.extend({noConflict:function(b){return a.$===ib&&(a.$=Z),b&&a.jQuery===ib&&(a.jQuery=Y),ib},isReady:!1,readyWait:1,holdReady:function(a){a?ib.readyWait++:ib.ready(!0)},ready:function(a){if(a===!0?!--ib.readyWait:!ib.isReady){if(!W.body)return setTimeout(ib.ready);ib.isReady=!0,a!==!0&&--ib.readyWait>0||(T.resolveWith(W,[ib]),ib.fn.trigger&&ib(W).trigger("ready").off("ready"))}},isFunction:function(a){return"function"===ib.type(a)},isArray:Array.isArray||function(a){return"array"===ib.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return null==a?String(a):"object"==typeof a||"function"==typeof a?$[fb.call(a)]||"object":typeof a},isPlainObject:function(a){if(!a||"object"!==ib.type(a)||a.nodeType||ib.isWindow(a))return!1;try{if(a.constructor&&!gb.call(a,"constructor")&&!gb.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||gb.call(a,d)},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},error:function(a){throw new Error(a)},parseHTML:function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||W;var d=nb.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=ib.buildFragment([a],b,e),e&&ib(e).remove(),ib.merge([],d.childNodes))},parseJSON:function(b){return a.JSON&&a.JSON.parse?a.JSON.parse(b):null===b?b:"string"==typeof b&&(b=ib.trim(b),b&&ob.test(b.replace(qb,"@").replace(rb,"]").replace(pb,"")))?new Function("return "+b)():(ib.error("Invalid JSON: "+b),void 0)},parseXML:function(c){var d,e;if(!c||"string"!=typeof c)return null;try{a.DOMParser?(e=new DOMParser,d=e.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(f){d=b}return d&&d.documentElement&&!d.getElementsByTagName("parsererror").length||ib.error("Invalid XML: "+c),d},noop:function(){},globalEval:function(b){b&&ib.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(sb,"ms-").replace(tb,ub)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,d){var e,f=0,g=a.length,h=c(a);if(d){if(h)for(;g>f&&(e=b.apply(a[f],d),e!==!1);f++);else for(f in a)if(e=b.apply(a[f],d),e===!1)break}else if(h)for(;g>f&&(e=b.call(a[f],f,a[f]),e!==!1);f++);else for(f in a)if(e=b.call(a[f],f,a[f]),e===!1)break;return a},trim:hb&&!hb.call("﻿ ")?function(a){return null==a?"":hb.call(a)}:function(a){return null==a?"":(a+"").replace(lb,"")},makeArray:function(a,b){var d=b||[];return null!=a&&(c(Object(a))?ib.merge(d,"string"==typeof a?[a]:a):cb.call(d,a)),d},inArray:function(a,b,c){var d;if(b){if(eb)return eb.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=c.length,e=a.length,f=0;if("number"==typeof d)for(;d>f;f++)a[e++]=c[f];else for(;c[f]!==b;)a[e++]=c[f++];return a.length=e,a},grep:function(a,b,c){var d,e=[],f=0,g=a.length;for(c=!!c;g>f;f++)d=!!b(a[f],f),c!==d&&e.push(a[f]);return e},map:function(a,b,d){var e,f=0,g=a.length,h=c(a),i=[];if(h)for(;g>f;f++)e=b(a[f],f,d),null!=e&&(i[i.length]=e);else for(f in a)e=b(a[f],f,d),null!=e&&(i[i.length]=e);return bb.apply([],i)},guid:1,proxy:function(a,c){var d,e,f;return"string"==typeof c&&(f=a[c],c=a,a=f),ib.isFunction(a)?(d=db.call(arguments,2),e=function(){return a.apply(c||this,d.concat(db.call(arguments)))},e.guid=a.guid=a.guid||ib.guid++,e):b},access:function(a,c,d,e,f,g,h){var i=0,j=a.length,k=null==d;if("object"===ib.type(d)){f=!0;for(i in d)ib.access(a,c,i,d[i],!0,g,h)}else if(e!==b&&(f=!0,ib.isFunction(e)||(h=!0),k&&(h?(c.call(a,e),c=null):(k=c,c=function(a,b,c){return k.call(ib(a),c)})),c))for(;j>i;i++)c(a[i],d,h?e:e.call(a[i],i,c(a[i],d)));return f?a:k?c.call(a):j?c(a[0],d):g},now:function(){return(new Date).getTime()}}),ib.ready.promise=function(b){if(!T)if(T=ib.Deferred(),"complete"===W.readyState)setTimeout(ib.ready);else if(W.addEventListener)W.addEventListener("DOMContentLoaded",vb,!1),a.addEventListener("load",vb,!1);else{W.attachEvent("onreadystatechange",vb),a.attachEvent("onload",vb);var c=!1;try{c=null==a.frameElement&&W.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!ib.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}wb(),ib.ready()}}()}return T.promise(b)},ib.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){$["[object "+b+"]"]=b.toLowerCase()}),U=ib(W);var xb={};ib.Callbacks=function(a){a="string"==typeof a?xb[a]||d(a):ib.extend({},a);var c,e,f,g,h,i,j=[],k=!a.once&&[],l=function(b){for(e=a.memory&&b,f=!0,h=i||0,i=0,g=j.length,c=!0;j&&g>h;h++)if(j[h].apply(b[0],b[1])===!1&&a.stopOnFalse){e=!1;break}c=!1,j&&(k?k.length&&l(k.shift()):e?j=[]:m.disable())},m={add:function(){if(j){var b=j.length;!function d(b){ib.each(b,function(b,c){var e=ib.type(c);"function"===e?a.unique&&m.has(c)||j.push(c):c&&c.length&&"string"!==e&&d(c)})}(arguments),c?g=j.length:e&&(i=b,l(e))}return this},remove:function(){return j&&ib.each(arguments,function(a,b){for(var d;(d=ib.inArray(b,j,d))>-1;)j.splice(d,1),c&&(g>=d&&g--,h>=d&&h--)}),this},has:function(a){return a?ib.inArray(a,j)>-1:!(!j||!j.length)},empty:function(){return j=[],this},disable:function(){return j=k=e=b,this},disabled:function(){return!j},lock:function(){return k=b,e||m.disable(),this},locked:function(){return!k},fireWith:function(a,b){return b=b||[],b=[a,b.slice?b.slice():b],!j||f&&!k||(c?k.push(b):l(b)),this},fire:function(){return m.fireWith(this,arguments),this},fired:function(){return!!f}};return m},ib.extend({Deferred:function(a){var b=[["resolve","done",ib.Callbacks("once memory"),"resolved"],["reject","fail",ib.Callbacks("once memory"),"rejected"],["notify","progress",ib.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return ib.Deferred(function(c){ib.each(b,function(b,f){var g=f[0],h=ib.isFunction(a[b])&&a[b];e[f[1]](function(){var a=h&&h.apply(this,arguments);a&&ib.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[g+"With"](this===d?c.promise():this,h?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?ib.extend(a,d):d}},e={};return d.pipe=d.then,ib.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b,c,d,e=0,f=db.call(arguments),g=f.length,h=1!==g||a&&ib.isFunction(a.promise)?g:0,i=1===h?a:ib.Deferred(),j=function(a,c,d){return function(e){c[a]=this,d[a]=arguments.length>1?db.call(arguments):e,d===b?i.notifyWith(c,d):--h||i.resolveWith(c,d)}};if(g>1)for(b=new Array(g),c=new Array(g),d=new Array(g);g>e;e++)f[e]&&ib.isFunction(f[e].promise)?f[e].promise().done(j(e,d,f)).fail(i.reject).progress(j(e,c,b)):--h;return h||i.resolveWith(d,f),i.promise()}}),ib.support=function(){var b,c,d,e,f,g,h,i,j,k,l=W.createElement("div");if(l.setAttribute("className","t"),l.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",c=l.getElementsByTagName("*"),d=l.getElementsByTagName("a")[0],!c||!d||!c.length)return{};f=W.createElement("select"),h=f.appendChild(W.createElement("option")),e=l.getElementsByTagName("input")[0],d.style.cssText="top:1px;float:left;opacity:.5",b={getSetAttribute:"t"!==l.className,leadingWhitespace:3===l.firstChild.nodeType,tbody:!l.getElementsByTagName("tbody").length,htmlSerialize:!!l.getElementsByTagName("link").length,style:/top/.test(d.getAttribute("style")),hrefNormalized:"/a"===d.getAttribute("href"),opacity:/^0.5/.test(d.style.opacity),cssFloat:!!d.style.cssFloat,checkOn:!!e.value,optSelected:h.selected,enctype:!!W.createElement("form").enctype,html5Clone:"<:nav></:nav>"!==W.createElement("nav").cloneNode(!0).outerHTML,boxModel:"CSS1Compat"===W.compatMode,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},e.checked=!0,b.noCloneChecked=e.cloneNode(!0).checked,f.disabled=!0,b.optDisabled=!h.disabled;try{delete l.test}catch(m){b.deleteExpando=!1}e=W.createElement("input"),e.setAttribute("value",""),b.input=""===e.getAttribute("value"),e.value="t",e.setAttribute("type","radio"),b.radioValue="t"===e.value,e.setAttribute("checked","t"),e.setAttribute("name","t"),g=W.createDocumentFragment(),g.appendChild(e),b.appendChecked=e.checked,b.checkClone=g.cloneNode(!0).cloneNode(!0).lastChild.checked,l.attachEvent&&(l.attachEvent("onclick",function(){b.noCloneEvent=!1}),l.cloneNode(!0).click());for(k in{submit:!0,change:!0,focusin:!0})l.setAttribute(i="on"+k,"t"),b[k+"Bubbles"]=i in a||l.attributes[i].expando===!1;return l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",b.clearCloneStyle="content-box"===l.style.backgroundClip,ib(function(){var c,d,e,f="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",g=W.getElementsByTagName("body")[0];g&&(c=W.createElement("div"),c.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",g.appendChild(c).appendChild(l),l.innerHTML="<table><tr><td></td><td>t</td></tr></table>",e=l.getElementsByTagName("td"),e[0].style.cssText="padding:0;margin:0;border:0;display:none",j=0===e[0].offsetHeight,e[0].style.display="",e[1].style.display="none",b.reliableHiddenOffsets=j&&0===e[0].offsetHeight,l.innerHTML="",l.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",b.boxSizing=4===l.offsetWidth,b.doesNotIncludeMarginInBodyOffset=1!==g.offsetTop,a.getComputedStyle&&(b.pixelPosition="1%"!==(a.getComputedStyle(l,null)||{}).top,b.boxSizingReliable="4px"===(a.getComputedStyle(l,null)||{width:"4px"}).width,d=l.appendChild(W.createElement("div")),d.style.cssText=l.style.cssText=f,d.style.marginRight=d.style.width="0",l.style.width="1px",b.reliableMarginRight=!parseFloat((a.getComputedStyle(d,null)||{}).marginRight)),typeof l.style.zoom!==V&&(l.innerHTML="",l.style.cssText=f+"width:1px;padding:1px;display:inline;zoom:1",b.inlineBlockNeedsLayout=3===l.offsetWidth,l.style.display="block",l.innerHTML="<div></div>",l.firstChild.style.width="5px",b.shrinkWrapBlocks=3!==l.offsetWidth,b.inlineBlockNeedsLayout&&(g.style.zoom=1)),g.removeChild(c),c=l=e=d=null)}),c=f=g=h=d=e=null,b}();var yb=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,zb=/([A-Z])/g;ib.extend({cache:{},expando:"jQuery"+(ab+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){return a=a.nodeType?ib.cache[a[ib.expando]]:a[ib.expando],!!a&&!h(a)},data:function(a,b,c){return e(a,b,c)},removeData:function(a,b){return f(a,b)},_data:function(a,b,c){return e(a,b,c,!0)},_removeData:function(a,b){return f(a,b,!0)},acceptData:function(a){if(a.nodeType&&1!==a.nodeType&&9!==a.nodeType)return!1;var b=a.nodeName&&ib.noData[a.nodeName.toLowerCase()];return!b||b!==!0&&a.getAttribute("classid")===b}}),ib.fn.extend({data:function(a,c){var d,e,f=this[0],h=0,i=null;if(a===b){if(this.length&&(i=ib.data(f),1===f.nodeType&&!ib._data(f,"parsedAttrs"))){for(d=f.attributes;h<d.length;h++)e=d[h].name,e.indexOf("data-")||(e=ib.camelCase(e.slice(5)),g(f,e,i[e]));ib._data(f,"parsedAttrs",!0)}return i}return"object"==typeof a?this.each(function(){ib.data(this,a)}):ib.access(this,function(c){return c===b?f?g(f,a,ib.data(f,a)):null:(this.each(function(){ib.data(this,a,c)}),void 0)},null,c,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){ib.removeData(this,a)})}}),ib.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=ib._data(a,b),c&&(!d||ib.isArray(c)?d=ib._data(a,b,ib.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=ib.queue(a,b),d=c.length,e=c.shift(),f=ib._queueHooks(a,b),g=function(){ib.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),f.cur=e,e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return ib._data(a,c)||ib._data(a,c,{empty:ib.Callbacks("once memory").add(function(){ib._removeData(a,b+"queue"),ib._removeData(a,c)})})}}),ib.fn.extend({queue:function(a,c){var d=2;return"string"!=typeof a&&(c=a,a="fx",d--),arguments.length<d?ib.queue(this[0],a):c===b?this:this.each(function(){var b=ib.queue(this,a,c);ib._queueHooks(this,a),"fx"===a&&"inprogress"!==b[0]&&ib.dequeue(this,a)})},dequeue:function(a){return this.each(function(){ib.dequeue(this,a)})},delay:function(a,b){return a=ib.fx?ib.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){var d,e=1,f=ib.Deferred(),g=this,h=this.length,i=function(){--e||f.resolveWith(g,[g])};for("string"!=typeof a&&(c=a,a=b),a=a||"fx";h--;)d=ib._data(g[h],a+"queueHooks"),d&&d.empty&&(e++,d.empty.add(i));return i(),f.promise(c)}});var Ab,Bb,Cb=/[\t\r\n]/g,Db=/\r/g,Eb=/^(?:input|select|textarea|button|object)$/i,Fb=/^(?:a|area)$/i,Gb=/^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,Hb=/^(?:checked|selected)$/i,Ib=ib.support.getSetAttribute,Jb=ib.support.input;ib.fn.extend({attr:function(a,b){return ib.access(this,ib.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){ib.removeAttr(this,a)})},prop:function(a,b){return ib.access(this,ib.prop,a,b,arguments.length>1)},removeProp:function(a){return a=ib.propFix[a]||a,this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,f,g=0,h=this.length,i="string"==typeof a&&a;if(ib.isFunction(a))return this.each(function(b){ib(this).addClass(a.call(this,b,this.className))});if(i)for(b=(a||"").match(kb)||[];h>g;g++)if(c=this[g],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(Cb," "):" ")){for(f=0;e=b[f++];)d.indexOf(" "+e+" ")<0&&(d+=e+" ");c.className=ib.trim(d)}return this},removeClass:function(a){var b,c,d,e,f,g=0,h=this.length,i=0===arguments.length||"string"==typeof a&&a;if(ib.isFunction(a))return this.each(function(b){ib(this).removeClass(a.call(this,b,this.className))});if(i)for(b=(a||"").match(kb)||[];h>g;g++)if(c=this[g],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(Cb," "):"")){for(f=0;e=b[f++];)for(;d.indexOf(" "+e+" ")>=0;)d=d.replace(" "+e+" "," ");c.className=a?ib.trim(d):""}return this},toggleClass:function(a,b){var c=typeof a,d="boolean"==typeof b;return ib.isFunction(a)?this.each(function(c){ib(this).toggleClass(a.call(this,c,this.className,b),b)}):this.each(function(){if("string"===c)for(var e,f=0,g=ib(this),h=b,i=a.match(kb)||[];e=i[f++];)h=d?h:!g.hasClass(e),g[h?"addClass":"removeClass"](e);else(c===V||"boolean"===c)&&(this.className&&ib._data(this,"__className__",this.className),this.className=this.className||a===!1?"":ib._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(Cb," ").indexOf(b)>=0)return!0;return!1},val:function(a){var c,d,e,f=this[0];{if(arguments.length)return e=ib.isFunction(a),this.each(function(c){var f,g=ib(this);1===this.nodeType&&(f=e?a.call(this,c,g.val()):a,null==f?f="":"number"==typeof f?f+="":ib.isArray(f)&&(f=ib.map(f,function(a){return null==a?"":a+""})),d=ib.valHooks[this.type]||ib.valHooks[this.nodeName.toLowerCase()],d&&"set"in d&&d.set(this,f,"value")!==b||(this.value=f))});if(f)return d=ib.valHooks[f.type]||ib.valHooks[f.nodeName.toLowerCase()],d&&"get"in d&&(c=d.get(f,"value"))!==b?c:(c=f.value,"string"==typeof c?c.replace(Db,""):null==c?"":c)}}}),ib.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(ib.support.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&ib.nodeName(c.parentNode,"optgroup"))){if(b=ib(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c=ib.makeArray(b);return ib(a).find("option").each(function(){this.selected=ib.inArray(ib(this).val(),c)>=0
}),c.length||(a.selectedIndex=-1),c}}},attr:function(a,c,d){var e,f,g,h=a.nodeType;if(a&&3!==h&&8!==h&&2!==h)return typeof a.getAttribute===V?ib.prop(a,c,d):(f=1!==h||!ib.isXMLDoc(a),f&&(c=c.toLowerCase(),e=ib.attrHooks[c]||(Gb.test(c)?Bb:Ab)),d===b?e&&f&&"get"in e&&null!==(g=e.get(a,c))?g:(typeof a.getAttribute!==V&&(g=a.getAttribute(c)),null==g?b:g):null!==d?e&&f&&"set"in e&&(g=e.set(a,d,c))!==b?g:(a.setAttribute(c,d+""),d):(ib.removeAttr(a,c),void 0))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(kb);if(f&&1===a.nodeType)for(;c=f[e++];)d=ib.propFix[c]||c,Gb.test(c)?!Ib&&Hb.test(c)?a[ib.camelCase("default-"+c)]=a[d]=!1:a[d]=!1:ib.attr(a,c,""),a.removeAttribute(Ib?c:d)},attrHooks:{type:{set:function(a,b){if(!ib.support.radioValue&&"radio"===b&&ib.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,f,g,h=a.nodeType;if(a&&3!==h&&8!==h&&2!==h)return g=1!==h||!ib.isXMLDoc(a),g&&(c=ib.propFix[c]||c,f=ib.propHooks[c]),d!==b?f&&"set"in f&&(e=f.set(a,d,c))!==b?e:a[c]=d:f&&"get"in f&&null!==(e=f.get(a,c))?e:a[c]},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):Eb.test(a.nodeName)||Fb.test(a.nodeName)&&a.href?0:b}}}}),Bb={get:function(a,c){var d=ib.prop(a,c),e="boolean"==typeof d&&a.getAttribute(c),f="boolean"==typeof d?Jb&&Ib?null!=e:Hb.test(c)?a[ib.camelCase("default-"+c)]:!!e:a.getAttributeNode(c);return f&&f.value!==!1?c.toLowerCase():b},set:function(a,b,c){return b===!1?ib.removeAttr(a,c):Jb&&Ib||!Hb.test(c)?a.setAttribute(!Ib&&ib.propFix[c]||c,c):a[ib.camelCase("default-"+c)]=a[c]=!0,c}},Jb&&Ib||(ib.attrHooks.value={get:function(a,c){var d=a.getAttributeNode(c);return ib.nodeName(a,"input")?a.defaultValue:d&&d.specified?d.value:b},set:function(a,b,c){return ib.nodeName(a,"input")?(a.defaultValue=b,void 0):Ab&&Ab.set(a,b,c)}}),Ib||(Ab=ib.valHooks.button={get:function(a,c){var d=a.getAttributeNode(c);return d&&("id"===c||"name"===c||"coords"===c?""!==d.value:d.specified)?d.value:b},set:function(a,c,d){var e=a.getAttributeNode(d);return e||a.setAttributeNode(e=a.ownerDocument.createAttribute(d)),e.value=c+="","value"===d||c===a.getAttribute(d)?c:b}},ib.attrHooks.contenteditable={get:Ab.get,set:function(a,b,c){Ab.set(a,""===b?!1:b,c)}},ib.each(["width","height"],function(a,b){ib.attrHooks[b]=ib.extend(ib.attrHooks[b],{set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}})})),ib.support.hrefNormalized||(ib.each(["href","src","width","height"],function(a,c){ib.attrHooks[c]=ib.extend(ib.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return null==d?b:d}})}),ib.each(["href","src"],function(a,b){ib.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}})),ib.support.style||(ib.attrHooks.style={get:function(a){return a.style.cssText||b},set:function(a,b){return a.style.cssText=b+""}}),ib.support.optSelected||(ib.propHooks.selected=ib.extend(ib.propHooks.selected,{get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}})),ib.support.enctype||(ib.propFix.enctype="encoding"),ib.support.checkOn||ib.each(["radio","checkbox"],function(){ib.valHooks[this]={get:function(a){return null===a.getAttribute("value")?"on":a.value}}}),ib.each(["radio","checkbox"],function(){ib.valHooks[this]=ib.extend(ib.valHooks[this],{set:function(a,b){return ib.isArray(b)?a.checked=ib.inArray(ib(a).val(),b)>=0:void 0}})});var Kb=/^(?:input|select|textarea)$/i,Lb=/^key/,Mb=/^(?:mouse|contextmenu)|click/,Nb=/^(?:focusinfocus|focusoutblur)$/,Ob=/^([^.]*)(?:\.(.+)|)$/;ib.event={global:{},add:function(a,c,d,e,f){var g,h,i,j,k,l,m,n,o,p,q,r=ib._data(a);if(r){for(d.handler&&(j=d,d=j.handler,f=j.selector),d.guid||(d.guid=ib.guid++),(h=r.events)||(h=r.events={}),(l=r.handle)||(l=r.handle=function(a){return typeof ib===V||a&&ib.event.triggered===a.type?b:ib.event.dispatch.apply(l.elem,arguments)},l.elem=a),c=(c||"").match(kb)||[""],i=c.length;i--;)g=Ob.exec(c[i])||[],o=q=g[1],p=(g[2]||"").split(".").sort(),k=ib.event.special[o]||{},o=(f?k.delegateType:k.bindType)||o,k=ib.event.special[o]||{},m=ib.extend({type:o,origType:q,data:e,handler:d,guid:d.guid,selector:f,needsContext:f&&ib.expr.match.needsContext.test(f),namespace:p.join(".")},j),(n=h[o])||(n=h[o]=[],n.delegateCount=0,k.setup&&k.setup.call(a,e,p,l)!==!1||(a.addEventListener?a.addEventListener(o,l,!1):a.attachEvent&&a.attachEvent("on"+o,l))),k.add&&(k.add.call(a,m),m.handler.guid||(m.handler.guid=d.guid)),f?n.splice(n.delegateCount++,0,m):n.push(m),ib.event.global[o]=!0;a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=ib.hasData(a)&&ib._data(a);if(q&&(k=q.events)){for(b=(b||"").match(kb)||[""],j=b.length;j--;)if(h=Ob.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){for(l=ib.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=k[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=m.length;f--;)g=m[f],!e&&p!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(m.splice(f,1),g.selector&&m.delegateCount--,l.remove&&l.remove.call(a,g));i&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||ib.removeEvent(a,n,q.handle),delete k[n])}else for(n in k)ib.event.remove(a,n+b[j],c,d,!0);ib.isEmptyObject(k)&&(delete q.handle,ib._removeData(a,"events"))}},trigger:function(c,d,e,f){var g,h,i,j,k,l,m,n=[e||W],o=gb.call(c,"type")?c.type:c,p=gb.call(c,"namespace")?c.namespace.split("."):[];if(i=l=e=e||W,3!==e.nodeType&&8!==e.nodeType&&!Nb.test(o+ib.event.triggered)&&(o.indexOf(".")>=0&&(p=o.split("."),o=p.shift(),p.sort()),h=o.indexOf(":")<0&&"on"+o,c=c[ib.expando]?c:new ib.Event(o,"object"==typeof c&&c),c.isTrigger=!0,c.namespace=p.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,c.result=b,c.target||(c.target=e),d=null==d?[c]:ib.makeArray(d,[c]),k=ib.event.special[o]||{},f||!k.trigger||k.trigger.apply(e,d)!==!1)){if(!f&&!k.noBubble&&!ib.isWindow(e)){for(j=k.delegateType||o,Nb.test(j+o)||(i=i.parentNode);i;i=i.parentNode)n.push(i),l=i;l===(e.ownerDocument||W)&&n.push(l.defaultView||l.parentWindow||a)}for(m=0;(i=n[m++])&&!c.isPropagationStopped();)c.type=m>1?j:k.bindType||o,g=(ib._data(i,"events")||{})[c.type]&&ib._data(i,"handle"),g&&g.apply(i,d),g=h&&i[h],g&&ib.acceptData(i)&&g.apply&&g.apply(i,d)===!1&&c.preventDefault();if(c.type=o,!(f||c.isDefaultPrevented()||k._default&&k._default.apply(e.ownerDocument,d)!==!1||"click"===o&&ib.nodeName(e,"a")||!ib.acceptData(e)||!h||!e[o]||ib.isWindow(e))){l=e[h],l&&(e[h]=null),ib.event.triggered=o;try{e[o]()}catch(q){}ib.event.triggered=b,l&&(e[h]=l)}return c.result}},dispatch:function(a){a=ib.event.fix(a);var c,d,e,f,g,h=[],i=db.call(arguments),j=(ib._data(this,"events")||{})[a.type]||[],k=ib.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){for(h=ib.event.handlers.call(this,a,j),c=0;(f=h[c++])&&!a.isPropagationStopped();)for(a.currentTarget=f.elem,g=0;(e=f.handlers[g++])&&!a.isImmediatePropagationStopped();)(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,d=((ib.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),d!==b&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()));return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,c){var d,e,f,g,h=[],i=c.delegateCount,j=a.target;if(i&&j.nodeType&&(!a.button||"click"!==a.type))for(;j!=this;j=j.parentNode||this)if(1===j.nodeType&&(j.disabled!==!0||"click"!==a.type)){for(f=[],g=0;i>g;g++)e=c[g],d=e.selector+" ",f[d]===b&&(f[d]=e.needsContext?ib(d,this).index(j)>=0:ib.find(d,this,null,[j]).length),f[d]&&f.push(e);f.length&&h.push({elem:j,handlers:f})}return i<c.length&&h.push({elem:this,handlers:c.slice(i)}),h},fix:function(a){if(a[ib.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];for(g||(this.fixHooks[e]=g=Mb.test(e)?this.mouseHooks:Lb.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new ib.Event(f),b=d.length;b--;)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||W),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,c){var d,e,f,g=c.button,h=c.fromElement;return null==a.pageX&&null!=c.clientX&&(e=a.target.ownerDocument||W,f=e.documentElement,d=e.body,a.pageX=c.clientX+(f&&f.scrollLeft||d&&d.scrollLeft||0)-(f&&f.clientLeft||d&&d.clientLeft||0),a.pageY=c.clientY+(f&&f.scrollTop||d&&d.scrollTop||0)-(f&&f.clientTop||d&&d.clientTop||0)),!a.relatedTarget&&h&&(a.relatedTarget=h===a.target?c.toElement:h),a.which||g===b||(a.which=1&g?1:2&g?3:4&g?2:0),a}},special:{load:{noBubble:!0},click:{trigger:function(){return ib.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0}},focus:{trigger:function(){if(this!==W.activeElement&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===W.activeElement&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},beforeunload:{postDispatch:function(a){a.result!==b&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=ib.extend(new ib.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?ib.event.trigger(e,null,b):ib.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},ib.removeEvent=W.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===V&&(a[d]=null),a.detachEvent(d,c))},ib.Event=function(a,b){return this instanceof ib.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?i:j):this.type=a,b&&ib.extend(this,b),this.timeStamp=a&&a.timeStamp||ib.now(),this[ib.expando]=!0,void 0):new ib.Event(a,b)},ib.Event.prototype={isDefaultPrevented:j,isPropagationStopped:j,isImmediatePropagationStopped:j,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=i,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=i,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=i,this.stopPropagation()}},ib.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){ib.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!ib.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),ib.support.submitBubbles||(ib.event.special.submit={setup:function(){return ib.nodeName(this,"form")?!1:(ib.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=ib.nodeName(c,"input")||ib.nodeName(c,"button")?c.form:b;d&&!ib._data(d,"submitBubbles")&&(ib.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),ib._data(d,"submitBubbles",!0))}),void 0)},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&ib.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return ib.nodeName(this,"form")?!1:(ib.event.remove(this,"._submit"),void 0)}}),ib.support.changeBubbles||(ib.event.special.change={setup:function(){return Kb.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(ib.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),ib.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),ib.event.simulate("change",this,a,!0)})),!1):(ib.event.add(this,"beforeactivate._change",function(a){var b=a.target;Kb.test(b.nodeName)&&!ib._data(b,"changeBubbles")&&(ib.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||ib.event.simulate("change",this.parentNode,a,!0)}),ib._data(b,"changeBubbles",!0))}),void 0)},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return ib.event.remove(this,"._change"),!Kb.test(this.nodeName)}}),ib.support.focusinBubbles||ib.each({focus:"focusin",blur:"focusout"},function(a,b){var c=0,d=function(a){ib.event.simulate(b,a.target,ib.event.fix(a),!0)};ib.event.special[b]={setup:function(){0===c++&&W.addEventListener(a,d,!0)},teardown:function(){0===--c&&W.removeEventListener(a,d,!0)}}}),ib.fn.extend({on:function(a,c,d,e,f){var g,h;if("object"==typeof a){"string"!=typeof c&&(d=d||c,c=b);for(g in a)this.on(g,c,d,a[g],f);return this}if(null==d&&null==e?(e=c,d=c=b):null==e&&("string"==typeof c?(e=d,d=b):(e=d,d=c,c=b)),e===!1)e=j;else if(!e)return this;return 1===f&&(h=e,e=function(a){return ib().off(a),h.apply(this,arguments)},e.guid=h.guid||(h.guid=ib.guid++)),this.each(function(){ib.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){var e,f;if(a&&a.preventDefault&&a.handleObj)return e=a.handleObj,ib(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler),this;if("object"==typeof a){for(f in a)this.off(f,c,a[f]);return this}return(c===!1||"function"==typeof c)&&(d=c,c=b),d===!1&&(d=j),this.each(function(){ib.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)},trigger:function(a,b){return this.each(function(){ib.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?ib.event.trigger(a,b,c,!0):void 0}}),function(a,b){function c(a){return ob.test(a+"")}function d(){var a,b=[];return a=function(c,d){return b.push(c+=" ")>y.cacheLength&&delete a[b.shift()],a[c]=d}}function e(a){return a[N]=!0,a}function f(a){var b=F.createElement("div");try{return a(b)}catch(c){return!1}finally{b=null}}function g(a,b,c,d){var e,f,g,h,i,j,k,n,o,p;if((b?b.ownerDocument||b:O)!==F&&E(b),b=b||F,c=c||[],!a||"string"!=typeof a)return c;if(1!==(h=b.nodeType)&&9!==h)return[];if(!H&&!d){if(e=pb.exec(a))if(g=e[1]){if(9===h){if(f=b.getElementById(g),!f||!f.parentNode)return c;if(f.id===g)return c.push(f),c}else if(b.ownerDocument&&(f=b.ownerDocument.getElementById(g))&&L(b,f)&&f.id===g)return c.push(f),c}else{if(e[2])return Z.apply(c,$.call(b.getElementsByTagName(a),0)),c;if((g=e[3])&&P.getByClassName&&b.getElementsByClassName)return Z.apply(c,$.call(b.getElementsByClassName(g),0)),c}if(P.qsa&&!I.test(a)){if(k=!0,n=N,o=b,p=9===h&&a,1===h&&"object"!==b.nodeName.toLowerCase()){for(j=l(a),(k=b.getAttribute("id"))?n=k.replace(sb,"\\$&"):b.setAttribute("id",n),n="[id='"+n+"'] ",i=j.length;i--;)j[i]=n+m(j[i]);o=nb.test(a)&&b.parentNode||b,p=j.join(",")}if(p)try{return Z.apply(c,$.call(o.querySelectorAll(p),0)),c}catch(q){}finally{k||b.removeAttribute("id")}}}return u(a.replace(gb,"$1"),b,c,d)}function h(a,b){var c=b&&a,d=c&&(~b.sourceIndex||W)-(~a.sourceIndex||W);if(d)return d;if(c)for(;c=c.nextSibling;)if(c===b)return-1;return a?1:-1}function i(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function j(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function k(a){return e(function(b){return b=+b,e(function(c,d){for(var e,f=a([],c.length,b),g=f.length;g--;)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function l(a,b){var c,d,e,f,h,i,j,k=T[a+" "];if(k)return b?0:k.slice(0);for(h=a,i=[],j=y.preFilter;h;){(!c||(d=hb.exec(h)))&&(d&&(h=h.slice(d[0].length)||h),i.push(e=[])),c=!1,(d=jb.exec(h))&&(c=d.shift(),e.push({value:c,type:d[0].replace(gb," ")}),h=h.slice(c.length));for(f in y.filter)!(d=mb[f].exec(h))||j[f]&&!(d=j[f](d))||(c=d.shift(),e.push({value:c,type:f,matches:d}),h=h.slice(c.length));if(!c)break}return b?h.length:h?g.error(a):T(a,i).slice(0)}function m(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function n(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=R++;return b.first?function(b,c,f){for(;b=b[d];)if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=Q+" "+f;if(g){for(;b=b[d];)if((1===b.nodeType||e)&&a(b,c,g))return!0}else for(;b=b[d];)if(1===b.nodeType||e)if(j=b[N]||(b[N]={}),(i=j[d])&&i[0]===k){if((h=i[1])===!0||h===x)return h===!0}else if(i=j[d]=[k],i[1]=a(b,c,g)||x,i[1]===!0)return!0}}function o(a){return a.length>1?function(b,c,d){for(var e=a.length;e--;)if(!a[e](b,c,d))return!1;return!0}:a[0]}function p(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function q(a,b,c,d,f,g){return d&&!d[N]&&(d=q(d)),f&&!f[N]&&(f=q(f,g)),e(function(e,g,h,i){var j,k,l,m=[],n=[],o=g.length,q=e||t(b||"*",h.nodeType?[h]:h,[]),r=!a||!e&&b?q:p(q,m,a,h,i),s=c?f||(e?a:o||d)?[]:g:r;if(c&&c(r,s,h,i),d)for(j=p(s,n),d(j,[],h,i),k=j.length;k--;)(l=j[k])&&(s[n[k]]=!(r[n[k]]=l));if(e){if(f||a){if(f){for(j=[],k=s.length;k--;)(l=s[k])&&j.push(r[k]=l);f(null,s=[],j,i)}for(k=s.length;k--;)(l=s[k])&&(j=f?_.call(e,l):m[k])>-1&&(e[j]=!(g[j]=l))}}else s=p(s===g?s.splice(o,s.length):s),f?f(null,g,s,i):Z.apply(g,s)})}function r(a){for(var b,c,d,e=a.length,f=y.relative[a[0].type],g=f||y.relative[" "],h=f?1:0,i=n(function(a){return a===b},g,!0),j=n(function(a){return _.call(b,a)>-1},g,!0),k=[function(a,c,d){return!f&&(d||c!==D)||((b=c).nodeType?i(a,c,d):j(a,c,d))}];e>h;h++)if(c=y.relative[a[h].type])k=[n(o(k),c)];else{if(c=y.filter[a[h].type].apply(null,a[h].matches),c[N]){for(d=++h;e>d&&!y.relative[a[d].type];d++);return q(h>1&&o(k),h>1&&m(a.slice(0,h-1)).replace(gb,"$1"),c,d>h&&r(a.slice(h,d)),e>d&&r(a=a.slice(d)),e>d&&m(a))}k.push(c)}return o(k)}function s(a,b){var c=0,d=b.length>0,f=a.length>0,h=function(e,h,i,j,k){var l,m,n,o=[],q=0,r="0",s=e&&[],t=null!=k,u=D,v=e||f&&y.find.TAG("*",k&&h.parentNode||h),w=Q+=null==u?1:Math.random()||.1;for(t&&(D=h!==F&&h,x=c);null!=(l=v[r]);r++){if(f&&l){for(m=0;n=a[m++];)if(n(l,h,i)){j.push(l);break}t&&(Q=w,x=++c)}d&&((l=!n&&l)&&q--,e&&s.push(l))}if(q+=r,d&&r!==q){for(m=0;n=b[m++];)n(s,o,h,i);if(e){if(q>0)for(;r--;)s[r]||o[r]||(o[r]=Y.call(j));o=p(o)}Z.apply(j,o),t&&!e&&o.length>0&&q+b.length>1&&g.uniqueSort(j)}return t&&(Q=w,D=u),s};return d?e(h):h}function t(a,b,c){for(var d=0,e=b.length;e>d;d++)g(a,b[d],c);return c}function u(a,b,c,d){var e,f,g,h,i,j=l(a);if(!d&&1===j.length){if(f=j[0]=j[0].slice(0),f.length>2&&"ID"===(g=f[0]).type&&9===b.nodeType&&!H&&y.relative[f[1].type]){if(b=y.find.ID(g.matches[0].replace(ub,vb),b)[0],!b)return c;a=a.slice(f.shift().value.length)}for(e=mb.needsContext.test(a)?0:f.length;e--&&(g=f[e],!y.relative[h=g.type]);)if((i=y.find[h])&&(d=i(g.matches[0].replace(ub,vb),nb.test(f[0].type)&&b.parentNode||b))){if(f.splice(e,1),a=d.length&&m(f),!a)return Z.apply(c,$.call(d,0)),c;break}}return B(a,j)(d,b,H,c,nb.test(a)),c}function v(){}var w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N="sizzle"+-new Date,O=a.document,P={},Q=0,R=0,S=d(),T=d(),U=d(),V=typeof b,W=1<<31,X=[],Y=X.pop,Z=X.push,$=X.slice,_=X.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},ab="[\\x20\\t\\r\\n\\f]",bb="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",cb=bb.replace("w","w#"),db="([*^$|!~]?=)",eb="\\["+ab+"*("+bb+")"+ab+"*(?:"+db+ab+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+cb+")|)|)"+ab+"*\\]",fb=":("+bb+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+eb.replace(3,8)+")*)|.*)\\)|)",gb=new RegExp("^"+ab+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ab+"+$","g"),hb=new RegExp("^"+ab+"*,"+ab+"*"),jb=new RegExp("^"+ab+"*([\\x20\\t\\r\\n\\f>+~])"+ab+"*"),kb=new RegExp(fb),lb=new RegExp("^"+cb+"$"),mb={ID:new RegExp("^#("+bb+")"),CLASS:new RegExp("^\\.("+bb+")"),NAME:new RegExp("^\\[name=['\"]?("+bb+")['\"]?\\]"),TAG:new RegExp("^("+bb.replace("w","w*")+")"),ATTR:new RegExp("^"+eb),PSEUDO:new RegExp("^"+fb),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ab+"*(even|odd|(([+-]|)(\\d*)n|)"+ab+"*(?:([+-]|)"+ab+"*(\\d+)|))"+ab+"*\\)|)","i"),needsContext:new RegExp("^"+ab+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ab+"*((?:-\\d)?\\d*)"+ab+"*\\)|)(?=[^-]|$)","i")},nb=/[\x20\t\r\n\f]*[+~]/,ob=/^[^{]+\{\s*\[native code/,pb=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,qb=/^(?:input|select|textarea|button)$/i,rb=/^h\d$/i,sb=/'|\\/g,tb=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,ub=/\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,vb=function(a,b){var c="0x"+b-65536;return c!==c?b:0>c?String.fromCharCode(c+65536):String.fromCharCode(c>>10|55296,1023&c|56320)};try{$.call(O.documentElement.childNodes,0)[0].nodeType}catch(wb){$=function(a){for(var b,c=[];b=this[a++];)c.push(b);return c}}A=g.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},E=g.setDocument=function(a){var d=a?a.ownerDocument||a:O;return d!==F&&9===d.nodeType&&d.documentElement?(F=d,G=d.documentElement,H=A(d),P.tagNameNoComments=f(function(a){return a.appendChild(d.createComment("")),!a.getElementsByTagName("*").length}),P.attributes=f(function(a){a.innerHTML="<select></select>";var b=typeof a.lastChild.getAttribute("multiple");return"boolean"!==b&&"string"!==b}),P.getByClassName=f(function(a){return a.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",a.getElementsByClassName&&a.getElementsByClassName("e").length?(a.lastChild.className="e",2===a.getElementsByClassName("e").length):!1}),P.getByName=f(function(a){a.id=N+0,a.innerHTML="<a name='"+N+"'></a><div name='"+N+"'></div>",G.insertBefore(a,G.firstChild);var b=d.getElementsByName&&d.getElementsByName(N).length===2+d.getElementsByName(N+0).length;return P.getIdNotName=!d.getElementById(N),G.removeChild(a),b}),y.attrHandle=f(function(a){return a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!==V&&"#"===a.firstChild.getAttribute("href")})?{}:{href:function(a){return a.getAttribute("href",2)},type:function(a){return a.getAttribute("type")}},P.getIdNotName?(y.find.ID=function(a,b){if(typeof b.getElementById!==V&&!H){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},y.filter.ID=function(a){var b=a.replace(ub,vb);return function(a){return a.getAttribute("id")===b}}):(y.find.ID=function(a,c){if(typeof c.getElementById!==V&&!H){var d=c.getElementById(a);return d?d.id===a||typeof d.getAttributeNode!==V&&d.getAttributeNode("id").value===a?[d]:b:[]}},y.filter.ID=function(a){var b=a.replace(ub,vb);return function(a){var c=typeof a.getAttributeNode!==V&&a.getAttributeNode("id");return c&&c.value===b}}),y.find.TAG=P.tagNameNoComments?function(a,b){return typeof b.getElementsByTagName!==V?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){for(;c=f[e++];)1===c.nodeType&&d.push(c);return d}return f},y.find.NAME=P.getByName&&function(a,b){return typeof b.getElementsByName!==V?b.getElementsByName(name):void 0},y.find.CLASS=P.getByClassName&&function(a,b){return typeof b.getElementsByClassName===V||H?void 0:b.getElementsByClassName(a)},J=[],I=[":focus"],(P.qsa=c(d.querySelectorAll))&&(f(function(a){a.innerHTML="<select><option selected=''></option></select>",a.querySelectorAll("[selected]").length||I.push("\\["+ab+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),a.querySelectorAll(":checked").length||I.push(":checked")}),f(function(a){a.innerHTML="<input type='hidden' i=''/>",a.querySelectorAll("[i^='']").length&&I.push("[*^$]="+ab+"*(?:\"\"|'')"),a.querySelectorAll(":enabled").length||I.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),I.push(",.*:")})),(P.matchesSelector=c(K=G.matchesSelector||G.mozMatchesSelector||G.webkitMatchesSelector||G.oMatchesSelector||G.msMatchesSelector))&&f(function(a){P.disconnectedMatch=K.call(a,"div"),K.call(a,"[s!='']:x"),J.push("!=",fb)}),I=new RegExp(I.join("|")),J=new RegExp(J.join("|")),L=c(G.contains)||G.compareDocumentPosition?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)for(;b=b.parentNode;)if(b===a)return!0;return!1},M=G.compareDocumentPosition?function(a,b){var c;return a===b?(C=!0,0):(c=b.compareDocumentPosition&&a.compareDocumentPosition&&a.compareDocumentPosition(b))?1&c||a.parentNode&&11===a.parentNode.nodeType?a===d||L(O,a)?-1:b===d||L(O,b)?1:0:4&c?-1:1:a.compareDocumentPosition?-1:1}:function(a,b){var c,e=0,f=a.parentNode,g=b.parentNode,i=[a],j=[b];if(a===b)return C=!0,0;if(!f||!g)return a===d?-1:b===d?1:f?-1:g?1:0;if(f===g)return h(a,b);for(c=a;c=c.parentNode;)i.unshift(c);for(c=b;c=c.parentNode;)j.unshift(c);for(;i[e]===j[e];)e++;return e?h(i[e],j[e]):i[e]===O?-1:j[e]===O?1:0},C=!1,[0,0].sort(M),P.detectDuplicates=C,F):F},g.matches=function(a,b){return g(a,null,null,b)},g.matchesSelector=function(a,b){if((a.ownerDocument||a)!==F&&E(a),b=b.replace(tb,"='$1']"),!(!P.matchesSelector||H||J&&J.test(b)||I.test(b)))try{var c=K.call(a,b);if(c||P.disconnectedMatch||a.document&&11!==a.document.nodeType)return c}catch(d){}return g(b,F,null,[a]).length>0},g.contains=function(a,b){return(a.ownerDocument||a)!==F&&E(a),L(a,b)},g.attr=function(a,b){var c;return(a.ownerDocument||a)!==F&&E(a),H||(b=b.toLowerCase()),(c=y.attrHandle[b])?c(a):H||P.attributes?a.getAttribute(b):((c=a.getAttributeNode(b))||a.getAttribute(b))&&a[b]===!0?b:c&&c.specified?c.value:null},g.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},g.uniqueSort=function(a){var b,c=[],d=1,e=0;if(C=!P.detectDuplicates,a.sort(M),C){for(;b=a[d];d++)b===a[d-1]&&(e=c.push(d));for(;e--;)a.splice(c[e],1)}return a},z=g.getText=function(a){var b,c="",d=0,e=a.nodeType;if(e){if(1===e||9===e||11===e){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=z(a)}else if(3===e||4===e)return a.nodeValue}else for(;b=a[d];d++)c+=z(b);return c},y=g.selectors={cacheLength:50,createPseudo:e,match:mb,find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ub,vb),a[3]=(a[4]||a[5]||"").replace(ub,vb),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||g.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&g.error(a[0]),a},PSEUDO:function(a){var b,c=!a[5]&&a[2];return mb.CHILD.test(a[0])?null:(a[4]?a[2]=a[4]:c&&kb.test(c)&&(b=l(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){return"*"===a?function(){return!0}:(a=a.replace(ub,vb).toLowerCase(),function(b){return b.nodeName&&b.nodeName.toLowerCase()===a})},CLASS:function(a){var b=S[a+" "];return b||(b=new RegExp("(^|"+ab+")"+a+"("+ab+"|$)"))&&S(a,function(a){return b.test(a.className||typeof a.getAttribute!==V&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=g.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){for(;p;){for(l=b;l=l[p];)if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){for(k=q[N]||(q[N]={}),j=k[a]||[],n=j[0]===Q&&j[1],m=j[0]===Q&&j[2],l=n&&q.childNodes[n];l=++n&&l&&l[p]||(m=n=0)||o.pop();)if(1===l.nodeType&&++m&&l===b){k[a]=[Q,n,m];break}}else if(s&&(j=(b[N]||(b[N]={}))[a])&&j[0]===Q)m=j[1];else for(;(l=++n&&l&&l[p]||(m=n=0)||o.pop())&&((h?l.nodeName.toLowerCase()!==r:1!==l.nodeType)||!++m||(s&&((l[N]||(l[N]={}))[a]=[Q,m]),l!==b)););return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,d=y.pseudos[a]||y.setFilters[a.toLowerCase()]||g.error("unsupported pseudo: "+a);return d[N]?d(b):d.length>1?(c=[a,a,"",b],y.setFilters.hasOwnProperty(a.toLowerCase())?e(function(a,c){for(var e,f=d(a,b),g=f.length;g--;)e=_.call(a,f[g]),a[e]=!(c[e]=f[g])}):function(a){return d(a,0,c)}):d}},pseudos:{not:e(function(a){var b=[],c=[],d=B(a.replace(gb,"$1"));return d[N]?e(function(a,b,c,e){for(var f,g=d(a,null,e,[]),h=a.length;h--;)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:e(function(a){return function(b){return g(a,b).length>0}}),contains:e(function(a){return function(b){return(b.textContent||b.innerText||z(b)).indexOf(a)>-1}}),lang:e(function(a){return lb.test(a||"")||g.error("unsupported lang: "+a),a=a.replace(ub,vb).toLowerCase(),function(b){var c;do if(c=H?b.getAttribute("xml:lang")||b.getAttribute("lang"):b.lang)return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===G},focus:function(a){return a===F.activeElement&&(!F.hasFocus||F.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeName>"@"||3===a.nodeType||4===a.nodeType)return!1;return!0},parent:function(a){return!y.pseudos.empty(a)},header:function(a){return rb.test(a.nodeName)},input:function(a){return qb.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||b.toLowerCase()===a.type)},first:k(function(){return[0]}),last:k(function(a,b){return[b-1]}),eq:k(function(a,b,c){return[0>c?c+b:c]}),even:k(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:k(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:k(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:k(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}};for(w in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})y.pseudos[w]=i(w);for(w in{submit:!0,reset:!0})y.pseudos[w]=j(w);B=g.compile=function(a,b){var c,d=[],e=[],f=U[a+" "];if(!f){for(b||(b=l(a)),c=b.length;c--;)f=r(b[c]),f[N]?d.push(f):e.push(f);f=U(a,s(e,d))}return f},y.pseudos.nth=y.pseudos.eq,y.filters=v.prototype=y.pseudos,y.setFilters=new v,E(),g.attr=ib.attr,ib.find=g,ib.expr=g.selectors,ib.expr[":"]=ib.expr.pseudos,ib.unique=g.uniqueSort,ib.text=g.getText,ib.isXMLDoc=g.isXML,ib.contains=g.contains}(a);var Pb=/Until$/,Qb=/^(?:parents|prev(?:Until|All))/,Rb=/^.[^:#\[\.,]*$/,Sb=ib.expr.match.needsContext,Tb={children:!0,contents:!0,next:!0,prev:!0};
ib.fn.extend({find:function(a){var b,c,d,e=this.length;if("string"!=typeof a)return d=this,this.pushStack(ib(a).filter(function(){for(b=0;e>b;b++)if(ib.contains(d[b],this))return!0}));for(c=[],b=0;e>b;b++)ib.find(a,this[b],c);return c=this.pushStack(e>1?ib.unique(c):c),c.selector=(this.selector?this.selector+" ":"")+a,c},has:function(a){var b,c=ib(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(ib.contains(this,c[b]))return!0})},not:function(a){return this.pushStack(l(this,a,!1))},filter:function(a){return this.pushStack(l(this,a,!0))},is:function(a){return!!a&&("string"==typeof a?Sb.test(a)?ib(a,this.context).index(this[0])>=0:ib.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=Sb.test(a)||"string"!=typeof a?ib(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c.ownerDocument&&c!==b&&11!==c.nodeType;){if(g?g.index(c)>-1:ib.find.matchesSelector(c,a)){f.push(c);break}c=c.parentNode}return this.pushStack(f.length>1?ib.unique(f):f)},index:function(a){return a?"string"==typeof a?ib.inArray(this[0],ib(a)):ib.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){var c="string"==typeof a?ib(a,b):ib.makeArray(a&&a.nodeType?[a]:a),d=ib.merge(this.get(),c);return this.pushStack(ib.unique(d))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}}),ib.fn.andSelf=ib.fn.addBack,ib.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return ib.dir(a,"parentNode")},parentsUntil:function(a,b,c){return ib.dir(a,"parentNode",c)},next:function(a){return k(a,"nextSibling")},prev:function(a){return k(a,"previousSibling")},nextAll:function(a){return ib.dir(a,"nextSibling")},prevAll:function(a){return ib.dir(a,"previousSibling")},nextUntil:function(a,b,c){return ib.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return ib.dir(a,"previousSibling",c)},siblings:function(a){return ib.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return ib.sibling(a.firstChild)},contents:function(a){return ib.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:ib.merge([],a.childNodes)}},function(a,b){ib.fn[a]=function(c,d){var e=ib.map(this,b,c);return Pb.test(a)||(d=c),d&&"string"==typeof d&&(e=ib.filter(d,e)),e=this.length>1&&!Tb[a]?ib.unique(e):e,this.length>1&&Qb.test(a)&&(e=e.reverse()),this.pushStack(e)}}),ib.extend({filter:function(a,b,c){return c&&(a=":not("+a+")"),1===b.length?ib.find.matchesSelector(b[0],a)?[b[0]]:[]:ib.find.matches(a,b)},dir:function(a,c,d){for(var e=[],f=a[c];f&&9!==f.nodeType&&(d===b||1!==f.nodeType||!ib(f).is(d));)1===f.nodeType&&e.push(f),f=f[c];return e},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}});var Ub="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",Vb=/ jQuery\d+="(?:null|\d+)"/g,Wb=new RegExp("<(?:"+Ub+")[\\s/>]","i"),Xb=/^\s+/,Yb=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,Zb=/<([\w:]+)/,$b=/<tbody/i,_b=/<|&#?\w+;/,ac=/<(?:script|style|link)/i,bc=/^(?:checkbox|radio)$/i,cc=/checked\s*(?:[^=]|=\s*.checked.)/i,dc=/^$|\/(?:java|ecma)script/i,ec=/^true\/(.*)/,fc=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,gc={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:ib.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},hc=m(W),ic=hc.appendChild(W.createElement("div"));gc.optgroup=gc.option,gc.tbody=gc.tfoot=gc.colgroup=gc.caption=gc.thead,gc.th=gc.td,ib.fn.extend({text:function(a){return ib.access(this,function(a){return a===b?ib.text(this):this.empty().append((this[0]&&this[0].ownerDocument||W).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(ib.isFunction(a))return this.each(function(b){ib(this).wrapAll(a.call(this,b))});if(this[0]){var b=ib(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){for(var a=this;a.firstChild&&1===a.firstChild.nodeType;)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return ib.isFunction(a)?this.each(function(b){ib(this).wrapInner(a.call(this,b))}):this.each(function(){var b=ib(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=ib.isFunction(a);return this.each(function(c){ib(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){ib.nodeName(this,"body")||ib(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&this.insertBefore(a,this.firstChild)})},before:function(){return this.domManip(arguments,!1,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,!1,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=0;null!=(c=this[d]);d++)(!a||ib.filter(a,[c]).length>0)&&(b||1!==c.nodeType||ib.cleanData(t(c)),c.parentNode&&(b&&ib.contains(c.ownerDocument,c)&&q(t(c,"script")),c.parentNode.removeChild(c)));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){for(1===a.nodeType&&ib.cleanData(t(a,!1));a.firstChild;)a.removeChild(a.firstChild);a.options&&ib.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return ib.clone(this,a,b)})},html:function(a){return ib.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return 1===c.nodeType?c.innerHTML.replace(Vb,""):b;if(!("string"!=typeof a||ac.test(a)||!ib.support.htmlSerialize&&Wb.test(a)||!ib.support.leadingWhitespace&&Xb.test(a)||gc[(Zb.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(Yb,"<$1></$2>");try{for(;e>d;d++)c=this[d]||{},1===c.nodeType&&(ib.cleanData(t(c,!1)),c.innerHTML=a);c=0}catch(f){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){var b=ib.isFunction(a);return b||"string"==typeof a||(a=ib(a).not(this).detach()),this.domManip([a],!0,function(a){var b=this.nextSibling,c=this.parentNode;c&&(ib(this).remove(),c.insertBefore(a,b))})},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){a=bb.apply([],a);var e,f,g,h,i,j,k=0,l=this.length,m=this,q=l-1,r=a[0],s=ib.isFunction(r);if(s||!(1>=l||"string"!=typeof r||ib.support.checkClone)&&cc.test(r))return this.each(function(e){var f=m.eq(e);s&&(a[0]=r.call(this,e,c?f.html():b)),f.domManip(a,c,d)});if(l&&(j=ib.buildFragment(a,this[0].ownerDocument,!1,this),e=j.firstChild,1===j.childNodes.length&&(j=e),e)){for(c=c&&ib.nodeName(e,"tr"),h=ib.map(t(j,"script"),o),g=h.length;l>k;k++)f=j,k!==q&&(f=ib.clone(f,!0,!0),g&&ib.merge(h,t(f,"script"))),d.call(c&&ib.nodeName(this[k],"table")?n(this[k],"tbody"):this[k],f,k);if(g)for(i=h[h.length-1].ownerDocument,ib.map(h,p),k=0;g>k;k++)f=h[k],dc.test(f.type||"")&&!ib._data(f,"globalEval")&&ib.contains(i,f)&&(f.src?ib.ajax({url:f.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):ib.globalEval((f.text||f.textContent||f.innerHTML||"").replace(fc,"")));j=e=null}return this}}),ib.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){ib.fn[a]=function(a){for(var c,d=0,e=[],f=ib(a),g=f.length-1;g>=d;d++)c=d===g?this:this.clone(!0),ib(f[d])[b](c),cb.apply(e,c.get());return this.pushStack(e)}}),ib.extend({clone:function(a,b,c){var d,e,f,g,h,i=ib.contains(a.ownerDocument,a);if(ib.support.html5Clone||ib.isXMLDoc(a)||!Wb.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(ic.innerHTML=a.outerHTML,ic.removeChild(f=ic.firstChild)),!(ib.support.noCloneEvent&&ib.support.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||ib.isXMLDoc(a)))for(d=t(f),h=t(a),g=0;null!=(e=h[g]);++g)d[g]&&s(e,d[g]);if(b)if(c)for(h=h||t(a),d=d||t(f),g=0;null!=(e=h[g]);g++)r(e,d[g]);else r(a,f);return d=t(f,"script"),d.length>0&&q(d,!i&&t(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k,l=a.length,n=m(b),o=[],p=0;l>p;p++)if(f=a[p],f||0===f)if("object"===ib.type(f))ib.merge(o,f.nodeType?[f]:f);else if(_b.test(f)){for(h=h||n.appendChild(b.createElement("div")),i=(Zb.exec(f)||["",""])[1].toLowerCase(),k=gc[i]||gc._default,h.innerHTML=k[1]+f.replace(Yb,"<$1></$2>")+k[2],e=k[0];e--;)h=h.lastChild;if(!ib.support.leadingWhitespace&&Xb.test(f)&&o.push(b.createTextNode(Xb.exec(f)[0])),!ib.support.tbody)for(f="table"!==i||$b.test(f)?"<table>"!==k[1]||$b.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;e--;)ib.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j);for(ib.merge(o,h.childNodes),h.textContent="";h.firstChild;)h.removeChild(h.firstChild);h=n.lastChild}else o.push(b.createTextNode(f));for(h&&n.removeChild(h),ib.support.appendChecked||ib.grep(t(o,"input"),u),p=0;f=o[p++];)if((!d||-1===ib.inArray(f,d))&&(g=ib.contains(f.ownerDocument,f),h=t(n.appendChild(f),"script"),g&&q(h),c))for(e=0;f=h[e++];)dc.test(f.type||"")&&c.push(f);return h=null,n},cleanData:function(a,b){for(var c,d,e,f,g=0,h=ib.expando,i=ib.cache,j=ib.support.deleteExpando,k=ib.event.special;null!=(c=a[g]);g++)if((b||ib.acceptData(c))&&(e=c[h],f=e&&i[e])){if(f.events)for(d in f.events)k[d]?ib.event.remove(c,d):ib.removeEvent(c,d,f.handle);i[e]&&(delete i[e],j?delete c[h]:typeof c.removeAttribute!==V?c.removeAttribute(h):c[h]=null,_.push(e))}}});var jc,kc,lc,mc=/alpha\([^)]*\)/i,nc=/opacity\s*=\s*([^)]*)/,oc=/^(top|right|bottom|left)$/,pc=/^(none|table(?!-c[ea]).+)/,qc=/^margin/,rc=new RegExp("^("+jb+")(.*)$","i"),sc=new RegExp("^("+jb+")(?!px)[a-z%]+$","i"),tc=new RegExp("^([+-])=("+jb+")","i"),uc={BODY:"block"},vc={position:"absolute",visibility:"hidden",display:"block"},wc={letterSpacing:0,fontWeight:400},xc=["Top","Right","Bottom","Left"],yc=["Webkit","O","Moz","ms"];ib.fn.extend({css:function(a,c){return ib.access(this,function(a,c,d){var e,f,g={},h=0;if(ib.isArray(c)){for(f=kc(a),e=c.length;e>h;h++)g[c[h]]=ib.css(a,c[h],!1,f);return g}return d!==b?ib.style(a,c,d):ib.css(a,c)},a,c,arguments.length>1)},show:function(){return x(this,!0)},hide:function(){return x(this)},toggle:function(a){var b="boolean"==typeof a;return this.each(function(){(b?a:w(this))?ib(this).show():ib(this).hide()})}}),ib.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=lc(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":ib.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var f,g,h,i=ib.camelCase(c),j=a.style;if(c=ib.cssProps[i]||(ib.cssProps[i]=v(j,i)),h=ib.cssHooks[c]||ib.cssHooks[i],d===b)return h&&"get"in h&&(f=h.get(a,!1,e))!==b?f:j[c];if(g=typeof d,"string"===g&&(f=tc.exec(d))&&(d=(f[1]+1)*f[2]+parseFloat(ib.css(a,c)),g="number"),!(null==d||"number"===g&&isNaN(d)||("number"!==g||ib.cssNumber[i]||(d+="px"),ib.support.clearCloneStyle||""!==d||0!==c.indexOf("background")||(j[c]="inherit"),h&&"set"in h&&(d=h.set(a,d,e))===b)))try{j[c]=d}catch(k){}}},css:function(a,c,d,e){var f,g,h,i=ib.camelCase(c);return c=ib.cssProps[i]||(ib.cssProps[i]=v(a.style,i)),h=ib.cssHooks[c]||ib.cssHooks[i],h&&"get"in h&&(g=h.get(a,!0,d)),g===b&&(g=lc(a,c,e)),"normal"===g&&c in wc&&(g=wc[c]),""===d||d?(f=parseFloat(g),d===!0||ib.isNumeric(f)?f||0:g):g},swap:function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e}}),a.getComputedStyle?(kc=function(b){return a.getComputedStyle(b,null)},lc=function(a,c,d){var e,f,g,h=d||kc(a),i=h?h.getPropertyValue(c)||h[c]:b,j=a.style;return h&&(""!==i||ib.contains(a.ownerDocument,a)||(i=ib.style(a,c)),sc.test(i)&&qc.test(c)&&(e=j.width,f=j.minWidth,g=j.maxWidth,j.minWidth=j.maxWidth=j.width=i,i=h.width,j.width=e,j.minWidth=f,j.maxWidth=g)),i}):W.documentElement.currentStyle&&(kc=function(a){return a.currentStyle},lc=function(a,c,d){var e,f,g,h=d||kc(a),i=h?h[c]:b,j=a.style;return null==i&&j&&j[c]&&(i=j[c]),sc.test(i)&&!oc.test(c)&&(e=j.left,f=a.runtimeStyle,g=f&&f.left,g&&(f.left=a.currentStyle.left),j.left="fontSize"===c?"1em":i,i=j.pixelLeft+"px",j.left=e,g&&(f.left=g)),""===i?"auto":i}),ib.each(["height","width"],function(a,b){ib.cssHooks[b]={get:function(a,c,d){return c?0===a.offsetWidth&&pc.test(ib.css(a,"display"))?ib.swap(a,vc,function(){return A(a,b,d)}):A(a,b,d):void 0},set:function(a,c,d){var e=d&&kc(a);return y(a,c,d?z(a,b,d,ib.support.boxSizing&&"border-box"===ib.css(a,"boxSizing",!1,e),e):0)}}}),ib.support.opacity||(ib.cssHooks.opacity={get:function(a,b){return nc.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=ib.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===ib.trim(f.replace(mc,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=mc.test(f)?f.replace(mc,e):f+" "+e)}}),ib(function(){ib.support.reliableMarginRight||(ib.cssHooks.marginRight={get:function(a,b){return b?ib.swap(a,{display:"inline-block"},lc,[a,"marginRight"]):void 0}}),!ib.support.pixelPosition&&ib.fn.position&&ib.each(["top","left"],function(a,b){ib.cssHooks[b]={get:function(a,c){return c?(c=lc(a,b),sc.test(c)?ib(a).position()[b]+"px":c):void 0}}})}),ib.expr&&ib.expr.filters&&(ib.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!ib.support.reliableHiddenOffsets&&"none"===(a.style&&a.style.display||ib.css(a,"display"))},ib.expr.filters.visible=function(a){return!ib.expr.filters.hidden(a)}),ib.each({margin:"",padding:"",border:"Width"},function(a,b){ib.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+xc[d]+b]=f[d]||f[d-2]||f[0];return e}},qc.test(a)||(ib.cssHooks[a+b].set=y)});var zc=/%20/g,Ac=/\[\]$/,Bc=/\r?\n/g,Cc=/^(?:submit|button|image|reset|file)$/i,Dc=/^(?:input|select|textarea|keygen)/i;ib.fn.extend({serialize:function(){return ib.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=ib.prop(this,"elements");return a?ib.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!ib(this).is(":disabled")&&Dc.test(this.nodeName)&&!Cc.test(a)&&(this.checked||!bc.test(a))}).map(function(a,b){var c=ib(this).val();return null==c?null:ib.isArray(c)?ib.map(c,function(a){return{name:b.name,value:a.replace(Bc,"\r\n")}}):{name:b.name,value:c.replace(Bc,"\r\n")}}).get()}}),ib.param=function(a,c){var d,e=[],f=function(a,b){b=ib.isFunction(b)?b():null==b?"":b,e[e.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(c===b&&(c=ib.ajaxSettings&&ib.ajaxSettings.traditional),ib.isArray(a)||a.jquery&&!ib.isPlainObject(a))ib.each(a,function(){f(this.name,this.value)});else for(d in a)D(d,a[d],c,f);return e.join("&").replace(zc,"+")},ib.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){ib.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),ib.fn.hover=function(a,b){return this.mouseenter(a).mouseleave(b||a)};var Ec,Fc,Gc=ib.now(),Hc=/\?/,Ic=/#.*$/,Jc=/([?&])_=[^&]*/,Kc=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Lc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Mc=/^(?:GET|HEAD)$/,Nc=/^\/\//,Oc=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Pc=ib.fn.load,Qc={},Rc={},Sc="*/".concat("*");try{Fc=X.href}catch(Tc){Fc=W.createElement("a"),Fc.href="",Fc=Fc.href}Ec=Oc.exec(Fc.toLowerCase())||[],ib.fn.load=function(a,c,d){if("string"!=typeof a&&Pc)return Pc.apply(this,arguments);var e,f,g,h=this,i=a.indexOf(" ");return i>=0&&(e=a.slice(i,a.length),a=a.slice(0,i)),ib.isFunction(c)?(d=c,c=b):c&&"object"==typeof c&&(g="POST"),h.length>0&&ib.ajax({url:a,type:g,dataType:"html",data:c}).done(function(a){f=arguments,h.html(e?ib("<div>").append(ib.parseHTML(a)).find(e):a)}).complete(d&&function(a,b){h.each(d,f||[a.responseText,b,a])}),this},ib.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){ib.fn[b]=function(a){return this.on(b,a)}}),ib.each(["get","post"],function(a,c){ib[c]=function(a,d,e,f){return ib.isFunction(d)&&(f=f||e,e=d,d=b),ib.ajax({url:a,type:c,dataType:f,data:d,success:e})}}),ib.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Fc,type:"GET",isLocal:Lc.test(Ec[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Sc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":ib.parseJSON,"text xml":ib.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?G(G(a,ib.ajaxSettings),b):G(ib.ajaxSettings,a)},ajaxPrefilter:E(Qc),ajaxTransport:E(Rc),ajax:function(a,c){function d(a,c,d,e){var f,l,s,t,v,x=c;2!==u&&(u=2,i&&clearTimeout(i),k=b,h=e||"",w.readyState=a>0?4:0,d&&(t=H(m,w,d)),a>=200&&300>a||304===a?(m.ifModified&&(v=w.getResponseHeader("Last-Modified"),v&&(ib.lastModified[g]=v),v=w.getResponseHeader("etag"),v&&(ib.etag[g]=v)),204===a?(f=!0,x="nocontent"):304===a?(f=!0,x="notmodified"):(f=I(m,t),x=f.state,l=f.data,s=f.error,f=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),w.status=a,w.statusText=(c||x)+"",f?p.resolveWith(n,[l,x,w]):p.rejectWith(n,[w,x,s]),w.statusCode(r),r=b,j&&o.trigger(f?"ajaxSuccess":"ajaxError",[w,m,f?l:s]),q.fireWith(n,[w,x]),j&&(o.trigger("ajaxComplete",[w,m]),--ib.active||ib.event.trigger("ajaxStop")))}"object"==typeof a&&(c=a,a=b),c=c||{};var e,f,g,h,i,j,k,l,m=ib.ajaxSetup({},c),n=m.context||m,o=m.context&&(n.nodeType||n.jquery)?ib(n):ib.event,p=ib.Deferred(),q=ib.Callbacks("once memory"),r=m.statusCode||{},s={},t={},u=0,v="canceled",w={readyState:0,getResponseHeader:function(a){var b;if(2===u){if(!l)for(l={};b=Kc.exec(h);)l[b[1].toLowerCase()]=b[2];b=l[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===u?h:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return u||(a=t[c]=t[c]||a,s[a]=b),this},overrideMimeType:function(a){return u||(m.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>u)for(b in a)r[b]=[r[b],a[b]];else w.always(a[w.status]);return this},abort:function(a){var b=a||v;return k&&k.abort(b),d(0,b),this}};if(p.promise(w).complete=q.add,w.success=w.done,w.error=w.fail,m.url=((a||m.url||Fc)+"").replace(Ic,"").replace(Nc,Ec[1]+"//"),m.type=c.method||c.type||m.method||m.type,m.dataTypes=ib.trim(m.dataType||"*").toLowerCase().match(kb)||[""],null==m.crossDomain&&(e=Oc.exec(m.url.toLowerCase()),m.crossDomain=!(!e||e[1]===Ec[1]&&e[2]===Ec[2]&&(e[3]||("http:"===e[1]?80:443))==(Ec[3]||("http:"===Ec[1]?80:443)))),m.data&&m.processData&&"string"!=typeof m.data&&(m.data=ib.param(m.data,m.traditional)),F(Qc,m,c,w),2===u)return w;j=m.global,j&&0===ib.active++&&ib.event.trigger("ajaxStart"),m.type=m.type.toUpperCase(),m.hasContent=!Mc.test(m.type),g=m.url,m.hasContent||(m.data&&(g=m.url+=(Hc.test(g)?"&":"?")+m.data,delete m.data),m.cache===!1&&(m.url=Jc.test(g)?g.replace(Jc,"$1_="+Gc++):g+(Hc.test(g)?"&":"?")+"_="+Gc++)),m.ifModified&&(ib.lastModified[g]&&w.setRequestHeader("If-Modified-Since",ib.lastModified[g]),ib.etag[g]&&w.setRequestHeader("If-None-Match",ib.etag[g])),(m.data&&m.hasContent&&m.contentType!==!1||c.contentType)&&w.setRequestHeader("Content-Type",m.contentType),w.setRequestHeader("Accept",m.dataTypes[0]&&m.accepts[m.dataTypes[0]]?m.accepts[m.dataTypes[0]]+("*"!==m.dataTypes[0]?", "+Sc+"; q=0.01":""):m.accepts["*"]);for(f in m.headers)w.setRequestHeader(f,m.headers[f]);if(m.beforeSend&&(m.beforeSend.call(n,w,m)===!1||2===u))return w.abort();v="abort";for(f in{success:1,error:1,complete:1})w[f](m[f]);if(k=F(Rc,m,c,w)){w.readyState=1,j&&o.trigger("ajaxSend",[w,m]),m.async&&m.timeout>0&&(i=setTimeout(function(){w.abort("timeout")},m.timeout));try{u=1,k.send(s,d)}catch(x){if(!(2>u))throw x;d(-1,x)}}else d(-1,"No Transport");return w},getScript:function(a,c){return ib.get(a,b,c,"script")},getJSON:function(a,b,c){return ib.get(a,b,c,"json")}}),ib.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return ib.globalEval(a),a}}}),ib.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),ib.ajaxTransport("script",function(a){if(a.crossDomain){var c,d=W.head||ib("head")[0]||W.documentElement;return{send:function(b,e){c=W.createElement("script"),c.async=!0,a.scriptCharset&&(c.charset=a.scriptCharset),c.src=a.url,c.onload=c.onreadystatechange=function(a,b){(b||!c.readyState||/loaded|complete/.test(c.readyState))&&(c.onload=c.onreadystatechange=null,c.parentNode&&c.parentNode.removeChild(c),c=null,b||e(200,"success"))},d.insertBefore(c,d.firstChild)},abort:function(){c&&c.onload(b,!0)}}}});var Uc=[],Vc=/(=)\?(?=&|$)|\?\?/;ib.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Uc.pop()||ib.expando+"_"+Gc++;return this[a]=!0,a}}),ib.ajaxPrefilter("json jsonp",function(c,d,e){var f,g,h,i=c.jsonp!==!1&&(Vc.test(c.url)?"url":"string"==typeof c.data&&!(c.contentType||"").indexOf("application/x-www-form-urlencoded")&&Vc.test(c.data)&&"data");return i||"jsonp"===c.dataTypes[0]?(f=c.jsonpCallback=ib.isFunction(c.jsonpCallback)?c.jsonpCallback():c.jsonpCallback,i?c[i]=c[i].replace(Vc,"$1"+f):c.jsonp!==!1&&(c.url+=(Hc.test(c.url)?"&":"?")+c.jsonp+"="+f),c.converters["script json"]=function(){return h||ib.error(f+" was not called"),h[0]},c.dataTypes[0]="json",g=a[f],a[f]=function(){h=arguments},e.always(function(){a[f]=g,c[f]&&(c.jsonpCallback=d.jsonpCallback,Uc.push(f)),h&&ib.isFunction(g)&&g(h[0]),h=g=b}),"script"):void 0});var Wc,Xc,Yc=0,Zc=a.ActiveXObject&&function(){var a;for(a in Wc)Wc[a](b,!0)};ib.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&J()||K()}:J,Xc=ib.ajaxSettings.xhr(),ib.support.cors=!!Xc&&"withCredentials"in Xc,Xc=ib.support.ajax=!!Xc,Xc&&ib.ajaxTransport(function(c){if(!c.crossDomain||ib.support.cors){var d;return{send:function(e,f){var g,h,i=c.xhr();if(c.username?i.open(c.type,c.url,c.async,c.username,c.password):i.open(c.type,c.url,c.async),c.xhrFields)for(h in c.xhrFields)i[h]=c.xhrFields[h];c.mimeType&&i.overrideMimeType&&i.overrideMimeType(c.mimeType),c.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");try{for(h in e)i.setRequestHeader(h,e[h])}catch(j){}i.send(c.hasContent&&c.data||null),d=function(a,e){var h,j,k,l;try{if(d&&(e||4===i.readyState))if(d=b,g&&(i.onreadystatechange=ib.noop,Zc&&delete Wc[g]),e)4!==i.readyState&&i.abort();else{l={},h=i.status,j=i.getAllResponseHeaders(),"string"==typeof i.responseText&&(l.text=i.responseText);try{k=i.statusText}catch(m){k=""}h||!c.isLocal||c.crossDomain?1223===h&&(h=204):h=l.text?200:404}}catch(n){e||f(-1,n)}l&&f(h,k,l,j)},c.async?4===i.readyState?setTimeout(d):(g=++Yc,Zc&&(Wc||(Wc={},ib(a).unload(Zc)),Wc[g]=d),i.onreadystatechange=d):d()},abort:function(){d&&d(b,!0)}}}});var $c,_c,ad=/^(?:toggle|show|hide)$/,bd=new RegExp("^(?:([+-])=|)("+jb+")([a-z%]*)$","i"),cd=/queueHooks$/,dd=[P],ed={"*":[function(a,b){var c,d,e=this.createTween(a,b),f=bd.exec(b),g=e.cur(),h=+g||0,i=1,j=20;if(f){if(c=+f[2],d=f[3]||(ib.cssNumber[a]?"":"px"),"px"!==d&&h){h=ib.css(e.elem,a,!0)||c||1;do i=i||".5",h/=i,ib.style(e.elem,a,h+d);while(i!==(i=e.cur()/g)&&1!==i&&--j)}e.unit=d,e.start=h,e.end=f[1]?h+(f[1]+1)*c:c}return e}]};ib.Animation=ib.extend(N,{tweener:function(a,b){ib.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],ed[c]=ed[c]||[],ed[c].unshift(b)},prefilter:function(a,b){b?dd.unshift(a):dd.push(a)}}),ib.Tween=Q,Q.prototype={constructor:Q,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(ib.cssNumber[c]?"":"px")},cur:function(){var a=Q.propHooks[this.prop];return a&&a.get?a.get(this):Q.propHooks._default.get(this)},run:function(a){var b,c=Q.propHooks[this.prop];return this.pos=b=this.options.duration?ib.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Q.propHooks._default.set(this),this}},Q.prototype.init.prototype=Q.prototype,Q.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=ib.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){ib.fx.step[a.prop]?ib.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[ib.cssProps[a.prop]]||ib.cssHooks[a.prop])?ib.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Q.propHooks.scrollTop=Q.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},ib.each(["toggle","show","hide"],function(a,b){var c=ib.fn[b];ib.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(R(b,!0),a,d,e)}}),ib.fn.extend({fadeTo:function(a,b,c,d){return this.filter(w).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=ib.isEmptyObject(a),f=ib.speed(b,c,d),g=function(){var b=N(this,ib.extend({},a),f);g.finish=function(){b.stop(!0)},(e||ib._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,c,d){var e=function(a){var b=a.stop;delete a.stop,b(d)};return"string"!=typeof a&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,c=null!=a&&a+"queueHooks",f=ib.timers,g=ib._data(this);if(c)g[c]&&g[c].stop&&e(g[c]);else for(c in g)g[c]&&g[c].stop&&cd.test(c)&&e(g[c]);for(c=f.length;c--;)f[c].elem!==this||null!=a&&f[c].queue!==a||(f[c].anim.stop(d),b=!1,f.splice(c,1));(b||!d)&&ib.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=ib._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=ib.timers,g=d?d.length:0;for(c.finish=!0,ib.queue(this,a,[]),e&&e.cur&&e.cur.finish&&e.cur.finish.call(this),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),ib.each({slideDown:R("show"),slideUp:R("hide"),slideToggle:R("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){ib.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),ib.speed=function(a,b,c){var d=a&&"object"==typeof a?ib.extend({},a):{complete:c||!c&&b||ib.isFunction(a)&&a,duration:a,easing:c&&b||b&&!ib.isFunction(b)&&b};return d.duration=ib.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in ib.fx.speeds?ib.fx.speeds[d.duration]:ib.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){ib.isFunction(d.old)&&d.old.call(this),d.queue&&ib.dequeue(this,d.queue)},d},ib.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},ib.timers=[],ib.fx=Q.prototype.init,ib.fx.tick=function(){var a,c=ib.timers,d=0;for($c=ib.now();d<c.length;d++)a=c[d],a()||c[d]!==a||c.splice(d--,1);c.length||ib.fx.stop(),$c=b},ib.fx.timer=function(a){a()&&ib.timers.push(a)&&ib.fx.start()},ib.fx.interval=13,ib.fx.start=function(){_c||(_c=setInterval(ib.fx.tick,ib.fx.interval))},ib.fx.stop=function(){clearInterval(_c),_c=null},ib.fx.speeds={slow:600,fast:200,_default:400},ib.fx.step={},ib.expr&&ib.expr.filters&&(ib.expr.filters.animated=function(a){return ib.grep(ib.timers,function(b){return a===b.elem}).length}),ib.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){ib.offset.setOffset(this,a,b)});var c,d,e={top:0,left:0},f=this[0],g=f&&f.ownerDocument;if(g)return c=g.documentElement,ib.contains(c,f)?(typeof f.getBoundingClientRect!==V&&(e=f.getBoundingClientRect()),d=S(g),{top:e.top+(d.pageYOffset||c.scrollTop)-(c.clientTop||0),left:e.left+(d.pageXOffset||c.scrollLeft)-(c.clientLeft||0)}):e},ib.offset={setOffset:function(a,b,c){var d=ib.css(a,"position");"static"===d&&(a.style.position="relative");var e,f,g=ib(a),h=g.offset(),i=ib.css(a,"top"),j=ib.css(a,"left"),k=("absolute"===d||"fixed"===d)&&ib.inArray("auto",[i,j])>-1,l={},m={};k?(m=g.position(),e=m.top,f=m.left):(e=parseFloat(i)||0,f=parseFloat(j)||0),ib.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(l.top=b.top-h.top+e),null!=b.left&&(l.left=b.left-h.left+f),"using"in b?b.using.call(a,l):g.css(l)}},ib.fn.extend({position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===ib.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),ib.nodeName(a[0],"html")||(c=a.offset()),c.top+=ib.css(a[0],"borderTopWidth",!0),c.left+=ib.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-ib.css(d,"marginTop",!0),left:b.left-c.left-ib.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||W.documentElement;a&&!ib.nodeName(a,"html")&&"static"===ib.css(a,"position");)a=a.offsetParent;return a||W.documentElement})}}),ib.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);ib.fn[a]=function(e){return ib.access(this,function(a,e,f){var g=S(a);return f===b?g?c in g?g[c]:g.document.documentElement[e]:a[e]:(g?g.scrollTo(d?ib(g).scrollLeft():f,d?f:ib(g).scrollTop()):a[e]=f,void 0)},a,e,arguments.length,null)}}),ib.each({Height:"height",Width:"width"},function(a,c){ib.each({padding:"inner"+a,content:c,"":"outer"+a},function(d,e){ib.fn[e]=function(e,f){var g=arguments.length&&(d||"boolean"!=typeof e),h=d||(e===!0||f===!0?"margin":"border");return ib.access(this,function(c,d,e){var f;return ib.isWindow(c)?c.document.documentElement["client"+a]:9===c.nodeType?(f=c.documentElement,Math.max(c.body["scroll"+a],f["scroll"+a],c.body["offset"+a],f["offset"+a],f["client"+a])):e===b?ib.css(c,d,h):ib.style(c,d,e,h)},c,g?e:b,g,null)}})}),a.jQuery=a.$=ib,"function"==typeof define&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return ib})}(window),FastClick.prototype.deviceIsAndroid=navigator.userAgent.indexOf("Android")>0,FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),FastClick.prototype.needsClick=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(this.deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(a.className)},FastClick.prototype.needsFocus=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"textarea":case"select":return!0;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},FastClick.prototype.sendClick=function(a,b){"use strict";
var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent("click",!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},FastClick.prototype.focus=function(a){"use strict";var b;this.deviceIsIOS&&a.setSelectionRange?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},FastClick.prototype.updateScrollParent=function(a){"use strict";var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(a){"use strict";return a.nodeType===Node.TEXT_NODE?a.parentNode:a},FastClick.prototype.onTouchStart=function(a){"use strict";var b,c,d;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),c=a.targetTouches[0],this.deviceIsIOS){if(d=window.getSelection(),d.rangeCount&&!d.isCollapsed)return!0;if(!this.deviceIsIOS4){if(c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=c.pageX,this.touchStartY=c.pageY,a.timeStamp-this.lastClickTime<200&&a.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(a){"use strict";var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},FastClick.prototype.onTouchMove=function(a){"use strict";return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},FastClick.prototype.findControl=function(a){"use strict";return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(a){"use strict";var b,c,d,e,f,g=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<200)return this.cancelNextClick=!0,!0;if(this.lastClickTime=a.timeStamp,c=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,this.deviceIsIOSWithBadTarget&&(f=a.changedTouches[0],g=document.elementFromPoint(f.pageX-window.pageXOffset,f.pageY-window.pageYOffset)||g,g.fastClickScrollParent=this.targetElement.fastClickScrollParent),d=g.tagName.toLowerCase(),"label"===d){if(b=this.findControl(g)){if(this.focus(g),this.deviceIsAndroid)return!1;g=b}}else if(this.needsFocus(g))return a.timeStamp-c>100||this.deviceIsIOS&&window.top!==window&&"input"===d?(this.targetElement=null,!1):(this.focus(g),this.deviceIsIOS4&&"select"===d||(this.targetElement=null,a.preventDefault()),!1);return this.deviceIsIOS&&!this.deviceIsIOS4&&(e=g.fastClickScrollParent,e&&e.fastClickLastScrollTop!==e.scrollTop)?!0:(this.needsClick(g)||(a.preventDefault(),this.sendClick(g,a)),!1)},FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(a){"use strict";return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0:!0},FastClick.prototype.onClick=function(a){"use strict";var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},FastClick.prototype.destroy=function(){"use strict";var a=this.layer;this.deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(a){"use strict";var b;if("undefined"==typeof window.ontouchstart)return!0;if(/Chrome\/[0-9]+/.test(navigator.userAgent)){if(!FastClick.prototype.deviceIsAndroid)return!0;if(b=document.querySelector("meta[name=viewport]"),b&&-1!==b.content.indexOf("user-scalable=no"))return!0}return"none"===a.style.msTouchAction?!0:!1},FastClick.attach=function(a){"use strict";return new FastClick(a)},"undefined"!=typeof define&&define.amd?define(function(){"use strict";return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick,function(a,b,c){"use strict";a.fn.backstretch=function(d,f){return(d===c||0===d.length)&&a.error("No images were supplied for Backstretch"),0===a(b).scrollTop()&&b.scrollTo(0,0),this.each(function(){var b=a(this),c=b.data("backstretch");if(c){if("string"==typeof d&&"function"==typeof c[d])return c[d](f),void 0;f=a.extend(c.options,f),c.destroy(!0)}c=new e(this,d,f),b.data("backstretch",c)})},a.backstretch=function(b,c){return a("body").backstretch(b,c).data("backstretch")},a.expr[":"].backstretch=function(b){return a(b).data("backstretch")!==c},a.fn.backstretch.defaults={centeredX:!0,centeredY:!0,duration:5e3,fade:0};var d={wrap:{left:0,top:0,overflow:"hidden",margin:0,padding:0,height:"100%",width:"100%",zIndex:-999999},img:{position:"absolute",display:"none",margin:0,padding:0,border:"none",width:"auto",height:"auto",maxHeight:"none",maxWidth:"none",zIndex:-999999}},e=function(c,e,g){this.options=a.extend({},a.fn.backstretch.defaults,g||{}),this.images=a.isArray(e)?e:[e],a.each(this.images,function(){a("<img />")[0].src=this}),this.isBody=c===document.body,this.$container=a(c),this.$root=this.isBody?f?a(b):a(document):this.$container;var h=this.$container.children(".backstretch").first();if(this.$wrap=h.length?h:a('<div class="backstretch"></div>').css(d.wrap).appendTo(this.$container),!this.isBody){var i=this.$container.css("position"),j=this.$container.css("zIndex");this.$container.css({position:"static"===i?"relative":i,zIndex:"auto"===j?0:j,background:"none"}),this.$wrap.css({zIndex:-999998})}this.$wrap.css({position:this.isBody&&f?"fixed":"absolute"}),this.index=0,this.show(this.index),a(b).on("resize.backstretch",a.proxy(this.resize,this)).on("orientationchange.backstretch",a.proxy(function(){this.isBody&&0===b.pageYOffset&&(b.scrollTo(0,1),this.resize())},this))};e.prototype={resize:function(){try{var a,c={left:0,top:0},d=this.isBody?this.$root.width():this.$root.innerWidth(),e=d,f=this.isBody?b.innerHeight?b.innerHeight:this.$root.height():this.$root.innerHeight(),g=e/this.$img.data("ratio");g>=f?(a=(g-f)/2,this.options.centeredY&&(c.top="-"+a+"px")):(g=f,e=g*this.$img.data("ratio"),a=(e-d)/2,this.options.centeredX&&(c.left="-"+a+"px")),this.$wrap.css({width:d,height:f}).find("img:not(.deleteable)").css({width:e,height:g}).css(c)}catch(h){}return this},show:function(b){if(!(Math.abs(b)>this.images.length-1)){var c=this,e=c.$wrap.find("img").addClass("deleteable"),f={relatedTarget:c.$container[0]};return c.$container.trigger(a.Event("backstretch.before",f),[c,b]),this.index=b,clearInterval(c.interval),c.$img=a("<img />").css(d.img).bind("load",function(d){var g=this.width||a(d.target).width(),h=this.height||a(d.target).height();a(this).data("ratio",g/h),a(this).fadeIn(c.options.speed||c.options.fade,function(){e.remove(),c.paused||c.cycle(),a(["after","show"]).each(function(){c.$container.trigger(a.Event("backstretch."+this,f),[c,b])})}),c.resize()}).appendTo(c.$wrap),c.$img.attr("src",c.images[b]),c}},next:function(){return this.show(this.index<this.images.length-1?this.index+1:0)},prev:function(){return this.show(0===this.index?this.images.length-1:this.index-1)},pause:function(){return this.paused=!0,this},resume:function(){return this.paused=!1,this.next(),this},cycle:function(){return this.images.length>1&&(clearInterval(this.interval),this.interval=setInterval(a.proxy(function(){this.paused||this.next()},this),this.options.duration)),this},destroy:function(c){a(b).off("resize.backstretch orientationchange.backstretch"),clearInterval(this.interval),c||this.$wrap.remove(),this.$container.removeData("backstretch")}};var f=function(){var a=navigator.userAgent,c=navigator.platform,d=a.match(/AppleWebKit\/([0-9]+)/),e=!!d&&d[1],f=a.match(/Fennec\/([0-9]+)/),g=!!f&&f[1],h=a.match(/Opera Mobi\/([0-9]+)/),i=!!h&&h[1],j=a.match(/MSIE ([0-9]+)/),k=!!j&&j[1];return!((c.indexOf("iPhone")>-1||c.indexOf("iPad")>-1||c.indexOf("iPod")>-1)&&e&&534>e||b.operamini&&"[object OperaMini]"==={}.toString.call(b.operamini)||h&&7458>i||a.indexOf("Android")>-1&&e&&533>e||g&&6>g||"palmGetResource"in b&&e&&534>e||a.indexOf("MeeGo")>-1&&a.indexOf("NokiaBrowser/8.5.0")>-1||k&&6>=k)}()}(jQuery,window),$(function(){FastClick.attach(document.body),console.log("fastclick in the house")}),$header=$("#page-header"),$shareButtons=$(".shareButtons"),$shareContainer=$(".shareContainer"),$("#mobileMenuToggle").on("click",function(){$header.toggleClass("active"),$(this).toggleClass("active")}),$(".shareToggle").on("click",function(a){a.preventDefault(),$shareButtons.toggleClass("active")}),$(".home .big-image").on("click",function(){return window.location=window.location+"/work",!1});var previousScroll=0;isMobile===!0&&$(window).scroll(function(){var a=$(this).scrollTop();a>previousScroll?(console.log("down"),$shareContainer.fadeOut()):(console.log("up"),$shareContainer.fadeIn()),previousScroll=a}),$("body").hasClass("home")&&($bgImage=$(".big-image"),$src=$bgImage.attr("src"),$bgImage.hide(),$.backstretch($(".big-image").attr("src")),console.log("mobile backstretch"));
jQuery(document).ready(function($) {
	
	// PAGE: WORKS
	var windowWidth = $(window).width();
	var windowHeight = $(window).height() - 104;
	$('.swiper-container').css('height', windowHeight);
	var slides = 3;
	if(isMobile === true) {
		slides = 1;
	}

	
	if(windowWidth > 1500) {
		slides = 5;
	}

    var workSwiper = new Swiper('.swiper-loop',{
	    slidesPerView: slides,
	    keyboardControl: true,
	    mousewheelControl: true,
	    loop: true
	  });
    $('.previous').click(function(e){
			e.preventDefault();
			workSwiper.swipePrev();
	});
    $('.next').click(function(e){
			e.preventDefault();
			workSwiper.swipeNext();
	});


    if(!isMobile) {
		$(".nextPrevIcon i").approach({
			"opacity": 1
		}, 200);
    }
	
	
	$nav = $('.nextPrevIcon.previous');
	
	
	$(".work-slide").click(function(){
	     window.location=$(this).find("a").attr("href");  
	     return false;
	});

	var slideImgHeight = $('.work-slide img').height();
	if(windowHeight > slideImgHeight) {
		$('.series-wrapper').css('bottom', windowHeight - slideImgHeight);
	}

});