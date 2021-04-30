
CKEDITOR.plugins.add( 'toolsmenu', {
	requires : ['richcombo'],
	init: function(editor) {
        editor.ui.addRichCombo('toolsmenu',
        {
            label: 'Tools',
            title: 'Tools',
            voiceLabel: 'Tools',
            className: 'cke_format',
            multiSelect: false,
            panel:
            {
                css: [editor.config.contentsCss, CKEDITOR.skin.getPath('editor')],
                voiceLabel: editor.lang.panelVoiceLabel
            },

            init: function() {
                this.add('checkspell', editor.config.iconUrl('spellchecker', 'Check Spelling'), 'Check Spelling', '');
                this.add('spelloptions', editor.config.iconUrl('spell-check-options', 'Spell Check Options'), 'Spell Check Options', '');
                this.add('thesaurus', editor.config.iconUrl('thesaurus', 'Thesaurus'), 'Thesaurus', '');
            },

            onClick: function(value) {
                // RonMorrill - use topMenuCommand for these RichCombo menus
                editor.fire('topMenuCommand', value);

                editor.focus();
                editor.fire('saveSnapshot');
                editor.execCommand(value);
                editor.fire('saveSnapshot');
            }

        });

        editor.on('click', function (evt) {
            alert(evt);
        });
    }
} );

