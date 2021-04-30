/*!
 * Hunspell Plugin for CK Editor
 *
 * http://ckeditor.com/
 *
 * Copyright (c) 2016 InfoPro Systems, Inc.
 * Released under the MIT license
 */

/// <summary>
/// Add THesaurus Dialog to CKEditor and pass selected text
/// </summary>

CKEDITOR.dialog.add(NHUNSPELL_COMMAND_THESAURUS, function(editor) {
  var wordRange;
  var characterPosition;
  var eventName;
  var compress = function(synonyms) {
    var meanings = [];
    if (synonyms && synonyms.Meanings) {
      out: for (var i = 0, len = synonyms.Meanings.length; i < len; i++) {
        for (var j = 0, len2 = meanings.length; j < len2; j++) {
          if (meanings[j].Description == synonyms.Meanings[i].Description) {
            // merge
            for (var k = 0, len3 = synonyms.Meanings[i].Synonyms.length; k < len3; k++) {
              if (meanings[j].Synonyms.indexOf(synonyms.Meanings[i].Synonyms[k]) == -1) {
                meanings[j].Synonyms.push(synonyms.Meanings[i].Synonyms[k]);
              }
            }
            continue out;
          }
        }
        meanings.push(synonyms.Meanings[i]);
      }
    }
    return { Meanings: meanings.length ? meanings : null };
  };

  function onClose() {
    $('.cke_button__thesaurus').removeClass('cke_button__thesaurus_active');
    $('.cke_dialog_close_button').off('click', onClose);
    editor.fire('nhunspell.event', { event: 'Thesaurus_Dialog_Box_Closed' });
  }

  // Dialog definition
  return {
    title: 'Thesaurus',
    minWidth: 300,
    minHeight: 200,
    resizable: CKEDITOR.DIALOG_RESIZE_NONE,
    buttons: [],
    contents: [
      {
        id: 'thesaurus',
        elements: [
          {
            type: 'hbox',
            widths: ['5%', '88%', '5%'],
            children: [
              {
                type: 'button',
                id: 'prev',
                className: 'nhspell-btn-left cke_icon_button',
                setup: function(text) {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var prev = dialog.getContentElement('thesaurus', 'prev');
                },
                onClick: function() {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var plugin = CKEDITOR.plugins.NHunspell;

                  if (plugin.lookupHistory.length > 0) {
                    var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                    var text = lookedUp.getValue().toLowerCase();
                    var idx = plugin.lookupHistory.indexOf(text);
                    if (idx === -1) {
                      idx = plugin.lookupHistory.length - 1;
                    } else {
                      --idx;
                    }
                    if (idx < 0) {
                      idx = 0;
                    }
                    lookedUp.setValue(plugin.lookupHistory[idx]);
                    this.setupButtonState();
                    plugin.api.getThesaurus(lookedUp.getValue(), function(synonyms) {
                      dialog.synonyms = synonyms = compress(synonyms);

                      //reset before deciding what is to be shown to user
                      var lookedupList = dialog.getContentElement('thesaurus', 'lookedupList');
                      var suggestReplace = dialog.getContentElement('thesaurus', 'suggestReplace');

                      clearVisuals(); //reset

                      var replaceWith = dialog.getContentElement('thesaurus', 'replaceWith');
                      var buttonReplace = dialog.getContentElement('thesaurus', 'buttonReplace');
                      var replaceWithHtml = dialog.getContentElement('thesaurus', 'replaceWithHtml');
                      var noReccomedtations = dialog.getContentElement('thesaurus', 'noReccomedtations');

                      var extendedInfo = {
                        targetWord: lookedUp.getValue(),
                        characterPosition: characterPosition,
                        suggestions: dialog.synonyms.Meanings
                      };

                      var payload = {
                        event: plugin.eventName,
                        payload: extendedInfo,
                        captureCharacterPosition: true
                      };
                      editor.fire('nhunspell.event', payload);

                      // Clear event name
                      plugin.eventName = '';

                      if (synonyms && synonyms.Meanings) {
                        for (var i = 0, len = synonyms.Meanings.length; i < len; i++) {
                          var meaning = synonyms.Meanings[i];
                          lookedupList.add(meaning.Description);
                        }
                        lookedupList.setValue(synonyms.Meanings[0].Description);

                        lookedupList.getElement().setStyle('visibility', 'visible');
                        suggestReplace.getElement().setStyle('visibility', 'visible');

                        replaceWith.getElement().setStyle('visibility', 'visible');
                        buttonReplace.getElement().setStyle('visibility', 'visible');
                        replaceWithHtml.getElement().setStyle('visibility', 'visible');
                        noReccomedtations.getElement().setStyle('visibility', 'hidden');
                      } else {
                        //replaced hidden with disabled controls (Bug - 43780)
                        replaceWith.setup('');
                        noReccomedtations.getElement().setStyle('visibility', 'visible');
                      }
                    });
                  }
                },
                setupButtonState: function() {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var prevBtn = dialog.getContentElement('thesaurus', 'prev');
                  var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                  if (CKEDITOR.plugins.NHunspell.lookupHistory.length > 0 && lookedUp.getValue() !== CKEDITOR.plugins.NHunspell.lookupHistory[0]) {
                    prevBtn.enable();
                  } else {
                    prevBtn.disable();
                  }
                }
              },
              {
                type: 'ddtext',
                id: 'lookedUp',
                style: 'width: 100%',
                width: '100%',
                items: [],
                required: true,
                setup: function(text) {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                  lookedUp.setValue(text);
                  this.setupButtonState();
                  lookedUp.focus();

                  var select = $('.cke_dialog_ui_input_select[onchange]')[0];
                  select.addEventListener('focusout', (e) => {
                    var input = $('input.cke_dialog_ui_input_text')[0];
                    input.style.zIndex = '';

                    if (e.relatedTarget && e.relatedTarget.className === 'cke_dialog_ui_button cke_primary') {
                      return;
                    } else {
                      $('.nhspell-btn-left')[1].focus();
                    }
                  });
                },
                commit: function(result) {
                  //result.value = this.getValue();
                },
                onKeyDown: function(event) {
                  var input = $('input.cke_dialog_ui_input_text')[0];
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var btLookup = dialog.getContentElement('thesaurus', 'btLookup');

                  switch (event.data.$.code) {
                    case 'Tab':
                      input.style.zIndex = '-1';

                      var dialog = CKEDITOR.dialog.getCurrent();
                      var plugin = CKEDITOR.plugins.NHunspell;

                      var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                      var text = lookedUp.getValue().toLowerCase();
                      if (text && plugin.lookupHistory.indexOf(text) === -1) {
                        plugin.lookupHistory.push(text);
                      }

                      lookedUp.clear();
                      for (var i = 0, len = plugin.lookupHistory.length; i < len; i++) {
                        var text = plugin.lookupHistory[i];
                        lookedUp.add(CKEDITOR.tools.htmlEncode(text));
                      }

                      var select = $('.cke_dialog_ui_input_select[onchange]')[0];
                      setTimeout(() => select.focus());
                      break;

                    default:
                      break;
                  }
                },
                onKeyUp: function(event) {
                  this.setupButtonState();

                  switch (event.data.$.code) {
                    case 'Enter':
                      var dialog = CKEDITOR.dialog.getCurrent();
                      var btLookup = dialog.getContentElement('thesaurus', 'btLookup');
                      btLookup.onClick();
                      break;

                    default:
                      break;
                  }
                },
                setupButtonState: function() {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var btLookup = dialog.getContentElement('thesaurus', 'btLookup');
                  if (this.getValue().trim()) {
                    btLookup.enable();
                  } else {
                    btLookup.disable();
                  }

                  var prevBtn = dialog.getContentElement('thesaurus', 'prev');
                  var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                  if (CKEDITOR.plugins.NHunspell.lookupHistory.length > 1) {
                    prevBtn.enable();
                  } else {
                    prevBtn.disable();
                  }
                }
              },
              {
                type: 'button',
                id: 'btLookup',
                style: 'margin-right: 10px;',
                className: 'nhspell-btn-left cke_icon_button',
                onClick: function() {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var plugin = CKEDITOR.plugins.NHunspell;
                  var targetWord;

                  var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                  var text = lookedUp.getValue().toLowerCase();
                  if (text && plugin.lookupHistory.indexOf(text) === -1) {
                    plugin.lookupHistory.push(text);
                    lookedUp.clear();
                    for (var i = 0, len = plugin.lookupHistory.length; i < len; i++) {
                      var text = plugin.lookupHistory[i];
                      lookedUp.add(CKEDITOR.tools.htmlEncode(text));
                    }
                  }

                  if (plugin.lookupHistory.length > 1) {
                    var prev = dialog.getContentElement('thesaurus', 'prev');
                    prev.enable();
                  } else {
                    var prev = dialog.getContentElement('thesaurus', 'prev');
                    prev.disable();
                  }

                  targetWord = lookedUp.getValue();
                  this.setupButtonState();
                  plugin.api.getThesaurus(lookedUp.getValue(), function(synonyms) {
                    dialog.synonyms = synonyms = compress(synonyms);

                    //reset before deciding what is to be shown to user
                    var lookedupList = dialog.getContentElement('thesaurus', 'lookedupList');
                    var suggestReplace = dialog.getContentElement('thesaurus', 'suggestReplace');

                    clearVisuals(); //reset

                    var replaceWith = dialog.getContentElement('thesaurus', 'replaceWith');
                    var buttonReplace = dialog.getContentElement('thesaurus', 'buttonReplace');
                    var replaceWithHtml = dialog.getContentElement('thesaurus', 'replaceWithHtml');
                    var noReccomedtations = dialog.getContentElement('thesaurus', 'noReccomedtations');

                    var extendedInfo = {
                      targetWord: targetWord,
                      characterPosition: characterPosition,
                      suggestions: dialog.synonyms.Meanings
                    };

                    var payload = {
                      event: plugin.eventName,
                      payload: extendedInfo,
                      captureCharacterPosition: true
                    };
                    editor.fire('nhunspell.event', payload);

                    // Clear event name
                    plugin.eventName = '';

                    if (synonyms && synonyms.Meanings) {
                      for (var i = 0, len = synonyms.Meanings.length; i < len; i++) {
                        var meaning = synonyms.Meanings[i];
                        lookedupList.add(meaning.Description);
                      }
                      lookedupList.setValue(synonyms.Meanings[0].Description);

                      lookedupList.getElement().setStyle('visibility', 'visible');
                      suggestReplace.getElement().setStyle('visibility', 'visible');

                      replaceWith.getElement().setStyle('visibility', 'visible');
                      buttonReplace.getElement().setStyle('visibility', 'visible');
                      replaceWithHtml.getElement().setStyle('visibility', 'visible');
                      noReccomedtations.getElement().setStyle('visibility', 'hidden');
                    } else {
                      //replaced hidden with disabled controls (Bug - 43780)
                      replaceWith.setup('');
                      noReccomedtations.getElement().setStyle('visibility', 'visible');
                    }
                  });
                },
                setupButtonState: function() {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var btLookup = dialog.getContentElement('thesaurus', 'btLookup');
                  var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                  if (lookedUp.getValue().trim()) {
                    btLookup.enable();
                  } else {
                    btLookup.disable();
                  }

                  var prevBtn = dialog.getContentElement('thesaurus', 'prev');
                  var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                  if (CKEDITOR.plugins.NHunspell.lookupHistory.length > 0 && lookedUp.getValue() !== CKEDITOR.plugins.NHunspell.lookupHistory[0]) {
                    prevBtn.enable();
                  } else {
                    prevBtn.disable();
                  }
                }
              }
            ]
          },
          {
            type: 'hbox',
            widths: ['50%', '50%'],
            style: 'position:relative',
            children: [
              {
                type: 'select',
                id: 'lookedupList',
                label: 'Meanings:',
                style: 'width: 100%',
                className: 'sbfix',
                width: '100%',
                size: 7,
                inputStyle: 'height:10.5em; width:100%; margin-top:7px;',
                items: [],
                onChange: function(event) {
                  var dialog = CKEDITOR.dialog.getCurrent();

                  // #43745 if onChange is called we know we have some lookup data that could be applied to students writing; therefore,
                  // the close button should read "Cancel" since there is an action the user could cancel from.
                  var btCancel = dialog.getContentElement('thesaurus', 'btCancel');
                  var btCancelDom = btCancel.getElement();
                  btCancelDom.$.childNodes[0].innerText = 'Cancel';

                  var suggestReplace = dialog.getContentElement('thesaurus', 'suggestReplace');
                  suggestReplace.clear();

                  if (dialog.synonyms) {
                    var meanings = dialog.getContentElement('thesaurus', 'lookedupList');
                    var select = meanings.getInputElement().$;
                    var i = select.selectedIndex;

                    if (i != -1 && dialog.synonyms.Meanings.length > i) {
                      for (var j = 0, len = dialog.synonyms.Meanings[i].Synonyms.length; j < len; j++) {
                        var s = dialog.synonyms.Meanings[i].Synonyms[j];
                        suggestReplace.add(s);
                      }
                      suggestReplace.setValue(dialog.synonyms.Meanings[i].Synonyms[0]);
                    }
                  }
                }
              },
              {
                type: 'select',
                id: 'suggestReplace',
                label: 'Synonyms:',
                style: 'width: 100%',
                width: '100%',
                size: 7,
                inputStyle: 'height:10.5em; width:100%; margin-top:7px;',
                className: 'zoomberger sbfix',
                items: [],
                onChange: function(event) {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var replaceWith = dialog.getContentElement('thesaurus', 'replaceWith');
                  var suggestReplace = dialog.getContentElement('thesaurus', 'suggestReplace');
                  //alert(this.getValue());
                  replaceWith.setValue(suggestReplace.getValue());
                },
                onClick: function(event) {
                  var offsetX = event.data.$.offsetX / 3.0; //???
                  var optionHtml = event.data.$.srcElement || event.data.$.explicitOriginalTarget;
                  if (optionHtml.nodeName == 'OPTION' && optionHtml.offsetWidth - optionHtml.offsetLeft - offsetX <= optionHtml.clientHeight) {
                    setTimeout(function() {
                      var dialog = CKEDITOR.dialog.getCurrent();
                      var suggestReplace = dialog.getContentElement('thesaurus', 'suggestReplace');
                      var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                      lookedUp.setValue(suggestReplace.getValue());

                      //  Must be scheduled for later for the right data to be available
                      setTimeout(function() {
                        var prevElm = lookedUp.getElement().getPrevious();
                        var valueToSet = suggestReplace.getValue();
                        var options = prevElm.$.options;
                        for (var idx = 0; idx < options.length; idx++) {
                          if (options[idx].value === valueToSet) {
                            prevElm.$.options[idx].selected = true;
                          } else {
                            prevElm.$.options[idx].selected = false;
                          }
                        }
                      });

                      var btLookup = dialog.getContentElement('thesaurus', 'btLookup');
                      btLookup.onClick();
                    });
                  }
                  return true;
                },
                onDblClick: function(event) {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var suggestReplace = dialog.getContentElement('thesaurus', 'suggestReplace');
                  var lookedUp = dialog.getContentElement('thesaurus', 'lookedUp');
                  var btLookup = dialog.getContentElement('thesaurus', 'btLookup');
                  lookedUp.setValue(suggestReplace.getValue());
                  btLookup.onClick();
                }
              },
              {
                type: 'html',
                id: 'noReccomedtations',
                html: 'There are no recommendations for <br>the selected word.',
                style: 'position:absolute; top:3em;left:0; margin:0 auto; width: 100%; text-align: center;',
                setup: function(text) {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var noReccomedtations = dialog.getContentElement('thesaurus', 'noReccomedtations');
                  noReccomedtations.getElement().setStyle('visibility', 'hidden');
                }
              }
            ]
          },
          {
            type: 'html',
            id: 'replaceWithHtml',
            html: 'Replace with:'
          },
          {
            type: 'hbox',
            widths: ['50%', '25%', '25%'],
            style: 'margin-top: -3px;',
            children: [
              {
                type: 'text',
                id: 'replaceWith',
                required: true,
                setup: function(text) {
                  this.setValue(text);
                },
                commit: function(result) {
                  result.value = this.getValue();
                },
                onChange: function(event) {
                  this.setupButtonState();
                },
                onKeyUp: function(event) {
                  this.setupButtonState();
                },
                setupButtonState: function() {
                  var dialog = CKEDITOR.dialog.getCurrent();
                  var btLookup = dialog.getContentElement('thesaurus', 'buttonReplace');
                  if (this.getValue().trim()) {
                    btLookup.enable();
                  } else {
                    btLookup.disable();
                  }
                }
              },
              {
                type: 'button',
                id: 'buttonReplace',
                label: 'Replace',
                className: 'cke_primary',
                style: 'margin-left: -12px; border-radius: 0 4px 4px 0;',
                onClick: function(event) {
                  var sel = editor.getSelection();

                  var dialog = CKEDITOR.dialog.getCurrent();
                  var replace = dialog.getContentElement('thesaurus', 'replaceWith');

                  var origWord = sel.getSelectedText();
                  editor.insertText(replace.getValue());

                  var extendedInfo = {
                    targetWord: origWord,
                    characterPosition: characterPosition,
                    replacementWord: replace.getValue()
                  };

                  var payload = {
                    event: 'Thesaurus_Replacement',
                    payload: extendedInfo,
                    captureCharacterPosition: true
                  };
                  editor.fire('nhunspell.event', payload);

                  var plugin = CKEDITOR.plugins.NHunspell;
                  plugin.api.logThesaurusReplace(origWord, replace.getValue());

                  CKEDITOR.dialog.getCurrent().hide();
                  $('.cke_button__thesaurus').removeClass('cke_button__thesaurus_active');
                  var plugin = CKEDITOR.plugins.NHunspell;
                  plugin._.renderDocument();
                }
              },
              {
                type: 'button',
                id: 'btCancel',
                label: 'Close',
                style: 'margin-left: -2px; padding-left: 3px; padding-right: 3px;',
                onClick: function(event) {
                  onClose();

                  CKEDITOR.dialog.getCurrent().hide();
                  $('.cke_button__thesaurus').removeClass('cke_button__thesaurus_active');
                }
              }
            ]
          }
        ]
      }
    ],
    onShow: function() {
      var plugin = CKEDITOR.plugins.NHunspell;
      //including lookupHistory - Bug 44063
      //plugin.lookupHistory = []; // drop lookup history

      //1. Merge broken lines - caused by spellchecker intrusive bookmarks
      //2. Set the range to start with a Text node instead of its wrapper.
      //   the thesaurus plugin expects text as its input and fails upon encountering wrapping spans
      var currentRange = this.getParentEditor().createRange(),
        startNode = '',
        textNode = '',
        bookmark = '';

      if (
        this.getParentEditor()
          .getSelection()
          .getRanges()[0].startContainer.$.nodeType === CKEDITOR.NODE_ELEMENT
      ) {
        if (
          this.getParentEditor()
            .getSelection()
            .getRanges()[0].startContainer.$.parentNode.childNodes[0].nodeType === CKEDITOR.NODE_TEXT &&
          !!this.getParentEditor()
            .getSelection()
            .getRanges()[0].startContainer.$.parentNode.childNodes[1]
        ) {
          currentRange = this.getParentEditor()
            .getSelection()
            .getRanges();
          if (currentRange[0].startContainer.$.nodeType === CKEDITOR.NODE_ELEMENT) {
            currentRange[0].startContainer.$.textContent = currentRange[0].startContainer.$.textContent; //merge broken texts
            textNode = new CKEDITOR.dom.node(currentRange[0].startContainer.$.childNodes[0]);
            currentRange[0].setStart(textNode, 0);
          }
        } else if (
          this.getParentEditor()
            .getSelection()
            .getRanges()[0].startContainer.$.childNodes[0].nodeType === CKEDITOR.NODE_TEXT &&
          !!this.getParentEditor()
            .getSelection()
            .getRanges()[0].startContainer.$.childNodes[1]
        ) {
          bookmark = this.getParentEditor()
            .getSelection()
            .getRanges()[0].startContainer.$.childNodes[0].length;

          this.getParentEditor()
            .getSelection()
            .getRanges()[0].startContainer.$.textContent = this.getParentEditor()
            .getSelection()
            .getRanges()[0].startContainer.$.textContent;

          startNode = this.getParentEditor()
            .getSelection()
            .getRanges()[0].startContainer;
          textNode = new CKEDITOR.dom.node(startNode.$.childNodes[0]);
          currentRange.setStart(textNode, bookmark);
        }
      } else {
        currentRange = this.getParentEditor()
          .getSelection()
          .getRanges();
      }
      // sending the filtered range created above to thesaurus plugin
      if (
        !(currentRange.startContainer === null && currentRange.endContainer === null) &&
        this.getParentEditor()
          .getSelection()
          .getSelectedText().length === 0
      ) {
        wordRange = this.plugin.selectWordAtCursor(currentRange);
        if (wordRange) wordRange.select();
        characterPosition = wordRange.startOffset;
      }
      this.setupContent(
        $.trim(
          this.getParentEditor()
            .getSelection()
            .getSelectedText()
        )
      );
      var dialog = CKEDITOR.dialog.getCurrent();
      if (dialog !== null && dialog !== undefined) {
        var prevBtn = dialog.getContentElement('thesaurus', 'prev');
        if (plugin.lookupHistory.length < 2) {
          if (prevBtn) {
            prevBtn.disable();
          }
        } else {
          if (prevBtn) {
            prevBtn.enable();
          }
        }
      }

      var btLookup = this.getContentElement('thesaurus', 'btLookup');
      btLookup.onClick();
    },
    onOk: function() {},
    onLoad: function() {
      clearVisuals(); //reset

      $('.cke_button__thesaurus').addClass('cke_button__thesaurus_active');
      $('.cke_dialog_close_button').on('click', onClose);

      this.plugin = CKEDITOR.plugins.NHunspell;
      // Save path to the icon path of the current plugin
      this.iconPath = this.plugin.path + 'icons/';
      // Define function to generate URL CSS atribute for a given file name
      this.getIconUrl = function(fileName) {
        return "url('" + this.iconPath + fileName + "')";
      };

      var dialogElement = this.parts.contents.$;
      dialogElement.style.overflow = 'hidden';
      this.parts.footer.$.style.display = 'none';

      // Get CKeditor buttons
      var prevButton = this.getContentElement('thesaurus', 'prev');
      var lookupButton = this.getContentElement('thesaurus', 'btLookup');

      $('#' + prevButton.domId)
        .css({
          width: '24px',
          'background-image': this.getIconUrl('thesaurus-previous.png'),
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          'background-size': '20px'
        })
        .attr('__img', this.getIconUrl('thesaurus-previous.png'))
        .attr('__imgH', this.getIconUrl('thesaurus-previous-hover.png'))
        .hover(handleHover);

      $('#' + lookupButton.domId)
        .css({
          width: '24px',
          'background-image': this.getIconUrl('thesaurus-search.png'),
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          'background-size': '20px'
        })
        .attr('__img', this.getIconUrl('thesaurus-search.png'))
        .attr('__imgH', this.getIconUrl('thesaurus-search-hover.png'))
        .hover(handleHover);
    }
  };
  function clearVisuals() {
    if (CKEDITOR.prevAssesment !== CKEDITOR.currentAssesment) {
      var plugin = CKEDITOR.plugins.NHunspell;
      plugin.lookupHistory = []; // drop any previous lookup history, new assessment has been loaded
    }

    CKEDITOR.prevAssesment = CKEDITOR.currentAssesment;

    var dialog = CKEDITOR.dialog.getCurrent();
    if (dialog !== null && dialog !== undefined) {
      //reset before deciding what is to be shown to user
      var lookedupList = dialog.getContentElement('thesaurus', 'lookedupList');
      var suggestReplace = dialog.getContentElement('thesaurus', 'suggestReplace');
      if (lookedupList !== null && lookedupList !== undefined) {
        lookedupList.clear();
        //reset visual, init state should be off, fix words selected other logic will turn back on
        lookedupList.getElement().setStyle('visibility', 'hidden');
      }
      if (suggestReplace !== null && suggestReplace !== undefined) {
        suggestReplace.clear();
        suggestReplace.getElement().setStyle('visibility', 'hidden');
      }
    }
  }

  function handleHover(e) {
    if (e.type == 'mouseenter' && !$(this).hasClass('cke_disabled')) {
      $(this).css({
        'background-image': $(this).attr('__imgH')
      });
    } else {
      $(this).css({
        'background-image': $(this).attr('__img')
      });
    }
  }
});
