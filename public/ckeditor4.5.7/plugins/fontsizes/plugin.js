
//CKEDITOR.stylesSet.add('default', [
//	{ name: 'SmallFont', element: 'span', attributes: { 'class': 'writing_font_small' } },
//    { name: 'MediumFont', element: 'span', attributes: { 'class': 'writing_font_medium' } },
//    { name: 'LargeFont', element: 'span', attributes: { 'class': 'writing_font_large' } }
//]);


CKEDITOR.plugins.add( 'fontsizes', {
	icons: 'fontsize_s,fontsize_m,fontsize_l', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function (editor) {
	    var order = 1,
            ctxOrder = 20,
	        fontSizeStyles = {
	            SmallFont: { element: 'span', attributes: { 'class': 'writing_font_small' } },
	            MediumFont: { element: 'span', attributes: { 'class': 'writing_font_medium' } },
	            LargeFont: {element: 'span', attributes: { 'class': 'writing_font_large' } }
	        }

	    var addFontSizeButtonCommand = function (commandName, buttonLabel) {
	        // Disable the command if no definition is configured.
	        var styleDefinition = fontSizeStyles[commandName];
	        if (!styleDefinition)
	            return;

	        var style = new CKEDITOR.style(styleDefinition),
                forms = [style],
                mediumStyle = new CKEDITOR.style(fontSizeStyles['MediumFont']),
                largeStyle = new CKEDITOR.style(fontSizeStyles['LargeFont']);

	        // Listen to contextual style activation.
	        editor.attachStyleStateChange( style, function( state ) {
	            if (!editor.readOnly) {
	                if (commandName === 'SmallFont') {
	                    var smallState = mediumStyle.checkActive(editor.elementPath(), editor) || largeStyle.checkActive(editor.elementPath(), editor)
                            ? CKEDITOR.TRISTATE_OFF
                            : CKEDITOR.TRISTATE_ON;
	                    editor.getCommand(commandName).setState(smallState);
	                }
	                else {
	                    editor.getCommand(commandName).setState(state);
	                }
	            }
	        } );

	        editor.addCommand(commandName, {
	            exec: function (editor) {
	                editor.fire('saveSnapshot');
	                editor.removeStyle(mediumStyle);
	                editor.removeStyle(largeStyle);
	                // Don't apply if small style. Small is the default, i.e. no font size style applied
	                if (commandName !== 'SmallFont') {
	                    editor.applyStyle(style);
	                }
	                editor.fire('saveSnapshot');
	            }
	        });


	        // Register the button, if the button plugin is loaded.
	        if ( editor.ui.addButton ) {
	            editor.ui.addButton(commandName, {
	                label: buttonLabel,
	                command: commandName,
	                toolbar: 'fontsizes,' + order++
	            } );
	        }

	        // If the "menu" plugin is loaded, register the menu item.
	        if (editor.addMenuItems) {
	            editor.addMenuItem(commandName, {
	                label: buttonLabel,
	                command: commandName,
	                icon: commandName,
	                group: 'form',
	                order: ctxOrder++
	            });
	        }
	    };

	    addFontSizeButtonCommand('SmallFont', 'Small Font Size');
	    addFontSizeButtonCommand('MediumFont', 'Medium Font Size');
	    addFontSizeButtonCommand('LargeFont', 'Large Font Size');


	    if (editor.contextMenu) {
	        editor.contextMenu.addListener(function (element, selection) {
	            // Note: if we want to get fancy and show the on/off states for different formatting, we can do that here
	            // by checking if the selection is small/med/large, etc. and returning tristate_on if so. However, AFAIK
	            // that is not in the requirements (RM 5/29/15)
	            return {
	                SmallFont: CKEDITOR.TRISTATE_OFF,
	                MediumFont: CKEDITOR.TRISTATE_OFF,
	                LargeFont: CKEDITOR.TRISTATE_OFF
	            };
	        });
	    }

		//editor.on('stylesSet', function (evt) {
		//    var stylesDefinitions = evt.data.styles;
		//    debugger;
		//    if (!stylesDefinitions)
		//        return;

		//    var style, styleName, styleType;

		//    // Put all styles into an Array.
		//    for (var i = 0, count = stylesDefinitions.length; i < count; i++) {
		//        var styleDefinition = stylesDefinitions[i];

		//        if (editor.blockless && (styleDefinition.element in CKEDITOR.dtd.$block))
		//            continue;

		//        styleName = styleDefinition.name;
		//        style = new CKEDITOR.style(styleDefinition);

		//        if (!editor.filter.customConfig || editor.filter.check(style)) {
		//            style._name = styleName;
		//            style._.enterMode = config.enterMode;
		//            // Get the type (which will be used to assign style to one of 3 groups) from assignedTo if it's defined.
		//            style._.type = styleType = style.assignedTo || style.type;

		//            // Weight is used to sort styles (#9029).
		//            style._.weight = i + (styleType == CKEDITOR.STYLE_OBJECT ? 1 : styleType == CKEDITOR.STYLE_BLOCK ? 2 : 3) * 1000;

		//            styles[styleName] = style;
		//            stylesList.push(style);
		//            allowedContent.push(style);
		//        }
		//    }

		//    // Sorts the Array, so the styles get grouped by type in proper order (#9029).
		//    stylesList.sort(function (styleA, styleB) {
		//        return styleA._.weight - styleB._.weight;
		//    });
		//});

	}
} );

