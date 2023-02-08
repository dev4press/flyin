/*
 * Smart Animated Popup v2.0
 * https://www.smartplugins.info/plugin/javascript/smart-animated-popup/
 * 
 * Copyright 2008 - 2023 Milan Petrovic (email: support@smartplugins.info)
 *
 * https://www.smartplugins.info
 */

/*jslint regexp: true, nomen: true, undef: true, sloppy: true, eqeq: true, vars: true, white: true, plusplus: true, maxerr: 50, indent: 4 */

var smartTimerCounter_Helper = {
    init: function() {
        jQuery(window).bind("load resize orientationchange", function() {
            jQuery(".srm-helper-screen-width").html(screen.width);
            jQuery(".srm-helper-screen-height").html(screen.height);

            jQuery(".srm-helper-client-width").html(document.body.clientWidth);
            jQuery(".srm-helper-client-height").html(document.body.clientHeight);
        });

        jQuery(".srm-helper-builder .srm-helper-b-style select.srm-sel-back").change(function() {
            var style = jQuery(this).val(),
                demo = jQuery(this).parent().parent().parent().find(".srm-helper-b-demo");

            demo.attr("class", style);
        });

        jQuery(".srm-helper-builder .srm-helper-b-style select.srm-sel-style").change(function() {
            var style = jQuery(this).val(),
                id = jQuery(this).parent().parent().parent().find(".srm-helper-b-demo div, .srm-helper-b-demo span").attr("id").substr(13),
                demo = jQuery(this).parent().next().find("span.stc-edit-style");

            demo.html(style);

            if (stacks[id].data("stcPlugin")) {
                stacks[id].data("stcPlugin").mod("style", style);
                stacks[id].data("stcPlugin").mod("recalculate");
            } else {
                stacks[id].data("sncPlugin").mod("style", style);
                stacks[id].data("sncPlugin").mod("recalculate");
            }
        });
    }
};

jQuery(document).ready(function() {
    smartTimerCounter_Helper.init();
});
