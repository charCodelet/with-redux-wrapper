/**
 * toolsmenu: eNAEP custom plugin.  Will need to be ported to any new version of CKEDITOR
 */

CKEDITOR.plugins.add('toolsmenu', {
  requires: ['richcombo'],
  init: function(editor) {
    editor.ui.addRichCombo('toolsmenu', {
      label: 'Tools',
      title: 'Tools',
      voiceLabel: 'Tools',
      className: 'cke_format',
      multiSelect: false,
      panel: {
        css: [editor.config.contentsCss, CKEDITOR.skin.getPath('editor')],
        voiceLabel: editor.lang.panelVoiceLabel
      },

      init: function() {
        this.add('checkspell', editor.config.iconUrl('spellchecker', 'Check Spelling'), 'Check Spelling', '');
        this.add('spelloptions', editor.config.iconUrl('spell-check-options', 'Spell Check Options'), 'Spell Check Options', '');
        this.add('thesaurus', editor.config.iconUrl('thesaurus', 'Thesaurus'), 'Thesaurus', '');
      },

      onClick: function(value) {
        // temp bypassing normal checkspell and calling new checkspell
        if (value === 'checkspell') {
          setTimeout(function() {
            editor.fire('topMenuCommand', value);
          }, 0);
          setTimeout(function() {
            var definition = {
              command: 'checkspell',
              icon: 'http://localhost:8030/student/assets/lib/ckeditor4-10-1/skins/moono/icons/hidpi/spellchecker.png',
              label: 'Check Spelling',
              name: 'checkspell',
              toolbar: 'spellcheck,99'
            };
            editor.fire('uiButtonCommand', definition); //simulate button click to populate new  spell control
          }, 0);
        } else {
          //  Just this line of code works as it is delegating the command execution to CKEDITOR.
          editor.execCommand(value);
          setTimeout(function() {
            editor.fire('topMenuCommand', value);
          }, 0);
        }

        // // RonMorrill - use topMenuCommand for these RichCombo menus
        // editor.fire('topMenuCommand', value);

        // editor.focus();
        // editor.fire('saveSnapshot');
        // editor.execCommand(value);
        // editor.fire('saveSnapshot');
      }
    });

    editor.on('click', function(evt) {
      alert(evt);
    });
  }
});
