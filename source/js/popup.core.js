/*
 * Smart Animated Popup v1.6
 * http://www.smartplugins.info/plugin/javascript/smart-animated-popup/
 * 
 * Copyright 2008 - 2017 Milan Petrovic (email: support@dev4press.com)
 * 
 * https://www.dev4press.com
 * http://www.smartplugins.info
 *
 */

/*jslint regexp: true, nomen: true, undef: true, sloppy: true, eqeq: true, vars: true, white: true, plusplus: true, maxerr: 50, indent: 4 */
/*global Base*/

var smartAniPopup, 
    smpIDSequence = 1;

;(function ($, window, document, undefined) {
    smartAniPopup = function(element, options) {
        return new smartAniPopup.Core(element, options);
    };

    smartAniPopup.Base = Base.extend({
        version: "1.6",

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

        settings: {},
        callbacks: {
            beforeOpen: false,
            afterOpen: false,
            beforeClose: false,
            afterClose: false
        },

        constructor: function(element, options) {
            this.base(options);

            this.$useCookie = $.cookie !== undefined;

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
            content: {}
        },
        $classes: {
            html: "sanp-active",
            htmlEffectPrefix: "sanp-effect-",
            overlay: "sanp-overlay",
            overlayIDPrefix: "sanp-overlay-",
            overlayActive: "sanp-active",
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
            closeButton: "sanp-button-close"
        },

        role: "dialog",
        modal: true,
        zIndex: 1000000,
        title: true,
        titleTag: "h5",
        style: "sanp-style-plain-white",
        extraClass: "",

        effect: "random",
        effectSpeed: .7,

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
        overlayOpacity: .7,
        overlaySpeed: .7,

        angle: 0,
        width: "40%",
        height: "auto",
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

            $(window).bind("resize orientationchange", function() {
                $this._calculatePosition(false);
            });

            this._buttonClick();
        },
        createModalay: function() {
            var style = ["z-index: " + this.zIndex + ";"];

            $("body").append("<div style='" + style.join(" ") + "' class='" + this.$classes.overlay + " " + this.css("overlay") + "'></div>");
        },
        createOverlay: function() {
            var style = this.props("overlay");

            style.push("transition: all " + this.overlaySpeed + "s;");

            $("body").append("<div style='" + style.join(" ") + "' class='" + this.$classes.overlay + " " + this.css("overlay") + "'></div>");
        },
        createDialog: function() {
            var title = "", html = "", style = this.props("dialog"),
                wrapper = [], $this = this, css = [
                    this.$classes.dialog,
                    this.css("dialog"),
                    this.css("effect"),
                    this.style,
                    this.extraClass
                ], content = this.props("content");

            if (this.title === true) {
                title = this.$core.$obj.data("title");
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

                html+= "</div>";
            }

            html+= "</div>";
            html+= "</div>";

            $("body").append(html);

            if (this.headerContent !== false) {
                $("." + this.css("dialog") + " ." + this.$classes.header).append(this.headerContent);
            }

            if (this.footerContent !== false) {
                $("." + this.css("dialog") + " ." + this.$classes.footer).append(this.footerContent);
            }

            $("." + this.css("dialog") + " ." + this.$classes.content).append(this.$core.$obj);

            this.$core.$obj.show();

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
                case "effect":
                    return this.$classes.dialogEffectPrefix + this.effect;
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

            $this.callback($this.$core.callbacks.beforeOpen, $this.$core);

            $this.$htmlClass = $this.$classes.html + " " + $this.$classes.htmlEffectPrefix + $this.effect;

            if ($this.modal) {
                $("html").addClass($this.$htmlClass);
            }

            $("." + $this.css("dialog")).addClass($this.$classes.dialogActive);

            if ($this.$mode === "animation") {
                $("." + $this.css("dialog")).removeClass($this.$classes.dialogInactive);
            }

            $("." + $this.css("overlay")).css("opacity", $this.overlayOpacity)
                                         .addClass($this.$classes.overlayActive);

            $this._calculatePosition();

            $this.$status = "opened";

            $this.callback($this.$core.callbacks.afterOpen, $this.$core);

            if (this.closeAuto && this.closeAutoDelay > 0) {
                this._autoClose();
            }

            return true;
        },
        _close: function($this) {
            if ($this.$status === "closed") {
                return false;
            }

            $this.callback($this.$core.callbacks.beforeClose, $this.$core);

            $("html").removeClass(this.$htmlClass);

            $("." + $this.css("dialog")).removeClass($this.$classes.dialogActive);

            if ($this.$mode === "animation") {
                $("." + $this.css("dialog")).addClass($this.$classes.dialogInactive);
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
                        d.css("right", this.offsetY);
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
                }

                if (this.xContentSize) {
                    this._calculateContent();
                }
            }
        },
        _buttonClick: function() {
            var $this = this;

            $("." + this.css("dialog") + " ." + this.$classes.closeButton).click(function(e){
                e.stopPropagation();

                $this.close($this);
            });
        },
        _escapeClick: function() {
            var $this = this;

            $(document).keyup(function(e){
                if ($this.$status === "opened" && e.keyCode === 27) {
                    $this.close($this);
                }
            });
        },
        _overlayClick: function() {
            var $this = this;

            $("." + this.css("overlay")).click(function(e){
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

            $(document).mousemove(function(event){
                if (event.pageY < $this.onLeaveTopOffset) {
                    $this.open($this, true);
                }
            });
        },
        _autoClose: function() {
            var $this = this;

            setTimeout(function() {
                $this.close($this);
            }, this.closeAutoDelay);
        },
        _cookieInit: function() {
            if (this.$core.$useCookie && this.autoShowLimit) {
                this.$cookie = $.cookie(this.cookieCode, Number);

                if (this.$cookie === undefined) {
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

                $.cookie(this.cookieCode, this.$cookie, {expires: expire, path: "/"});
            }
        }
    });

    smartAniPopup.BaseSkin = smartAniPopup.Skin.extend({
        
    });

    $.fn.smartAniPopup = function(option, name, value) {
        if (option === undefined || typeof option === "object") {
            return this.each(function(){
                var $elem = $(this),
                    $plugin = new smartAniPopup($elem, option);

                $elem.data("smp-plugin", $plugin);
            });
        } else if (typeof option === "string") {
            if (option === "get") {
                var values = [];

                this.each(function(){
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
