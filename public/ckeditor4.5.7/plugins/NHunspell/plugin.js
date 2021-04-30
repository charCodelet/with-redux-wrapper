/*!
 * Hunspell Plugin for CK Editor
 *
 * http://ckeditor.com/
 *
 * Copyright (c) 2016 InfoPro Systems, Inc.
 * Released under the MIT license
 */

// Constants for plugin commands
const NHUNSPELL_COMMAND_SPELLCHECK = 'checkspell';
const NHUNSPELL_COMMAND_OPTIONS = 'spelloptions';
const NHUNSPELL_COMMAND_THESAURUS = 'thesaurus';
const NHUNSPELL_BUTTON_SPELLCHECK = 'checkspell';
const NHUNSPELL_BUTTON_THESAURUS = 'thesaurus';
const NHUNSPELL_GROUP_SPELLCHECK = 'spellcheck';
const NHUNSPELL_COMMAND_FINISHEDSELECTION = 'finishedselection';
const NHUNSPELL_GROUPNAME_SYNONYMS = 'synonyms';
const NHUNSPELL_COMMAND_SYNONYMS = 'synonyms';
const NHUNSPELL_BUTTON_SYNONYMS = 'synonyms';
const NHUNSPELL_GROUPNAME_SYNONMYS_THESAURUS = "synonymsThesaurus";
const NHUNSPELL_GROUP_SYNONMYS_THESAURUS = 41;
const NHUNSPELL_GROUP_SYNONYMS = 40;

CKEDITOR.plugins.add('NHunspell', {
  requires: ['dialog', 'richcombo', 'contextmenu', 'toolsmenu'],
  icons: 'NHunspell',
  eventName: '',
  eventSource: '',

  init: function (editor) {

    var head = window.document.head;
    var last = null,
      links = head.getElementsByTagName('link');
    for (var i = 0, len = links.length; i < len; i++) {
      var link = links[i];
      if (link.type == "text/css") {
        last = link;
      }
    }
    var link = window.document.createElement('link');
    //link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = CKEDITOR.getUrl('plugins/NHunspell/css/custom.css');
    link.media = 'all';

    if (last != null) {
      last.parentNode.insertBefore(link, last.nextSibling);
    } else {
      head.appendChild(link)
    }

    // Plugin reference
    var plugin = CKEDITOR.plugins.NHunspell;

    //Load css for "classic mode" integration
    editor.addContentsCss(CKEDITOR.getUrl(this.path + 'css/NHunspell.css'));

    // When editor instance is ready - initialiaze plugin
    editor.on('instanceReady', function () {
      //  Looks like instanceReady is getting called sooner than needed causing a race condition leading to unexpected errors.
      //  Scheduling the plugin initialization for later to give time to CKE to initialize itself.
      setTimeout(function () {
        plugin.init(editor);
      }, 350);
    });

    editor.on('topMenuCommand', function (evt) {
      plugin.eventSource = 'menu';
      if (evt.data === 'thesaurus') {
        plugin.eventName = 'Menu_Thesaurus';
      } else if (evt.data === 'checkspell') {
        plugin.eventName = 'Menu_SpellCheck';
      }
    });

    editor.on('uiButtonCommand', function (evt) {
      plugin.eventSource = 'toolbar';
      if (evt.data.command === 'thesaurus') {
        plugin.eventName = 'Button_Thesaurus';
      } else if (evt.data.command === 'checkspell') {
        plugin.eventName = 'Button_SpellCheck';
      }
    });

    editor.on('menuItemCommand', function (evt) {
      plugin.eventSource = 'context menu';
      if (evt.data.command === 'thesaurus') {
        plugin.eventName = 'RightClick_Thesaurus';
      } else if (evt.data.command === 'checkspell') {
        plugin.eventName = 'RightClick_SpellCheck';
      }
    });

    // Define textedit with dropdown listbox UI element
    CKEDITOR.dialog.addUIElement('ddtext', {
      build: function (dialog, elementDefinition, htmlList) {

        var ddtextElement = function (dialog, elementDefinition, htmlList) {
          if (arguments.length < 3)
            return;


          var _ = (this._ || (this._ = {})),
            contentLoad = elementDefinition.onContentLoad && CKEDITOR.tools.bind(elementDefinition.onContentLoad, this),
            cssWidth = CKEDITOR.tools.cssLength(elementDefinition.width),
            cssHeight = CKEDITOR.tools.cssLength(elementDefinition.height);

          _.textId = CKEDITOR.tools.getNextId() + '_text';
          _.listId = CKEDITOR.tools.getNextId() + '_list';

          var attributes = {
            src: '%2',
            id: _.textId,
            frameborder: 0,
            allowtransparency: true
          };

          var html = [];

          CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, html, 'ddtext', {
            width: cssWidth,
            height: cssHeight
          }, attributes, '');

          html = ['<div class="cke_dialog_ui_labeled_content" role="presentation">'];

          // Set the validator, if any.
          if (elementDefinition.validate)
            this.validate = elementDefinition.validate;

          // Set the max length and size.
          if (elementDefinition.maxLength)
            attributes.maxlength = elementDefinition.maxLength;
          if (elementDefinition.size)
            attributes.size = elementDefinition.size;

          if (elementDefinition.inputStyle)
            attributes.style = elementDefinition.inputStyle;


          // IE BUG: Text input fields in IE at 100% would exceed a <td> or inline
          // container's width, so need to wrap it inside a <div>.
          //
          html.push('<div class="cke_dialog_ui_input_text select-editable" role="presentation" style="position:relative');
          if (elementDefinition.width)
            html.push('width:' + elementDefinition.width + ';');

          //html.push(';width:100px"');
          html.push('">');

          html.push('<select class="cke_dialog_ui_input_select" onchange="this.nextElementSibling.value=this.value;document.querySelector(\'a[__img*=search]\').click();" style="');
          if (elementDefinition.width)
            html.push('width:' + elementDefinition.width + ';');
          html.push('">');

          if (elementDefinition.items) {
            for (var i = 0, len = elementDefinition.items.length; i < len; i++) {
              var item = elementDefinition.items[i];
              html.push('<option value="' + item + '"/>');
            }
          }
          html.push('</select>');

          html.push('<input aria-labelledby="');

          html.push(CKEDITOR.tools.getNextId(), "_label");
          html.push('" type="text" class="cke_dialog_ui_input_text"');
          html.push(' id="' + _.textId + '"');
          //html.push(' list="' + _.listId + '"');
          html.push(' style="width: 91%; margin-top: 1px; margin-left: 1px; padding: 4px 4px 3px 4px;" />');

          /*html.push('<datalist id="' + _.listId + '">');
              if (elementDefinition.items) {
              for (var i = 0, len = elementDefinition.items.length; i < len; i++) {
                  var item = elementDefinition.items[i];
                  html.push('<option value="' + item + '"/>');
              }
              }
          html.push('</datalist>');*/

          html.push('</div>');
          html.push('</div>');

          htmlList.push(html.join(''));

        }

        ddtextElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement(), {
          keyboardFocusable: true
        }, {
            add: function (label, value, index) {
              var option = new CKEDITOR.dom.element('option', this.getDialog().getParentEditor().document),
                selectElement = this.getInputElement().$.previousSibling;
              option.$.text = label;
              option.$.value = (value === undefined || value === null) ? label : value;
              if (index === undefined || index === null) {
                selectElement.options.add(option.$);
              } else {
                selectElement.options.add(option.$, index);
              }
              return this;
            },
            clear: function () {
              var selectElement = this.getInputElement().$.previousSibling;
              while (selectElement.options.length > 0)
                selectElement.options.remove(0);
              return this;
            },
          }, true);

        return new ddtextElement(dialog, elementDefinition, htmlList);

      }
    });

    // Create dialogs
    CKEDITOR.dialog.add(NHUNSPELL_COMMAND_SPELLCHECK, CKEDITOR.getUrl(this.path + 'dialogs/spellcheck.js'));
    CKEDITOR.dialog.add(NHUNSPELL_COMMAND_OPTIONS, CKEDITOR.getUrl(this.path + 'dialogs/spelloptions.js'));
    CKEDITOR.dialog.add(NHUNSPELL_COMMAND_THESAURUS, CKEDITOR.getUrl(this.path + 'dialogs/thesaurus.js'));
    CKEDITOR.dialog.add(NHUNSPELL_COMMAND_FINISHEDSELECTION, CKEDITOR.getUrl(this.path + 'dialogs/finishedselection.js'));

    // Add toolbar buttons
    editor.ui.addButton(NHUNSPELL_BUTTON_SPELLCHECK, {
      label: 'Check Spelling',
      command: NHUNSPELL_COMMAND_SPELLCHECK,
      icon: CKEDITOR.getUrl(CKEDITOR.basePath + 'skins/' + CKEDITOR.skinName + '/icons/hidpi/spellchecker.png'),
      toolbar: NHUNSPELL_GROUP_SPELLCHECK + ',99'
    });
    editor.ui.addButton(NHUNSPELL_BUTTON_THESAURUS, {
      label: 'Open Thesaurus',
      command: NHUNSPELL_COMMAND_THESAURUS,
      toolbar: NHUNSPELL_GROUP_SPELLCHECK + ',99'
    });

    // Enhance dialogs behavior and styling
    CKEDITOR.on('dialogDefinition', function (evt) {
      // Only do enhancements for NHunspell dialogs
      switch (evt.data.name) {
        case NHUNSPELL_COMMAND_SPELLCHECK:
        case NHUNSPELL_COMMAND_OPTIONS:
        case NHUNSPELL_COMMAND_THESAURUS:
        case NHUNSPELL_COMMAND_FINISHEDSELECTION:
          plugin._.adjustDialogStyle(evt.data.definition.dialog);
          break;
      }
    });

    // Create dialog/context menu commands
    var nhspellCheckCommand = editor.addCommand(NHUNSPELL_COMMAND_SPELLCHECK, new CKEDITOR.dialogCommand(NHUNSPELL_COMMAND_SPELLCHECK)),
      nhspellOptionsCommand = editor.addCommand(NHUNSPELL_COMMAND_OPTIONS, new CKEDITOR.dialogCommand(NHUNSPELL_COMMAND_OPTIONS)),
      nhspellThesaurusCommand = editor.addCommand(NHUNSPELL_COMMAND_THESAURUS, new CKEDITOR.dialogCommand(NHUNSPELL_COMMAND_THESAURUS)),
      nhspellFinishedSelectionCommand = editor.addCommand(NHUNSPELL_COMMAND_FINISHEDSELECTION, new CKEDITOR.dialogCommand(NHUNSPELL_COMMAND_FINISHEDSELECTION));

    var selectedElementAtCursor = null;
    var selectedWordAtCursor = null;

    // Storage for shown suggestions - will be used for cleanup
    var menuSuggestions = [];
    // Menu group for suggestion words
    editor.addMenuGroup('nhspell_suggest', -10);
    // Menu group for controls (ignore, ignore all)
    editor.addMenuGroup('nhspell_control', -9);
    // Menu group for commands (spell check, thesaurus)
    editor.addMenuGroup(NHUNSPELL_GROUP_SPELLCHECK, 10);


    // Add item to context menu
    if (editor.addMenuItems) {
      editor.addMenuItem(NHUNSPELL_COMMAND_SPELLCHECK, {
      label: "Check Spelling",
      icon: this.path + 'icons/hidpi/spellchecker.png',
      command: NHUNSPELL_COMMAND_SPELLCHECK,
       group: NHUNSPELL_GROUP_SPELLCHECK,
        order: 101
     });
    };

    // Register context menu listeners

    if (editor.contextMenu && editor.addMenuItems) {
        editor.contextMenu.addListener(function (element, selection) {

        var plugin = CKEDITOR.plugins.NHunspell;// Remove unused commands and menuitems

        // Remove unused commands and menuitems
        for (m in menuSuggestions) {
          // Do not delete commands
          switch (m) {
            case NHUNSPELL_COMMAND_SYNONYMS:
            case NHUNSPELL_COMMAND_SPELLCHECK:
            case NHUNSPELL_COMMAND_THESAURUS:
              continue;
          }
          delete editor._.menuItems[m];
          delete editor.commands[m];
        }

        // Reset items
        menuSuggestions = {};
        menuSuggestions[NHUNSPELL_COMMAND_SPELLCHECK] = CKEDITOR.TRISTATE_OFF;

        var word = plugin.getTypoWord(element);

        if (!word) {
           var currentSynonyms = plugin.currentSynonyms;
           menuSuggestions = plugin.buildSynonmysContextMenu(element, editor, currentSynonyms, menuSuggestions);
        }
        else {
           menuSuggestions = plugin.buildSpellContextMenu(element, word, menuSuggestions);
        }

        return menuSuggestions;

      });  //end add context menu listensers

    }; //end context menu add items

    editor.on("key", function (k) {
      plugin.keyHandler(k.data.keyCode)
    });

    editor.on("focus", function () {
      this._.editorHasFocus = true;
    });
    editor.on("blur", function () {
      this._.editorHasFocus = false;
    });

    editor.on("getSynonyms", function (evt) {
      var continueOnOpenCallback = evt.editor.continueOnOpenCallback;
      var plugin = CKEDITOR.plugins.NHunspell;
      plugin.selectedElementAtCursor = plugin.elementAtCursor();
      plugin.selectedWordAtCursor = plugin.getWordFromElementAtCursor(plugin.selectedElementAtCursor);
      plugin.getSynonymsData(plugin.selectedWordAtCursor, editor, continueOnOpenCallback);
    });

  },   // end init

});  // end plugins.add


// Plugin constants
const NHUNSPELL_SERVICE_URL = window.location.protocol + '//' + window.location.hostname + '/api/hunspell/v1'; // Path to the API root
const NHUNSPELL_STYLE_TYPO = 'nhspell-typo';
const NHUNSPELL_STYLE_IGNORED = 'nhspell-typo-disabled';
const NHUNSPELL_ATTR_WORD = 'data-nhspell-word';
const NHUNSPELL_ATTR_IGNORED = 'data-nhspell-ignored';


CKEDITOR.plugins.NHunspell = {
    config: {
        //Spell Check Options configuration with defaults
        ignoreUpperCase: false,
        ignoreNumbers: false,
        ignoreMixedCase: false,
        spellAsUType: true,

        // Muximum size of suggestions list in context menu
        maxSuggestions: 7,
        // Minimum length of word to check spelling
        minWordLength: 2,

        // Maximum length of word to check spelling
        maxWordLength: 63
    },
    state: false,
    suggestionsCache: [], // suggestionsCache[word] = ['suggestion1', ...];
    synonymsCache: [], // synonymsCache[word] = ['synonym1', ...];
    spellCache: [],
    ignoredWords: [],
    lookupHistory: [],
    normalizeRequested: true, // always normalize
    isCheckSelectedArea: false,
    isRevisitRequired: false,
    eventName: '',

    checkNow: function() {
        if (!this.selectionCollapsed()) {
            return;
        }
        if (this.state) {
            this.startSCAYT();
        }
    },

    elementAtCursor: function() {
        if (!this.editor.getSelection()) {
            return null;
        }
        return this.editor.getSelection().getStartElement();
    },

    /*triggerSpelling: function (immediate) {
        //only reckeck when the user pauses typing
        clearTimeout(spell_ticker);
        if (selectionCollapsed) {
            spell_ticker = setTimeout(checkNow, immediate ? 50 : spell_delay);
        }
    },*/

    spell_fast_after_spacebar: true,

    keyHandler: function(ch8r) {
        this._.editorHasFocus = true;
        //recheck after typing activity
        if (ch8r >= 16 && ch8r <= 31) {
            return;
        }
        if (ch8r >= 37 && ch8r <= 40) {
            return;
        }
        var target = this.elementAtCursor();
        if (!target) {
            return;
        }
        //if! user is typing on a typo remove its underline
        if (target.$.className == NHUNSPELL_STYLE_TYPO) {
            target.$.className = NHUNSPELL_STYLE_IGNORED;
        }
        this.triggerSpelling((this.spell_fast_after_spacebar && (ch8r === 32 || ch8r === 10 || ch8r === 13)))
    },

    triggerSpelling: function(immediate) {
        //only reckeck when the user pauses typing
        if (this.spell_ticker)
            clearTimeout(this.spell_ticker);
        //if (this.selectionCollapsed()) {
        var self = this;
        this.spell_ticker = setTimeout(function() { self.checkNow.call(self) }, immediate ? 50 : this.spell_delay);
        //}
    },

    selectionCollapsed: function() {
        if (!this.editor.getSelection()) {
            return true;
        }
        return this.editor.getSelection().getSelectedText().length == 0;
    },

    elementAtCursor: function() {
        if (!this.editor.getSelection()) {
            return null;
        }
        return this.editor.getSelection().getStartElement();
    },

    setEditorFocus: function(focus) {
        var tmp = this._.editorHasFocus;
        this._.editorHasFocus = focus;
        return tmp;
    },

    spell_ticker: null,
    spell_delay: 250,

    // Initializes plugin. Runs on Editor loaded event
    init: function(editor) {

        this.editor = editor;
        this.path = editor.plugins.NHunspell.path;
        this._.editor = editor;
        this._.plugin = this;

        // *** Load NHunspell CSS ***

        // Attempt to load CSS for the Dialog look-n-feel adjustment.
        // Approach did not work as it loads CSS into the CKEditor document only (not browser document)
        // and therefore does not affect dialogs and other UI elements. Alternative solution is to inject
        // style directly into the UI elements - see adjustDialogStyle(dialog) method for details.
        //this._.loadCss(this.path + 'css/NHunspell.css', 'NHunspell_Style');

        // Method to add stylesheet to the HEAD. Used to load NHunspell styles to the document model
        /*var loadCss = function (path, name) {
            var d = CKEDITOR.document.$; // Document
            if (!name || !d.getElementById(name)) {
                var head = d.getElementsByTagName("head")[0];
                var el = d.createElement("link"); // Link element for the CSS
                el.setAttribute("rel", "stylesheet");
                el.setAttribute("type", "text/css");
                el.setAttribute("href", path);
                el.setAttribute("id", 'nhspell_theme');
                head.insertBefore(el, head.firstChild);
            }
        };
        loadCss("Scripts/ckeditor4.5.7/plugins/NHunspell/css/NHunspell.css");*/


        if (this.config.spellAsUType)
            this.startSCAYT();
    },

    // Start spellcheck as you type
    startSCAYT: function(callback) {
        if (this.editor.document) {
            this.state = true;
            if (this.normalizeRequested) {
                this._.normalizeNodes(this.editor.document.$.body);
            }

            var words = this._.getWords(this.editor.document.$.body);

            // Start spell check as you type logic
            if (words.length == 0) {
                this._.renderDocument()
                if (callback) callback();
            } else {
                this._.sendWords(words, callback)
            }
        }
    },

    isSpelled: function() {
        return false;
    },

    stopSCAYT: function() {
        this.state = false;
        this._.clearMarkings(this.editor.document.$.body);
        this._.normalizeNodes(this.editor.document.$.body);
    },

    getSuggestions: function(word) {
        // Check via API if not in cache - It's always in cache if it marked as 'spelling error'
        var suggestions = this.suggestionsCache[word];
        if (suggestions && suggestions.length > this.config.maxSuggestions) {
            suggestions = suggestions.slice(0, this.config.maxSuggestions);
        }
        return suggestions;
    },

    getSynonyms: function(word) {
        // Check via API if not in cache
        return this.synonymsCache[word];
    },

    getListOfSynonyms: function (thesaurusInfo) {
      if ((thesaurusInfo !== null) && (thesaurusInfo !== undefined)) {
        var synonyms = thesaurusInfo.Meanings[0].Synonyms;
        return synonyms;
      }
      return [];
    },

    getSynonymsData: function (origWord, editor, callback) {
      var self = this;
      //lookup in cache first if not there fetch
      if (self.synonymsCache[origWord] !== undefined) {
        self.currentSynonyms = self.synonymsCache[origWord];
        return callback(); //done
      }
      //need to fetch the synonyms for given word
      self.api.getThesaurus(origWord, function (thesaurusInfo) {
        self.currentSynonyms = self.getListOfSynonyms(thesaurusInfo);
        self.synonymsCache[origWord] = self.currentSynonyms;
        return callback();
       // editor.fire('continueOnShow');  did not work,so went with callback
      });
    },

    buildSynonmysSubMenuItem: function (editor, element, plugin, suggestion ) {
      var sCommandName = 'nhspell_suggestion_' + suggestion;
        var sExecCommand = (function (element, suggestion) {
          return {
            exec: function () {
              var origWord = plugin.selectedWordAtCursor;
               plugin.replaceWordWithSynonym(origWord, suggestion);
               plugin.api.logThesaurusReplace(origWord, suggestion);
            }
          };
        })(element, suggestion);

        plugin._.addButtonCommand(suggestion, sCommandName, sExecCommand, NHUNSPELL_GROUPNAME_SYNONYMS, 0);

        editor.addMenuItem(sCommandName, {
          label: suggestion,
          icon: '',
          command: sCommandName,
          group: NHUNSPELL_GROUPNAME_SYNONYMS,
          state: 2,
          order: 105
        });

        return sCommandName;
    },

    buildSynonmysThesaurusSubMenuItem: function (editor, element, plugin) {

      editor.addMenuGroup(NHUNSPELL_GROUPNAME_SYNONMYS_THESAURUS, NHUNSPELL_GROUP_SYNONMYS_THESAURUS);

      var suggestion = "Thesaurus"
      var sCommandName = 'nhspell_suggestion_' + suggestion;
      var sExecCommand = NHUNSPELL_COMMAND_THESAURUS;

      plugin._.addButtonCommand(suggestion, sCommandName, sExecCommand, NHUNSPELL_GROUPNAME_SYNONMYS_THESAURUS, 1);

      editor.addMenuItem(sCommandName, {
        label: suggestion,
        icon: NHUNSPELL_BUTTON_THESAURUS,
        command: sExecCommand,
        group: NHUNSPELL_GROUPNAME_SYNONMYS_THESAURUS,
        state: 2,
        order: 105
      });

      return sCommandName;
    },

    buildNoSuggestionSubMenuItem: function (editor, element, plugin) {
      var suggestion = "No Suggestions"
      var sCommandName = 'nhspell_suggestion_' + suggestion;
     var sExecCommand = '';
      
      plugin._.addButtonCommand(suggestion, sCommandName, sExecCommand, NHUNSPELL_GROUPNAME_SYNONYMS, 1);

      editor.addMenuItem(sCommandName, {
        label: suggestion,
        icon: '',
        command: sExecCommand,
        group: NHUNSPELL_GROUPNAME_SYNONYMS,
        state: CKEDITOR.TRISTATE_OFF,
        order: 105
      });

      return sCommandName;
    },

    buildSynonmysContextMenu: function (element, editor, currentSynonmys, menuSuggestions) {
      var plugin = this;
      var subMenuItems = [];

      if (!editor) { return; }

      // add Synonyms menu item to context menu
      editor.addMenuGroup(NHUNSPELL_GROUPNAME_SYNONYMS, NHUNSPELL_GROUP_SYNONYMS);
      plugin._.addButtonCommand(NHUNSPELL_GROUPNAME_SYNONYMS, NHUNSPELL_COMMAND_SYNONYMS, NHUNSPELL_COMMAND_SYNONYMS, NHUNSPELL_GROUPNAME_SYNONYMS, 0);

      editor.addMenuItem(NHUNSPELL_COMMAND_SYNONYMS, {
        label: "Synonyms",
        icon: NHUNSPELL_BUTTON_SYNONYMS,
        command: NHUNSPELL_COMMAND_SYNONYMS,
        group: NHUNSPELL_GROUPNAME_SYNONYMS,
        state: CKEDITOR.TRISTATE_OFF,
        order: 103
      });

      //only taking the top 5 choices for suggestion to be added to context menu
      if (currentSynonmys.length > 0) {
        for (var i = 0; i < currentSynonmys.length && i < 5; i++) {
          var subMenuItem = this.buildSynonmysSubMenuItem(editor, element, plugin, currentSynonmys[i])
          subMenuItems.push[subMenuItem];
          subMenuItems[subMenuItem] = CKEDITOR.TRISTATE_OFF;
        }
      }
      else {
        //add no suggestions
        var subMenuItem = this.buildNoSuggestionSubMenuItem(editor, element, plugin);
        subMenuItems[subMenuItem] = CKEDITOR.TRISTATE_DISABLED;
      }

      var thesaurusMenuItem = this.buildSynonmysThesaurusSubMenuItem(editor, element, plugin)
      subMenuItems.push[thesaurusMenuItem];
      subMenuItems[thesaurusMenuItem] = CKEDITOR.TRISTATE_OFF;

      //add Synonmys Sub Menu Items to Synomys
      editor.addMenuItem(NHUNSPELL_COMMAND_SYNONYMS, {
        label: "Synonyms",
        icon: NHUNSPELL_BUTTON_SYNONYMS,
        command: NHUNSPELL_COMMAND_SYNONYMS,
        group: NHUNSPELL_GROUPNAME_SYNONYMS,
        order: 103,
        state: 2,
        getItems:subMenuItems
      });
      menuSuggestions[NHUNSPELL_COMMAND_SYNONYMS] = CKEDITOR.TRISTATE_OFF;

      return menuSuggestions;
     },


    // buildSpellContextMenu
    buildSpellContextMenu: function (element, word, menuSuggestions) {

      var self = this;
      var plugin = self;

      var currentSuggestions = plugin.getSuggestions(word);

      // Populate suggestion menu
      for (var i = 0; i < currentSuggestions.length; i++) {
        var sCommandName = 'nhspell_suggestion_' + currentSuggestions[i].replace(' ', '_');
        var sExecCommand = (function (element, suggestion) {
          return {
            exec: function () {
              var origWord = element.getText();
              // hook to the actual replace with suggestion logic
              plugin.replaceWord(element, suggestion);

              plugin.api.logMisspellFromMenu(origWord, suggestion);
            }
          };
        })(element, currentSuggestions[i]);

        plugin._.addButtonCommand(currentSuggestions[i], sCommandName, sExecCommand, 'nhspell_suggest', i);
        menuSuggestions[sCommandName] = CKEDITOR.TRISTATE_OFF;
      }

      // Create Ignore commands
      var ignoreCommand = (function (element, word) {
        return {
          exec: function () {
            // hook to the plugin ignore command
            plugin.spellIgnore(element, word, false);
          }
        };
      })(element, word);

      var ignoreAllCommand = (function (element, word) {
        return {
          exec: function () {
            // hook to the plugin ignore command
            plugin.spellIgnore(element, word, true);
          }
        };
      })(element, word);

      //buttonLabel, commandName, command, menugroup, menuOrder
      plugin._.addButtonCommand('Ignore', 'nhspell_ignore', ignoreCommand, 'nhspell_control', 1);
      plugin._.addButtonCommand('Ignore All', 'nhspell_ignore_all', ignoreAllCommand, 'nhspell_control', 2);
      menuSuggestions['nhspell_ignore'] = CKEDITOR.TRISTATE_OFF;
      menuSuggestions['nhspell_ignore_all'] = CKEDITOR.TRISTATE_OFF;

      return menuSuggestions;
    },

    spellIgnore: function(element, word, all) {
        if (all && !this.isIgnoredWord(word))
            this.ignoreWord(word);
        else
            this.ignoreSingleWord(element);
        this.triggerSpelling();
    },

    ignoreWord: function(word) {
        // Used for "ignore all" command cache
        this.ignoredWords.push(word.toLowerCase());
    },

    isIgnoredWord: function(word) {
        return (this.ignoredWords.indexOf(word.toLowerCase()) >= 0);
    },

    ignoreSingleWord: function(element) {
        if (element.type == 1 && element.hasClass(NHUNSPELL_STYLE_TYPO)) {
            element.setAttribute(NHUNSPELL_ATTR_IGNORED, "1");
            element.removeClass(NHUNSPELL_STYLE_TYPO);
        }
    },

    // This method gets a word (misstyped word) from a document typo element.
    // If not, go up and check parents (up to specified number of levels)
    // Going up is only needed for 'fancy' formatting handling
    getTypoWord: function(element) {
        var node = this.getTypoNode(element);
        if (node)
            return node.getAttribute('data-cke-word');
    },

    // This method should check if current element is a typo element.
    // If not, go up and check parents (up to specified number of levels)
    // Going up is only needed for 'fancy' formatting handling
    getTypoNode: function(element, attempt) {
        var node = (element.$ ? element.$ : element);
        if (node.className == NHUNSPELL_STYLE_TYPO)
            return node;
        var level = (level ? level++ : 1);
        if (level < 3 && node.parentNode)
            return this.getTypoNode(node.parentNode, level);
        return null;
    },

    // This method replaces mistyped word with a suggestion
    replaceWord: function(element, suggestion) {
        var node = this.getTypoNode(element);
        if (node) {
            node.innerText = suggestion;
            node.removeAttribute('class', NHUNSPELL_STYLE_TYPO);
        }
    },

    //this method will get the selected word (under cursor) in the given span element
    //returned from CKEditors ElementAtCursor.  Used to find word to run getThesauaurs on
    getWordFromElementAtCursor: function (selectedElement) {
      var plugin = this;

      //get the  start and end offest of selected word from  CKEDITOR helpers
      var sel = plugin.editor.getSelection();
      var ranges = sel.getRanges();

      plugin.selectedWordRange = plugin.selectWordAtCursor(ranges);
      var word = '';
      if (plugin.selectedWordRange.startContainer.$.data !== undefined) {
          word = plugin.selectedWordRange.startContainer.$.data.substring(plugin.selectedWordRange.startOffset, plugin.selectedWordRange.endOffset);
      }
      return word;
    },

    // This method replaces the currently selected element text that contains the given word
    // with the given synonym suggestion
    replaceWordWithSynonymNew: function (word, suggestion) {
      var plugin = this;
   
      var origText = plugin.selectedElementAtCursor.getText();
      var newText = origText.replace(word, suggestion);
      plugin.selectedElementAtCursor.setText(newText);

      plugin.editor.container.addClass('cke_focus');

      },

    // This method replaces the currently selected element text that contains the given word
    // with the given synonym suggestion
    replaceWordWithSynonym: function (word, suggestion) {
      var plugin = this;

      var origText = plugin.selectedElementAtCursor.getText();
      var newText = origText.replace(word, suggestion);
      plugin.selectedElementAtCursor.setText(newText);

      //update the cursor to the correct location and then reset focus on editor
      var sel = plugin.editor.window.$.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        var range = sel.getRangeAt(0);
        range.collapse(true);
        //get new cursor position which will be at the end of word just inserted/replaced
        var delta = suggestion.length - word.length;
        var curPos = plugin.selectedWordRange.endOffset + delta;
        range.setStart(plugin.selectedElementAtCursor.$.childNodes[0], curPos);
        range.setEnd(plugin.selectedElementAtCursor.$.childNodes[0], curPos);

        sel.removeAllRanges();
        sel.addRange(range);
        textNode = plugin.selectedElementAtCursor;
        textNode.focus();

        plugin.editor.container.addClass('cke_focus');

      }

    },

    // Tools and helpers methods reside under '_' class
    _: {
        firstDialogLoad: true, // Set to true by default, since no dialog was yet loaded

        editorHasFocus: false,

        adjustDialogStyle: function(dialog) {

            var dts = dialog.parts.title.$.style; // Title style
            var dcs = dialog.parts.close.$.style; // Close button style ([X] button)

            //Remove CKEditor title background image
            dts.backgroundImage = 'none';

            // Set background color according to requirements (used color picker to get color formula)
            dts.backgroundColor = 'rgb(36, 107, 178)';
            dts.color = 'white';

            // Set styling of the dialog close button according to requirements ([X] button in the title bar)
            dcs.backgroundColor = 'silver';
            dcs.border = 'solid 1px gray';

            if (!dialog.parts.instructions) {

                // Instructional message text
                var instructionText = 'You can move this window by dragging the blue bar.';

                // Create instructions Element
                var instructions = this.createInstructionsBubble(dialog, instructionText);

                // Append instructions element to the dialog body
                dialog.parts.dialog.append(instructions);

                // Add instructions element to the dialog parts object
                dialog.parts.instructions = instructions;
            }

            // Add onShow handler to track and show dialog instructions
            dialog.on('show', function() {
                var plugin = CKEDITOR.plugins.NHunspell;
                plugin._.showDialogInstructions(this);
            });

            // Since dialog does not support onMove event firing, override dialog's move method
            if (!dialog._move) {
                // Save original method
                dialog._move = dialog.move;

                var prevX = '', prevY = '';
                var plugH = CKEDITOR.plugins.NHunspell;
                // Send dialog move observable event for spell check or thesaurus, debounce 250.
                var sendObsEventFunc = _.debounce(plugH._.sendDialogMoveEnaepObservableEvent, 250);

                // Redefine move method
                dialog.move = function(x, y, save) {
                    // Call to the original method
                    this._move(x, y, save);
                    // Hide dialog help once start moving the dialog.
                    var plugin = CKEDITOR.plugins.NHunspell;
                    plugin._.hideDialogInstructions(this);

                    //ensure the jquery ui-draggable-dragging css is removed so the style when dialog is moved DOES NOT CHANGE as per requested #44818
                    $(CKEDITOR.dialog.dragRoot).removeClass("ui-draggable ui-draggable-dragging");

                    sendObsEventFunc(this, x, y, prevX, prevY);
                    prevX=x;
                    prevY=y
                }
            }

            // That did not work as there is no knowledge of dialog object inside
            //dialog.parts.contents.$.onclick = function () {
            //    var plugin = CKEDITOR.plugins.NHunspell;
            //    plugin._.hideDialogInstructions(this);
            //}

        },

        sendDialogMoveEnaepObservableEvent: function(self, x, y, prevX, prevY) {
            var title = self.definition && self.definition.title;
            var extendedInfo = {};
            var sel = window.getSelectionInfo(self.getParentEditor());
            extendedInfo.selectedText = sel.textSelected || '';
            extendedInfo.startPos = sel.startPos;
            extendedInfo.endPos = sel.endPos;
            // get coords relative to ckeditor
            var pos = $('ckeditor').position();
            x -= pos.left;
            y -= (pos.top + 58); // ckeditor dialog top styling of 58.
            extendedInfo.endingLocation = `(${x}, ${y})`;
            extendedInfo.startingLocation = `(${prevX}, ${prevY})`;
            var typeId = 999;
            switch(title.toLowerCase()) {
                case 'spell check': typeId = 150; break;
                case 'thesaurus': typeId = 152; break;
                default: console.warning('DialogMoveOE: Unknown dialog title conversion to typeId, using 999');
                }
            var oe = {
                type: typeId,
                name: title,
                time: getCurTime(),
                extInfo: extendedInfo
            };
            self.getParentEditor().fire("enaepObservableEvent", oe);
        },

        createInstructionsBubble: function(dialog, message) {
            // CSS did not work most likely due to the injection in a wrong document module.
            // Investigate later, for now hardcode into the style property

            // Instruction buble template
            var instructionsTemplate = '<div ' +
                'id="inlineInstructionsTemplate"' +
                ' style="' +
                'font-size: 28rem; ' +
                'font-weight: bold; ' +
                'font-family: Calibri, sans-serif;' +
                'position: absolute !important; ' +
                'box-sizing: border-box; ' +
                'padding: 7px 20px 13px; ' +
                'opacity: 1;' +
                'box-shadow: 0 0 5px rgba(0,0,0,.2); ' +
                'line-height: 1.25; ' +
                'cursor: default; ' +
                'max-width: 225px; ' +
                'top: 0; ' +
                'left: -234px; '
                // Override 'nowrap' set by .cke_reset_all style to allow text wrapping
                +
                'white-space: normal;' +
                'border: 1px solid #bbb; ' +
                'border-radius: 4px; ' +
                '">{text}<div' +
                ' style="'
                // Add tooltip arrow using left border
                +
                'position: absolute; ' +
                'top: 15px; ' +
                'right: -12px;' +
                '"></div><div ' +
                'id="inlineInstructionsTemplateFlag"' +
                ' style="' +
                'position: absolute; ' +
                'border-top: 10px solid transparent; ' +
                'border-left: none !important; ' +
                'border-bottom: none !important; ' +
                'top: 13px; ' +
                'right: -7px;' +
                'display: block;' +
                'width: 12px;' +
                'height: 12px;' +
                'border: 1px solid #bbb;' +
                'transform: rotate(45deg);' +
                'zoom: reset;' +
                '"></div></div>';

            // Create instructions element from HTML template
            var instructions = CKEDITOR.dom.element.createFromHtml(instructionsTemplate.replace('{text}', message));

            // Make instructions unselectable
            instructions.unselectable();

            return instructions;
        },

        showDialogInstructions: function(dialog) {
            if (dialog.parts.instructions &&
                (dialog.parts.title.$.textContent === 'Spell Check' || dialog.parts.title.$.textContent === 'Thesaurus')) {
                // Check if first time load
                if (this.editor.newBlock) {
                    dialog.parts.instructions.$.style.display = ''; // Reset display attribute
                } else
                    this.hideDialogInstructions(dialog);
            }
        },

        hideDialogInstructions: function(dialog) {
            if (dialog.parts.instructions) {
                dialog.parts.instructions.$.style.display = 'none';
            }
        },

        // Create a button command for the context menu
        addButtonCommand: function(buttonLabel, commandName, command, menugroup, menuOrder) {
            this.editor.addCommand(commandName, command);

            // If the "menu" plugin is loaded, register the menu item.
            this.editor.addMenuItem(commandName, {
                label: buttonLabel,
                command: commandName,
                group: menugroup,
                order: menuOrder
            });
        },

        // Call Web API for spellcheck
        sendWords: function(words, callabck2) {
            var self = this;
            var url = NHUNSPELL_SERVICE_URL + "/suggestions";
            var callback = function(data) {
                self.parseRpc(data, words, callabck2);
                //We don't have a limit on request size for now
                /*if (words.length >= maxRequest) {
                    checkNow()
                }*/
            }
            for (var i = 0, len = words.length; i < len; i++) {
                words[i] = words[i].replace("'", "\\'");
            }

            var data = "['" + words.join("','") + "']";
            this.rpc(url, data, callback);
        },

        // Web API call
        rpc: function(url, data, callback) {
            var xhr = new XMLHttpRequest();
            if (!xhr) {
                return null;
            }
            xhr.open('POST', url, true);
            xhr.onreadystatechange = function() {
                if ((xhr.readyState == 4 && ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status === 0 || xhr.status == 1223))) {

                    callback(xhr.responseText);
                    xhr = null;
                }
            };
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(data);
            return true;
        },

        // Parse response from Web API call
        parseRpc: function(data, words, callback) {
            if (!data) return;
            try {
                var json = JSON.parse(data);
            } catch (e) {
                ////alert("Wrong data recieved from spell checker");
            }

            var result = json;
            for (var i = 0, len = words.length; i < len; i++) {
                var word = words[i].replace("\\'", "'");
                if (result[word]) {
                    this.plugin.suggestionsCache[word] = result[word];
                    this.plugin.spellCache[word] = false;
                } else {
                    this.plugin.spellCache[word] = true;
                }
            }

            this.renderDocument();
            if (callback) callback();
        },

        // Parse text, find misspelled word and mark them by special span tags
        renderDocument: function() {
            this.putCursor();
            var IEcaret = this.getCaretIE()

            this.clearMarkings(this.editor.document.$.body);
            this.normalizeNodes(this.editor.document.$.body);

            //if (this.plugin.config.spellAsUType) {
            var caret = this.getCaret();

            this.markAllTypos(this.editor.document.$.body);

            this.setCaret(caret);
            this.setCaretIE(IEcaret)
            this.editor.fire('SpellcheckStart');
            this.editor.nhspellstarted = true;
            //}
        },

        caret_marker: String.fromCharCode(8) + String.fromCharCode(127) + String.fromCharCode(1),

        putCursor: function() {
            if (!this.editor.window.$.getSelection) {
                return null /*IE <=8*/
            }
            if (!this.editorHasFocus) {
                return;
            }

            /*var sel = this.editor.getSelection();
            var ranges = sel.getRanges();
            var range = ranges[0];
            range.deleteContents();
            range.insertNode(this.editor.document.$.createTextNode(this.caret_marker));*/

            var sel = this.editor.window.$.getSelection();
            if (sel.rangeCount) {
                var range = sel.getRangeAt(0);
                if (!range.collapsed)
                    range.collapse();
                range.deleteContents();
                range.insertNode(this.editor.document.$.createTextNode(this.caret_marker));
            }
        },

        getCaretIE: function() {
            if (this.editor.window.$.getSelection) {
                return null;
            }
            var doc = this.editor.document.$;
            var clickx, clicky
            var cursorPos = doc.selection.createRange().duplicate();
            clickx = cursorPos.boundingLeft;
            clicky = cursorPos.boundingTop;
            var pos = {
                x: clickx,
                y: clicky
            };
            return pos;
        },

        setCaretIE: function(pos) {
            if (this.editor.window.$.getSelection || pos.x === 0 || pos.y === 0) {
                return null;
            }
            var doc = this.editor.document.$;
            var clickx, clicky
            clickx = pos.x;
            clicky = pos.y;
            var cursorPos = doc.body.createTextRange();
            cursorPos.moveToPoint(clickx, clicky)
            cursorPos.select();
        },

        getCaret: function() {
            if (!this.editor.window.$.getSelection) {
                return null
            }
            if (!this.editorHasFocus) {
                return;
            }
            var allTextNodes = this.findTextNodes(this.editor.document.$.body)
            var caretpos = null
            var caretnode = null
            for (var i = 0; i < allTextNodes.length; i++) {
                if (allTextNodes[i].data.indexOf(this.caret_marker) > -1) {
                    caretnode = allTextNodes[i]
                    caretpos = allTextNodes[i].data.indexOf(this.caret_marker);
                    allTextNodes[i].data = allTextNodes[i].data.replace(this.caret_marker, "")
                    return {
                        node: caretnode,
                        offset: caretpos
                    }
                }
            }
        },

        setCaret: function(bookmark) {
            if (!this.editor.window.$.getSelection) {
                return null
            }
            if (!this.editorHasFocus) {
                return;
            }
            if (!bookmark) {
                return;
            }
            var nodeIndex = null;
            var allTextNodes = this.findTextNodes(this.editor.document.$.body)
            var caretnode = bookmark.node
            var caretpos = bookmark.offset
            for (var i = 0; i < allTextNodes.length; i++) {
                if (allTextNodes[i] == caretnode) {
                    var nodeIndex = i;
                }
            }
            if (nodeIndex === null) {
                return;
            }
            for (var i = nodeIndex; i < allTextNodes.length - 1; i++) {
                if (caretpos <= allTextNodes[i].data.length) {
                    break;
                }
                caretpos -= allTextNodes[i].data.length
                caretnode = allTextNodes[i + 1]
            }
            var textNode = caretnode
            var sel = this.editor.window.$.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                range.collapse(true);
                range.setStart(textNode, caretpos);
                range.setEnd(textNode, caretpos);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        },

        // Remove spacial span tags from text
        clearMarkings: function(base) {
            var i, node, nodes;
            var finished = false;
            while (!finished) {
                finished = true;
                nodes = base.getElementsByTagName("span")
                var i = nodes.length;
                while (i--) {
                    node = nodes[i];
                    if (node.className == (NHUNSPELL_STYLE_TYPO) || node.className == (NHUNSPELL_STYLE_IGNORED)) {
                        this.unwrapbogus(node);
                        finished = false;
                    }
                }
            }
        },

        unwrapbogus: function(node) {
            node.outerHTML = new String(node.innerHTML);
        },

        normalizeNodes: function(element) {
            if (!CKEDITOR.env.isIE) {
                if (element) {
                    element.normalize();
                }
                return;
            }
            /*IE normalize function is not stable, even in IE 11*/
            var child = element.firstChild,
                nextChild;
            while (child) {
                if (child.nodeType == 3) { // Use constance instead
                    while ((nextChild = child.nextSibling) && nextChild.nodeType == 3) {
                        child.appendData(nextChild.data);
                        element.removeChild(nextChild);
                    }
                } else {
                    this.normalizeNodes(child);
                }
                child = child.nextSibling;
            }
        },

        markAllTypos: function(body) {
            //var body = editor.document.$.body;
            var allTextNodes = this.findTextNodes(body)
            for (var i = 0; i < allTextNodes.length; i++) {
                this.markTypos(allTextNodes[i]);
            }
        },
        // Generate a special span tag for a word
        markTypos: function(textNode) {
            var regex = this.wordTokenizer();
            "".match(regex); // the magic reset button
            var currentNode = textNode
            var match
            var caretpos = -1
            var newNodes = [textNode];
            while ((match = regex.exec(currentNode.data)) != null) {
                if (currentNode.parentNode.nodeType == 1 && currentNode.parentNode.getAttribute(NHUNSPELL_ATTR_IGNORED) && currentNode.parentNode.getAttribute('data-cke-word') && currentNode.parentNode.getAttribute('data-cke-word').trim() !== currentNode.data.trim()) {
                    currentNode.parentNode.removeAttribute(NHUNSPELL_ATTR_IGNORED);
                }

                if (currentNode.parentNode.nodeType == 1 && currentNode.parentNode.getAttribute(NHUNSPELL_ATTR_IGNORED)) {
                    continue;
                }
                var matchtext = match[0];
                if (!this.validWordToken(matchtext)) {
                    continue;
                }
                if (typeof(this.plugin.suggestionsCache[this.cleanQuotes(matchtext)]) !== 'object') {
                    continue;
                }
                if (this.plugin.ignoredWords.indexOf(matchtext.toLowerCase()) != -1) {
                    continue;
                }

                if (this.plugin.config.ignoreUpperCase && /^[A-Z]+$/.test(matchtext)) {
                    continue;
                }
                if (this.plugin.config.ignoreNumbers && /[0-9]/.test(matchtext)) {
                    continue;
                }
                if (this.plugin.config.ignoreMixedCase && /(?:[A-Z][a-z])|(?:[a-z][A-Z])/.test(matchtext)) {
                    continue;
                }

                var pos = match.index
                var matchlength = matchtext.length
                    //var matchlength = matchtext.length
                var newNode = currentNode.splitText(pos)
                var span = this.editor.document.$.createElement('span');
                span.className = NHUNSPELL_STYLE_TYPO
                    //span.style.color = 'red'
                span.setAttribute('data-cke-bogus', true)
                span.setAttribute('data-cke-word', matchtext)
                var middle = this.editor.document.$.createTextNode(matchtext);
                span.appendChild(middle);
                currentNode.parentNode.insertBefore(span, newNode);
                newNode.data = newNode.data.substr(matchlength)
                currentNode = newNode;
                newNodes.push(middle)
                newNodes.push(newNode)
                "".match(regex); //the magic reset button
            }
        },

        __mtoks: null,

        __memtoks: null,

        findTextNodes: function(elem) {
            var textNodes = [];
            FindTextNodes_r.call(this, elem)

            function FindTextNodes_r(elem) {
                if (elem === null) {
                    return textNodes;
                }

                for (var i = 0; i < elem.childNodes.length; i++) {
                    var child = elem.childNodes[i];
                    if (child.nodeType == 3) {
                        textNodes.push(child)
                    } else if (!this.isCDATA(child) && child.childNodes) {
                        FindTextNodes_r.call(this, child);
                    }
                }
            }
            return textNodes;
        },

        isCDATA: function(elem) {
            var n = elem.nodeName.toLowerCase();
            if (n == "script") {
                return true;
            }
            if (n == "style") {
                return true;
            }
            if (n == "textarea") {
                return true;
            }
            return false;
        },

        // Analyse if a part of a text is a word with skipping some predefined patterns, like e-mails
        wordTokenizer: function(singleton) {
            if (!singleton && !!this.__memtok) {
                return this.__memtok
            };
            if (singleton && !!this.__memtoks) {
                return this.__memtoks
            };
            var email = "\\b[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}\\b"
                //var ws = "^(?:&nbsp;)"
            var protocol = "\\bhttp[s]?://[a-z0-9#\\._/]{5,}\\b"
            var domain = "\\bwww\.[a-z0-9#\._/]{8,128}[a-z0-9/]\\b"
            var invalidchar = "\\s!\"#$%&()*+,-.â€¦/:;~<=>?@[\\]^_{|}`\u00a7\u00a9\u00ab\u00ae\u00b1\u00b6\u00b7\u00b8\u00bb\u00bc\u00bd\u00be\u00bf\u00d7\u00f7\u00a4\u201d\u201c\u201e\u201f\u200B\u00a0" + String.fromCharCode(160)
            var validword = "[^" + invalidchar + "'\u2018\u2019][^" + invalidchar + "]*[^" + invalidchar + "'\u2018\u2019]";
            var result = new RegExp("(" + email + ")|(" + protocol + ")|(" + domain + ")|(" + validword + ")", singleton ? "" : "g");
            if (singleton) {
                this.__memtoks = result
            } else {
                this.__memtok = result
            }
            return result;
        },

        validWordToken: function(word) {
            if (!word) {
                return false;
            }
            if (/\s/.test(word)) {
                return false;
            }
            if (/[\:\.\@\/\\]/.test(word)) {
                return false;
            }
            if (/^\d+$/.test(word) || word.length == 1) {
                return false;
            }
            var ingnoreAllCaps = (this.plugin.config.ignoreUpperCase === true);
            var ignoreNumeric = (this.plugin.config.ignoreNumbers !== false);
            if (ingnoreAllCaps && word.toUpperCase() == word) {
                return false;
            }
            if (ignoreNumeric && /\d/.test(word)) {
                return false;
            }
            if (this.plugin.ignoredWords[word.toLowerCase()]) {
                return false;
            }
            /*if (hasPersonal(word)) {
                return false
            }*/
            //console.log(word);
            return true;
        },

        cleanQuotes: function(word) {
            return word.replace(/[\u2018\u2019]/g, "'");
        },

        // Extract words from HTML body
        getWords: function getWords(body) {
            var fullTextContext = "";
            var allTextNodes = this.findTextNodes(body)
            for (var i = 0; i < allTextNodes.length; i++) {
                fullTextContext += allTextNodes[i].data
                if (allTextNodes[i].parentNode && allTextNodes[i].parentNode.className && allTextNodes[i].parentNode.className == ("nanospell-typo")) {
                    fullTextContext += "";
                } else {
                    fullTextContext += " ";
                }
            }
            var matches = fullTextContext.match(this.wordTokenizer())
            var uniqueWords = [];
            var words = [];
            if (!matches) {
                return words;
            }
            for (var i = 0; i < matches.length; i++) {
                var word = this.cleanQuotes(matches[i]);
                if (word.length >= this.plugin.config.minWordLength && word.length <= this.plugin.config.maxWordLength && !uniqueWords[word] && this.validWordToken(word) && (typeof(this.plugin.spellCache[word]) === 'undefined')) {
                    words.push(word);
                    uniqueWords[word] = true;
                    //if (words.length >= max) {
                    //    return words;
                    //}
                }
            }
            return words;
        },

        advance2NextTypo: function(editor) {
            var sel = editor.getSelection();
            var text = '';
            var typo = editor.document.findOne('.' + NHUNSPELL_STYLE_TYPO);
            if (typo) {
                sel.selectElement(typo);
                text = sel.getSelectedText().trim();
                if (text) {
                    sel.scrollIntoView();
                }
            }
            return text;
        },

        // Replaces word with a new word keeping formatting
        replaceText: function(editor, textOrig, textDest) {
            var sel = editor.getSelection();
            var typos = editor.document.find('.' + NHUNSPELL_STYLE_TYPO);

            for (var i = 0, len = typos.count(); i < len; i++) {
                var typo = typos.getItem(i);
                if (typo) {
                    var txt = typo.getText();
                    if (txt == textOrig) {
                        sel.selectElement(typo);
                        typo.$.className = '';
                        editor.insertHtml(textDest, 'text');
                    }
                }
            }
        }

    },

    // Find a word near current curson when there is no text selection
    selectWordAtCursor: function(ranges) {
        var nonWord = /[\W\u200B\u00a0]/;
        var range = "";
        if (typeof(ranges.indexOf) === "undefined")
            range = ranges;
        else
            range = ranges[0];
        if (range.startContainer === null) {
            range.selectNodeContents(editor.editable());
        }
        //var range = ranges[0];

        //Commented this out as it was creating an element wrapper on the selected text. (Bug 41201)
        //that created error in selection
        //range.shrink(CKEDITOR.SHRINK_TEXT);
        var text = range.startContainer.getText();

        var words = text.split(nonWord);
        var chars = [];
        var char, r, l, len;

        if (range.collapsed) {
            for (l = range.startOffset; l > 0; l--) {
                char = text.charAt(l - 1)
                if (nonWord.test(char)) {
                    break;
                }
                chars.unshift(char);
            }
            for (r = range.startOffset, len = text.length; r < len; r++) {
                char = text.charAt(r)
                if (nonWord.test(char)) {
                    break;
                }
                chars.push(char);
            }

            //  NOTE:   This is a possible fix for exception on incorrect selection.
            //          The solution has been tested however maybe crop up as an issue in an unexpected scenario.
            if ((range.startOffset < 2 && range.endOffset < 2) && (range.startContainer.getText().trim() !== '')) {
                if ((range.startOffset === 0 && range.endOffset !== 0))
                    r = l + 1;
            }


        } else if (range.startContainer.$.nodeType == 1 && range.endContainer.$.nodeType == 1) {
            return range;
        } else {
            for (l = range.startOffset, len = text.length; l < len; l++) {
                char = text.charAt(l)
                if (!nonWord.test(char)) {
                    break;
                }
            }
            for (r = l + 1, len = text.length; r < len; r++) {
                char = text.charAt(r)
                if (nonWord.test(char)) {
                    break;
                }
                chars.push(char);
            }
        }
        range.setStart(range.startContainer, l);
        range.setEnd(range.startContainer, r);

        return range;
    },

    // Wrapper around Web API call
    api: (function() {
        var xmlhttp = null;
        return {
            getCheckWithSuggestions: function(word, callback) {
                if (word != null && word.length >= 2) {
                    if (xmlhttp != null && xmlhttp.readyState != 4) {
                        xmlhttp.abort();
                    }
                    xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            var dialog = CKEDITOR.dialog.getCurrent();
                            var spelling = JSON.parse(xmlhttp.responseText);
                            callback(spelling);
                        }
                    };
                    var wordSuggestionApi = NHUNSPELL_SERVICE_URL + "/suggestions/" + word;
                    xmlhttp.open("GET", wordSuggestionApi, true);
                    xmlhttp.send();
                }
            },
            getThesaurus: function(word, callback) {
                if (word != null) {
                    if (xmlhttp != null && xmlhttp.readyState != 4) {
                        xmlhttp.abort();
                    }
                    xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            var dialog = CKEDITOR.dialog.getCurrent();
                            var synonyms = JSON.parse(xmlhttp.responseText);
                            callback(synonyms);
                        }
                    };
                    var wordThesaurusApi = NHUNSPELL_SERVICE_URL + "/thesaurussynonims/" + word;
                    if (word === "") {
                        callback(null);
                    } else {
                        xmlhttp.open("GET", wordThesaurusApi, true);
                        xmlhttp.send();
                    }
                }
            },
            logMisspellFromDialog: function(wordOrig, wordReplace, callback) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        if (callback) callback(synonyms);
                    }
                };
                var logApi = NHUNSPELL_SERVICE_URL + "/audit/misspelldialog/" + wordOrig + "/" + wordReplace;
                xmlhttp.open("GET", logApi, true);
                xmlhttp.send();
            },
            logMisspellFromMenu: function(wordOrig, wordReplace, callback) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        if (callback) callback(synonyms);
                    }
                };
                var logApi = NHUNSPELL_SERVICE_URL + "/audit/misspellmenu/" + wordOrig + "/" + wordReplace;
                xmlhttp.open("GET", logApi, true);
                xmlhttp.send();
            },

            logThesaurusReplace: function(wordOrig, wordReplace, callback) {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        if (callback) callback(synonyms);
                    }
                };
                var logApi = NHUNSPELL_SERVICE_URL + "/audit/thesaurus/" + wordOrig + "/" + wordReplace;
                xmlhttp.open("GET", logApi, true);
                xmlhttp.send();
            }
        };
    })()
};
