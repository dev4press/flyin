/*
 * Smart Animated Popup v2.0
 * https://www.smartplugins.info/plugin/javascript/smart-animated-popup/
 *
 * Copyright 2008 - 2023 Milan Petrovic (email: support@smartplugins.info)
 *
 * https://www.smartplugins.info
 */

/*jslint regexp: true, nomen: true, undef: true, sloppy: true, eqeq: true, vars: true, white: true, plusplus: true, maxerr: 50, indent: 4 */
/*global Base, jQuery*/

;(function ($, window, document, undefined) {
    smartAniPopup.FreeSkin = smartAniPopup.Skin.extend({
        $skinCode: "free",
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

        cookiePosizeCode: "smart-animated-popup-posize",

        _prepareDialog: function () {
            if (this.savePosize) {
                var cookie = Cookies.get(this.cookiePosizeCode, true);

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
        _afterOpen: function ($this) {
            $this._savePosizeCookie();
        },
        _appendToFooter: function () {
            return this.showGrip ? '<div class="' + this.$classes.grip + '"></div>' : '';
        },
        _finishDialog: function () {
            this._savePosizeCookie();

            var $this = this,
                wrapper = "." + this.css("wrapper"),
                grip = wrapper + " ." + this.$classes.grip,
                header = wrapper + " ." + this.$classes.header;

            if (!this.showGrip) {
                $(document).on("mousedown", grip, function (e) {
                    $this.mover._mouseDownWrapper($this, e);
                });

                $(document).on("touchstart", grip, function (e) {
                    $this.mover._mouseDownWrapper($this, e);
                });
            }

            $(document).on("mousedown", wrapper, function (e) {
                $this.mover._mouseDownWrapper($this, e);
            });

            $(document).on("mousedown", header, function (e) {
                $this.mover._mouseDown($this, e);
            });
            $(document).on("mousemove", function (e) {
                $this.mover._mouseMove($this, e);
            });
            $(document).on("mouseup", function (e) {
                $this.mover._mouseUp($this, e);
            });

            $(document).on("touchstart", wrapper, function (e) {
                $this.mover._mouseDownWrapper($this, e);
            });

            $(document).on("touchstart", header, function (e) {
                $this.mover._mouseDown($this, e);
            });
            $(document).on("touchmove", this, function (e) {
                $this.mover._mouseMove($this, e);
            });
            $(document).on("touchend", this, function (e) {
                $this.mover._touchEnd($this, e);
            });
        },
        _savePosizeCookie: function () {
            if (this.savePosize) {
                var c = $("." + this.css("content")), poSize = {
                    left: this.w().parent().offset().left,
                    top: this.w().parent().offset().top,
                    width: this.w().width(),
                    height: this.w().height(),
                    cWidth: c.width(),
                    cHeight: c.height(),
                };

                Cookies.set(this.cookiePosizeCode, poSize);
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

            _mousePos: function (e) {
                var pos = {pageX: 0, pageY: 0, touch: false};

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
            _downWrapper: function ($this, e) {
                if ($this.mover.rm === "") {
                    return;
                }

                var _pos = $this.mover._mousePos(e);

                $this.mover.resizing = true;
                $this.mover.rmX = _pos.pageX;
                $this.mover.rmY = _pos.pageY;
            },
            _down: function ($this, e) {
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
            _move: function ($this, e) {
                var _pos = $this.mover._mousePos(e);

                if ($this.mover.dr !== undefined) {
                    var left = _pos.pageX + $this.mover.posX - $this.mover.width,
                        top = _pos.pageY + $this.mover.posY - $this.mover.height;

                    if (top <= 0) {
                        top = 0;
                    }

                    if (left <= 0) {
                        left = 0;
                    }

                    if (top >= $this.mover.maxTop) {
                        top = $this.mover.maxTop;
                    }

                    if (left >= $this.mover.maxLeft) {
                        left = $this.mover.maxLeft;
                    }

                    $this.mover.dr.offset({top: top, left: left});

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
                                    dialog.offset({top: dialog.offset().top + relY});
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
                                    dialog.offset({left: dialog.offset().left + relX});
                                }
                            }

                            if ($this.mover.resizeRight) {
                                if (cWidth + relX > $this.sizeMinWidth) {
                                    dialog.width(dialog.width() + relX);
                                }
                            }
                        }

                        if (relX !== 0 && relY !== 0) {
                            $this._savePosizeCookie();
                        }
                    }
                }
            },
            _up: function ($this, e) {
                if ($this.mover.resizing) {
                    $this.mover.rm = '';
                    $this.mover.resizing = false;
                    $this.w()[0].style.cursor = "";
                }

                if ($this.mover.dr !== undefined) {
                    $this.mover.moving = false;
                    $this.mover.dr.removeClass($this.$classes.drag);
                    $this.mover.dr = undefined;

                    $this._savePosizeCookie();
                }
            },
            _mouseDownWrapper: function ($this, e) {
                $this.mover._downWrapper($this, e);
            },
            _mouseDown: function ($this, e) {
                $this.mover._down($this, e);
            },
            _mouseMove: function ($this, e) {
                $this.mover._move($this, e);
            },
            _mouseUp: function ($this, e) {
                $this.mover._up($this, e);
            },
            _touchEnd: function ($this, e) {
                if (e.touches.length === 0) {
                    $this.mover._up($this, e);
                }
            }
        }
    });
})(jQuery, window, document);
