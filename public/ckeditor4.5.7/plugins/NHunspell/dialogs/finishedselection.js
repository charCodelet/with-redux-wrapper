/*!
 * Hunspell Plugin for CK Editor
 *
 * http://ckeditor.com/
 *
 * Copyright (c) 2016 InfoPro Systems, Inc.
 * Released under the MIT license
 */

/// <summary>
///  Add a dialog when finished spellcheking of the selected text
/// </summary>

CKEDITOR.dialog.add(NHUNSPELL_COMMAND_FINISHEDSELECTION, function (editor) {
    var result = false;

    return {
        title: 'Spell Check',
        minWidth: 210,
        minHeight: 125,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        buttons: [
            {
                type: 'button',
                id: 'buttonYes',
                label: 'Yes',
                title: 'Yes',
                onClick: function (evt) {
                    /*result = true;
                    var dialog = evt.data.dialog;
                    if (dialog.fire('ok', { hide: true }).hide !== false)
                        dialog.hide();*/
                    var plugin = CKEDITOR.plugins.NHunspell;
                    plugin.isCheckSelectedArea = true;
                    var dialog = evt.data.dialog;
                    dialog.hide();

                    var selection = editor.getSelection();
                    var ranges = selection.getRanges();
                    var range = ranges[0];
                    range.collapse(false);
                    range.select();
                    //dialog.hide();
                    setTimeout(function (evt) {
                        editor.execCommand(NHUNSPELL_COMMAND_SPELLCHECK);
                    })
                }
            },
            {
                type: 'button',
                id: 'buttonNo',
                label: 'No',
                title: 'No',
                onClick: function (evt) {
                    // this = CKEDITOR.ui.dialog.button
                    /*result = false;
                    var dialog = evt.data.dialog;
                    if (dialog.fire('cancel', { hide: true }).hide !== false)
                        dialog.hide();*/
                    var plugin = CKEDITOR.plugins.NHunspell;
                    plugin.isCheckSelectedArea = false;
                    var dialog = evt.data.dialog;
                    dialog.hide();

                    $('.cke_button__checkspell').removeClass('cke_button__checkspell_active');
                }
            }
        ],
        contents:
        [
            {
                id: 'spellOptions',
                label: 'Spell Check Options',
                elements:
                [
                    {
                        type: 'html',
                        html: 'Finished checking the selection.<br/>Do you want to check the rest of the <br/> document?',
                        style: 'text-align: center;'
                    },
            {
                type: 'hbox',
                widths: ['50%', '25%', '25%'],
                style: 'margin-top: -3px;',
                children: [/*{
                    type: 'button',
                    id: 'buttonYes',
                    label: 'Yes',
                    title: 'Yes',
                    onClick: function (evt) {
                        var plugin = CKEDITOR.plugins.NHunspell;
                        plugin.isCheckSelectedArea = true;
                        var dialog = evt.data.dialog;
                        dialog.hide();

                        var selection = editor.getSelection();
                        var ranges = selection.getRanges();
                        var range = ranges[0];
                        range.collapse(false);
                        range.select();
                        //dialog.hide();
                        setTimeout(function (evt) {
                            editor.execCommand(NHUNSPELL_COMMAND_SPELLCHECK);
                        })
                    }
                },
            {
                type: 'button',
                id: 'buttonNo',
                label: 'No',
                title: 'No',
                onClick: function (evt) {
                    // this = CKEDITOR.ui.dialog.button
                    var plugin = CKEDITOR.plugins.NHunspell;
                    plugin.isCheckSelectedArea = false;
                    var dialog = evt.data.dialog;
                    dialog.hide();
                }
            }*/]
            }
                ]
            }
        ],
        onShow: function (evt, data) {
            evt.sender._.element.$.style.display = "block";
        }
    };
});