CKEDITOR.plugins.add('thesaurus', {
    requires: ['dialog'],
    icons: 'thesaurus', // %REMOVE_LINE_CORE%
    hidpi: true, // %REMOVE_LINE_CORE%
    init: function (editor) {
        var spellCheckGroupName = 'spellcheck',
            commandName = 'thesaurus',
            buttonLabel = 'Open Thesaurus',
            buttonName = 'thesaurus',
            menuText = 'Thesaurus';
        var command = editor.addCommand(commandName, new CKEDITOR.dialogCommand(commandName));
        
        command.modes = {
            wysiwyg: true
        };

        editor.addMenuGroup(spellCheckGroupName);

        //if(typeof editor.plugins.scayt == 'undefined'){
        editor.ui.addButton && editor.ui.addButton(buttonName, {
            label: buttonLabel,
            click: function (editor) {
                var inlineMode = (editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE),
                    text = inlineMode ? editor.container.getText() : editor.document.getBody().getText();

                // RonMorrill: Use the button event for the observable
                editor.fire("uiButtonCommand", { "command": commandName });

                text = text.replace(/\s/g, '');

                if (text) {
                    editor.execCommand(commandName);
                } else {
                    alert('Nothing to check!');
                }
            },
            toolbar: spellCheckGroupName + ',99' 
        });
        //}

        // Add item to context menu
        if (editor.addMenuItems) {
            editor.addMenuItem(commandName, {
                label: menuText,
                icon: buttonName,
                command: commandName,
                group: spellCheckGroupName,
                order: 101
            });
        }
        if (editor.contextMenu) {
            editor.contextMenu.addListener(function (element, selection) {
                return {
                    thesaurus: CKEDITOR.TRISTATE_OFF
                };
            });
        }

        CKEDITOR.dialog.add('thesaurus', CKEDITOR.getUrl(this.path + 'dialogs/thesaurus.js'));
    }
});

