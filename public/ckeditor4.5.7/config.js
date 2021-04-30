/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
console.log("32432432432432432432423")
CKEDITOR.editorConfig = function(config) {
    // %REMOVE_START%
    // The configuration options below are needed when running CKEditor from source files.
    //config.plugins = 'basicstyles,dialogui,dialog,clipboard,button,toolbar,enterkey,entities,floatingspace,wysiwygarea,indent,list,undo,indentblock,selectall,panel,floatpanel,menu,find,fontsizes,contextmenu,editmenu,formatmenu,toolsmenu,wsc,scayt,paginator,keystrokelog';
    config.plugins =
        'basicstyles,dialogui,dialog,clipboard,button,toolbar,enterkey,floatingspace,wysiwygarea,indent,list,indentblock,selectall,panel,floatpanel,menu,fontsizes,contextmenu,editmenu,formatmenu,toolsmenu,paginator,NHunspell,keystrokelog';
    config.extraPlugins = 'undo,widget,widgetcontextmenu';
    //config.skin = 'moono'; // This will be set at create time
    //config.uiColor = '#C7C7A9';
    // %REMOVE_END%

    // Define changes to default configuration here.
    // For complete reference see:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    // The toolbar groups arrangement, optimized for a single toolbar row.
    //config.toolbarGroups = [
    //	{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
    //	{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
    //	{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
    //	{ name: 'forms' },
    //	{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    //	{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
    //	{ name: 'links' },
    //	{ name: 'insert' },
    //	{ name: 'styles' },
    //	{ name: 'colors' },
    //	{ name: 'tools' },
    //	{ name: 'others' },
    //	{ name: 'about' }
    //];
    config.toolbar = [
        ['editmenu'],
        ['formatmenu'],
        ['toolsmenu'],
        '/', ['Cut', 'Copy', 'Paste', 'SelectAll'],
        ['Undo', 'Redo'],
        [
            'Bold',
            'Italic',
            'Underline',
            'Outdent',
            'Indent',
            'SmallFont',
            'MediumFont',
            'LargeFont'
        ],
        ['checkspell', 'thesaurus']
    ];

    // The default plugins included in the basic setup define some buttons that
    // are not needed in a basic editor. They are removed here.
    config.removeButtons = 'Anchor,Strike,Subscript,Superscript';
    config.dialog_noConfirmCancel = true;
    // Dialog windows are also simplified.
    config.removeDialogTabs = 'link:advanced';
    //config.allowedContent = "hr";
    //config.extraAllowedContent = "hr";

    //config.allowedContent = true;
    //  Instruct ACF to *not* filter out the following tags and their attributes (included strong, em and u tags used for bold, italic and underline respectively.)
    //  This is required so that the formatting is not lost during copy/paste operations or when the data is retrieved from the database posted to the editor.
    config.extraAllowedContent =
        'strong; em; u; span(writing_font_small,writing_font_medium,writing_font_large)';
    config.pasteFilter = config.extraAllowedContent; // otherwise a more strict filter is used on paste

    //config.width = 1435;
    config.width = 'auto';

    // The ckEditor is initialized with 1 action already on the undo stack.  In order to obtain the 50 user action limit, we have to add 1 to the limit.
    config.undoStackSize = 51;

    config.indentOffset = 40;
    config.indentMax = 800; // no indent allowed if at or beyond this # of pixels indent
    //config.toolbarGroupCycling = false; // This makes it so you can navigate among toolbar buttons with just arrows, rather than tabbing between groups. Meant to check in, but too late.

    //CKEDITOR.config.scayt_spellOptions = {
    //    'ignore-all-caps-words': false,
    //    'ignore-words-with-numbers': false,
    //    'ignore-words-with-mixed-cases': false,
    //    'AlwaysSuggest': true,
    //    'ScaytOn': true
    //};

    config.iconUrl = function(icon, command) {
        if (icon === 'selectAll') {
            // Case sensitive fix for panel plugin looking for 'selectAll' icon instead of 'selectall'
            icon = 'selectall';
        }
        return (
            '<img class="enaep-toolbar-img" src="' +
            CKEDITOR.getUrl(
                CKEDITOR.basePath +
                'skins/' +
                CKEDITOR.skinName +
                '/icons/hidpi/' +
                icon +
                '.png'
            ) +
            '" alt="' +
            command +
            '"/><span class="enaep-toolbar-text">' +
            command +
            '</span>'
        );
    };
};