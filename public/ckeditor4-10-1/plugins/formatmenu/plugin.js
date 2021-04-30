/**
 * formatmenu: eNAEP custom plugin.  Will need to be ported to any new version of CKEDITOR
 */

CKEDITOR.plugins.add('formatmenu', {
  requires: ['richcombo'],
  init: function(editor) {
    editor.ui.addRichCombo('formatmenu', {
      label: 'Format',
      title: 'Format',
      voiceLabel: 'Format',
      className: 'cke_format',
      multiSelect: false,
      panel: {
        css: [editor.config.contentsCss, CKEDITOR.skin.getPath('editor')],
        voiceLabel: editor.lang.panelVoiceLabel
      },

      init: function() {
        this.add('bold', editor.config.iconUrl('bold', 'Bold'), 'Bold', 'Ctrl+B');
        this.add('italic', editor.config.iconUrl('italic', 'Italic'), 'Italic', 'Ctrl+I');
        this.add('underline', editor.config.iconUrl('underline', 'Underline'), 'Underline', 'Ctrl+U');
        this.startGroup('');
        this.add('outdent', editor.config.iconUrl('outdent', 'Decrease Indent'), 'Decrease Indent', '');
        this.add('indent', editor.config.iconUrl('indent', 'Increase Indent'), 'Increase Indent', '');
        this.startGroup('Font Size');
        this.add('SmallFont', editor.config.iconUrl('SmallFont', 'Small Font Size'), 'Small Font Size', '');
        this.add('MediumFont', editor.config.iconUrl('MediumFont', 'Medium Font Size'), 'Medium font size', '');
        this.add('LargeFont', editor.config.iconUrl('LargeFont', 'Large Font Size'), 'Large font size', '');
      },

      onClick: function(value) {
        // garyfeng: testing to see if I can find out which menu the
        // item comes from
        // RonMorrill - use topMenuCommand for these RichCombo menus
        editor.fire('topMenuCommand', value);
        // garyfeng: end
        editor.focus();
        editor.fire('saveSnapshot');
        editor.execCommand(value);
        editor.fire('saveSnapshot');
      }
    });
  }
});
