/*
 * Smart Animated Popup v2.0
 * https://www.smartplugins.info/plugin/javascript/smart-animated-popup/
 * 
 * Copyright 2008 - 2021 Milan Petrovic (email: support@dev4press.com)
 * 
 * https://www.dev4press.com
 * https://www.smartplugins.info
 *
 */

/*jslint regexp: true, nomen: true, undef: true, sloppy: true, eqeq: true, vars: true, white: true, plusplus: true, maxerr: 50, indent: 4 */
/*global Base, jQuery*/

var smartAniPopup, 
    smpIDSequence = 1;

;(function ($, window, document, undefined) {
    smartAniPopup = function(element, options) {
        return new smartAniPopup.Core(element, options);
    };

    smartAniPopup.Base = Base.extend({
        version: "2.0",

        constructor: function(_default, options) {
            if (typeof _default !== "object") {
                _default = {};
            }

            if (typeof options !== "object") {
                options = {};
            }

            this.setOptions($.extend(true, {}, _default, options));
        },
        setOption: function(index, value) {
            this[index] = value;
        },
        getOption: function(index) {
            if (this[index]) {
                return this[index];
            }

            return false;
        },
        setOptions: function(options) {
            var key;

            for (key in options) {
                if (typeof options[key] !== "undefined") {
                    this.setOption(key, options[key]);
                }
            }
        },
        getOptions: function() {
            return this;
        },
        callback: function(method) {
            if (typeof method === "function") {
                var args = [], i;

                for (i = 1; i <= arguments.length; i++) {
                    if (arguments[i]) {
                        args.push(arguments[i]);
                    }
                }

                method.apply(this, args);
            }
        }
    });

    smartAniPopup.Core = smartAniPopup.Base.extend({
        $useCookie: false,
        $skin: false,
        $obj: false,
        $overlay: false,
        $id: false,

        skin: "Base",
        settings: {},
        callbacks: {
            beforeOpen: false,
            afterOpen: false,
            beforeClose: false,
            afterClose: false
        },

        constructor: function(element, options) {
            this.base(options);

            this.$useCookie = typeof Cookies !== "undefined";

            this.$id = smpIDSequence;
            this.$obj = $(element);

            this.$skin = this._loadSkin(this.skin, this.settings);

            smpIDSequence++;
        },
        open: function() {
            this.$skin._open(this.$skin);
        },
        close: function() {
            this.$skin._close(this.$skin);
        },
        get: function(name) {
            if (name === "cookie") {
                name = "$cookie";
            } else if (name === "status") {
                name = "$status";
            }

            return this.$skin[name];
        },
        resize: function(size) {
            this.$skin._resize(size);
        },
        randomFromArray: function(input) {
            var idx = Math.floor((Math.random() * input.length));

            return input[idx];
        },
        _loadSkin: function(name, options) {
            if (!smartAniPopup[name + "Skin"]) {
                name = "Base";
            }

            return new smartAniPopup[name + "Skin"](this, options);
        }
    });

    smartAniPopup.Skin = smartAniPopup.Base.extend({
        $skinCode: '',
        $core: false,
        $cookie: 1,
        $enabled: true,
        $status: "closed",
        $htmlClass: "",
        $animation: [
            "slit",
            "slithor",
            "bounce",
            "roll"
        ],
        $mode: "transition",
        $effects: [
            "none",
            "fade",
            "scale",
            "zoomfade",
            "slideinright",
            "slideinleft",
            "slideintop",
            "slideinbottom",
            "newspaper",
            "fallcenter",
            "fallleft",
            "fallright",
            "fliphorleft",
            "fliphorright",
            "flipvertop",
            "flipverbottom",
            "flipsign",
            "flipsignfront",
            "slit",
            "slithor",
            "bounce",
            "roll",
            "rotatebottom",
            "rotatetop",
            "rotateleft",
            "rotateright"
        ],
        $props: {
            overlay: {
                zIndex: "z-index",
                overlayColor: "background"
            },
            dialog: {
                width: "width",
                height: "height",
                minWidth: "min-width",
                maxWidth: "max-width",
                minHeight: "min-height",
                maxHeight: "max-height"
            },
            content: {
                cWidth: "width",
                cHeight: "height"
            }
        },
        $classes: {
            html: "sanp-active",
            htmlEffectPrefix: "sanp-effect-",
            overlay: "sanp-overlay",
            overlayIDPrefix: "sanp-overlay-",
            overlayActive: "sanp-active",
            skinPrefix: "sanp-skin-",
            titleIDPrefix: "sanp-dialog-title-",
            dialog: "sanp-dialog",
            dialogIDPrefix: "sanp-dialog-",
            dialogEffectPrefix: "sanp-effect-",
            dialogActive: "sanp-active",
            dialogInactive: "sanp-inactive",
            wrapper: "sanp-wrapper",
            header: "sanp-header",
            content: "sanp-content",
            footer: "sanp-footer",
            srOnly: "sanp-sr-only",
            closeButton: "sanp-button-close",
            drag: "sanp-drag",
            grip: "sanp-grip"
        },

        role: "dialog",
        modal: true,
        zIndex: 1000000,
        title: true,
        titleTag: "h5",
        style: "sanp-style-plain-white",
        containerSelector: "body",
        extraClass: "",

        effect: "random",
        effectSpeed: 0.7,

        onLoad: true,
        onLoadDelay: 500,
        onLeaveTop: false,
        onLeaveTopOffset: 3,
        onLeaveViewport: false,

        closeEscape: true,
        closeOverlay: true,
        closeAuto: false,
        closeAutoDelay: 0,

        overlayActive: true,
        overlayColor: "#ffffff",
        overlayOpacity: 0.7,
        overlaySpeed: 0.07,

        angle: 0,
        width: "40%",
        height: "auto",
        cWidth: "auto",
        cHeight: "auto",
        minWidth: "200px",
        maxWidth: "95%",
        positionX: "center",
        positionY: "center",
        offsetX: "10px",
        offsetY: "10px",

        minHeight: null,
        maxHeight: null,

        header: true,
        headerContent: false,
        footer: true,
        footerContent: false,

        buttonX: true,
        buttonXContent: "&#x2716;",
        buttonFooter: true,
        buttonFooterContent: "Close",
        ariaCloseLabel: "Close this dialog",

        cookieCode: "smart-animated-popup",

        autoShowLimit: false,
        autoShowCounter: 5,
        autoShowDelay: 7,

        attrWrapper: "",
        attrHeader: "",
        attrContent: "",
        attrFooter: "",

        xContentSize: false,

        constructor: function(core, options) {
            this.base(options);
            this.$core = core;

            if (this.effect === "random") {
                this.effect = this.$core.randomFromArray(this.$effects);
            }

            this._setMode();
            this._cookieInit();
            this._prepareDialog();

            if (this.modal) {
                if (this.overlayActive) {
                    this.createOverlay();

                    if (this.closeOverlay) {
                        this._overlayClick();
                    }
                } else {
                    this.createModalay();
                }
            }

            if (this.closeEscape) {
                this._escapeClick();
            }

            this.createDialog();

            if (this.onLoad) {
                this._onLoad();
            }

            if (this.onLeaveTop) {
                this._onLeaveTop();
            }

            if (this.onLeaveViewport) {
                this._onLeaveViewport();
            }

            var $this = this;

            $(window).on("resize orientationchange", function() {
                $this._calculatePosition(false);
            });

            this._buttonClick();
            this._finishDialog();
        },
        container: function() {
            return $(this.containerSelector).length === 1 ? $(this.containerSelector) : $("body");
        },
        createModalay: function() {
            var style = ["z-index: " + this.zIndex + ";"];

            this.container().append("<div style='" + style.join(" ") + "' class='" + this.$classes.overlay + " " + this.css("overlay") + "'></div>");
        },
        createOverlay: function() {
            var style = this.props("overlay");

            style.push("transition: all " + this.overlaySpeed + "s;");

            this.container().append("<div style='" + style.join(" ") + "' class='" + this.$classes.overlay + " " + this.css("overlay") + "'></div>");
        },
        createDialog: function() {
            var title = "", html, style = this.props("dialog"),
                wrapper = [], $this = this, css = [
                    this.$classes.dialog,
                    this.css("skin"),
                    this.css("dialog"),
                    this.css("effect"),
                    this.style,
                    this.extraClass
                ], content = this.props("content");

            if (this.title === true) {
                title = this.o().data("title");
            } else if (this.title !== false) {
                title = this.title;
            }

            if (this.angle !== 0) {
                style.push("transform: rotate(" + this.angle + "deg);");
            }

            style.push("z-index: " + (this.zIndex + 1) + ";");

            if ($this.$mode === "transition") {
                wrapper.push("-webkit-transition: all " + this.effectSpeed + "s;");
                wrapper.push("transition: all " + this.effectSpeed + "s;");
            }

            html = "<div class='" + css.join(" ") + "' style='" + style.join(" ") + "'";

            if (this.role !== "") {
                html+= " role='" + this.role + "'";
            }

            if (title !== "" && this.headerContent === false) {
                html+= " aria-labelledby='" + this.css("title") + "'";
            }

            html+= this.attrWrapper;
            html+= "><div class='" + this.$classes.wrapper + "' style='" + wrapper.join(" ") + "'>";

            if (this.buttonX) {
                html+= "<button type='button' class='" + this.$classes.closeButton + "'><span aria-hidden='true'>" + this.buttonXContent + "</span><span class='" + this.$classes.srOnly + "'>" + this.ariaCloseLabel + "</span></button>";
            }

            if (this.header) {
                html+= "<div class='" + this.$classes.header + "'" + this.attrHeader + ">";

                if (this.headerContent === false && title !== "") {
                    html+= "<" + this.titleTag + " id='" + this.css("title") + "'>" + title + "</" + this.titleTag + ">";
                }

                html+= "</div>";
            }

            html+= "<div class='" + this.$classes.content + "' style='" + content.join(" ") + "'" + this.attrContent + "></div>";

            if (this.footer) {
                html+= "<div class='" + this.$classes.footer + "'" + this.attrFooter + ">";

                if (this.footerContent === false && this.buttonFooter) {
                    html+= "<button type='button' class='" + this.$classes.closeButton + "'><span aria-hidden='true'>" + this.buttonFooterContent + "</span><span class='" + this.$classes.srOnly + "'>" + this.ariaCloseLabel + "</span></button>";
                }

                html+= this._appendToFooter();

                html+= "</div>";
            }

            html+= "</div>";
            html+= "</div>";

            this.container().append(html);

            if (this.headerContent !== false) {
                $("." + this.css("dialog") + " ." + this.$classes.header).append(this.headerContent);
            }

            if (this.footerContent !== false) {
                $("." + this.css("dialog") + " ." + this.$classes.footer).append(this.footerContent);
            }

            $("." + this.css("dialog") + " ." + this.$classes.content).append(this.o());

            this.o().show();

            $this._calculatePosition(true);
        },
        open: function($this, disable) {
            if (!$this.$enabled || $this.$cookie === 0) {
                return false;
            }

            var open = $this._open($this);

            if (open) {
                if (disable) {
                    $this.$enabled = false;
                }

                if ($this.autoShowLimit) {
                    $this.$cookie--;

                    $this._cookieSave();
                }
            }

            return open;
        },
        close: function($this) {
            return $this._close($this);
        },
        css: function(name) {
            switch (name) {
                case "title":
                    return this.$classes.titleIDPrefix + this.$core.$id;
                case "overlay":
                    return this.$classes.overlayIDPrefix + this.$core.$id;
                case "dialog":
                    return this.$classes.dialogIDPrefix + this.$core.$id;
                case "wrapper":
                    return this.$classes.dialogIDPrefix + this.$core.$id + " ." + this.$classes.wrapper;
                case "content":
                    return this.$classes.dialogIDPrefix + this.$core.$id + " ." + this.$classes.content;
                case "effect":
                    return this.$classes.dialogEffectPrefix + this.effect;
                case "skin":
                    return this.$classes.skinPrefix + this.$skinCode;
            }
        },
        props: function(name) {
            var $this = this, style = [];

            $.each(this.$props[name], function(idx, prop){
                if ($this[idx]) {
                    style.push(prop + ":" + $this[idx] + ";");
                }
            });

            return style;
        },
        o: function() {
            return this.$core.$obj;
        },
        w: function() {
            return $("." + this.css("wrapper"));
        },
        _resize: function(size) {
            var mod = $.extend({
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                }, size),
                dialog = $("." + this.css("dialog"));

            dialog.offset({ top: mod.top, left: mod.left});
            dialog.width(mod.width);
            dialog.height(mod.height);

            this.positionX = mod.left;
            this.positionY = mod.top;

            this._calculatePosition();
        },
        _setMode: function() {
            if ($.inArray(this.effect, this.$animation) > -1) {
                this.$mode = "animation";
            } else if (this.effect === "none") {
                this.$mode = "none";
            }
        },
        _open: function($this) {
            if ($this.$status === "opened") {
                return false;
            }

            $this._beforeOpen($this);

            $this.callback($this.$core.callbacks.beforeOpen, $this.$core);

            $this.$htmlClass = $this.$classes.html + " " + $this.$classes.htmlEffectPrefix + $this.effect;

            if ($this.modal) {
                $("html").addClass($this.$htmlClass);
            }

            var el = $("." + $this.css("dialog"));

            el.addClass($this.$classes.dialogActive);

            if ($this.$mode === "animation") {
                el.removeClass($this.$classes.dialogInactive);
            }

            $("." + $this.css("overlay")).css("opacity", $this.overlayOpacity)
                                         .addClass($this.$classes.overlayActive);

            $this._calculatePosition();

            $this.$status = "opened";

            $this.callback($this.$core.callbacks.afterOpen, $this.$core);

            if ($this.closeAuto && $this.closeAutoDelay > 0) {
                $this._autoClose();
            }

            $this._afterOpen($this);

            return true;
        },
        _close: function($this) {
            if ($this.$status === "closed") {
                return false;
            }

            $this.callback($this.$core.callbacks.beforeClose, $this.$core);

            $("html").removeClass(this.$htmlClass);

            var el = $("." + $this.css("dialog"));

            el.removeClass($this.$classes.dialogActive);

            if ($this.$mode === "animation") {
                el.addClass($this.$classes.dialogInactive);
            }

            $("." + $this.css("overlay")).css("opacity", 0)
                                         .removeClass($this.$classes.overlayActive);

            $this.$status = "closed";

            $this.callback($this.$core.callbacks.afterClose, $this.$core);

            return true;
        },
        _calculateContent: function() {
            var d = $("." + this.css("dialog")), dH = d.outerHeight(), 
                h = $("." + this.css("dialog") + " ." + this.$classes.header), 
                f = $("." + this.css("dialog") + " ." + this.$classes.footer), 
                c = $("." + this.css("dialog") + " ." + this.$classes.content), 
                inner = c.innerHeight() - c.height();

            if (h.length > 0) {
                inner+= h.outerHeight(true);
            }

            if (f.length > 0) {
                inner+= f.outerHeight(true);
            }

            c.height(dH - inner);
        },
        _calculatePosition: function(init) {
            if (this.$status === "opened" || init) {
                var d = $("." + this.css("dialog")), 
                    dW = d.outerWidth(), dH = d.outerHeight(), 
                    winW = window.innerWidth, winH = window.innerHeight,
                    hor = winW - dW, ver = winH - dH;

                switch (this.positionX) {
                    case "center":
                        d.css("left", ((hor / 2) / (winW / 100)) + "%");
                        break;
                    case "left":
                        d.css("left", this.offsetX);
                        break;
                    case "right":
                        d.css("right", this.offsetX);
                        break;
                    default:
                        d.css("left", this.positionX + "px");
                        break;
                }

                switch (this.positionY) {
                    case "center":
                        d.css("top", ((ver / 2) / (winH / 100)) + "%");
                        break;
                    case "top":
                        d.css("top", this.offsetY);
                        break;
                    case "bottom":
                        d.css("bottom", this.offsetY);
                        break;
                    default:
                        d.css("top", this.positionY + "px");
                        break;
                }

                if (this.xContentSize) {
                    this._calculateContent();
                }
            }
        },
        _buttonClick: function() {
            var $this = this,
                selector = "." + this.css("dialog") + " ." + this.$classes.closeButton;

            $(document).on("click", selector, function(e){
                e.stopPropagation();

                $this.close($this);
            });
        },
        _escapeClick: function() {
            var $this = this;

            $(document).on("keyup", function(e){
                if ($this.$status === "opened" && e.keyCode === 27) {
                    $this.close($this);
                }
            });
        },
        _overlayClick: function() {
            var $this = this,
                selector = "." + this.css("overlay");

            $(document).on("click", selector, function(e){
                e.stopPropagation();

                $this.close($this);
            });
        },
        _onLoad: function() {
            var $this = this;

            setTimeout(function() {
                $this.open($this, false);
            }, this.onLoadDelay);
        },
        _onLeaveViewport: function() {
            var $this = this;

            $(document).mouseleave(function(){
                $this.open($this, true);
            });
        },
        _onLeaveTop: function() {
            var $this = this;

            $(document).on("mousemove", function(event){
                if (event.pageY < $this.onLeaveTopOffset) {
                    $this.open($this, true);
                }
            });
        },
        _beforeOpen: function($this) {},
        _afterOpen: function($this) {},
        _appendToFooter: function() {
            return '';
        },
        _autoClose: function() {
            var $this = this;

            setTimeout(function() {
                $this.close($this);
            }, this.closeAutoDelay);
        },
        _cookieInit: function() {
            if (this.$core.$useCookie && this.autoShowLimit) {
                this.$cookie = parseInt(Cookies.get(this.cookieCode));

                if (isNaN(this.$cookie) || this.$cookie === undefined) {
                    this.$cookie = this.autoShowCounter;
                }
            }
        },
        _cookieSave: function() {
            if (this.$core.$useCookie && this.autoShowLimit) {
                var expire = this.$cookie === 0 ? this.autoShowDelay : 365;

                if (this.$cookie < 0) {
                    this.$cookie = 0;
                }

                Cookies.set(this.cookieCode, this.$cookie, {expires: expire, path: "/"});
            }
        },
        _getRect: function(el) {
            var rect = el.getBoundingClientRect(),
                offsetX = window.scrollX || document.documentElement.scrollLeft,
                offsetY = window.scrollY || document.documentElement.scrollTop;

            return {
                left: rect.left + offsetX,
                top: rect.top + offsetY,
                right: rect.right + offsetX,
                bottom: rect.bottom + offsetY
            };
        },
        _getOffset: function() {
            var rect = this.w()[0].getBoundingClientRect(),
                content = $("." + this.css("content")),
                wrapper = $("." + this.css("wrapper")),
                offsetX = window.scrollX || document.documentElement.scrollLeft,
                offsetY = window.scrollY || document.documentElement.scrollTop;

            return {
                content: {
                    width: content.width(),
                    height: content.height()
                },
                wrapper: {
                    width: wrapper.width(),
                    height: wrapper.height()
                },
                left: rect.left + offsetX,
                top: rect.top + offsetY,
                right: rect.right + offsetX,
                bottom: rect.bottom + offsetY
            };
        },
        _prepareDialog: function() {},
        _finishDialog: function() {}
    });

    smartAniPopup.BaseSkin = smartAniPopup.Skin.extend({
        $skinCode: "base",
    });

    smartAniPopup.FreeSkin = smartAniPopup.Skin.extend({
        $skinCode: "free",
        $cookieUsed: false,
        $cookiePosize: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            cWidth: 0,
            cHeight: 0
        },

        showGrip: false,
        savePosize: true,
        sizeMinWidth: 90,
        sizeMinHeight: 60,
        resizeMargin: 5,

        cookiePositionSizeCode: "smart-animated-popup-posize",

        _prepareDialog: function() {
            if (this.savePosize) {
                var cookie = Cookies.get(this.cookiePositionSizeCode, true);

                if (cookie !== undefined) {
                    cookie = JSON.parse(cookie);
                    this.$cookiePosize = $.extend({
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0,
                        cWidth: 0,
                        cHeight: 0
                    }, cookie);
                    this.$cookieUsed = true;
                }
            }

            if (this.$cookieUsed) {
                if (this.$cookiePosize.cHeight === 0) {
                    this.$cookiePosize.cHeight = this.$cookiePosize.height;
                }

                this.positionX = this.$cookiePosize.left;
                this.positionY = this.$cookiePosize.top;

                this.width = this.$cookiePosize.width + "px";
                this.cHeight = this.$cookiePosize.cHeight + "px";

                this.height = "auto"; //this.$cookiePosize.height + "px";
                this.cWidth = "auto"; //this.$cookiePosize.cWidth + "px";

                if ($(window).width() < this.positionX + this.$cookiePosize.width) {
                    this.positionX = $(window).width() - this.$cookiePosize.width;
                }

                if ($(window).height < this.positionY + this.$cookiePosize.height) {
                    this.positionY = $(window).height - this.$cookiePosize.height;
                }
            }
        },
        _afterOpen: function($this) {
            $this._posizeCookie();
        },
        _appendToFooter: function() {
            return this.showGrip ? '<div class="' + this.$classes.grip + '"></div>' : '';
        },
        _finishDialog: function() {
            this._posizeCookie();

            var $this = this,
                wrapper = "." + this.css("wrapper"),
                grip = wrapper + " ." + this.$classes.grip,
                header = wrapper + " ." + this.$classes.header;

            if (!this.showGrip) {
                $(document).on("mousedown", grip, function(e) {
                    $this.mover._mouseDownWrapper($this, e);
                });

                $(document).on("touchstart", grip, function(e) {
                    $this.mover._mouseDownWrapper($this, e);
                });
            }

            $(document).on("mousedown", wrapper, function(e) {
                $this.mover._mouseDownWrapper($this, e);
            });

            $(document).on("mousedown", header, function(e) {
                $this.mover._mouseDown($this, e);
            });
            $(document).on("mousemove", function(e) {
                $this.mover._mouseMove($this, e);
            });
            $(document).on("mouseup", function(e) {
                $this.mover._mouseUp($this, e);
            });

            $(document).on("touchstart", wrapper, function(e) {
                $this.mover._mouseDownWrapper($this, e);
            });

            $(document).on("touchstart", header, function(e) {
                $this.mover._mouseDown($this, e);
            });
            $(document).on("touchmove", this, function(e) {
                $this.mover._mouseMove($this, e);
            });
            $(document).on("touchend", this, function(e) {
                $this.mover._touchEnd($this, e);
            });
        },
        _posizeCookie: function() {
            if (this.savePosize) {
                var c = $("." + this.css("content")), poSize = {
                    left: this.w().parent().offset().left,
                    top: this.w().parent().offset().top,
                    width: this.w().width(),
                    height: this.w().height(),
                    cWidth: c.width(),
                    cHeight: c.height(),
                };

                Cookies.set(this.cookiePositionSizeCode, poSize);
            }
        },
        mover: {
            dr: undefined,
            width: 0,
            height: 0,
            minLeft: 0,
            maxLeft: 0,
            minTop: 0,
            maxTop: 0,
            posX: 0,
            posY: 0,
            moving: false,
            resizing: false,
            resizeTop: false,
            resizeBottom: false,
            resizeLeft: false,
            resizeRight: false,
            rmX: 0,
            rmY: 0,
            rm: "",

            _mousePos: function(e) {
                var pos = { pageX: 0, pageY: 0, touch: false };

                if (typeof e.clientX === "number") {
                    pos.pageX = e.clientX;
                    pos.pageY = e.clientY;
                } else if (e.originalEvent.touches) {
                    pos.pageX = e.originalEvent.touches[0].clientX;
                    pos.pageY = e.originalEvent.touches[0].clientY;
                    pos.touch = true;
                } else {
                    pos = null;
                }

                return pos;
            },
            _downWrapper: function($this, e) {
                if ($this.mover.rm === "") {
                    return;
                }

                var _pos = $this.mover._mousePos(e);

                $this.mover.resizing = true;
                $this.mover.rmX = _pos.pageX;
                $this.mover.rmY = _pos.pageY;
            },
            _down: function($this, e) {
                if ($this.mover.rm !== "") {
                    return;
                }

                var _pos = $this.mover._mousePos(e);
                
                $this.mover.moving = true;
                $this.mover.dr = $this.w().closest("." + $this.$classes.dialog).addClass($this.$classes.drag);
                $this.mover.width = $this.mover.dr.outerWidth();
                $this.mover.height = $this.mover.dr.outerHeight();

                $this.mover.maxLeft = $(window).width() - $this.mover.width;
                $this.mover.maxTop = $(window).height() - $this.mover.height;

                $this.mover.posX = $this.mover.dr.offset().left + $this.mover.width - _pos.pageX;
                $this.mover.posY = $this.mover.dr.offset().top + $this.mover.height - _pos.pageY;
            },
            _move: function($this, e) {
                var _pos = $this.mover._mousePos(e);

                if ($this.mover.dr !== undefined) {
                    var left = _pos.pageX + $this.mover.posX - $this.mover.width,
                        top = _pos.pageY + $this.mover.posY - $this.mover.height;

                    if (top <= 0 ) {
                        top = 0;
                    }

                    if (left <= 0 ) {
                        left = 0;
                    }

                    if (top >= $this.mover.maxTop) {
                        top = $this.mover.maxTop;
                    }

                    if (left >= $this.mover.maxLeft) {
                        left = $this.mover.maxLeft;
                    }

                    $this.mover.dr.offset({ top: top, left: left});

                    $this.positionX = left;
                    $this.positionY = top;
                }

                if ($this.$status === "opened") {
                    var box = $this._getOffset(),
                        grip = $this.showGrip ? $this._getRect($("." + $this.css("wrapper") + " ." + $this.$classes.grip)[0]) : {},
                        cs = '', inGrip = false;

                    if (!$this.mover.resizing) {
                        var _mod = _pos.touch ? 20 : 0;

                        $this.mover.rm = '';

                        $this.mover.resizeTop = false;
                        $this.mover.resizeLeft = false;
                        $this.mover.resizeBottom = false;
                        $this.mover.resizeRight = false;

                        if ($this.showGrip && _pos.pageY >= grip.top - _mod && _pos.pageY <= grip.bottom && _pos.pageX >= grip.left - _mod && _pos.pageX <= grip.right) {
                            $this.mover.rm = 'se';

                            $this.mover.resizeBottom = true;
                            $this.mover.resizeRight = true;

                            inGrip = true;
                        }

                        if (!inGrip) {
                            if (_pos.pageY >= box.top && _pos.pageY < box.top + $this.resizeMargin) {
                                $this.mover.resizeTop = true;
                                $this.mover.rm += 'n';
                            }

                            if (_pos.pageY <= box.bottom && _pos.pageY > box.bottom - $this.resizeMargin) {
                                $this.mover.resizeBottom = true;
                                $this.mover.rm += 's';
                            }

                            if (_pos.pageX >= box.left && _pos.pageX < box.left + $this.resizeMargin) {
                                $this.mover.resizeLeft = true;
                                $this.mover.rm += 'w';
                            }

                            if (_pos.pageX <= box.right && _pos.pageX > box.right - $this.resizeMargin) {
                                $this.mover.resizeRight = true;
                                $this.mover.rm += 'e';
                            }
                        }

                        if ($this.mover.rm !== "") {
                            if ($this.mover.rm === "n" || $this.mover.rm === "s") {
                                cs = "ns-resize";
                            } else if ($this.mover.rm === "e" || $this.mover.rm === "w") {
                                cs = "ew-resize";
                            } else if ($this.mover.rm === "ne" || $this.mover.rm === "sw") {
                                cs = "nesw-resize";
                            } else if ($this.mover.rm === "nw" || $this.mover.rm === "se") {
                                cs = "nwse-resize";
                            }

                            $this.w()[0].style.cursor = cs;
                        } else {
                            if (!$this.mover.resizing) {
                                $this.w()[0].style.cursor = "";
                            }
                        }
                    } else {
                        var relX = _pos.pageX - $this.mover.rmX,
                            relY = _pos.pageY - $this.mover.rmY,
                            content = $("." + $this.css("content")),
                            dialog = $("." + $this.css("dialog")),
                            cWidth = content.width(),
                            cHeight = content.height();

                        $this.mover.rmX = _pos.pageX;
                        $this.mover.rmY = _pos.pageY;

                        if (relY !== 0) {
                            if ($this.mover.resizeTop) {
                                if (cHeight - relY > $this.sizeMinHeight) {
                                    content.height(cHeight - relY);
                                    dialog.offset({ top: dialog.offset().top + relY });
                                }
                            }

                            if ($this.mover.resizeBottom) {
                                if (cHeight + relY > $this.sizeMinHeight) {
                                    content.height(cHeight + relY);
                                }
                            }
                        }

                        if (relX !== 0) {
                            if ($this.mover.resizeLeft) {
                                if (cWidth - relX > $this.sizeMinWidth) {
                                    dialog.width(dialog.width() - relX);
                                    dialog.offset({ left: dialog.offset().left + relX });
                                }
                            }

                            if ($this.mover.resizeRight) {
                                if (cWidth + relX > $this.sizeMinWidth) {
                                    dialog.width(dialog.width() + relX);
                                }
                            }
                        }

                        if (relX !== 0 && relY !== 0) {
                            $this._posizeCookie();
                        }
                    }
                }
            },
            _up: function($this, e) {
                if ($this.mover.resizing) {
                    $this.mover.rm = '';
                    $this.mover.resizing = false;
                    $this.w()[0].style.cursor = "";
                }

                if ($this.mover.dr !== undefined) {
                    $this.mover.moving = false;
                    $this.mover.dr.removeClass($this.$classes.drag);
                    $this.mover.dr = undefined;

                    $this._posizeCookie();
                }
            },
            _mouseDownWrapper: function($this, e) {
                $this.mover._downWrapper($this, e);
            },
            _mouseDown: function($this, e) {
                $this.mover._down($this, e);
            },
            _mouseMove: function($this, e) {
                $this.mover._move($this, e);
            },
            _mouseUp: function($this, e) {
                $this.mover._up($this, e);
            },
            _touchEnd: function($this, e) {
                if (e.touches.length === 0) {
                    $this.mover._up($this, e);
                }
            }
        }
    });

    $.fn.smartAniPopup = function(option, name) {
        if (option === undefined || typeof option === "object") {
            return this.each(function(){
                var $elem = $(this),
                    $plugin = new smartAniPopup($elem, option);

                $elem.data("smp-plugin", $plugin);
            });
        } else if (typeof option === "string") {
            if (option === "get") {
                var values = [];

                this.each(function() {
                    var data = $(this).data("smpPlugin");

                    if (data) {
                        values.push(data.get(name));
                    }
                });

                if (values.length === 1) {
                    return values[0];
                } else {
                    return values;
                }
            } else if (option === "resize") {
                var data = $(this).data("smpPlugin");

                if (data) {
                    data.resize(name);
                }
            } else {
                this.each(function(){
                    var data = $(this).data("smpPlugin");

                    if (data) {
                        data[option](name);
                    }
                });
            }
        }
    };
})(jQuery, window, document);
