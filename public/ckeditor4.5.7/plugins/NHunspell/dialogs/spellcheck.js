/*!
 * Hunspell Plugin for CK Editor
 *
 * http://ckeditor.com/
 *
 * Copyright (c) 2016 InfoPro Systems, Inc.
 * Released under the MIT license
 */

/// <summary>
/// Add Spellcheck Dialog to CKEditor and pass selected text
/// </summary>
CKEDITOR.dialog.add(NHUNSPELL_COMMAND_SPELLCHECK, function (editor) {
    var __DEBUG__ = true;
    var __CONSOLE__ = {};
    for (var k in console) {
        __CONSOLE__[k] = console[k];
    }
    function __CONSOLE__ENABLE__(enable) {
        function noop() { }
        if (enable) {
            for (var k in console) {
                if (__CONSOLE__[k]) console[k] = __CONSOLE__[k];
            }
        } else {
            for (var k in console) {
                console[k] = noop;
            }
        }
    }

    var checkSpelling = function (word) {
        var plugin = CKEDITOR.plugins.NHunspell;
        var checkWord = word;

        plugin.api.getCheckWithSuggestions(word, function (spelling) {
            var dialog = CKEDITOR.dialog.getCurrent();

            var suggestions = dialog.getContentElement('spell', 'suggestList');
            suggestions.clear();
            if (spelling.suggestions) {
                for (var i = 0, len = spelling.suggestions.length; i < len; i++) {
                    suggestions.add(spelling.suggestions[i]);
                }
                if (justOpen) {
                    suggestions.setValue(spelling.suggestions[0]);
                    justOpen = !justOpen;
                }
            }

            var payload = {
                event: 'Misspellings_Identified',
                payload: {
                    name: 'Misspellings_Identified',
                    word: checkWord,
                    itemList: spelling && spelling.suggestions ? spelling.suggestions : [],
                    source: plugin.eventSource
                },
                captureCharacterPosition: true
            };
            CKEDITOR.currentInstance.fire('nhunspell.event', payload);
            plugin.eventSource = false;
        });
    };

    // Minimum and maximum values of the css Top property for the spellcheck dialog
    var DIALOG_MIN_TOP_POSITION = 60;
    var DIALOG_MAX_TOP_POSITION = 586;

    var walker;
    var currentTypo;
    var justOpen;
    var firstLoad = false;
    var evaluator = function (element) {
        return element.$.nodeType == 1 && element.hasClass(NHUNSPELL_STYLE_TYPO);
        //|| element.$.nodeType == 3 && element.getParent().hasClass(NHUNSPELL_STYLE_TYPO);
    }

    // Called when spellcheck finished, UI buttons are hidden
    var done = function (dialog) {
        var textInput = dialog.getContentElement('spell', 'value');
        textInput.getElement().setStyle('visibility', 'hidden');
        var suggestList = dialog.getContentElement('spell', 'suggestList');
        suggestList.getElement().setStyle('visibility', 'hidden');
        var head = dialog.getContentElement('spell', 'head');
        head.getElement().setStyle('visibility', 'hidden');

        var btChange = dialog.getContentElement('spell', 'btChange');
        var btChangeAll = dialog.getContentElement('spell', 'btChangeAll');
        var btIgnore = dialog.getContentElement('spell', 'btIgnore');
        var btIgnoreAll = dialog.getContentElement('spell', 'btIgnoreAll');

        btChange.disable();
        btChangeAll.disable();
        btIgnore.disable();
        btIgnoreAll.disable();

        //#43745 Done dialog should have "Close" vs "Cancel" to exit dialog since there is no action for the user to cancel
        var btCancel = dialog.getContentElement('spell', 'btCancel');
        var btCancelDom = btCancel.getElement();
        btCancelDom.$.innerText = "Close";

        btCancel.focus();

        var noReccomedtations = dialog.getContentElement('spell', 'noReccomedtations');
        noReccomedtations.getElement().setStyle('visibility', 'visible');

        var plugin = CKEDITOR.plugins.NHunspell;
        if (plugin.isCheckSelectedArea) {
            dialog.hide();
            //editor.openDialog(NHUNSPELL_COMMAND_FINISHEDSELECTION);
            setTimeout(function () {
                var result = editor.execCommand(NHUNSPELL_COMMAND_FINISHEDSELECTION);
            }, 250);
        } else if (plugin.isRevisitRequired) {
            dialog.hide();
            setTimeout(function () {
                //Bug: 45756 (the user is not presented with a 'finished checking' dialog. It automatically resumes checking possible other mis-spelt words towards beginning of the document.
                var result = editor.execCommand(NHUNSPELL_COMMAND_SPELLCHECK);
                editor.fire('afterInsertHtml', {});
            }, 250);
        }
    };

    var ensureElementVisibility = function (wordElement) {
        var dialog = CKEDITOR.dialog.getCurrent();
        if (!$) {
            console.warn('[NHUNSPELL-S] [ensureElementVisibility] jquery.element is not available');
            return;
        }

        __CONSOLE__ENABLE__(__DEBUG__);

        /**
            	Inputs																										Outputs
            	Target Word Obscured	Scrolling Enabled	Word Vertical Alignment in relation	Will Dialog Fit Vertically	Change to Dialog Location		Change To Scroll Position		Target Word Relation to Dialog
            												to default Spell Check position		Below Target Word
            1	Not Obscured			No/Yes				Above								Yes							No Change to location			No Scrolling					Above
            2	Not Obscured			No/Yes				Below								No							No Change to location			No Scrolling					Below
            3	Not Obscured			Yes					Below								Yes							Move Dialog Below Target Word	Scroll Writing Response Panel	Above
            4	Off Page				Yes					Above								Yes							No Change to location			Scroll Writing Response Panel	Above
            5	Off Page				Yes					Below								No							No Change to location			Scroll Writing Response Panel	Below
            6	Off Page				Yes					Below								Yes							No Change to location			Scroll Writing Response Panel	Above
            7	Obscured				Yes					N/A									Yes							No Change to location			Scroll Writing Response Panel	Above
            8	Obscured				No					N/A									No							Move Dialog Above Target Word	No Scrolling					Below
            9	Obscured				Yes					N/A									No							No Change to location			Scroll Writing Response Panel	Below
            10	Obscured				No					N/A                                 Yes							Move Dialog Below Target Word	No Scrolling					Above
        */

        var bodyMargin = 20;
        var $wordElement = $(wordElement);
        var browserZoom = Math.floor(window.outerWidth / window.innerWidth * 100) / 100;
        var dialogElement = $(dialog._.element.$).children('.cke_dialog');
        var $contentsFrameContainer = $(CKEDITOR.currentInstance.ui.contentsElement.$);
        var contentsWindow = CKEDITOR.currentInstance.ui.contentsElement.$.childNodes[0].contentWindow;
        var contentsScrollingElement = wordElement.ownerDocument.scrollingElement;

        /// dialog info, relative to page
        var dialogInfo = computeDialogInfo(dialogElement, 1 / browserZoom);
        /// word info, relative to the page
        var wordInfo = computeElementInfo($contentsFrameContainer, wordElement);
        /// word offset relative to content
        var wordOffset = $wordElement.offset();

        var obscured = dialogInfo.top <= wordInfo.top + wordInfo.height && dialogInfo.bottom >= wordInfo.top && dialogInfo.right > wordInfo.left;
        var hasScroll = contentsScrollingElement.scrollHeight > contentsScrollingElement.getBoundingClientRect().bottom + contentsScrollingElement.scrollTop + bodyMargin;
        var offPage = hasScroll && (wordOffset.top >= contentsScrollingElement.scrollHeight + contentsScrollingElement.scrollTop);
        var canFitBelow = $('.cke_contents > iframe').contents().find('body').height() - contentsScrollingElement.scrollTop - wordInfo.top > 0;
        var contextAboveDialog = wordInfo.bottom <= dialogInfo.top;
        hasScroll = contentsScrollingElement.scrollHeight - wordOffset.top >= dialogInfo.height / browserZoom;

        console.info(
            '[NHUNSPELL-S] [ensureElementVisibility]\n  content frame container offset top: %d\n  content frame scroll top: %d\n' +
            '  element page offset: %s\n' +
            '  dialog page offset: %s\n' +
            '  element content offset: %s\n' +
            '  content frame: %o\n' +
            '  element: %o\n' +
            '  dialog: %o\n',
            $contentsFrameContainer.offset().top, contentsScrollingElement.scrollTop, JSON.stringify(wordInfo), JSON.stringify(dialogInfo), JSON.stringify(wordOffset),
            $contentsFrameContainer[0], $wordElement[0], dialogElement[0]);
        console.info('[NHUNSPELL-S] [ensureElementVisibility] obscured %s off page %s has scroll %s can fit below %s context above dialog %s',
            obscured, offPage, hasScroll, canFitBelow, contextAboveDialog);

        var margin = 40;
        contentsWindow.scrollTo(0, contentsWindow.scrollY);
        if (!obscured && contextAboveDialog && canFitBelow) {
            // do nothing
            console.info('[NHUNSPELL-S] case 1');
            var newX = wordOffset.left + wordInfo.width, newY = wordOffset.top - margin;
            console.info('[NHUNSPELL-S] scroll content frame to (%d, %d)', newX, newY);
            contentsWindow.scrollTo(newX, newY);
            editor.getSelection().scrollIntoView({ block: "start", behavior: "smooth" });
        } else if (!obscured && !contextAboveDialog && !canFitBelow) {
            // do nothing
            console.info('[NHUNSPELL-S] case 2');
            var newX = wordOffset.left + wordInfo.width, newY = wordOffset.top - margin;
            console.info('[NHUNSPELL-S] scroll content frame to (%d, %d)', newX, newY);
            contentsWindow.scrollTo(newX, newY);
            editor.getSelection().scrollIntoView({ block: "start", behavior: "smooth" });
            moveDialogAboveElement(wordInfo.top, dialogElement, dialogInfo.height, margin, browserZoom);
        } else if (!obscured && hasScroll && !contextAboveDialog && canFitBelow) {
            // move dialog below target word, scroll to word above dialog
            console.info('[NHUNSPELL-S] case 3');
            // scroll to bottom
            var newX = wordOffset.left + wordInfo.width, newY = wordOffset.top - margin;
            console.info('[NHUNSPELL-S] scroll content frame to (%d, %d)', newX, newY);
            contentsWindow.scrollTo(newX, newY);
            editor.getSelection().scrollIntoView({ block: "start", behavior: "smooth" });
            // recalculate word info
            wordInfo = computeElementInfo($contentsFrameContainer, wordElement);
            // move dialog below element
            moveDialogBelowElement(wordInfo.bottom, dialogElement, margin, browserZoom);
        } else if (offPage && hasScroll && contextAboveDialog && canFitBelow) {
            // scroll to word above dialog
            console.info('[NHUNSPELL-S] case 4');
            scrollElementAboveDialog(wordInfo.bottom, dialogInfo.top, contentsWindow, margin);
        } else if (offPage && hasScroll && !contextAboveDialog && !canFitBelow) {
            // scroll to word below dialog
            console.info('[NHUNSPELL-S] case 5');
            scrollElementBelowDialog(wordInfo.top, dialogInfo.bottom, contentsWindow, margin);
        } else if (offPage && hasScroll && !contextAboveDialog && canFitBelow) {
            // scroll to word above dialog
            console.info('[NHUNSPELL-S] case 6');
            scrollElementAboveDialog(wordInfo.bottom, dialogInfo.top, contentsWindow, margin);
        } else if (obscured && hasScroll && canFitBelow) {
            // scroll to word above dialog
            console.info('[NHUNSPELL-S] case 7');
            editor.getSelection().scrollIntoView({ block: "start", behavior: "smooth" });
            scrollElementAboveDialog(wordInfo.bottom, dialogInfo.top, contentsWindow, margin);
        } else if (obscured && !hasScroll && !canFitBelow) {
            // move dialog above target word
            console.info('[NHUNSPELL-S] case 8');
            moveDialogAboveElement(wordInfo.top, dialogElement, dialogInfo.height, margin, browserZoom);
        } else if (obscured && hasScroll && !canFitBelow) {
            // scroll to word below dialog
            console.info('[NHUNSPELL-S] case 9');
            if (offPage) {
                scrollElementBelowDialog(wordInfo.top, dialogInfo.bottom, contentsWindow, margin);
            } else {
                moveDialogAboveElement(wordInfo.top, dialogElement, dialogInfo.height, margin, browserZoom);
            }

            editor.getSelection().scrollIntoView({ block: "start", behavior: "smooth" });
        } else if (obscured && !hasScroll && canFitBelow) {
            // move dialog below target word
            console.info('[NHUNSPELL-S] case 10');
            moveDialogBelowElement(wordInfo.bottom, dialogElement, margin, browserZoom);
        }

        __CONSOLE__ENABLE__(true);

        function computeElementInfo(frameContainer, element) {
            var $element = $(element);
            var rc = {
                top: $(frameContainer).offset().top + $element.offset().top - $element[0].ownerDocument.scrollingElement.scrollTop,
                left: $(frameContainer).offset().left + $element.offset().left - $element[0].ownerDocument.scrollingElement.scrollLeft,
                height: $element.height(),
                width: $element.width()
            };
            rc.right = rc.left + rc.width;
            rc.bottom = rc.top + rc.height;
            return rc;
        }

        function computeDialogInfo(dialogElement, scale) {
            var rc = dialogElement.offset();
            rc.top *= scale;
            rc.left *= scale;
            rc.width = dialogElement.width();
            rc.height = dialogElement.height();
            rc.right = rc.left + rc.width;
            rc.bottom = rc.top + rc.height;
            return rc;
        }

        function moveDialogAboveElement(elementTop, dialogElement, dialogHeight, margin, scale) {
            var top = (elementTop - dialogHeight - (margin || 10)) * (scale || 1);

            if (top < DIALOG_MIN_TOP_POSITION) {
                top = DIALOG_MIN_TOP_POSITION;
            } else if (top > DIALOG_MAX_TOP_POSITION) {
                top = DIALOG_MAX_TOP_POSITION;
            }

            console.info('[NHUNSPELL-S] move dialog to above element top %d to %d', elementTop, top);
            dialogElement.css('top', top + 'px');
        }

        function moveDialogBelowElement(elementBottom, dialogElement, margin, scale) {
            var top = (elementBottom + (margin || 10)) * (scale || 1);

            if (top < DIALOG_MIN_TOP_POSITION) {
                top = DIALOG_MIN_TOP_POSITION;
            } else if (top > DIALOG_MAX_TOP_POSITION) {
                top = DIALOG_MAX_TOP_POSITION;
            }

            console.info('[NHUNSPELL-S] move dialog to below element bottom %d to %d', elementBottom, top);
            dialogElement.css('top', top + 'px');
        }

        function scrollElementAboveDialog(elementBottom, dialogTop, frame, margin) {
            var scrollDistance = elementBottom - dialogTop + (margin || 10);
            console.info('[NHUNSPELL-S] scroll contents frame up %d (element top %d dialog top %d)', scrollDistance, elementBottom, dialogTop);
            frame.scrollBy(0, scrollDistance);
        }

        function scrollElementBelowDialog(elementTop, dialogBottom, frame, margin) {
            var scrollDistance = dialogBottom - elementTop + (margin || 10);
            console.info('[NHUNSPELL-S] scroll contents frame down %d (element bottom %d dialog bottom %d)', scrollDistance, elementTop, dialogBottom);
            frame.scrollBy(0, -scrollDistance);
        }
    };

    // Move to the next word to spellcheck
    var next = function (focusId) {
        var typoNode = this.walker.next();

        if (typoNode) {
            editor.getSelection().selectElement(typoNode);
            var text = typoNode.getText();

            if (text) {
                ensureElementVisibility(typoNode.$);
                ////editor.getSelection().scrollIntoView();
            }

            this.currentTypo = text;
            var head = this.getContentElement('spell', 'head');
            head.getElement().$.innerHTML = head.html.replace("{value}", text);

            if (this.firstLoad) {
                var plugin = CKEDITOR.plugins.NHunspell;
                if (plugin) {
                    var extendedInfo = {
                        'misspelledWord': this.currentTypo
                    };

                    var payload = {
                        event: plugin.eventName,
                        payload: extendedInfo,
                        captureCharacterPosition: true
                    };
                    editor.fire('nhunspell.event', payload);
                }
            }
            var textInput = this.getContentElement('spell', 'value');
            textInput.setValue(text);
            checkSpelling(this.currentTypo);

            if (focusId) {
                var focus = this.getContentElement('spell', focusId);
                focus.focus();
            }

            this.firstLoad = false;
        } else {
            editor.fire('afterInsertHtml', {});
            done(this);
        }
    }

    function onClose() {
        $('.cke_button__checkspell').removeClass('cke_button__checkspell_active');
        $('.cke_dialog_close_button').off('click', onClose);
        editor.fire('nhunspell.event', { event: 'Spellcheck_Dialog_Box_Closed' });
    }

    // Spellcheck Dialog definition
    return {
        title: 'Spell Check',
        minWidth: 270,
        minHeight: 120,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        buttons: [
        ],
        contents:
        [
            {
                id: 'spell',
                label: 'Spell Check',
                elements:
                [
                    {
                        type: 'hbox',
                        widths: ['80%', '20%'],
                        style: 'position:relative; margin-top:-15px; margin-bottom: -15px; padding-bottom:0;',
                        children: [
                            {
                                type: 'vbox',
                                style: 'width: 100%;',
                                children: [
                                   // UI elements left column.
                                    {
                                        type: 'html',
                                        id: 'head',
                                        html: 'Change \'<i style="font-weight: bold">{value}</i>\' to:',
                                    },
                                    {
                                        type: 'text',
                                        id: 'value',
                                        title: 'Suggestion',
                                        required: true,
                                        setup: function (text) {

                                        },
                                        commit: function (result) {
                                            result.value = this.getValue();
                                        },
                                        onKeyUp: function (event) {
                                            var dialog = CKEDITOR.dialog.getCurrent();
                                            var textInput = dialog.getContentElement('spell', 'value');
                                            var value = textInput.getValue().trim();
                                            //checkSpelling(value);
                                        }
                                    },
                                    {
                                        type: 'select',
                                        id: 'suggestList',
                                        title: 'Suggestions list',
                                        size: '6',
                                        style: 'width: 100%;',
                                        width: '100%',
                                        inputStyle: 'height:12em; width:100%;',
                                        className: "sbfix",
                                        items:
                                        [
                                        ],
                                        onChange: function (event) {
                                            var dialog = CKEDITOR.dialog.getCurrent();
                                            var textInput = dialog.getContentElement('spell', 'value');
                                            textInput.setValue(event.data.value, false);
                                        }
                                    }
                                    ,
                            {
                                type: 'html',
                                id: 'noReccomedtations',
                                html: '&nbsp;&nbsp;&nbsp;The spelling<br/>check is complete.',
                                style: 'position:absolute; top:3em;left:1em;margin:0 auto;visibility:hidden;',
                            }
                                ]
                            },
                            {
                                type: 'vbox',
                                //style: 'padding-left: 15%;',
                                children: [
                                     // UI elements right column.
                                    {
                                        type: 'html',
                                        html: '&nbsp;'
                                    },
                                    {
                                        type: 'button',
                                        id: 'btChange',
                                        label: 'Change',
                                        //className: 'cke_primary',
                                        style: 'width: 100%;',
                                        onClick: function () {

                                            var dialog = CKEDITOR.dialog.getCurrent();

                                            var currentTypo = "";
                                            var sel = editor.getSelection();
                                            if (sel) {
                                                var typo = sel.getStartElement();
                                                if (typo) {
                                                    typo.$.className = '';
                                                    currentTypo = typo.getText();
                                                }
                                            }

                                            var textInput = dialog.getContentElement('spell', 'value');
                                            editor.insertHtml(textInput.getValue(), 'text');

                                            var plugin = CKEDITOR.plugins.NHunspell;
                                            plugin.api.logMisspellFromDialog(currentTypo, textInput.getValue());

                                            justOpen = true;
                                            next.call(dialog, 'btChange');

                                        }
                                    },
                                    {
                                        type: 'button',
                                        id: 'btChangeAll',
                                        label: 'Change all',
                                        style: 'width: 100%;',
                                        onClick: function () {
                                            var sel = editor.getSelection();

                                            var text = sel.getSelectedText().trim();

                                            var dialog = CKEDITOR.dialog.getCurrent();
                                            var textInput = dialog.getContentElement('spell', 'value');

                                            var plugin = CKEDITOR.plugins.NHunspell;
                                            plugin._.replaceText(editor, text, textInput.getValue());

                                            plugin.api.logMisspellFromDialog(this.currentTypo, textInput.getValue());

                                            justOpen = true;
                                            next.call(dialog, 'btChangeAll');

                                        }
                                    },
                                    {
                                        type: 'button',
                                        id: 'btIgnore',
                                        label: 'Ignore',
                                        style: 'width: 100%;',
                                        onClick: function () {
                                            var dialog = CKEDITOR.dialog.getCurrent();
                                            var plugin = CKEDITOR.plugins.NHunspell;

                                            var textInput = dialog.getContentElement('spell', 'value');
                                            var sel = editor.getSelection();
                                            if (sel) {
                                                var element = sel.getStartElement();
                                                if (element) {
                                                    element.setAttribute(NHUNSPELL_ATTR_IGNORED, "1");
                                                    element.removeClass(NHUNSPELL_STYLE_TYPO);
                                                }
                                            }

                                            justOpen = true;
                                            editor.getSelection().removeAllRanges(); //remove the selection, so that spell checking can automatically begin revisiting the document
                                            editor.fire('afterInsertHtml', {});
                                            next.call(dialog, 'btIgnore');
                                        }
                                    },
                                    {
                                        type: 'button',
                                        id: 'btIgnoreAll',
                                        label: 'Ignore all',
                                        style: 'width: 100%;',
                                        onClick: function () {
                                            var dialog = CKEDITOR.dialog.getCurrent();
                                            var plugin = CKEDITOR.plugins.NHunspell;

                                            var textInput = dialog.getContentElement('spell', 'value');
                                            var text = textInput.getValue();
                                            if (!plugin.isIgnoredWord(dialog.currentTypo)) {
                                                plugin.ignoreWord(dialog.currentTypo);
                                            }

                                            var plugin = CKEDITOR.plugins.NHunspell;
                                            plugin._.replaceText(editor, dialog.currentTypo, dialog.currentTypo);

                                            justOpen = true;
                                            editor.getSelection().removeAllRanges(); //remove the selection, so that spell checking can automatically begin revisiting the document
                                            editor.fire('afterInsertHtml', {});
                                            next.call(dialog, 'btIgnoreAll');

                                        }
                                    },
                                    {
                                        type: 'button',
                                        id: 'btCancel',
                                        label: 'Cancel',
                                        style: 'width: 100%;',
                                        onClick: function () {

                                            onClose();

                                            if (CKEDITOR.dialog.getCurrent() !== null) { CKEDITOR.dialog.getCurrent().hide(); }


                                            var plugin = CKEDITOR.plugins.NHunspell;
                                            if (!plugin.config.spellAsUType) {
                                                plugin.stopSCAYT();
                                            }


                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        ],
        // Called when Spellcheck Dialog became visible
        onShow: function () {
            this.firstLoad = true;
            var sel = editor.getSelection();
            var dialog = CKEDITOR.dialog.getCurrent();
            var plugin = CKEDITOR.plugins.NHunspell;

            justOpen = true;

            var bookmark = editor.getSelection().createBookmarks(); //Storeselection

            var callback = function () {
                editor.getSelection().selectBookmarks(bookmark); // Restore selection
                var ranges = sel.getRanges();
                var range;
                range = editor.getSelection().getRanges()[0];
                if (plugin.isCheckSelectedArea === true) {
                    //uncomment it if the spell check is to begin from the beginning of the document after the 'check remaining document' dialog
                    //range.selectNodeContents(editor.editable());
                    plugin.isCheckSelectedArea = false;
                }
                if (ranges[0].collapsed) { // if nothing is selected on the editor
                    //Compare the node at curosor position to the first node in document.
                    //if they are different, the spellchecker needs to visit to the beginning of the document
                    //after it finishes checking till end of document
                    var firstNode = new CKEDITOR.dom.node(editor.editable().$.firstElementChild);
                    if (!!editor.editable().$.firstElementChild.firstElementChild) {
                        firstNode = new CKEDITOR.dom.node(editor.editable().$.firstElementChild.firstElementChild);
                    }
                    if (plugin.isRevisitRequired) {
                        plugin.isRevisitRequired = false;
                        range.setStart(firstNode, 0);
                    } else {
                        var nodeAtCursor = new CKEDITOR.dom.node(range.startContainer.$);
                        if (firstNode.$.textContent !== nodeAtCursor.$.textContent || firstNode.hasClass(NHUNSPELL_STYLE_TYPO) || ($(nodeAtCursor.$).find('.' + NHUNSPELL_STYLE_TYPO).length > 0)) {
                            plugin.isRevisitRequired = true; //this will set the spellchecker to revisit the document again.
                            plugin.isCheckSelectedArea = false;
                        }
                    }
                    //Select the range till end of document for the spell checker to walk across each of them till end
                    var lastNode = new CKEDITOR.dom.node(editor.editable().$.lastElementChild);
                    if (!!editor.editable().$.lastElementChild.lastElementChild) {
                        lastNode = new CKEDITOR.dom.node(editor.editable().$.lastElementChild.lastElementChild);
                    }
                    range.setEndAfter(lastNode);
                } else { //if the text is selected on the editor
                    plugin.isCheckSelectedArea = true;
                    range = ranges[0];
                }
                /* Workaround for Chrome, it have strange slection logic */
                if (range.startContainer.$ === range.endContainer.$ && range.startContainer.$.nodeType == 3) {
                    if (range.startContainer.getParent() && range.startContainer.getParent().hasClass(NHUNSPELL_STYLE_TYPO)) {
                        range.setStartBefore(range.startContainer.getParent());
                        range.setEndAfter(range.startContainer.getParent());
                        console.log(range.startOffset);
                        console.log(range.endOffset);
                    }
                } else if (range.startContainer.type == CKEDITOR.NODE_TEXT && range.startContainer.getParent().hasClass(NHUNSPELL_STYLE_TYPO)) {
                    range.setStartBefore(range.startContainer.getParent());
                } else if (range.startContainer.type == CKEDITOR.NODE_ELEMENT && (range.startContainer.hasClass(NHUNSPELL_STYLE_TYPO))) {
                    range.setStartBefore(range.startContainer);
                }
                /**/
                dialog.walker = new CKEDITOR.dom.walker(range);
                dialog.walker.evaluator = evaluator;

                next.call(dialog);
                firstLoad = false;
            }

            // Absolete start
            var cb = function () {
                var textInput = dialog.getContentElement('spell', 'value');

                var text;

                var ranges = sel.getRanges();
                // No range selection
                if (ranges[0].collapsed) {
                    var wordRange = plugin.selectWordAtCursor(ranges);
                    if (wordRange
                        && wordRange.startContainer == wordRange.endContainer
                        && wordRange.startContainer.nodeType == 1
                        && wordRange.startContainer.hasClass(NHUNSPELL_STYLE_TYPO)) {
                        //we stand on typo word
                        wordRange.select();
                        //text = sel.getSelectedText();
                    } else {
                        text = plugin._.advance2NextTypo(editor);
                    }
                } else {
                    walker = new CKEDITOR.dom.walker(ranges[0]);
                    walker.evaluator = function (node) {
                        return node.type == 1 && node.hasClass(NHUNSPELL_STYLE_TYPO);
                    };
                    var node = walker.next();
                    if (node) {
                        sel.selectElement(node);
                    }
                }

                text = editor.getSelection().getSelectedText();
                var typo = editor.document.findOne('.nhspell-typo');

                if (text && typo) {

                    sel.selectElement(typo);
                    text = sel.getSelectedText().trim();

                    currentTypo = text;
                    var head = dialog.getContentElement('spell', 'head');
                    head.getElement().$.innerHTML = head.html.replace("{value}", text);

                    textInput.setValue(text);
                    checkSpelling(text);

                } else {
                    done(dialog);
                }
            }
            // Absolete end

            if (!plugin.config.spellAsUType) {
                plugin.startSCAYT(callback);
            } else {
                callback();
            }

        },
        onOk: function () {

        },
        onLoad: function () {
            $('.cke_button__checkspell').addClass('cke_button__checkspell_active');
            $('.cke_dialog_close_button').on('click', onClose);

            // Get CKeditor buttons
            var prevButton = this.getContentElement('spell', 'btChange');
            prevButton.focus();
            this.parts.footer.$.style.display = 'none';
        },
        onHide: function () {
            var plugin = CKEDITOR.plugins.NHunspell;
            if (!plugin.config.spellAsUType) {
                plugin.stopSCAYT();
            }
        },
        findFirst: function () {

        }
    };
});
