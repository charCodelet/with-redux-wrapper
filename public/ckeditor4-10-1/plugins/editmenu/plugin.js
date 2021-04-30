/**
 * editmenu: eNAEP custom plugin.  Will need to be ported to any new version of CKEDITOR
 */

CKEDITOR.plugins.add('editmenu', {
  requires: ['richcombo'],
  init: function(editor) {
    editor.ui.addRichCombo('editmenu', {
      label: 'Edit',
      title: 'Edit',
      voiceLabel: 'Edit',
      className: 'cke_format',
      multiSelect: false,
      panel: {
        css: [editor.config.contentsCss, CKEDITOR.skin.getPath('editor')],
        voiceLabel: editor.lang.panelVoiceLabel
      },

      init: function() {
        this.add('cut', editor.config.iconUrl('cut', 'Cut'), editor.setKeystroke(CKEDITOR.CTRL + 88 /*X*/, 'Cut'));
        this.add('copy', editor.config.iconUrl('copy', 'Copy'), 'Copy', 'Ctrl+C');
        this.add('paste', editor.config.iconUrl('paste', 'Paste'), 'Paste', 'Ctrl+V');
        this.add('selectAll', editor.config.iconUrl('selectAll', 'Select All'), 'Select All', 'Ctrl+A');
        this.startGroup('');
        this.add('undo', editor.config.iconUrl('undo', 'Undo'), 'Undo', 'Ctrl+Z');
        this.add('redo', editor.config.iconUrl('redo', 'Redo'), 'Redo', 'Ctrl+Y');
      },

      onClick: function(value) {
        //  Just this line of code works as it is delegating the command execution to CKEDITOR.
        editor.execCommand(value);
        setTimeout(function() {
          editor.fire('topMenuCommand', value);
        }, 0);

        //   //// garyfeng: testing to see if I can find out which menu the
        //   //// item comes from
        //   //// RonMorrill - use topMenuCommand for these RichCombo menus
        //   editor.fire('topMenuCommand', value);
        //   //// garyfeng: end
        //   editor.focus();
        //   editor.fire('saveSnapshot');
        //   editor.execCommand(value);
        //   editor.fire('saveSnapshot');
      }
    });
  }
});
