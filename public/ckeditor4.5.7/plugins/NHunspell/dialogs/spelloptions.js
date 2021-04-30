/*!
 * Hunspell Plugin for CK Editor
 *
 * http://ckeditor.com/
 *
 * Copyright (c) 2016 InfoPro Systems, Inc.
 * Released under the MIT license
 */

/// <summary>
/// Add Spellcheck Options Dialog to CKEditor and set Plugin variables
/// </summary>

CKEDITOR.dialog.add(NHUNSPELL_COMMAND_OPTIONS, function (editor) {
    return {
        title: 'Spell Check Options',
        minWidth: 210,
        minHeight: 125,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents:
        [
            {
                id: 'spellOptions',
                label: 'Spell Check Options',
                elements:
                [
                    {
                        type: 'vbox',
                        style: 'padding-left: 15px;',
                        children: [
                            {
                                type: 'checkbox',
                                id: 'ignoreUpperCase',
                                label: 'Ignore words in UPPERCASE'
                            },
                            {
                                type: 'checkbox',
                                id: 'ignoreNumbers',
                                label: 'Ignore words with numbers'
                             },
                            {
                                type: 'checkbox',
                                id: 'ignoreMixedCase',
                                label: 'Ignore mixed-case words'
                             },
                            {
                                type: 'checkbox',
                                id: 'spellAsUType',
                                label: 'Check spelling as you type' 
                            }
                        ]
                    }
                ]
            }

        ],
        onShow: function () {
            // Set control value based on current plugin configuration
            this.ignoreUpperCase.setValue(this.plugin.config.ignoreUpperCase, false);
            this.ignoreNumbers.setValue(this.plugin.config.ignoreNumbers, false);
            this.ignoreMixedCase.setValue(this.plugin.config.ignoreMixedCase, false);
            this.spellAsUType.setValue(this.plugin.config.spellAsUType, false);
         },
        onOk: function () {
            // Set control value based on current plugin configuration
            this.plugin.config.ignoreUpperCase = this.ignoreUpperCase.getValue();
            this.plugin.config.ignoreNumbers = this.ignoreNumbers.getValue();
            this.plugin.config.ignoreMixedCase = this.ignoreMixedCase.getValue();
            this.plugin.config.spellAsUType = this.spellAsUType.getValue();
            var savedStatus = this.plugin.setEditorFocus(false);
            if (this.plugin.config.spellAsUType) this.plugin.startSCAYT(); else this.plugin.stopSCAYT();
            this.plugin.setEditorFocus(savedStatus);
        },
        onLoad: function () {
            // Create control variables into dialog properties not to search every time
            this.plugin = CKEDITOR.plugins.NHunspell;
            this.ignoreUpperCase = this.getContentElement('spellOptions', 'ignoreUpperCase');
            this.ignoreNumbers = this.getContentElement('spellOptions', 'ignoreNumbers');
            this.ignoreMixedCase = this.getContentElement('spellOptions', 'ignoreMixedCase');
            this.spellAsUType = this.getContentElement('spellOptions', 'spellAsUType');
        }
    };
});