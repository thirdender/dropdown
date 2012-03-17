/*!
 * jQuery Dropdown
 * http://blog.gatherage.com/jquery-select-dropdown
 *
 * Copyright 2012, Rob Rothermel
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Date: Fri Mar 16 20:46:40 EDT 2012
 */

(function($) {
    if (!$) {
	window.console && console.log("Dropdown plugin: jQuery not found");
	return;
    }

    // Initialize the dropdowns
    // source: http://www.jankoatwarpspeed.com/post/2009/07/28/reinventing-drop-down-with-css-jquery.aspx
    $.fn.extend({
	"dropdown": function() {
	    // Build dropdown HTML for each SELECT to be replaced
	    this.filter("select").each(function() {
		var select = $(this);
		if (select.data("dropdown.initialized") === true) {
		    return;
		}
		var linkHandler = function() {
			select.val($(this).attr("value")).change();
			return false;
		    },
		    recursiveOptionBuilder = function(rent, children) {
			return rent.append(children.map(function() {
			    var option = $(this);
			    if (option.is("optgroup")) {
				return $(document.createElement("li")).
				    append($(document.createElement("strong")).
					text(option.attr("label"))
				    ).
				    append(
					recursiveOptionBuilder($(document.createElement("ul")), option.children())
				    ).get()[0];
			    } else {
				return $(document.createElement("li")).
				    append($(document.createElement("a")).
					text(option.text()).
					attr({
					    "value": option.attr("value") || option.text(),
					    "href": ""
					}).
					click(linkHandler)
				    ).get()[0];
			    }
			}));
		    },
		    dl = $(document.createElement("dl")).
			addClass("dropdown").
			data("select", select).
			append($(document.createElement("dt")).
			    append($(document.createElement("a")).
				attr("href", "#").
				append($(document.createElement("span")).
				    addClass("label").
				    text(select.attr("title") || select.find("option:first").text())
				).
				append($(document.createElement("span")).
				    addClass("arrow")
				)
			    )
			).
			append($(document.createElement("dd")).
			    append(
				recursiveOptionBuilder($(document.createElement("ul")), select.children())
			    )
			);
		select.after(dl).hide().data("dropdown.initialized", true);
	    });

	    // This is the HTML that displays the dropdowns when clicked.
	    this.each(function() {
		// If this is a SELECT that's been targetted, switch to the next element (the actual display)
		var dropdown = $(this);
		if (dropdown.is("select")) {
		    dropdown = dropdown.next(".dropdown");
		}

		// Skip this element if it's already been initialized
		if (dropdown.data("dropdown.initialized") === true) {
		    return;
		}

		// Add appropriate handlers
		dropdown.
		    find("dt a").click(function() {
			$(".dropdown").not(dropdown).removeClass("dropdownActive");
			dropdown.toggleClass("dropdownActive");
			return false;
		    }).end().
		    find("dd ul li a").click(function() {
			dropdown.removeClass("dropdownDefaultValue").
			    find("dt a span.label").html($(this).html()).end().
			    removeClass("dropdownActive");
			if (!dropdown.hasClass("dropdownNavigation")) {
			    return false;
			}
		    });

		// If we're working from an actual SELECT, see if a value is selected
		var select = dropdown.data("select"),
		    selected = select && select.children().filter(function() { return this.getAttribute("selected"); });
		if (select && selected.length > 0) {
		    $(dropdown.find("dd ul li a")[select.children().index(selected)]).click();
		}

		dropdown.data("dropdown.initialized", true);
	    });

	    // Add the "dropdown" class and return the chain
	    return this.not("select").addClass("dropdown").end();
	}
    });
    
    $(function() {
	// This snippet hides all dropdowns when the document is clicked.
	//   If another dropdown is clicked, all other dropdowns are hidden.
	$(document).bind("click", function(e) {
	    if (!$(e.target).parents().hasClass("dropdown")) {
		$(".dropdown").removeClass("dropdownActive");
	    }
	});

	/*
	// TODO: handle keypresses
	$(window).live("keypress", function(e) {
	    $(".dropdownActive").each(function() {
		var dropdown = $(this);
		// ...
	    });
	});
	*/
    });
})(window.jQuery);
