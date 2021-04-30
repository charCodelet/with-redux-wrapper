/**
 * @license Copyright (c) Gary Feng, 2015
 * based on the Undo/Redo code by Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Keystroke logging plug-in.
 */

'use strict';

/////////////////////////
// garyfeng: logging functions
/////////////////////////
// Dependency: diff.js, log4javascript.js

////////////////////////////////
//garyfeng: logging configuration
var logConfig = {
    // logging format
    //timeFormat: "UTC", or "JSON", or getTime() if missing
    timeFormat: 'JSON',
    // format of the extendedInfo data
    formatUsingXML: false,
    formatUsingJSON: true,
    //formatAsString: true, // no need; default for enaep

    // options for the diff algorithm
    // if change of text length is too large, then do not calc edit distance
    // instead just output a snapshot.
    diffLengthThreshold: 200,

    // eNAEP call
    eNaepAPI: true, // the enaep.observibleData() expets a string
    eNaepPostInterval: 16000, // how many milliseconds between calls
    eNaepEventSizeLimit: 500, // max size of the events to hold in buffer, in KB
    localLogging: false, // non-eNAEP logging using Console, String, or AJAX appenders

    // event options
    logKeyPresses: true, // keyup and keydown events?
    logKeyVerbose: false, // to keep HTML and text contents in the text.change events.
    logMouseClicks: true, // to log mouse clicks anywhere on the screen except in the editor.
    logSelectionChanges: true, // log selection change events, e.g., mouse clicks.
    //logWSCVerbose: false, // verbose logging of the spellchecker/thesaurus events
    logEventVerbose: false, // Set true to include ExtendedInfo for certain events (generally those triggered by toolbar buttons/menu items)

    // error handling
    onErrorAlert: false,
    onErrorLog: true,
    consoleDebuging: true,

    ////////////////
    // things below are not used for eNAEP; for local/remote logging only
    ////////////////
    // Ajax Appender setup
    AjaxAppender: false,
    AjaxSetTime: true,
    AjaxTimerInterval: 1000,
    AjaxBatchSize: 10,
    AjaxSetSendAllOnUnload: true,
    AjaxWaitForResponse: true,
    serverURL: 'dev/logger.php',
    serverLogFilename: 'Keystrokelog.txt',

    // stringAppender
    StringAppender: true,
    localLogFilename: 'KeystrokeLog_' + new Date().toISOString().replace(/[^0-9]/g, '') + '.txt',

    // consoleAppender
    ConsoleAppender: true,

    // junk, to capture accidental commas
    nothing: true
};

// check to see if log4javascript.js is loaded. disable logAppenders if it's not.
if (typeof log4javascript == 'undefined') {
    logConfig.localLogging = false;
    logConfig.AjaxAppender = false;
    logConfig.StringAppender = false;
    logConfig.ConsoleAppender = false;
}

if (typeof saveAs != 'function') {
    // FileSaver.js not loaded; no point loading StringAppender because you can't save
    logConfig.StringAppender = false;
}

if (typeof Blob != 'function') {
    // Blob.js not loaded; no point loading StringAppender because you can't save
    logConfig.StringAppender = false;
}

// alertLogError, use alert() or console.log depending on the config setting
// logging function in the case eventlogging is not present
// see below for better implementation!
var alertLogError = function(msg) {
    console.log('ERROR\t' + msg);
};
var consoleDebuging = function(msg) {
    console.log('DEBUG\t' + msg);
};
var logMessage = function(message) {
    console.log(message);
};
//alertLogError("--> eventlogging.js not loaded yet")

if (typeof logConfig !== 'undefined') {
    // if logConfig is defined
    alertLogError = function(msg) {
        if (logConfig['onErrorAlert']) alert(msg);
        if (logConfig['onErrorLog']) console.log('ERROR\t' + msg);
    };
    consoleDebuging = function(msg) {
        if (logConfig['consoleDebuging']) console.log('DEBUG\t' + msg);
    };
    logMessage = function(message) {
        // use console.log now for debug
        consoleDebuging(message);
        // consoleDebuging(JSON.stringifyOnce(message))
        // logging to file
        if (typeof log != 'undefined') {
            log.info(message);
        } else {
            if (logConfig.localLogging)
                alertLogError('Error: log object not created');
        }
    };
}

if (typeof JsDiff != 'object') {
    // Diff.js not loaded; no point going forward;
    logConfig = null;
    alertLogError("Diff.js is not loaded. Can't log keystrokes.");
    throw 'Please load Diff.js first.';
}

// create the logger if does exist
// this requires log4javascript.js is loaded.
if (typeof log === 'undefined') {
    // check to see if this is in an iFrame and the parent has log
    if (typeof parent.log != 'undefined') {
        // if parent has log, then use that one.
        log = parent.log;
    } else if (!logConfig.localLogging) {
        // no local logging
        // do nothing
    } else {
        // if no log in this or parent, then create a log
        if (typeof logConfig == 'undefined') {
            // no logConfig object
            alertLogError('Logging: logConfig is not defined');
        }
        // already checked to see if log4javascript is loaded
        log4javascript.setTimeStampsInMilliseconds();
        var log = log4javascript.getLogger('main');
        //var layout = new log4javascript.PatternLayout("%50r\t%d{dd MMM yyyy HH:mm:ss,SSS}\t%-5p\t%m");
        // we now use the millisecond since logger started
        var layout = new log4javascript.PatternLayout('%6r\t%m%n');

        // preparing to add AJAX appender
        if (logConfig['AjaxAppender']) {
            var appender = new log4javascript.AjaxAppender(
                logConfig['serverURL'] || 'logger.php'
            );

            function requestCallback(xmlHttp) {
                consoleDebuging('Logging: ajax post succeeded');
            }

            function requestCallbackFail(xmlHttp) {
                alertLogError('Logging: ajax post FAILED');
            }
            appender.setRequestSuccessCallback(requestCallback);
            appender.setFailCallback(requestCallbackFail);
            appender.setLayout(layout);
            // set log as timed, for buffered logging
            // see http://log4javascript.org/docs/manual.html#ajaxappender
            appender.setWaitForResponse(logConfig['AjaxWaitForResponse']);
            appender.setTimed(logConfig['AjaxSetTime']);
            appender.setTimerInterval(logConfig['AjaxTimerInterval']);
            appender.setBatchSize(logConfig['AjaxBatchSize']);
            appender.setSendAllOnUnload(logConfig['AjaxSetSendAllOnUnload']);
            log.addAppender(appender);
        }
        //now adding the StringAppender, as a possible backup
        if (logConfig['StringAppender']) {
            var strAppender = new log4javascript.StringAppender();
            strAppender.setLayout(layout);
            log.addAppender(strAppender);
        }
        //now adding the ConsoleAppender, as a possible backup
        if (logConfig['ConsoleAppender']) {
            // currently any appender will use logMessage, which prints to debut.
        }
    }
}

// jgrant. Cleans HTML formatting out of editor contents.
function cleanContent(txt) {
    txt = txt.replace('</p><p>', '\n');
    txt = txt.replace(/(<([^>]+)>)/gi, '');
    return txt;
}
// jgrant. Global array for storing observable events.
var gObsEvents = [];

// jgrant. Pass observable events array to enaep.observerableEvents() every 16 seconds.
// garyfeng: use the option logConfig.eNaepPostInterval for the interval

/*-----  No longer needed as component model events are being used.

setInterval(function() {
    if (typeof gObsEvents == 'undefined') return; // make sure the global is there
    // Do we see the enape API?
    if (typeof enaep != 'undefined' && gObsEvents.length > 0) {
        // Pass a copy of the array.
        var gObsEventsCopy = gObsEvents;
        logMessage('Posting process data to eNAEP');
        //enaep.observableEvent(gObsEventsCopy);
        const editor = this.CKEDITOR && this.CKEDITOR.instances && this.CKEDITOR.instances.editor1;
        if (editor) {
            _.forEach(gObsEvents, oe => {
                editor.fire("enaepObservableEvent", oe);
            });
        }

        //gObsEventsCopy = [];
        // TODO: Determine if send was successful before resetting the original array.
        gObsEvents = [];
    }
}, logConfig.eNaepPostInterval);

--------------------------------------------*/


// save log to file using FileSaver.JS
// as a backup of log4javascript
function saveLogToLocalFile() {
    // ensure the log exists
    if (!log) {
        alertLogError('Error: log is not set. No data tracked or saved.');
        return;
    }
    var filename = logConfig['localLogFilename'] || 'KeystrokeLog_Temp.txt';
    // get all appenders. There may or may not be a StringAppender in there.
    var appenderList = log.getEffectiveAppenders();
    // loop through the appenders to save all strAppenders
    for (var i in appenderList) {
        // if this is a StringAppender
        if (appenderList[i].toString() === 'StringAppender') {
            // only save if log length is >0
            var logContent = appenderList[i].getLog();
            if (logContent.length > 0) {
                // save the log; in the case there are multiple stringAppenders, filename will be saved as xxx(1).txt
                var eNaepName = 'saveLogToLocalFile';
                var extendedInfo = {
                    //"eventTime": getCurTime(),
                    name: eNaepName,
                    filename: filename,
                    length: logContent.length
                };
                CKEDITOR.instances.editor1.keystrokeManager.logit(
                    eNaepName,
                    extendedInfo
                );

                var blob = new Blob([appenderList[i].getLog()], {
                    type: 'text/plain;charset=utf-8'
                });
                saveAs(blob, filename);
                // clearLog
                appenderList[i].clearLog();
            }
        }
    }
}

// make sure we sendall() to the server
function flushAjaxLoggers() {
    // ensure the log exists
    if (!log) {
        alertLogError('Error: log is not set. No data tracked or saved.');
        return;
    }
    // flush it with this so that the buffer can be ready to send.
    var i;
    for (i = 0; i < (logConfig['AjaxBatchSize'] + 2 || 12); i++) {
        logMessage(
            '=========================================================================='
        );
    }
    // wait for n-sec, and keep flushing
    var t0 = new Date().getTime();
    var appenderList = log.getEffectiveAppenders();
    // this is kinda stupid: we have to wait
    while (new Date().getTime() - t0 < logConfig['AjaxTimerInterval'] * 2) {
        for (i in appenderList) {
            // only for ajaxAppenders
            try {
                appenderList[i].sendAll();
            } catch (err) {}
        }
    }
}

////////////////////////
// garyfeng: utilities extending existing prototypes
////////////////////////

// garyfeng: utilities to deal with JSON circular references
// String.startsWith(), see
// http://stackoverflow.com/questions/646628/how-to-check-if-a-string-startswith-another-string
if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) === 0;
    };
}
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

// utility: http://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
// TODO: this function can be slow!!
if (!String.prototype.encodeHTML) {
    String.prototype.encodeHTML = function() {
        return this.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
}

// utility: http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
if (!String.prototype.capitalizeFirstLetter) {
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}

// extending JSON.stringify() to prevent circular errors
// see http://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
if (typeof JSON.stringifyOnce == 'undefined') {
    JSON.stringifyOnce = function(obj, replacer, indent) {
        var printedObjects = [];
        var printedObjectKeys = [];

        function printOnceReplacer(key, value) {
            if (printedObjects.length > 2000) {
                // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
                return 'object too long';
            }
            var printedObjIndex = false;
            printedObjects.forEach(function(obj, index) {
                if (obj === value) {
                    printedObjIndex = index;
                }
            });

            if (key == '') {
                //root element
                printedObjects.push(obj);
                printedObjectKeys.push('root');
                return value;
            } else if (key.startsWith('_')) {
                // garyfeng: if the key starts with '_', don't go in.
                //a private element
                return '(private element, skipping)';
            } else if (printedObjIndex + '' != 'false' && typeof value == 'object') {
                if (printedObjectKeys[printedObjIndex] == 'root') {
                    return '(pointer to root)';
                } else {
                    return (
                        '(see ' +
                        (!!value && !!value.constructor ?
                            value.constructor.name.toLowerCase() :
                            typeof value) +
                        ' with key ' +
                        printedObjectKeys[printedObjIndex] +
                        ')'
                    );
                }
            } else {
                var qualifiedKey = key || '(empty key)';
                printedObjects.push(value);
                printedObjectKeys.push(qualifiedKey);
                if (replacer) {
                    return replacer(key, value);
                } else {
                    return value;
                }
            }
        }

        var res = 'unknown error';
        try {
            res = JSON.stringify(obj, printOnceReplacer, indent);
        } catch (e) {
            console.log(e);
        }

        return res;
    };
}

/////////////////////////
// garyfeng: Utilities for this project
/////////////////////////

// from http://stackoverflow.com/questions/2631820/im-storing-click-coordinates-in-my-db-and-then-reloading-them-later-and-showing/2631931#2631931
//function getPathTo(element) {
//	if (element.id !== '')
//		return "//*[@id='" + element.id + "']";

//	if (element === document.body)
//		return element.tagName.toLowerCase();

//	var ix = 0;
//	var siblings = element.parentNode.childNodes;
//	for (var i = 0; i < siblings.length; i++) {
//		var sibling = siblings[i];

//		if (sibling === element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';

//		if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
//			ix++;
//		}
//	};
//}

//function getPageXY(element) {
//	var x = 0, y = 0;
//	while (element) {
//		x += element.offsetLeft;
//		y += element.offsetTop;
//		element = element.offsetParent;
//	}
//	return [x, y];
//}

// getTime function
// TODO: the toUTCString() is accurate to seconds, not millisecond!
// the following is a stub to add getUTCMilliseconds, but it's not a
// standard UTC format anyways. Should use toJSON()
/*
function addZero(x,n) {
    if (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
}

// Thu, 07 May 2015 00:07:28.123 GMT
function myUTC(d) {
    //var d = new Date();
    if (! (d instanceof Date)) return;

    var h = addZero(d.getUTCHours(), 2);
    var m = addZero(d.getUTCMinutes(), 2);
    var s = addZero(d.getUTCSeconds(), 2);
    var ms = addZero(d.getUTCMilliseconds(), 3);
    var myUTC= h + ":" + m + ":" + s + ":" + ms;

    return myUTC
}
*/
// optional date object
var getCurTime = function(d) {
    // take optional time value
    var t = d instanceof Date ? new Date(d) : new Date();
    // returns either getTime() or UTC() depending on the logConfig
    if (typeof logConfig == 'undefined') {
        // no logConfig, reutnr getTime()
        return t.getTime();
    } else if (logConfig['timeFormat'] === 'UTC') {
        return t.toUTCString();
    } else if (logConfig['timeFormat'] === 'JSON') {
        return t.toJSON();
    } else {
        return t.getTime();
    }
};

// cdataWrap: to wrap (selected) content in CDATA for XML output
var cdataWrap = function(data) {
    return '<![CDATA[' + data.toString() + ']]>';
};

// A hack to get text from HTML
// http://stackoverflow.com/questions/5002111/javascript-how-to-strip-html-tags-from-string
var html2text = function(html) {
    // testing the idea of using .toString() with a replacement trick
    // knowing that .textContent doesn't preserve the newlines, let's replace </p> with 2 newline chars
    // This is ignoring all other HTML/CSS markups, such as <br>, tables, etc.
    // console.log(html);
    // but first, we have to remove the dangling '<p></p>' at the end of a selection.
    // other wise moving the cursor to the begiining of a new line will give you incorrect pos reading
    // it's basically 2+, because the empty </p> is turned into \n\n.
    // This is only applicable to "<p></p>" inserted by CKEditor; user created newlines (e.g.
    // when the user hits enter keys) are like "<p><br/></p>", and textContent ignores <br>s. We
    // are ok there.
    html = html.replace(/<p><\/p>/gi, '');
    // now we can do our trick
    html = html.replace(/<\/p>/gi, '\n\n</p>');
    // create the div if it's not there
    var el = document.getElementById('divHTML2Text');
    if (!el) {
        el = document.createElement('div');
        el.setAttribute('id', 'divHTML2Text');
        el.setAttribute('style', '{display:hidden; white-space: pre-line;}');
    }
    // clear the element
    el.innerHTML = '';
    try {
        // in the case html is not valid
        el.innerHTML = html;
    } catch (e) {
        console.log('Error in html2text(): invalid HTML input');
        return '';
    }

    // can't use  el.textContent because it doesn't preserve newline as \n
    // but innerText trims spaces ;<  We solve this problem by
    // replacing spaces with non-breaking spaces in the incoming HTML.
    // @@@@@ NOTE: Firefox doesn't support innerText @@@@@@@@
    // see this for a great summary of the state of affair as of 2015
    // http://perfectionkills.com/the-poor-misunderstood-innerText/
    // and we probably don't want to polyfill, like
    // https://github.com/duckinator/innerText-polyfill/blob/master/innertext.js
    // So we will use .textContent instead, with the newline replacement trick above.

    //return el.innerText;
    return el.textContent;
};

// A hack to get a docment fragment to HTML
var frag2html = function(frag) {
    // create the div if it's not there
    var el = document.getElementById('divHTML2Text');
    if (!el) {
        el = document.createElement('div');
        el.setAttribute('id', 'divHTML2Text');
        el.setAttribute('style', '{display:hidden}');
    }
    // clear the element
    el.innerHTML = '';
    try {
        // in the case html is not valid
        el.appendChild(frag.cloneNode(true));
    } catch (e) {
        console.log('Error in frag2html(): invalid document fragment');
        return '';
    }

    return el.innerHTML;
};

var selection2string = function(editor) {
    // avoid using DOM manipulations
    // return editor.getSelection().getNative().toString()
    return editor.getSelection().getSelectedText();
};

var getSelectionInfo = function(editor) {
    // get the current selection, return a selInfo object

    // RonMorrill: Initialize this for cases when we need to return an empty selection
    var selInfo = {
            selectedText: '',
            startPos: 0,
            endPos: 0
        },
        textSelected = '';
    // get current selection in DOM
    // var editor = CKEDITOR.instances.editor1
    var sel = editor.getSelection().getNative();

    // jgrant. check for no selection.
    // RonMorrill: improve check and return something that won't cause calling code to crash
    if (sel == null || sel.rangeCount === 0) {
        return selInfo;
    }
    // get range
    var ran = sel.getRangeAt(0);
    // get html
    // make sure we replace white spaces with non-break spaces
    var html = frag2html(ran.cloneContents()).replace(/ /g, '&nbsp;');

    // filling in properties
    if (logConfig.logKeyVerbose) {
        selInfo.html = editor.document.$.body.innerHTML;
        selInfo.text = html2text(editor.document.$.body.innerHTML);
    }

    // Calculate the text position of the two ends.
    // note that html2text() returns "\n\n" for line breaks,
    //  but range.toString() reutrns "\n" only.
    // So we must go through html2text() for all range contents for consistency.

    // first select the beginning of the text
    var firstnode = editor.document.$.body.childNodes[0];
    var firstOffset = 0;
    // Count characters before to the left of the selection.
    var leftrange = editor.document.$.createRange();
    leftrange.setStart(firstnode, firstOffset);
    leftrange.setEnd(ran.startContainer, ran.startOffset);
    textSelected = html2text(
        frag2html(leftrange.cloneContents()).replace(/ /g, '&nbsp;')
    );
    selInfo.startPos = textSelected.length;
    if (logConfig.logKeyVerbose) selInfo.leftText = textSelected;
    // this includes "\n\n" that we need to take out
    if (ran.startOffset !== 0 && textSelected.endsWith('\n\n')) {
        selInfo.startPos -= 2;
    }

    // Count characters before to the right of the selection.
    var rightrange = editor.document.$.createRange();
    rightrange.setStart(firstnode, firstOffset);
    rightrange.setEnd(ran.endContainer, ran.endOffset);
    textSelected = html2text(
        frag2html(rightrange.cloneContents()).replace(/ /g, '&nbsp;')
    );
    if (logConfig.logKeyVerbose) selInfo.rightText = textSelected;
    selInfo.endPos = textSelected.length;
    // this includes "\n\n" that we need to take out
    if (ran.endOffset !== 0 && textSelected.endsWith('\n\n')) {
        selInfo.endPos -= 2;
    }

    selInfo.lenSelected = selInfo.endPos - selInfo.startPos;
    // selected contents
    if (logConfig.logKeyVerbose) selInfo.htmlSelected = html;
    // textSelected turned out to be more complex. In the following example
    // "startPos":13,"endPos":20,"htmlSelected":"<p>t</p><p>Se</p>","textSelected":"t\n\nSe\n\n"
    // we see that the lenSelected = 7, but the text has an extra "\n\n" because html2text automatically
    // closes off the </p>, which gets translated as "\n\n". We have to take it out.
    textSelected = html2text(html);
    // if endOffset is 0, then delete the last 2 characters, which are "\n\n"
    selInfo.textSelected =
        ran.endOffset != 0 && textSelected.endsWith('\n\n') ?
        textSelected.substring(0, textSelected.length - 2) :
        textSelected;
    //selInfo.textSelected = textSelected;
    selInfo.isCollapsed = sel.isCollapsed;

    return selInfo;
};

// utility
// TODO: should add to JSON.toXml()
// from http://goessner.net/download/prj/jsonxml/json2xml.js,
// see http://stackoverflow.com/questions/1773550/convert-xml-to-json-and-back-using-javascript.
/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
  Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/
*/
function json2xml(o, tab) {
    var toXml = function(v, name, ind) {
            var xml = '';
            if (v instanceof Array) {
                for (var i = 0, n = v.length; i < n; i++)
                    xml += ind + toXml(v[i], name, ind + '\t') + '\n';
            } else if (typeof v === 'object') {
                var hasChild = false;
                xml += ind + '<' + name;
                for (var m in v) {
                    if (m.charAt(0) === '@')
                        xml += ' ' + m.substr(1) + '="' + v[m].toString() + '"';
                    else hasChild = true;
                }
                xml += hasChild ? '>' : '/>';
                if (hasChild) {
                    for (var m in v) {
                        if (m === '#text') xml += v[m];
                        else if (m === '#cdata') xml += '<![CDATA[' + v[m] + ']]>';
                        else if (m.charAt(0) !== '@') xml += toXml(v[m], m, ind + '\t');
                    }
                    xml +=
                        (xml.charAt(xml.length - 1) === '\n' ? ind : '') +
                        '</' +
                        name +
                        '>';
                }
            } else {
                xml += ind + '<' + name + '>' + v.toString() + '</' + name + '>';
            }
            return xml;
        },
        xml = '';
    for (var m in o) xml += toXml(o[m], m, '');
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, '');
}
// end json2xml

// we need an eventName2typeId() to support the eNAEP API
// the idea is to have an conversation table object, and a function
// that checks a string against this table. If not found, then it returns 999
// We can simplify this table for only the events we care about
// for now, though, I am keeping everythign that is in the file Molly shared
// as of May 07, 2015.

// JGrant. Added additional item below to compensate for typos elsewhere in the code. This will fix eNAEPAPI
// logging errors:
// "Button_Selectall": 69
// "Menu_SelectAll": 71
// "Button_Underline": 43
// "Menu_Underline": 45
// jgrant: Removed Button_Underline and Menu_Underline, as they are no longer needed. Fixed the problem at the source.
var eventName2typeIdTable = {
    Enter_Item: 1,
    Exit_Item: 2,
    Change_Language: 4,
    KeypressCount: 5,
    Click_Choice: 6,
    Click_Progress_Navigator: 7,
    Keyboard_Cut: 8,
    RightClick_Cut: 9,
    Keyboard_Copy: 10,
    RightClick_Copy: 11,
    Keyboard_Paste: 12,
    RightClick_Paste: 13,
    TextToSpeech: 14,
    Collapse_Prompt: 15,
    Expand_Prompt: 16,
    Collapse_Response: 17,
    Expand_Response: 18,
    Item_Bottom_Not_Reached: 19,
    Admin_MoveToNextBlock: 20,
    Hide_Timer: 21,
    Show_Timer: 22,
    Change_Theme: 23,
    Application_Recovery: 24,
    Equation_Editor_Button: 25,
    Backspace: 26,
    Delete: 27,
    Clear_Answer: 28,
    Button_Cut: 29,
    Menu_Cut: 30,
    Button_Copy: 31,
    Menu_Copy: 32,
    Button_Paste: 33,
    Menu_Paste: 34,
    Button_Bold: 35,
    Keyboard_Bold: 36,
    Menu_Bold: 37,
    RightClick_Bold: 38,
    Button_Italic: 39,
    Keyboard_Italic: 40,
    Menu_Italic: 41,
    RightClick_Italic: 42,
    // RonMorrill: changing these to "underline" instead of "underscore" so they match the basicstyles plugin command text
    Button_Underline: 43,
    Keyboard_Underline: 44,
    Menu_Underline: 45,
    RightClick_Underline: 46,
    // end RonMorrill change
    Button_Indent: 47,
    Button_Outdent: 48,
    // RonMorrill: changing these to "checkspell" instead of "spellcheck" so they match the wsc plugin command text
    Button_SpellCheck: 49,
    Menu_SpellCheck: 50,
    RightClick_Misspellings: 51,
    Misspellings_Identified: 52,
    Misspellings_Corrected: 53,
    Menu_Thesaurus: 54,
    RightClick_Thesaurus: 55,
    Item_Scroll: 57,
    Vertical_Item_Scroll: 58,
    Horizontal_Item_Scroll: 59,
    DropChoice: 60,
    Keypress: 61,
    Open_Calculator: 62,
    Close_Calculator: 63,
    Move_Calculator: 64,
    Calculator_Buffer: 65,
    Decrease_Zoom: 66,
    Increase_Zoom: 67,
    Eliminate_Choice: 68,
    // RonMorrill: removed underscore to match plugin
    Button_SelectAll: 69,
    Keyboard_Select_All: 70,
    // RonMorrill: removed underscore to match plugin
    Menu_SelectAll: 71,
    Button_Undo: 72,
    Keyboard_Undo: 73,
    Menu_Undo: 74,
    Button_Redo: 75,
    Keyboard_Redo: 76,
    Menu_Redo: 77,
    // RonMorrill: changing to "checkspell" instead of "spellcheck" to match the wsc plugin command text
    RightClick_SpellCheck: 78,
    RightClick_Checkspell: 78,
    Button_Thesaurus: 79,
    Click_Word_Definition: 80,
    Display_Reminder: 81,
    Pause_Workstation: 82,
    Resume_Workstation: 83,
    Enter_Supervisor_Access_Dialog: 84,
    Leave_Supervisor_Access_Dialog: 85,
    Menu_Indent: 86,
    Menu_Outdent: 87,
    Close_Word_Definition: 88,
    Reset_Booklet: 89,
    Next: 90,
    Back: 91,
    Yes: 92,
    No: 93,
    OK: 94,
    Media_Interaction: 95,
    Scratchwork_Mode_On: 96,
    Scratchwork_Mode_Off: 97,
    Scratchwork_Draw_Mode_On: 98,
    Scratchwork_Erase_Mode_On: 100,
    Scratchwork_Highlight_Mode_On: 102,
    Clear_Scratchwork: 104,
    Draw: 105,
    Erase: 106,
    Highlight: 107,
    First_Text_Change: 108,
    Last_Text_Change: 109,
    Text_Entered: 110,
    Start_Typing: 111,
    End_Typing: 112,
    Touchscreen_Reposition_Cursor: 113,
    Trackpad_Reposition_Cursor: 114,
    Delete_Selected_Text: 115,
    Receive_Focus: 116,
    Lose_Focus: 117,
    Previous_Passage_Page: 118,
    Next_Passage_Page: 119,
    Other_Passage_Page: 120,
    Previous_Passage_Page_Swipe: 121,
    Next_Passage_Page_Swipe: 122,
    Activate_Footnote: 123,
    Dismiss_Footnote: 124,
    Click_Passage_Tab: 125,
    Show_Questions_Panel: 126,
    Hide_Questions_Panel: 127,
    'Click_Look-back_Button': 128,
    Leave_Section: 129,
    Math_Keypress: 143,
    Thesaurus_Replacement: 144,
    Spellcheck_Dialog_Box_Closed: 145,
    Thesaurus_Dialog_Box_Closed: 146,
    Open_Equation_Editor: 147,
    Close_Equation_Editor: 148,
    Spellcheck_Dialog_Box_Moved: 150,
    Thesaurus_Dialog_Box_Moved: 151,
    Thesaurus_Lookup: 152,
    Thesaurus_Meanings: 153,
    Thesaurus_Synonyms: 154,
    Thesaurus_Previous_Looked_Up_Word: 155,
    Thesaurus_Edit_Lookup: 156,
    Thesaurus_Edit_Replace: 157,
    PilotObservable: 999
};

var eventName2typeId = function(evtName) {
    return eventName2typeIdTable[evtName] || 999;
};

// textDiff: reduce rich text to plain text before doing diffs.
// This is because (a) content is much more important than markups
// (b) richtext editors may add spaces to HTML to beautify the code, and
// therefore introduce artibrary changes that are not part of writing
// (c) doing a diff of HTML will often result in disjunct diffs.
// We will track markups by (1) tracking all triggers of the markup commands,
// and (2) optionally keep a snapshot of the HTML.

var textDiff = function(str1, str2) {
    // str1 is the original, str2 is the "new" text
    var diffArray = [],
        counter = 1,
        keyRecord = {},
        diff = {},
        textContext = '';

    // we first check if text len difference is above a threshhold, logConfig.diffLengthThreshold.
    // It makes no sense for JsDiff to calculate edit distance for texts
    // that differ by too much.
    // We construct the diffArray differently depending on the length diff.
    if (Math.abs(str1.length - str2.length) > logConfig.diffLengthThreshold) {
        // length difference too large, we simply return a snapshot
        // with str1 taken out and str2 put in.
        diffArray = [
            { edit: 'DEL', pos: 1, len: str1.length, text: str1 },
            { edit: 'INS', pos: 1, len: str2.length, text: str2 }
        ];
        textContext = ''; // no textContext
    } else {
        // length difference is not too big; we use the diffChars mode
        diff = JsDiff.diffChars(str1, str2);

        diff.forEach(function(part) {
            keyRecord = {
                edit: '',
                pos: counter,
                len: part.value.length,
                text: part.value // RonMorrill: why does this need to be escaped?
                    //text: escape(part.value)
            };
            if (part.added) {
                keyRecord['edit'] = 'INS';
                diffArray.push(keyRecord); //output
                counter += part.value.length;
            } else if (part.removed) {
                keyRecord['edit'] = 'DEL';
                diffArray.push(keyRecord); //output
                // if it's deletion, subtract the length?
                // counter -=part.value.length;
            } else {
                // garyfeng TODO: need to add conditions to log markup events
                // e.g., keyRecord['edit'] = 'bold', with pos and len and text
                // parts with no change, skip
                // log.info("Keystroke\tUnchanged\t"+counter+"\t"+escape(part.value))

                // we need to add the length of non INS and DEL texts as well.
                counter += part.value.length;
            }
        });

        if (counter < 0) {
            console.log('======= error textDiff: counter<0 ======');
        }

        // get n-gram text context
        // assuming only a single editing location at a time
        // so we take the last keyRecord.pos
        // .split(/[\s,\.\?\!\:\;]+/).slice(-3).join(' ')
        var sp = /[\s,\.\?\!\:\;]+/;
        var leftContext = str2
            .substring(0, keyRecord.pos - 1)
            .split(sp)
            .slice(-5)
            .join(' ');
        var rightContext = str2
            .substring(keyRecord.pos - 1)
            .split(sp)
            .slice(0, 3)
            .join(' ');
        textContext = leftContext + '^' + rightContext;
    }

    // output
    var output = {
        //"textDiff": escape(JsDiff.convertChangesToXML(diff)),
        //"textDiff": JsDiff.convertChangesToXML(diff),
        diffs: diffArray,
        // get the last n grams, n=5
        textContext: textContext,
        // "counter": keyRecord.pos,
        textLength: str2.length // this counts \n as 2 chars
    };
    // if we need additional info
    if (logConfig.logKeyVerbose) {
        output.diffString = JsDiff.convertChangesToXML(diff);
    }

    return output;
};
/*
////////////////////////////////
// Logging functions and hooks
// global error message logging
// https://danlimerick.wordpress.com/2014/01/18/how-to-catch-javascript-errors-with-window-onerror-even-on-chrome-and-firefox/
window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    var eNaepName = "Error";
    var extendedInfo = {
        "eventTime": getCurTime(),
        "name": eNaepName,
        "errorMsg": errorMsg,
        "script": url,
        "line": lineNumber,
        "column": column,
        "stackTrace": JSON.stringifyOnce(errorObj)
    }
    consoleDebuging('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' + errorObj);
    // log using the keystrokeManager.logit() function
    CKEDITOR.instances.editor1.keystrokeManager.logit(eNaepName, extendedInfo);
}

// global mouse click logging
window.onclick = function (e) {
    //consoleDebuging("MOUSE\t"+JSON.stringify(msg));
    // garyfeng: logging the save command
    var eNaepName = "MouseClick";
    var extendedInfo = {
        "eventTime": getCurTime(),
        "name": eNaepName,
        "button": e.button,
        "x": e.pageX,
        "y": e.pageY,
    };
    // log using the keystrokeManager.logit() function
    if (logConfig.logMouseClicks) {
        CKEDITOR.instances.editor1.keystrokeManager.logit(eNaepName, extendedInfo);
    }
};
*/
// end garyfeng

/////////////////////
// Keystrokelog plugin, modified from the Undo/Redo Manager
/////////////////////

('use strict');

(function() {
    // garyfeng: TODO: need to assign other hotkeys.
    var keystrokes = [
            CKEDITOR.CTRL + 90 /*Z*/ ,
            CKEDITOR.CTRL + 89 /*Y*/ ,
            CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/
        ],
        backspaceOrDelete = { 8: 1, 46: 1 };

    // garyfeng: to trap and trigger eNAEP typeId
    var eNAEPkeystrokes = {};
    eNAEPkeystrokes[CKEDITOR.CTRL + 65] = 'Keyboard_Select_All'; // CTRL-a
    eNAEPkeystrokes[CKEDITOR.CTRL + 66] = 'Keyboard_Bold'; // CTRL-b
    eNAEPkeystrokes[CKEDITOR.CTRL + 67] = 'Keyboard_Copy'; // CTRL-c

    // JGrant. Added keyboard cut.
    eNAEPkeystrokes[CKEDITOR.CTRL + 88] = 'Keyboard_Cut'; // CTRL-x

    eNAEPkeystrokes[CKEDITOR.CTRL + 73] = 'Keyboard_Italic'; // CTRL-i
    eNAEPkeystrokes[CKEDITOR.CTRL + 85] = 'Keyboard_Underline'; // CTRL-u
    eNAEPkeystrokes[CKEDITOR.CTRL + 86] = 'Keyboard_Paste'; // CTRL-v
    eNAEPkeystrokes[CKEDITOR.CTRL + 89] = 'Keyboard_Redo'; // CTRL-y
    eNAEPkeystrokes[CKEDITOR.CTRL + 90] = 'Keyboard_Undo'; // CTRL-z

    CKEDITOR.plugins.add('keystrokelog', {
        // jscs:disable maximumLineLength
        lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
        // jscs:enable maximumLineLength
        // garyfeng: TODO: need to replace the icons
        icons: 'redo,redo-rtl,undo,undo-rtl', // %REMOVE_LINE_CORE%
        hidpi: true, // %REMOVE_LINE_CORE%

        init: function(editor) {
            var keystrokeManager = (editor.keystrokeManager = new KeystrokeManager(
                    editor
                )),
                editingHandler = (keystrokeManager.editingHandler = new NativeEditingHandler(
                    keystrokeManager
                ));

            // garyfeng: This is the primary saveSnapShot function.
            // need to convert the save() function to the log() function.
            function recordCommandBefore(event) {
                // garyfeng: logging the save command
                // console.log(event)
                var extendedInfo = {
                    name: event.data.name
                };
                //keystrokeManager.logit("COMMAND", extendedInfo);
                //keystrokeManager.logdiff();
                keystrokeManager.save();
                // end gary feng

                // If the command hasn't been marked to not support undo.
                //if ( keystrokeManager.enabled && event.data.command.canUndo !== false )
                //	keystrokeManager.save();
            }

            // ronmorrill: do keystroke command handling for non-clipboard functions in this function, since the key combinations get
            // swallowed and don't make it to the keydown handler
            function recordCommandAfter(event) {
                // garyfeng: logging the save command
                // ronmorrill: only log here if from keystroke handler. Otherwise it will have been logged elsewhere
                if (
                    event.data.commandData &&
                    event.data.commandData.from === 'keystrokeHandler'
                ) {
                    var eNaepName =
                        eNAEPkeystrokes[event.data.name] ||
                        'Keyboard_' + event.data.name.capitalizeFirstLetter();
                    var extendedInfo = {
                        //"eventTime": getCurTime(),
                        name: eNaepName,
                        command: event.data.name,
                        //"prevState": event.data.command.previousState,
                        //"state": event.data.command.state,
                        //"source": event.data.commandData.from,
                        selectedText: selection2string(editor) || ''
                    };
                    //keystrokeManager.logit("COMMAND", extendedInfo);
                    keystrokeManager.logit(
                        eNaepName,
                        logConfig.logEventVerbose ? extendedInfo : null
                    );
                }

                keystrokeManager.save();
                // keystrokeManager.logdiff();
                // raise the eNAEP event

                // also clear up the keyEventStack
                // it's under editingHandler.keyEventsStack
                //console.log(editingHandler.keyEventsStack.stack)
                editingHandler.keyEventsStack.clearStack();
                //console.log(editingHandler.keyEventsStack.stack)

                // end gary feng

                // If the command hasn't been marked to not support undo.
                //if ( keystrokeManager.enabled && event.data.command.canUndo !== false )
                //	keystrokeManager.save();
            }

            // garyfeng: these are for editor toolbar buttons/commands
            // We'll save snapshots before and after executing a command.
            editor.on('beforeCommandExec', recordCommandBefore);
            editor.on('afterCommandExec', recordCommandAfter);

            /*            // garyfeng: dialogue boxes, for spell checker, etc.
                        editor.on('dialogShow', function (evt) {
                            // this is where we log the right-click commands
                            // garyfeng: logging the save command
                            var eNaepName = "DialogueShow";
                            var extendedInfo = {
                                "eventTime": getCurTime(),
                                "name": eNaepName,
                                "DialogueName": evt.data._.name,
                                "DialogueTab": evt.data._.currentTabId,
                                "Pos": evt.data._.position,
                                "size": evt.data._.contentSize,
                                "command": evt.data.name
                            };
                            //console.log(evt);
                            keystrokeManager.logit(eNaepName, extendedInfo);

                        });

            editor.on('dialogHide', function (evt) {
                // this is where we log the right-click commands
                // garyfeng: logging the save command
                var eNaepName = "DialogueHide";
                var extendedInfo = {
                     "eventTime": getCurTime(),
                    "name": eNaepName,
                    "DialogueName": evt.data._.name,
                    "command": evt.data.name
                };
                //console.log(evt);
                keystrokeManager.logit(eNaepName, extendedInfo);

            });
*/
            // garyfeng: modified menu plugin to fire "menuItemCommand" with
            // additional data "item". This is fired as RightClick_ events
            editor.on('menuItemCommand', function(evt) {
                // this is where we log the right-click commands
                //RonMorrill: special handling for spellcheck correction context menu items
                //var scaytSuggestPrefix = "scayt_suggest_";
                //if (evt.data.command.indexOf(scaytSuggestPrefix) === 0) {
                //    editor.fire("nhunspell.event", {
                //        //"command": evt.data.command,
                //        "event": "Misspellings_Corrected",
                //        "word": evt.data.command.slice(scaytSuggestPrefix.length)
                //    });
                //}
                //else {
                // garyfeng: logging the save command

                var eNaepName =
                    'RightClick_' + evt.data.command.capitalizeFirstLetter();
                var extendedInfo = {
                    //"eventTime": getCurTime(),
                    name: eNaepName,
                    command: evt.data.command
                        //"selectedText": selection2string(editor) || "",
                        //"menuId": evt.data.className
                };
                var sel = getSelectionInfo(keystrokeManager.editor);
                extendedInfo.selectedText = sel.textSelected || '';
                extendedInfo.startPos = sel.startPos;
                extendedInfo.endPos = sel.endPos;

                // SCAYT returns suggested corrections as a right-click context menu
                // then each word becomes a right-click action, like "RightClick_Scayt_suggest_motet"
                //if (evt.data.command.startsWith("scayt_suggest_")) {
                //    eNaepName = "Misspellings_Corrected";
                //    extendedInfo.name = eNaepName;
                //    extendedInfo.spellchecker = "SCAYT",
                //    extendedInfo.newWord = evt.data.command.substring("scayt_suggest_".length);
                //}

                // if (eventName2typeId(eNaepName) !== 999 && !logConfig.logEventVerbose) {
                //     extendedInfo = null;
                // }
                keystrokeManager.logit(eNaepName, extendedInfo);
                //}
            });

            // garyfeng: modified editmenu plugin to fire "editMenuCommand" with
            // additional data "item".
            //editor.on('editMenuCommand', function (evt) {
            // RonMorrill: added to distinguish the commands executed from the top menu
            editor.on('topMenuCommand', function(evt) {
                var eNaepName = 'Menu_' + evt.data.capitalizeFirstLetter();
                var extendedInfo = {
                    //"eventTime": getCurTime(),
                    name: eNaepName,
                    // jgrant: evt.data.command was throwing "undefined" error.
                    //"command": evt.data.command,
                    command: evt.data,
                    menuId: evt.data.className
                };
                var sel = getSelectionInfo(keystrokeManager.editor);
                extendedInfo.selectedText = sel.textSelected || '';
                extendedInfo.startPos = sel.startPos;
                extendedInfo.endPos = sel.endPos;

                if (eventName2typeId(eNaepName) !== 999 && !logConfig.logEventVerbose) {
                    extendedInfo = null;
                }

                // The Menu_Thesaurus and Menu_SpellCheck observable events are sent from the NHunspell plugin.
                // Sending it here would be sending the observables twice.
                if (eNaepName !== 'Menu_Thesaurus' && eNaepName !== 'Menu_Checkspell') {
                    keystrokeManager.logit(eNaepName, extendedInfo);
                }
            });

            /* RonMorrill: these are covered by the topMenuCommand handler above

        // garyfeng: modified formatmenu plugin to fire "formatMenuCommand" with
        // additional data "item".
        editor.on('formatMenuCommand', function (evt) {
            // this is where we log the right-click commands
            // garyfeng: logging the save command
            // jgrant: evt.data.command was throwing "undefined" error.
            //var eNaepName = "Menu_"+evt.data.command.capitalizeFirstLetter();

            // =================================================================
            //jgrant. if the event is "underline," change it to "underscore".
            var correct_name = "";
            if (evt.data == "underline") {
                correct_name = "underscore";
            }
            else {
                correct_name = evt.data;
            }
            //var eNaepName = "Menu_" + evt.data.capitalizeFirstLetter();
            var eNaepName = "Menu_" + correct_name.capitalizeFirstLetter();
            // =================================================================

            var extendedInfo = {
                "eventTime": getCurTime(),
                "name": eNaepName,
                // jgrant: evt.data.command was throwing "undefined" error.
                //"command": evt.data.command,
                "command": evt.data,
                "menuId": evt.data.className
            };
            var sel = getSelectionInfo(keystrokeManager.editor);
            extendedInfo.selectedText = sel.textSelected || "";
            extendedInfo.startPos = sel.startPos;
            extendedInfo.endPos = sel.endPos;

            keystrokeManager.logit(eNaepName, extendedInfo);

        });
*/
            /*
                  // garyfeng: WSC event handler
                  editor.on('spellchecker', function (evt) {
                      // this is where we log the WSC commands
                      // garyfeng: logging the save command
                      var eNaepName = "WSC_" + evt.data.command.capitalizeFirstLetter();
                      var extendedInfo = {
                          "eventTime": getCurTime(),
                          "name": eNaepName,
                          "command": evt.data.command,
                          "spellchecker": "WSC",
                          "data": evt.data.extInfo,
                      };
                      var sel = getSelectionInfo(keystrokeManager.editor);

                      // jgrant. check for no selection.
                      if (sel != undefined) {
                          extendedInfo.selectedText = sel.textSelected || "";
                          extendedInfo.startPos = sel.startPos;
                          extendedInfo.endPos = sel.endPos;
                      }

                      if (evt.data.command == "ChangeTo" || evt.data.command == "ChangeAll") {
                          // these have special eNAEP names
                          extendedInfo.mode = evt.data.extInfo.mode;
                          if (extendedInfo.mode == "thesaurus") {
                              eNaepName = "Thesaurus_Replacement";
                          } else {
                              eNaepName = "Misspellings_Corrected";
                          }
                          extendedInfo.name = eNaepName;
                          extendedInfo.newWord = evt.data.extInfo.new_word;

                          keystrokeManager.logit(eNaepName, extendedInfo);
                      } else if (evt.data.command == "sendData" || evt.data.command == "setText") {
                          // only log when in verbose mmode
                          if (logConfig.logWSCVerbose) keystrokeManager.logit(eNaepName, extendedInfo);
                      } else {
                          // logging the rest
                          keystrokeManager.logit(eNaepName, extendedInfo);
                      }


                  });

                  editor.on('spellchecker.button.click', function (evt) {
                      // this is where we log the WSC commands
                      // garyfeng: logging the save command
                      var eNaepName = evt.data.command == "thesaurus" ? "Button_Thesaurus" : "Button_SpellCheck";
                      var extendedInfo = {
                          "eventTime": getCurTime(),
                          "name": eNaepName,
                          "command": evt.data.command,
                          "text": evt.data.text
                      };
                      keystrokeManager.logit(eNaepName, extendedInfo);
                  });

                  // garyfeng: SCAYT event handler
                  // SCAYT raises several different events
                  editor.on('scaytButtonState', function (evt) {
                      var eNaepName = "SCAYT_stateChange";
                      var extendedInfo = {
                          "eventTime": getCurTime(),
                          "name": eNaepName,
                          "state": evt.data
                      };
                      if (logConfig.logWSCVerbose) keystrokeManager.logit(eNaepName, extendedInfo);
                  });

                  editor.on('startSpellCheck', function (evt) {
                      var eNaepName = "SCAYT_startSpellCheck";
                      var extendedInfo = {
                          "eventTime": getCurTime(),
                          "name": eNaepName
                      };
                      if (logConfig.logWSCVerbose) keystrokeManager.logit(eNaepName, extendedInfo);
                  });

                  // editor.on('SCAYT_contentDomReady', function(evt) {
                  //  var eNaepName = "SCAYT_contentDomReady";
                  //   var extendedInfo={
                  //     "eventTime": getCurTime(),
                  //     "name": eNaepName
                  //   };
                  //   keystrokeManager.logit(eNaepName, extendedInfo);
                  // });

                  // SCAYT plugin.js, line 860
                  // garyfeng added itemList to the event
                  editor.on('SCAYT_getSuggestionsList', function (evt) {
                      var eNaepName = "SCAYT_WordSuggestions";
                      // get the word list from the itemList object
                      var words = [];
                      for (w in evt.data.itemList) {
                          if (w != "no_scayt_suggest") {
                              words.push(w.substring("scayt_suggest_".length));
                          }
                      }
                      var extendedInfo = {
                          "eventTime": getCurTime(),
                          "name": eNaepName,
                          "word": evt.data.word,
                          "suggestions": words
                      };
                      keystrokeManager.logit(eNaepName, extendedInfo);
                  });
                  // in SCAYT options.js
                  editor.on('scaytDialogShown', function (evt) {
                      var eNaepName = "SCAYT_dialogShown";
                      var extendedInfo = {
                          "eventTime": getCurTime(),
                          "name": eNaepName,
                          "data": evt.data
                      };
                      keystrokeManager.logit(eNaepName, extendedInfo);
                  });
                  // in SCAYT options.js
                  editor.on('scaytUserDictionaryAction', function (evt) {
                      var eNaepName = "SCAYT_userDictionaryAction";
                      var extendedInfo = {
                          "eventTime": getCurTime(),
                          "name": eNaepName,
                          "data": evt.data
                      };
                      keystrokeManager.logit(eNaepName, extendedInfo);
                  });
                  */
            // end SCAYT
            /*
                              // garyfeng: modified button plugin to fire "uiButtonCommand" with
                              // additional data "definition" in the evt.data.
                              editor.on('uiButtonCommand', function (evt) {
                                  // this is where we log the right-click commands
                                  // garyfeng: logging the save command
                                  // jgrant: evt.data.command was throwing an "undefined" error.
                                  //var eNaepName = "Button_"+evt.data.command.capitalizeFirstLetter();

                                  // ==========================================================================
                                  // jgrant: If evt.data.name is "underline," replace it with "underscore."
                                  var correct_name = "";
                                  if (evt.data.name == "underline") {
                                      correct_name = "underscore";
                                  }
                                  else {
                                      correct_name = evt.data.name;
                                  }
                                  //var eNaepName = "Button_" + evt.data.name.capitalizeFirstLetter();
                                  var eNaepName = "Button_" + correct_name.capitalizeFirstLetter();
                                  // ==========================================================================

                                  var extendedInfo = {
                                      "eventTime": getCurTime(),
                                      "name": eNaepName,
                                      // jgrant: evt.data.command was throwing an "undefined" error.
                                      //"command": evt.data.command,
                                      "command": evt.data.name,
                                  };
                                  var sel = getSelectionInfo(keystrokeManager.editor);
                                  extendedInfo.selectedText = sel.textSelected || "";
                                  extendedInfo.startPos = sel.startPos;
                                  extendedInfo.endPos = sel.endPos;

                                  keystrokeManager.logit(eNaepName, extendedInfo);
                              });
                  */
            // garyfeng: modified button plugin to fire "uiButtonCommand" with
            // additional data "definition" in the evt.data.
            editor.on('uiButtonCommand', function(evt) {
                // this is where we log the right-click commands
                // garyfeng: logging the save command
                var eNaepName = 'Button_' + evt.data.command.capitalizeFirstLetter();
                var extendedInfo = {
                    //"eventTime": getCurTime(),
                    name: eNaepName,
                    command: evt.data.command
                        //"selectedText": selection2string(editor) || ""
                };
                var sel = getSelectionInfo(keystrokeManager.editor);
                extendedInfo.selectedText = sel.textSelected || '';
                extendedInfo.startPos = sel.startPos;
                extendedInfo.endPos = sel.endPos;

                if (eventName2typeId(eNaepName) !== 999 && !logConfig.logEventVerbose) {
                    extendedInfo = null;
                }

                // The Button_Thesaurus and Button_SpellCheck observable events are sent from the NHunspell plugin.
                // Sending them here would be sending the observables twice.
                if (
                    eNaepName !== 'Button_Thesaurus' &&
                    eNaepName !== 'Button_Checkspell'
                ) {
                    keystrokeManager.logit(eNaepName, extendedInfo);
                }
            });

            // RonMorrill: added handler
            editor.on('nhunspell.event', function(evt) {
                var eNaepName = '';
                var extendedInfo = {};
                switch (evt.data.event) {
                    case 'buttonClick':
                        eNaepName = 'Button_' + evt.data.command.capitalizeFirstLetter();
                        extendedInfo = {
                            //"eventTime": getCurTime(),
                            name: eNaepName,
                            command: evt.data.command
                                //"text": evt.data.text || ""
                        };
                        break;
                        // These happen inside the spellchecker or thesaurus dialogs
                    case 'spellcheckerButtonClick':
                        eNaepName =
                            'Button_Spellchecker_' + evt.data.command.capitalizeFirstLetter();
                        extendedInfo = {
                            //"eventTime": getCurTime(),
                            name: eNaepName,
                            command: evt.data.command
                                //"text": evt.data.text || ""
                        };
                        break;
                    case 'RightClick_Misspellings':
                        eNaepName = evt.data.event;
                        extendedInfo = {
                            //"eventTime": getCurTime(),
                            name: eNaepName,
                            word: evt.data.word || '',
                            itemList: evt.data.itemList
                        };
                        break;
                    case 'Misspellings_Corrected':
                    case 'Thesaurus_Replacement':
                        eNaepName = evt.data.event;
                        extendedInfo = {
                            //"eventTime": getCurTime(),
                            name: eNaepName,
                            command: evt.data.command,
                            newWord: evt.data.newWord || ''
                        };
                        break;
                        // 20160830: handling 'Misspellings_Identified' in default case
                        //case "Misspellings_Identified":
                        //    eNaepName = evt.data.event;
                        //    extendedInfo = {
                        //        //"eventTime": getCurTime(),
                        //        "name": eNaepName,
                        //        "word": evt.data.word || "",
                        //        "itemList": evt.data.itemList
                        //    };
                        //    break;
                    case 'thesaurusSuggestions':
                        eNaepName = evt.data.event;
                        extendedInfo = {
                            //"eventTime": getCurTime(),
                            name: eNaepName,
                            //"command": evt.data.command || "",
                            word: evt.data.word || '',
                            origCategory: evt.data.origCategory,
                            itemList: evt.data.itemList
                        };
                        break;
                    case 'SpellcheckOptions_Saved':
                        eNaepName = evt.data.event;
                        extendedInfo = {
                            //"eventTime": getCurTime(),
                            name: eNaepName,
                            options: evt.data.options
                        };
                        break;
                    default:
                        var MappedObservableId = eventName2typeIdTable[evt.data.event];
                        if (
                            MappedObservableId !== undefined &&
                            !isNaN(MappedObservableId)
                        ) {
                            eNaepName = evt.data.event;
                            if (evt.data.payload) {
                                extendedInfo = evt.data.payload;
                            } else {
                                extendedInfo = null;
                            }
                        }
                        break;
                }
                var sel = getSelectionInfo(keystrokeManager.editor);
                if (sel && extendedInfo) {
                    if (evt.data && evt.data.captureCharacterPosition) {
                        if (extendedInfo.targetWord === '' && sel.textSelected === '') {
                            extendedInfo.characterPosition = '';
                        } else {
                            extendedInfo.characterPosition = sel.startPos;
                        }
                    } else {
                        extendedInfo.selectedText = sel.textSelected || '';
                        extendedInfo.startPos = sel.startPos;
                        extendedInfo.endPos = sel.endPos;
                    }
                }

                keystrokeManager.logit(eNaepName, extendedInfo);
            });

            // garyfeng: these are for external plug-ins to initiate changes
            // Save snapshots before doing custom changes.
            editor.on('saveSnapshot', function(evt) {
                // garyfeng: logging the save command
                //var extendedInfo = {
                //	//"eventTime": getCurTime(),
                //	// "editor": editor.element.getId(),
                //	"name": evt.name,
                //	"senderType": evt.sender.constructor,
                //	"senderID": evt.sender.id,
                //	"senderName": evt.sender.name
                //}
                //keystrokeManager.logit("ONSAVESNAPSHOT", extendedInfo);
                //keystrokeManager.logdiff();
                // end gary feng

                keystrokeManager.save(evt.data && evt.data.contentOnly);
            });

            // garyfeng: 2016-05: to unlink keystrokeManager and undoManager
            // we need to trigger saveSnapshot per 'type' event, but in
            // undoManager we keep the default behavior of 25 keystrokes.
            // Save snapshots before doing custom changes.
            editor.on('saveKeystrokeSnapshot', function(evt) {
                // garyfeng: logging the save command
                var extendedInfo = {
                    //"eventTime": getCurTime(),
                    // "editor": editor.element.getId(),
                    name: evt.name,
                    senderType: evt.sender.constructor,
                    senderID: evt.sender.id,
                    senderName: evt.sender.name
                };
                //keystrokeManager.logit("ONSAVESNAPSHOT", extendedInfo);
                //keystrokeManager.logdiff();
                // end gary feng

                keystrokeManager.save(evt.data && evt.data.contentOnly);
            });

            // garyfeng: not sure what this does.
            // Event manager listeners should be attached on contentDom.
            editor.on('contentDom', editingHandler.attachListeners, editingHandler);

            editor.on('instanceReady', function() {
                // garyfeng: logging the save command
                // keystrokeManager.logit("ONEDITORINSTANCEREADY");
                // end gary feng

                // Saves initial snapshot.
                editor.fire('saveSnapshot');
            });

            // Always save an undo snapshot - the previous mode might have
            // changed editor contents.
            editor.on('beforeModeUnload', function() {
                editor.mode === 'wysiwyg' && keystrokeManager.save(true);
                // garyfeng: logging the save command
                // keystrokeManager.logit("ONBEFOREMODEUNLOAD");
                // end gary feng
            });

            /**
             * Amends the top of the undo stack (last undo image) with the current DOM changes.
             *
             *		function() {
             *			editor.fire( 'saveSnapshot' );
             *			editor.document.body.append(...);
             *			// Makes new changes following the last undo snapshot a part of it.
             *			editor.fire( 'updateSnapshot' );
             *			..
             *		}
             *
             * @event updateSnapshot
             * @member CKEDITOR.editor
             * @param {CKEDITOR.editor} editor This editor instance.
             */
            editor.on('updateSnapshot', function() {
                if (keystrokeManager.currentImage) keystrokeManager.update();
                // garyfeng: logging the save command
                keystrokeManager.logit('ONUPDATESNAPSHOT');
                // end gary feng
            });

            /**
             * Locks the undo manager to prevent any save/update operations.
             *
             * It is convenient to lock the undo manager before performing DOM operations
             * that should not be recored (e.g. auto paragraphing).
             *
             * See {@link CKEDITOR.plugins.keystrokelog.KeystrokeManager#lock} for more details.
             *
             * **Note:** In order to unlock the undo manager, {@link #unlockSnapshot} has to be fired
             * the same number of times that `lockSnapshot` has been fired.
             *
             * @since 4.0
             * @event lockSnapshot
             * @member CKEDITOR.editor
             * @param {CKEDITOR.editor} editor This editor instance.
             * @param data
             * @param {Boolean} [data.dontUpdate] When set to `true`, the last snapshot will not be updated
             * with the current content and selection. Read more in the {@link CKEDITOR.plugins.keystrokelog.KeystrokeManager#lock} method.
             * @param {Boolean} [data.forceUpdate] When set to `true`, the last snapshot will always be updated
             * with the current content and selection. Read more in the {@link CKEDITOR.plugins.keystrokelog.KeystrokeManager#lock} method.
             */
            editor.on('lockSnapshot', function(evt) {
                var data = evt.data;
                keystrokeManager.lock(
                    data && data.dontUpdate,
                    data && data.forceUpdate
                );
            });

            /**
             * Unlocks the undo manager and updates the latest snapshot.
             *
             * @since 4.0
             * @event unlockSnapshot
             * @member CKEDITOR.editor
             * @param {CKEDITOR.editor} editor This editor instance.
             */
            editor.on('unlockSnapshot', keystrokeManager.unlock, keystrokeManager);

            ///////////////////////
            // garyfeng: tracking additional events
            ///////////////////////
            // core\editor.js and editor_basic.js: editing events
            //editor.on('insertHtml', function (evt) {
            //    //keystrokeManager.logit("ONEDITORINSERTHTML", evt.data);
            //});

            //editor.on('insertText', function (evt) {
            //    //keystrokeManager.logit("ONEDITORINSERTTEXT", evt.data);
            //});

            //editor.on('insertElement', function (evt) {
            //    //keystrokeManager.logit("ONEDITORINSERTELEMENT", evt.data);
            //});

            //editor.on('selectionChange', function (evt) {
            //    //keystrokeManager.logit("ONEDITORSELECTIONCHANGE");
            //    // console.log(evt.data); // which contains selection and path objs
            //    // see core/selections.js
            //});
            //// some events are capitalized and some not
            //editor.on('selectionchange', function (evt) {
            //    //keystrokeManager.logit("ONEDITORSELECTIONCHANGE");
            //    // console.log(evt.data); // which contains selection and path objs
            //    // see core/selections.js
            //});

            // editor gets focus
            editor.on('focus', function(evt) {
                keystrokeManager.logit('Receive_Focus'); // "eventTime": getCurTime() });
            });
            // editor de-focused
            editor.on('blur', function(evt) {
                keystrokeManager.logit('Lose_Focus'); // "eventTime": getCurTime() });
            });

            ////////////
            // Clipboard Plugin: paste and cut events
            // editor beforepaste
            //editor.on('beforepaste', function (evt) {
            //    //keystrokeManager.logit("ONEDITORBEFOREPASTE");
            //});
            //// editor pasteDialog
            //editor.on('pasteDialog', function (evt) {
            //    //keystrokeManager.logit("ONEDITORPASTEDIALOG");
            //});
            //// editor paste
            //editor.on('paste', function (evt) {
            //    //keystrokeManager.logit("ONEDITORPASTE");
            //});
            //// editor afterpaste
            //editor.on('afterPaste', function (evt) {
            //    //keystrokeManager.logit("ONEDITORAFTERPASTE");
            //});

            ///////////////////////
            // editor events
            ///////////////////////
        }
    });

    CKEDITOR.plugins.keystrokelog = {};

    /**
     * Main logic for the keystroke log functions.
     *
     * @private
     * @class CKEDITOR.plugins.keystrokelog.KeystrokeManager
     * @constructor Creates an KeystrokeManager class instance.
     * @param {CKEDITOR.editor} editor
     */
    var KeystrokeManager = (CKEDITOR.plugins.keystrokelog.KeystrokeManager = function(
        editor
    ) {
        /**
         * An array storing the number of key presses, count in a row. Use {@link #keyGroups} members as index.
         *
         * **Note:** The keystroke count will be reset after reaching the limit of characters per snapshot.
         *
         * @since 4.4.4
         */
        this.strokesRecorded = [0, 0];

        /**
         * When the `locked` property is not `null`, the undo manager is locked, so
         * operations like `save` or `update` are forbidden.
         *
         * The manager can be locked and unlocked by the {@link #lock} and {@link #unlock}
         * methods, respectively.
         *
         * @readonly
         * @property {Object} [locked=null]
         */
        this.locked = null;

        /**
         * Contains the previously processed key group, based on {@link #keyGroups}.
         * `-1` means an unknown group.
         *
         * @since 4.4.4
         * @readonly
         * @property {Number} [previousKeyGroup=-1]
         */
        this.previousKeyGroup = -1;

        /**
         * The maximum number of snapshots in the stack. Configurable via {@link CKEDITOR.config#undoStackSize}.
         *
         * @readonly
         * @property {Number} [limit]
         */
        this.limit = editor.config.undoStackSize || 50;

        /**
         * The maximum number of characters typed/deleted in one undo step.
         *
         * @since 4.4.5
         * @readonly
         */
        // garyfeng: change this from 25 to 1.
        this.strokesLimit = 25;

        this.editor = editor;

        // Reset the undo stack.
        this.reset();
    });

    KeystrokeManager.prototype = {
        /**
         * Handles logging of content changes.
         * garyfeng: v01. Simply console.log()
         * garyfeng: v02. Using eventlogging if 'log' exits; or else use console.log
         *
         * @param {Number} evt A one-word keyword to be printed as plain text.
         * @param {Object} [extendedInfo] Optional extendedInfo to be serialized using JSON.stringifyOnce
         * behave as if the strokes limit was exceeded regardless of the {@link #strokesRecorded} value.
         */

        // jgrant. Returns size of object in bytes.
        getObjSize: function(obj) {
            // Taken from: http://www.russwurm.com/uncategorized/calculate-memory-size-of-javascript-object/
            var objectList = [];
            var recurse = function(value) {
                var bytes = 0;
                if (typeof value === 'boolean') {
                    bytes = 4;
                } else if (typeof value === 'string') {
                    bytes = value.length * 2;
                } else if (typeof value === 'number') {
                    bytes = 8;
                } else if (
                    typeof value === 'object' &&
                    objectList.indexOf(value) === -1
                ) {
                    objectList[objectList.length] = value;
                    for (var i in value) {
                        bytes += 8; // assumed existence overhead
                        bytes += recurse(value[i]);
                    }
                }
                return bytes;
            };
            return recurse(obj);
        },
        // jgrant. Returns size of array in KB.
        getSizeOf: function(arr) {
            // Gets size of array and returns value in KB.
            var totalSize = 0;
            // Loop through all objects in the array.
            for (var i = 0; i < arr.length; i++) {
                var obj = arr[i];
                totalSize += this.getObjSize(obj);
            }
            return totalSize / 1024;
        },

/*-----  No longer needed as component model events are being used.
        // jgrant. Sends event data to eNaep.
        sendEventData: function() {
            if (typeof gObsEvents == 'undefined') return; // make sure the global is there
            // Do we see the enape API?
            if (typeof enaep !== 'undefined' && gObsEvents.length > 0) {
                // Pass a copy of the array.
                var gObsEventsCopy = gObsEvents;
                //enaep.observableEvent(gObsEventsCopy);
                CKEDITOR.enaepObservableEvent(gObsEventsCopy);
                //gObsEventsCopy = [];
                // TODO: Determine if send was successful before resetting the original array.
                gObsEvents = [];
            }
        },
--------------------------------------------*/

        logit: function(evt, extendedInfo) {
            var logEntry = {
                    timestamp: getCurTime(),
                    controlId: this.editor.element.getId(),
                    eventType: evt,
                    extInfo: {}
                },
                xmlPairs = [];

            if (logConfig['formatUsingXML']) {
                // using XML coding
                if (extendedInfo && typeof extendedInfo !== 'string') {
                    // extendedInfo exists, now convert to the XML spec

                    for (var key in extendedInfo) {
                        var attrName = key;
                        var attrValue = JSON.stringifyOnce(extendedInfo[key]).encodeHTML();
                        // get rid of the quotation marks at the begining and end
                        attrValue = attrValue.replace(/^&quot;|&quot;$/g, '');
                        // TODO: assuming a flat structure, e.g., no arrays, etc.
                        xmlPairs.push({
                            key: attrName,
                            value: typeof attrValue == 'string' ? attrValue : cdataWrap(attrValue)
                        });
                    }
                    // extInfo in the xmlPairs structure
                    // for json2xml, "array":[xxx] will turn
                    // into <array></array> for each element, which is why we have
                    // extInfo and then pair, whic turns into <pair>...</pair> for
                    // each element in the list.
                    logEntry.extInfo.pair = xmlPairs;
                    logEntry.pair = xmlPairs;
                }

                // adding <observableDatum>
                // TODO: beautify using https://github.com/vkiryukhin/vkBeautify
                logMessage(json2xml({ observableDatum: logEntry }) + '\n');
            }

            if (logConfig['formatUsingJSON']) {
                // using JSON
                if (extendedInfo) {
                    logEntry.extInfo = extendedInfo;
                }
                // log, to end with "," for making JSON
                logMessage(JSON.stringifyOnce(logEntry) + ',');
            }

            // eNaepAPI
            // enaep.observableEvent =
            //  function (typeId, blockId, itemId, studentId, eventTime, extendedInfo)
            if (logConfig['eNaepAPI']) {
                // using escaped JSON string
                if (extendedInfo && typeof extendedInfo !== 'string') {
                    logEntry.extInfo = JSON.stringifyOnce(extendedInfo);
                    //consoleDebuging(logEntry.extInfo);
                } else {
                    // no extendedInfo
                    logEntry.extInfo = extendedInfo || null;
                }

                // convert eventName to typeId; get 999 if fails
                var typeId = eventName2typeId(evt);
                // Create object containing event data.
                var oe = {
                    type: typeId,
                    name: evt,
                    time: logEntry.timestamp,
                    extInfo: logEntry.extInfo,
                    pair: logEntry.pair
                };
                this.editor.fire("enaepObservableEvent", oe);

/*-----  No longer needed as component model events are being used.
                // RonMorrill: Changed to ALWAYS add the event to the array. Otherwise the event that pushes the array over the limit will not get logged.
                gObsEvents.push(oe);
                If the event array has reached the configured limit, send the data.
                if (this.getSizeOf(gObsEvents) >= logConfig.eNaepEventSizeLimit) {
                    this.sendEventData();
                }
--------------------------------------------*/

            }
        },
        /**
         * Calculate keyTravelTime.
         * 	garyfeng: v01.
         *
         * @param {Number} keyCode The key code.
         * @param {Boolean} [strokesPerSnapshotExceeded] When set to `true`, the method will
         * behave as if the strokes limit was exceeded regardless of the {@link #strokesRecorded} value.
         */
        getKeyTravelTime: function(keycode) {
            // onKeyDown will set the t0 in an array keydownTime[keycode]
            // onKeyUp will then call this to calculate the travel time
            // currTime-keydownTime[keycode]
            // and clear the keydownTime[keycode]
        },

        logKeyTravelTime: function() {
            // function to log travel time
        },

        logKeystroke: function() {
            // function to log keystroke
        },

        logEditingEvents: function() {
            // function to log editing events
        },

        logdiff: function() {
            // function to log text diffs
            var editor = this.editor,
                image = this.currentImage;
            // this is a fake, use the content of the current Image
            if (!image) return false;
            // Do nothing if it was not possible to retrieve an image.
            if (image.contents === false) return false;

            // garyfeng: only log if there is something different
            if (!this.snapshots.length)
            // no snapshot, nothing to diff
                return false;

            if (this.snapshots.length < 2)
            // no snapshot, nothing to diff
                return false;

            var snapshots = this.snapshots,
                thisImage = snapshots[snapshots.length - 1],
                lastImage = snapshots[snapshots.length - 2];

            if (lastImage.equalsContent(thisImage)) {
                // content is the same, no diff
                // console.log("lastImage.equalsContent( thisImage )");
                return false;
            }

            // RonMorrill: this can happen if you click the spellchecker button but the cursor has not been placed yet
            if (!thisImage.bookmarks || thisImage.bookmarks.length === 0) {
                return false;
            }

            // garyfeng: logging

            // clean up the selection;
            // only report the first selection; haven't seen cases of multiple selections
            // drop the "normal", "iscollapsed", and 'is2' properties
            // insert the "text" property
            // {"start":[1,0,0],"end":[1,1,0],"startOffset":8,"endOffset":3
            // var sel={};
            // sel.start = thisImage.bookmarks[0].start;
            // sel.startOffset = thisImage.bookmarks[0].startOffset;
            // sel.end = thisImage.bookmarks[0].end;
            // sel.endOffset = thisImage.bookmarks[0].endOffset;
            // sel.text = selection2string(editor)||"";
            // sel.collapsed = thisImage.bookmarks[0].collapsed;
            var sel = getSelectionInfo(editor);

            var curTexts = html2text(thisImage.contents);
            var prevTexts = html2text(lastImage.contents);
            var diffs = '';
            // return if texts are the same
            if (curTexts != prevTexts) {
                diffs = textDiff(prevTexts, curTexts);
            } else {
                // same text, then there must be a markup difference
                // need to find out which markup changes to record
                // var htmlDiffs = textDiff(lastImage.contents, thisImage.contents);
                // but this is done in trigging events
                return false;
            }

            var eNaepName = 'text.change';
            var extendedInfo = {
                //"eventTime": getCurTime(),
                name: eNaepName,
                // could have used CKEDITOR.instances.editor1.id, which gives an internal id
                //"editor": editor.element.getId(), // use the element ID rather than the editorId
                //"contents": thisImage.contents,
                //"texts": curTexts,
                textDiff: diffs,
                //"htmlDiff": htmlDiffs,
                selection: sel
            };
            // if we need snapshots of the HTML and text content in the editor
            if (logConfig.logKeyVerbose) {
                extendedInfo.html = thisImage.contents;
                extendedInfo.text = curTexts;
            }
            // logging
            this.logit(eNaepName, extendedInfo);
            return true;
        },

        /**
         * Handles keystroke support for the undo manager. It is called on `keyup` event for
         * keystrokes that can change the editor content.
         *
         * @param {Number} keyCode The key code.
         * @param {Boolean} [strokesPerSnapshotExceeded] When set to `true`, the method will
         * behave as if the strokes limit was exceeded regardless of the {@link #strokesRecorded} value.
         */
        type: function(keyCode, strokesPerSnapshotExceeded) {
            // garyfeng: either FUNCTIONAL or PRINTABLE
            var keyGroup = KeystrokeManager.getKeyGroup(keyCode),
                // Count of keystrokes in current a row.
                // Note if strokesPerSnapshotExceeded will be exceeded, it'll be restarted.
                strokesRecorded = this.strokesRecorded[keyGroup] + 1;

            strokesPerSnapshotExceeded =
                strokesPerSnapshotExceeded || strokesRecorded >= this.strokesLimit;

            if (!this.typing) onTypingStart(this);

            // garyfeng: 2016-05
            this.editor.fire('saveKeystrokeSnapshot');

            //garyfeng:  a 'change' or 'saveSnapshot' event will be fired at keyup
            if (strokesPerSnapshotExceeded) {
                // Reset the count of strokes, so it'll be later assigned to this.strokesRecorded.
                strokesRecorded = 0;
                this.editor.fire('saveSnapshot');
            } else {
                // Fire change event.
                this.editor.fire('change');
            }

            // garyfeng:
            // var extendedInfo={
            //   "eventTime":getCurTime(),
            //   // "editor": editor.element.getId(),
            //   "keycode":keyCode,
            //   "keyGroup":keyGroup
            // }
            //this.logit("TYPE", extendedInfo)

            // Store recorded strokes count.
            this.strokesRecorded[keyGroup] = strokesRecorded;
            // This prop will tell in next itaration what kind of group was processed previously.
            this.previousKeyGroup = keyGroup;
        },

        /**
         * Whether the new `keyCode` belongs to a different group than the previous one ({@link #previousKeyGroup}).
         *
         * @since 4.4.5
         * @param {Number} keyCode
         * @returns {Boolean}
         */
        keyGroupChanged: function(keyCode) {
            return KeystrokeManager.getKeyGroup(keyCode) != this.previousKeyGroup;
        },

        /**
         * Resets the undo stack.
         */
        reset: function() {
            // Stack for all the undo and redo snapshots, they're always created/removed
            // in consistency.
            this.snapshots = [];

            // Current snapshot history index.
            this.index = -1;

            this.currentImage = null;

            this.hasUndo = false;
            this.hasRedo = false;
            this.locked = null;

            this.resetType();
        },

        /**
         * Resets all typing variables.
         *
         * @see #type
         */
        resetType: function() {
            this.strokesRecorded = [0, 0];
            this.typing = false;
            this.previousKeyGroup = -1;
        },

        /**
         * Refreshes the state of the {@link CKEDITOR.plugins.keystrokelog.KeystrokeManager undo manager}
         * as well as the state of the `undo` and `redo` commands.
         */
        refreshState: function() {
            // These lines can be handled within onChange() too.
            this.hasUndo = !!this.getNextImage(true);
            this.hasRedo = !!this.getNextImage(false);
            // Reset typing
            this.resetType();
        },

        /**
         * Saves a snapshot of the document image for later retrieval.
         *
         * @param {Boolean} onContentOnly If set to `true`, the snapshot will be saved only if the content has changed.
         * @param {CKEDITOR.plugins.keystrokelog.Image} image An optional image to save. If skipped, current editor will be used.
         * @param {Boolean} [autoFireChange=true] If set to `false`, will not trigger the {@link CKEDITOR.editor#change} event to editor.
         */
        save: function(onContentOnly, image, autoFireChange) {
            var editor = this.editor;
            // Do not change snapshots stack when locked, editor is not ready,
            // editable is not ready or when editor is in mode difference than 'wysiwyg'.
            if (this.locked || editor.status != 'ready' || editor.mode != 'wysiwyg')
                return false;

            var editable = editor.editable();
            if (!editable || editable.status != 'ready') return false;

            var snapshots = this.snapshots;

            // Get a content image.
            if (!image) image = new Image(editor);

            // Do nothing if it was not possible to retrieve an image.
            //if (image.contents === false)
            if (!image.contents) return false;

            // Check if this is a duplicate. In such case, do nothing.
            if (this.currentImage) {
                if (image.equalsContent(this.currentImage)) {
                    // garyfeng
                    //console.log("@@@ image.equalsContent( this.currentImage )");
                    if (onContentOnly) return false;

                    if (image.equalsSelection(this.currentImage)) return false;
                } else if (autoFireChange !== false) {
                    editor.fire('change');
                }
            }

            // Drop future snapshots.
            snapshots.splice(this.index + 1, snapshots.length - this.index - 1);

            // If we have reached the limit, remove the oldest one.
            if (snapshots.length == this.limit) snapshots.shift();

            // Add the new image, updating the current index.
            this.index = snapshots.push(image) - 1;

            this.currentImage = image;

            if (autoFireChange !== false) this.refreshState();

            // garyfeng: logging the save command
            // var extendedInfo={
            //   "eventTime": getCurTime(),
            //   // "editor": editor.element.getId(),
            // 	"onContentOnly": onContentOnly,
            // 	"autoFireChange": autoFireChange,
            // 	"contents": image.contents,
            // 	"selections": image.bookmarks,
            //   "snapshotCount": snapshots.length
            // }
            // this.logit("SAVE", extendedInfo);
            this.logdiff();
            // end gary feng

            return true;
        },

        /**
         * Sets editor content/selection to the one stored in `image`.
         *
         * @param {CKEDITOR.plugins.keystrokelog.Image} image
         */
        restoreImage: function(image) {
            // Bring editor focused to restore selection.
            var editor = this.editor,
                sel;

            if (image.bookmarks) {
                editor.focus();
                // Retrieve the selection beforehand. (#8324)
                sel = editor.getSelection();
            }

            // Start transaction - do not allow any mutations to the
            // snapshots stack done when selecting bookmarks (much probably
            // by selectionChange listener).
            this.locked = { level: 999 };

            this.editor.loadSnapshot(image.contents);

            if (image.bookmarks) sel.selectBookmarks(image.bookmarks);
            else if (CKEDITOR.env.ie) {
                // IE BUG: If I don't set the selection to *somewhere* after setting
                // document contents, then IE would create an empty paragraph at the bottom
                // the next time the document is modified.
                var $range = this.editor.document.getBody().$.createTextRange();
                $range.collapse(true);
                $range.select();
            }

            this.locked = null;

            this.index = image.index;
            this.currentImage = this.snapshots[this.index];

            // Update current image with the actual editor
            // content, since actualy content may differ from
            // the original snapshot due to dom change. (#4622)
            this.update();
            this.refreshState();

            // garyfeng: log it
            //this.logit("RESTOREIMAGE", this.currentImage);
            // end garyfeng

            editor.fire('change');
        },

        /**
         * Gets the closest available image.
         *
         * @param {Boolean} isUndo If `true`, it will return the previous image.
         * @returns {CKEDITOR.plugins.keystrokelog.Image} Next image or `null`.
         */
        getNextImage: function(isUndo) {
            var snapshots = this.snapshots,
                currentImage = this.currentImage,
                image,
                i;

            // garyfeng: log it
            // this.logit("GETNEXTIMAGE");
            // end garyfeng

            if (currentImage) {
                if (isUndo) {
                    for (i = this.index - 1; i >= 0; i--) {
                        image = snapshots[i];
                        if (!currentImage.equalsContent(image)) {
                            image.index = i;
                            return image;
                        }
                    }
                } else {
                    for (i = this.index + 1; i < snapshots.length; i++) {
                        image = snapshots[i];
                        if (!currentImage.equalsContent(image)) {
                            image.index = i;
                            return image;
                        }
                    }
                }
            }

            return null;
        },

        /**
         * Updates the last snapshot of the undo stack with the current editor content.
         *
         * @param {CKEDITOR.plugins.keystrokelog.Image} [newImage] The image which will replace the current one.
         * If it is not set, it defaults to the image taken from the editor.
         */
        update: function(newImage) {
            // garyfeng: log it
            //this.logit("UPDATE", newImage);
            // end garyfeng

            // Do not change snapshots stack is locked.
            if (this.locked) return;

            if (!newImage) newImage = new Image(this.editor);

            var i = this.index,
                snapshots = this.snapshots;

            // Find all previous snapshots made for the same content (which differ
            // only by selection) and replace all of them with the current image.
            while (i > 0 && this.currentImage.equalsContent(snapshots[i - 1])) i -= 1;

            snapshots.splice(i, this.index - i + 1, newImage);
            this.index = i;
            this.currentImage = newImage;
        },

        /**
         * Amends the last snapshot and changes its selection (only in case when content
         * is equal between these two).
         *
         * @since 4.4.4
         * @param {CKEDITOR.plugins.keystrokelog.Image} newSnapshot New snapshot with new selection.
         * @returns {Boolean} Returns `true` if selection was amended.
         */
        updateSelection: function(newSnapshot) {
            // garyfeng & jGrant
            var eNaepName = 'UPDATESELECTION';
            var extendedInfo = {
                //"eventTime": getCurTime(),
                name: eNaepName,
                selection: getSelectionInfo(this.editor)
            };

            if (logConfig.logSelectionChanges) {
                this.logit(eNaepName, extendedInfo);
            }
            // end garyfeng

            if (!this.snapshots.length) return false;

            var snapshots = this.snapshots,
                lastImage = snapshots[snapshots.length - 1];

            if (lastImage.equalsContent(newSnapshot)) {
                if (!lastImage.equalsSelection(newSnapshot)) {
                    snapshots[snapshots.length - 1] = newSnapshot;
                    this.currentImage = newSnapshot;
                    return true;
                }
            }

            return false;
        },

        /**
         * Locks the snapshot stack to prevent any save/update operations and when necessary,
         * updates the tip of the snapshot stack with the DOM changes introduced during the
         * locked period, after the {@link #unlock} method is called.
         *
         * It is mainly used to ensure any DOM operations that should not be recorded
         * (e.g. auto paragraphing) are not added to the stack.
         *
         * **Note:** For every `lock` call you must call {@link #unlock} once to unlock the undo manager.
         *
         * @since 4.0
         * @param {Boolean} [dontUpdate] When set to `true`, the last snapshot will not be updated
         * with current content and selection. By default, if undo manager was up to date when the lock started,
         * the last snapshot will be updated to the current state when unlocking. This means that all changes
         * done during the lock will be merged into the previous snapshot or the next one. Use this option to gain
         * more control over this behavior. For example, it is possible to group changes done during the lock into
         * a separate snapshot.
         * @param {Boolean} [forceUpdate] When set to `true`, the last snapshot will always be updated with the
         * current content and selection regardless of the current state of the undo manager.
         * When not set, the last snapshot will be updated only if the undo manager was up to date when locking.
         * Additionally, this option makes it possible to lock the snapshot when the editor is not in the `wysiwyg` mode,
         * because when it is passed, the snapshots will not need to be compared.
         */
        lock: function(dontUpdate, forceUpdate) {
            // garyfeng: log it
            // this.logit("LOCK");
            // end garyfeng

            if (!this.locked) {
                if (dontUpdate) this.locked = { level: 1 };
                else {
                    var update = null;

                    if (forceUpdate) update = true;
                    else {
                        // Make a contents image. Don't include bookmarks, because:
                        // * we don't compare them,
                        // * there's a chance that DOM has been changed since
                        // locked (e.g. fake) selection was made, so createBookmark2 could fail.
                        // http://dev.ckeditor.com/ticket/11027#comment:3
                        var imageBefore = new Image(this.editor, true);

                        // If current editor content matches the tip of snapshot stack,
                        // the stack tip must be updated by unlock, to include any changes made
                        // during this period.
                        if (
                            this.currentImage &&
                            this.currentImage.equalsContent(imageBefore)
                        )
                            update = imageBefore;
                    }

                    this.locked = { update: update, level: 1 };
                }

                // Increase the level of lock.
            } else {
                this.locked.level++;
            }
        },

        /**
         * Unlocks the snapshot stack and checks to amend the last snapshot.
         *
         * See {@link #lock} for more details.
         *
         * @since 4.0
         */
        unlock: function() {
            // garyfeng: log it
            // this.logit("UNLOCK");
            // end garyfeng

            if (this.locked) {
                // Decrease level of lock and check if equals 0, what means that undoM is completely unlocked.
                if (!--this.locked.level) {
                    var update = this.locked.update;

                    this.locked = null;

                    // forceUpdate was passed to lock().
                    if (update === true) this.update();
                    else if (update) {
                        // update is instance of Image.
                        var newImage = new Image(this.editor, true);

                        if (!update.equalsContent(newImage)) this.update();
                    }
                }
            }
        }
    };

    /**
     * Codes for navigation keys like *Arrows*, *Page Up/Down*, etc.
     * Used by the {@link #isNavigationKey} method.
     *
     * @since 4.4.5
     * @readonly
     * @static
     */
    KeystrokeManager.navigationKeyCodes = {
        37: 1,
        38: 1,
        39: 1,
        40: 1, // Arrows.
        36: 1,
        35: 1, // Home, End.
        33: 1,
        34: 1 // PgUp, PgDn.
    };

    /**
     * Key groups identifier mapping. Used for accessing members in
     * {@link #strokesRecorded}.
     *
     * * `FUNCTIONAL` &ndash; identifier for the *Backspace* / *Delete* key.
     * * `PRINTABLE` &ndash; identifier for printable keys.
     *
     * Example usage:
     *
     *		keystrokeManager.strokesRecorded[ keystrokeManager.keyGroups.FUNCTIONAL ];
     *
     * @since 4.4.5
     * @readonly
     * @static
     */
    KeystrokeManager.keyGroups = {
        PRINTABLE: 0,
        FUNCTIONAL: 1
    };

    /**
     * Checks whether a key is one of navigation keys (*Arrows*, *Page Up/Down*, etc.).
     * See also the {@link #navigationKeyCodes} property.
     *
     * @since 4.4.5
     * @static
     * @param {Number} keyCode
     * @returns {Boolean}
     */
    KeystrokeManager.isNavigationKey = function(keyCode) {
        return !!KeystrokeManager.navigationKeyCodes[keyCode];
    };

    /**
     * Returns the group to which the passed `keyCode` belongs.
     *
     * @since 4.4.5
     * @static
     * @param {Number} keyCode
     * @returns {Number}
     */
    KeystrokeManager.getKeyGroup = function(keyCode) {
        var keyGroups = KeystrokeManager.keyGroups;

        return backspaceOrDelete[keyCode] ?
            keyGroups.FUNCTIONAL :
            keyGroups.PRINTABLE;
    };

    /**
     * @since 4.4.5
     * @static
     * @param {Number} keyGroup
     * @returns {Number}
     */
    KeystrokeManager.getOppositeKeyGroup = function(keyGroup) {
        var keyGroups = KeystrokeManager.keyGroups;
        return keyGroup == keyGroups.FUNCTIONAL ?
            keyGroups.PRINTABLE :
            keyGroups.FUNCTIONAL;
    };

    /**
     * Whether we need to use a workaround for functional (*Backspace*, *Delete*) keys not firing
     * the `keypress` event in Internet Explorer in this environment and for the specified `keyCode`.
     *
     * @since 4.4.5
     * @static
     * @param {Number} keyCode
     * @returns {Boolean}
     */
    KeystrokeManager.ieFunctionalKeysBug = function(keyCode) {
        return (
            CKEDITOR.env.ie &&
            KeystrokeManager.getKeyGroup(keyCode) ==
            KeystrokeManager.keyGroups.FUNCTIONAL
        );
    };

    // Helper method called when keystrokeManager.typing val was changed to true.
    function onTypingStart(keystrokeManager) {
        // It's safe to now indicate typing state.
        keystrokeManager.typing = true;

        // Manually mark snapshot as available.
        keystrokeManager.hasUndo = true;
        keystrokeManager.hasRedo = false;

        // garyfeng:
        // keystrokeManager.logit("TypingStart");
    }

    /**
     * Contains a snapshot of the editor content and selection at a given point in time.
     *
     * @private
     * @class CKEDITOR.plugins.keystrokelog.Image
     * @constructor Creates an Image class instance.
     * @param {CKEDITOR.editor} editor The editor instance on which the image is created.
     * @param {Boolean} [contentsOnly] If set to `true`, the image will only contain content without the selection.
     */
    var Image = (CKEDITOR.plugins.keystrokelog.Image = function(
        editor,
        contentsOnly
    ) {
        this.editor = editor;

        editor.fire('beforeUndoImage');

        var contents = editor.getSnapshot();

        // In IE, we need to remove the expando attributes.
        if (CKEDITOR.env.ie && contents)
            contents = contents.replace(/\s+data-cke-expando=".*?"/g, '');

        this.contents = contents;

        if (!contentsOnly) {
            var selection = contents && editor.getSelection();
            this.bookmarks = selection && selection.createBookmarks2(true);
        }

        editor.fire('afterUndoImage');
    });

    // Attributes that browser may changing them when setting via innerHTML.
    var protectedAttrs = /\b(?:href|src|name)="[^"]*?"/gi;

    Image.prototype = {
        /**
         * @param {CKEDITOR.plugins.keystrokelog.Image} otherImage Image to compare to.
         * @returns {Boolean} Returns `true` if content in `otherImage` is the same.
         */
        equalsContent: function(otherImage) {
            var thisContents = this.contents,
                otherContents = otherImage.contents;

            // For IE7 and IE QM: Comparing only the protected attribute values but not the original ones.(#4522)
            if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks)) {
                thisContents = thisContents.replace(protectedAttrs, '');
                otherContents = otherContents.replace(protectedAttrs, '');
            }

            if (thisContents != otherContents) return false;

            return true;
        },

        /**
         * @param {CKEDITOR.plugins.keystrokelog.Image} otherImage Image to compare to.
         * @returns {Boolean} Returns `true` if selection in `otherImage` is the same.
         */
        equalsSelection: function(otherImage) {
            var bookmarksA = this.bookmarks,
                bookmarksB = otherImage.bookmarks;

            if (bookmarksA || bookmarksB) {
                if (!bookmarksA ||
                    !bookmarksB ||
                    bookmarksA.length !== bookmarksB.length
                )
                    return false;

                for (var i = 0; i < bookmarksA.length; i++) {
                    var bookmarkA = bookmarksA[i],
                        bookmarkB = bookmarksB[i];

                    if (
                        bookmarkA.startOffset != bookmarkB.startOffset ||
                        bookmarkA.endOffset != bookmarkB.endOffset ||
                        !CKEDITOR.tools.arrayCompare(bookmarkA.start, bookmarkB.start) ||
                        !CKEDITOR.tools.arrayCompare(bookmarkA.end, bookmarkB.end)
                    ) {
                        return false;
                    }
                }
            }

            return true;
        }

        /**
         * Editor content.
         *
         * @readonly
         * @property {String} contents
         */

        /**
         * Bookmarks representing the selection in an image.
         *
         * @readonly
         * @property {Object[]} bookmarks Array of bookmark2 objects, see {@link CKEDITOR.dom.range#createBookmark2} for definition.
         */
    };

    /**
     * A class encapsulating all native event listeners which have to be used in
     * order to handle undo manager integration for native editing actions (excluding drag and drop and paste support
     * handled by the Clipboard plugin).
     *
     * @since 4.4.4
     * @private
     * @class CKEDITOR.plugins.keystrokelog.NativeEditingHandler
     * @member CKEDITOR.plugins.keystrokelog Undo manager owning the handler.
     * @constructor
     * @param {CKEDITOR.plugins.keystrokelog.KeystrokeManager} keystrokeManager
     */
    var NativeEditingHandler = (CKEDITOR.plugins.keystrokelog.NativeEditingHandler = function(
        keystrokeManager
    ) {
        // We'll use keyboard + input events to determine if snapshot should be created.
        // Since `input` event is fired before `keyup`. We can tell in `keyup` event if input occured.
        // That will tell us if any printable data was inserted.
        // On `input` event we'll increase input fired counter for proper key code.
        // Eventually it might be canceled by paste/drop using `ignoreInputEvent` flag.
        // Order of events can be found in http://www.w3.org/TR/DOM-Level-3-Events/

        /**
         * An undo manager instance owning the editing handler.
         *
         * @property {CKEDITOR.plugins.keystrokelog.KeystrokeManager} keystrokeManager
         */
        this.keystrokeManager = keystrokeManager;

        /**
         * See {@link #ignoreInputEventListener}.
         *
         * @since 4.4.5
         * @private
         */
        this.ignoreInputEvent = false;

        /**
         * A stack of pressed keys.
         *
         * @since 4.4.5
         * @property {CKEDITOR.plugins.keystrokelog.KeyEventsStack} keyEventsStack
         */
        this.keyEventsStack = new KeyEventsStack();

        /**
         * An image of the editor during the `keydown` event (therefore without DOM modification).
         *
         * @property {CKEDITOR.plugins.keystrokelog.Image} lastKeydownImage
         */
        this.lastKeydownImage = null;
    });

    NativeEditingHandler.prototype = {
        /**
         * The `keydown` event listener.
         *
         * @param {CKEDITOR.dom.event} evt
         */
        onKeydown: function(evt) {
            this.lastKeyDownTime = new Date().getTime();
            //CKEDITOR.$log.debug("******KEYDOWN Time: " + this.lastKeyDownTime);
            // garyfeng: log it
            // console.log(evt);
            // var extendedInfo={
            //   //"eventTime": getCurTime(),
            //   "eventTime": getCurTime(evt.data.$.timeStamp),
            //   // "editor": editor.element.getId(),
            // 	"name":evt.name,
            //   "keyCode":evt.data.getKey(),
            //   "keyStrokeCode": evt.data.getKeystroke()
            //   // "altKey": evt.data.$.altKey,
            //   // "ctrlKey": evt.data.$.ctrlKey,
            //   // "shiftKey": evt.data.$.shiftKey,
            //   // "metaKey": evt.data.$.metaKey ,
            // 	// "sender": evt.sender,
            // 	// "id": evt.sender.$.id,
            // 	// "textContent": evt.sender.$.textContent,
            // 	// "baseURI": evt.sender.$.baseURI,
            // 	// "className": evt.sender.$.className,
            // 	// "nodeType": evt.sender.$.nodeType,
            // 	// "nodeName": evt.sender.$.nodeName,
            // 	// "innerText": evt.sender.$.innerText,
            // 	// "outerHTML": evt.sender.$.outerHTML,
            // 	// "innerHTML": evt.sender.$.innerHTML //,
            // 	// "scrollHeight": evt.sender.$.scrollHeight,
            // 	// "scrollWidth": evt.sender.$.scrollWidth,
            // 	// "scrollTop": evt.sender.$.scrollTop,
            // 	// "scrollLeft": evt.sender.$.scrollLeft,
            // 	// "clientHeight": evt.sender.$.clientHeight,
            // 	// "clientWidth": evt.sender.$.clientWidth,
            // 	// "clientTop": evt.sender.$.clientTop,
            // 	// "clientLeft": evt.sender.$.clientLeft,
            // 	// "offsetParent": evt.sender.$.offsetParent,
            // 	// "offsetHeight": evt.sender.$.offsetHeight,
            // 	// "offsetWidth": evt.sender.$.offsetWidth,
            // 	// "offsetTop": evt.sender.$.offsetTop,
            // 	// "offsetLeft": evt.sender.$.offsetLeft
            // }
            // garyfeng: not logging keydown events because we have keyup-travel
            //if(logConfig.logKeyPresses) this.keystrokeManager.logit("Keypress", extendedInfo);
            //testing keyEventsStack
            //this.keystrokeManager.logit("KeyStack", this.keyEventsStack.stack);

            var keyCode = evt.data.getKey();
            var that = this;

            // garyfeng: per eNAEP typeId requirement, we need to distinguish
            // various triggers of the same command, e.g., "keyboard-bold" vs
            // "right-click-bold".
            // TODO: set up traps to get keyboard combinations.
            var eNAEPEventName = eNAEPkeystrokes[evt.data.getKeystroke()];
            if (eNAEPEventName) {
                // eNAEP editing event keyboard trigger
                //this.keystrokeManager.logit(eNAEPEventName, extendedInfo);
                // get selection info
                var sel = getSelectionInfo(evt.sender.editor);

                var extendedInfo = {
                    //"eventTime": getCurTime(),
                    name: eNAEPEventName,
                    selectedText: sel.textSelected || '',
                    startPos: sel.startPos,
                    endPos: sel.endPos
                };

                //this.keystrokeManager.logit(eNAEPEventName, extendedInfo);
                this.keystrokeManager.logit(
                    eNAEPEventName,
                    logConfig.logEventVerbose ? extendedInfo : undefined
                );
                // now set a delayed timer to cancel the key in the keystack in 250ms
                setTimeout(function() {
                    that.keyEventsStack.remove(keyCode);
                }, 250);
            }

            // end garyfeng

            // RonMorrill: removed duplicate code
            //var keyCode = evt.data.getKey();

            // The composition is in progress - ignore the key. (#12597)
            if (keyCode === 229) {
                return;
            }

            // Block undo/redo keystrokes when at the bottom/top of the undo stack (#11126 and #11677).
            // if ( CKEDITOR.tools.indexOf( keystrokes, evt.data.getKeystroke() ) > -1 ) {
            // 	evt.data.preventDefault();
            // 	return;
            // }

            // Cleaning tab functional keys.
            this.keyEventsStack.cleanUp(evt);

            var keystrokeManager = this.keystrokeManager;

            // Gets last record for provided keyCode. If not found will create one.
            var last = this.keyEventsStack.getLast(keyCode);
            if (!last) {
                this.keyEventsStack.push(keyCode, evt.data.$.timeStamp);
            }

            //garyfeng testing keyEventsStack
            //this.keystrokeManager.logit("KeyStack", this.keyEventsStack.stack);

            // We need to store an image which will be used in case of key group
            // change.
            this.lastKeydownImage = new Image(keystrokeManager.editor);

            if (
                KeystrokeManager.isNavigationKey(keyCode) ||
                this.keystrokeManager.keyGroupChanged(keyCode)
            ) {
                if (
                    keystrokeManager.strokesRecorded[0] ||
                    keystrokeManager.strokesRecorded[1]
                ) {
                    // We already have image, so we'd like to reuse it.

                    // #12300
                    keystrokeManager.save(false, this.lastKeydownImage, false);
                    keystrokeManager.resetType();
                }
            }
        },

        /**
         * The `input` event listener.
         */
        onInput: function() {
            // Input event is ignored if paste/drop event were fired before.
            if (this.ignoreInputEvent) {
                // Reset flag - ignore only once.
                this.ignoreInputEvent = false;
                return;
            }

            var lastInput = this.keyEventsStack.getLast();
            // Nothing in key events stack, but input event called. Interesting...
            // That's because on Android order of events is buggy and also keyCode is set to 0.
            if (!lastInput) {
                lastInput = this.keyEventsStack.push(0, 0);
            }

            // garyfeng: log it
            //var extendedInfo = {
            //    //"eventTime": getCurTime(),
            //    // "editor": editor.element.getId(),
            //    "name": "input",
            //    //"sender": "notTracking",
            //    "keycode": lastInput.keyCode
            //}
            // this.keystrokeManager.logit("ONINPUT", extendedInfo);
            // end garyfeng

            // Increment inputs counter for provided key code.
            this.keyEventsStack.increment(lastInput.keyCode);

            // Exceeded limit.
            //if ( this.keyEventsStack.getTotalInputs() >= this.keystrokeManager.strokesLimit ) {
            // always "type" regardless of keystrokesLimit
            if (true) {
                // garyfeng: 2016-05-16
                // this.keystrokeManager.type(lastInput.keyCode, true);
                this.keystrokeManager.type(lastInput.keyCode, false);
                this.keyEventsStack.resetInputs();
            }
        },

        /**
         * The `keyup` event listener.
         *
         * @param {CKEDITOR.dom.event} evt
         */
        onKeyup: function(evt) {
            var keystrokeManager = this.keystrokeManager,
                keyCode = evt.data.getKey(),
                totalInputs = this.keyEventsStack.getTotalInputs();

            // garyfeng: log it
            var keyTraveltime = this.keyEventsStack.getKeyTravelTime(
                keyCode,
                evt.data.$.timeStamp
            );
            var extendedInfo = {
                //"eventTime": getCurTime(evt.data.$.timeStamp),
                // "editor": editor.element.getId(),
                name: evt.name,
                keyCode: evt.data.getKey(),
                //"keyStrokeCode": evt.data.getKeystroke(),
                altKey: evt.data.$.altKey,
                ctrlKey: evt.data.$.ctrlKey,
                shiftKey: evt.data.$.shiftKey,
                metaKey: evt.data.$.metaKey,
                keyTravelTime: keyTraveltime
                    //,
                    //"sender": evt.sender,
                    //"innerText": evt.sender.$.innerText,
                    //"outerHTML": evt.sender.$.outerHTML
            };
            // var sel = getSelectionInfo(keystrokeManager.editor);
            // extendedInfo.selectedText= sel.textSelected||"";
            // extendedInfo.startPos= sel.startPos;
            // extendedInfo.endPos= sel.endPos;

            //// end garyfeng

            // JGrant. Check for certain keyboard combinations.
            //this.keystrokeManager.logit("Keypress", extendedInfo);

            //if (extendedInfo.ctrlKey == true) {
            //    switch (extendedInfo.keyCode) {
            //        case 66: {
            //            //extendedInfo.selectedText = selection2string(keystrokeManager.editor)||"";
            //            this.keystrokeManager.logit("Keyboard_Bold", extendedInfo);
            //            break;
            //        }
            //        case 73: {
            //            //extendedInfo.selectedText = selection2string(keystrokeManager.editor)||"";
            //            this.keystrokeManager.logit("Keyboard_Italic", extendedInfo);
            //            break;
            //        }
            //        case 85: {
            //            //extendedInfo.selectedText = selection2string(keystrokeManager.editor)||"";
            //            this.keystrokeManager.logit("Keyboard_Underscore", extendedInfo);
            //            break;
            //        }
            //        case 89: {
            //            //extendedInfo.selectedText = selection2string(keystrokeManager.editor)||"";
            //            this.keystrokeManager.logit("Keyboard_Redo", extendedInfo);
            //            break;
            //        }
            //        case 90: {
            //            //extendedInfo.selectedText = selection2string(keystrokeManager.editor)||"";
            //            this.keystrokeManager.logit("Keyboard_Undo", extendedInfo);
            //            break;
            //        }
            //        default: {
            //            this.keystrokeManager.logit("Keypress", extendedInfo);
            //        }
            //    }
            //} else {
            if (logConfig.logKeyPresses)
                this.keystrokeManager.logit('Keypress', extendedInfo);
            //}

            // Remove record from stack for provided key code.
            this.keyEventsStack.remove(keyCode);
            //console.log(this.keyEventsStack.stack);

            // Second part of the workaround for IEs functional keys bug. We need to check whether something has really
            // changed because we blindly mocked the keypress event.
            // Also we need to be aware that lastKeydownImage might not be available (#12327).
            if (
                KeystrokeManager.ieFunctionalKeysBug(keyCode) &&
                this.lastKeydownImage &&
                this.lastKeydownImage.equalsContent(
                    new Image(keystrokeManager.editor, true)
                )
            ) {
                return;
            }

            if (totalInputs > 0) {
                keystrokeManager.type(keyCode, true);
            } else if (KeystrokeManager.isNavigationKey(keyCode)) {
                // Note content snapshot has been checked in keydown.
                this.onNavigationKey(true);
            }
        },

        /**
         * Method called for navigation change. At first it will check if current content does not differ
         * from the last saved snapshot.
         *
         * * If the content is different, the method creates a standard, extra snapshot.
         * * If the content is not different, the method will compare the selection, and will
         * amend the last snapshot selection if it changed.
         *
         * @param {Boolean} skipContentCompare If set to `true`, it will not compare content, and only do a selection check.
         */
        onNavigationKey: function(skipContentCompare) {
            var keystrokeManager = this.keystrokeManager;

            // We attempt to save content snapshot, if content didn't change, we'll
            // only amend selection.
            if (skipContentCompare || !keystrokeManager.save(true, null, false))
                keystrokeManager.updateSelection(new Image(keystrokeManager.editor));

            keystrokeManager.resetType();

            // garyfeng: log it
            // this.keystrokeManager.logit("ONNAVIGATIONKEY", {"skipContentCompare":skipContentCompare});
            // end garyfeng
        },

        /**
         * Makes the next `input` event to be ignored.
         */
        ignoreInputEventListener: function() {
            this.ignoreInputEvent = true;
        },

        /**
         * Attaches editable listeners required to provide the undo functionality.
         */
        attachListeners: function() {
            var scrollInfo = {
                zoomLevel: 100,
                direction: '',
                method: 'swipe',
                //area: "writing",
                hpos: 0,
                vpos: 0
            };

            var editor = this.keystrokeManager.editor,
                editable = editor.editable(),
                that = this,
                scrollingObservableTimer = null;

            // We'll create a snapshot here (before DOM modification), because we'll
            // need unmodified content when we got keygroup toggled in keyup.
            editable.attachListener(
                editable,
                'keydown',
                function(evt) {
                    that.onKeydown(evt);

                    // On IE keypress isn't fired for functional (backspace/delete) keys.
                    // Let's pretend that something's changed.
                    if (KeystrokeManager.ieFunctionalKeysBug(evt.data.getKey())) {
                        that.onInput();
                    }
                    scrollInfo.method = 'keyboard';
                },
                null,
                null,
                999
            );

            // Only IE can't use input event, because it's not fired in contenteditable.
            editable.attachListener(
                editable,
                CKEDITOR.env.ie ? 'keypress' : 'input',
                that.onInput,
                that,
                null,
                999
            );

            // Keyup executes main snapshot logic.
            editable.attachListener(editable, 'keyup', that.onKeyup, that, null, 999);

            // On paste and drop we need to ignore input event.
            // It would result with calling keystrokeManager.type() on any following key.
            editable.attachListener(
                editable,
                'paste',
                that.ignoreInputEventListener,
                that,
                null,
                999
            );
            editable.attachListener(
                editable,
                'drop',
                that.ignoreInputEventListener,
                that,
                null,
                999
            );

            // Click should create a snapshot if needed, but shouldn't cause change event.
            // Don't pass onNavigationKey directly as a listener because it accepts one argument which
            // will conflict with evt passed to listener.
            // #12324 comment:4
            editable.attachListener(
                editable.isInline() ? editable : editor.document.getDocumentElement(),
                'click',
                function() {
                    that.onNavigationKey();
                },
                null,
                null,
                999
            );

            // When pressing `Tab` key while editable is focused, `keyup` event is not fired.
            // Which means that record for `tab` key stays in key events stack.
            // We assume that when editor is blurred `tab` key is already up.
            editable.attachListener(
                this.keystrokeManager.editor,
                'blur',
                function() {
                    that.keyEventsStack.remove(9 /*Tab*/ );
                },
                null,
                null,
                999
            );

            editable.attachListener(editable.getDocument(), 'scroll', function(
                event
            ) {
                scrollInfo.zoomLevel = 100; //zoomLevelsByIndex[zoomService.currentZoom().zoomIndex];
                var top = $(event.data.$.target).scrollTop(); //angular.element(element).scrollTop();
                var left = $(event.data.$.target).scrollLeft();
                var eventType = null;
                var delay = 250; // record scrolling observables no more than 1 per every 250ms

                // clear any outstanding scrolling event logging
                clearTimeout(scrollingObservableTimer);

                // If the last keydown event was more than 100 ms ago, something else must have triggered the scroll. Assume swipe.
                if (
                    scrollInfo.method === 'keyboard' &&
                    new Date().getTime() - that.lastKeyDownTime > 100
                ) {
                    scrollInfo.method = 'swipe';
                }

                if (top > scrollInfo.vpos) {
                    scrollInfo.direction = 'down';
                    eventType = 'Vertical_Item_Scroll';
                } else if (top < scrollInfo.vpos) {
                    scrollInfo.direction = 'up';
                    eventType = 'Vertical_Item_Scroll';
                }
                if (left > scrollInfo.hpos) {
                    scrollInfo.direction = 'right';
                    eventType = 'Horizontal_Item_Scroll';
                } else if (left < scrollInfo.hpos) {
                    scrollInfo.direction = 'left';
                    eventType = 'Horizontal_Item_Scroll';
                }
                scrollInfo.vpos = top;
                scrollInfo.hpos = left;
                // scrollInfo.zoomLevel = CKEDITOR.getAppZoom().normalizedZoomLevel;

                var infoString =
                    scrollInfo.zoomLevel +
                    ', ' +
                    scrollInfo.direction +
                    ', ' +
                    scrollInfo.method +
                    ', Writing Panel, ' +
                    Math.round(scrollInfo.hpos) +
                    ', ' +
                    Math.round(scrollInfo.vpos);

                // queue scrolling event logging
                scrollingObservableTimer = setTimeout(
                    function(_that, _eventType, _infoString) {
                        _that.keystrokeManager.logit(_eventType, _infoString);
                    },
                    delay,
                    that,
                    eventType,
                    infoString
                );
            });

            editable.attachListener(
                editable.getDocument(),
                'swipe',
                function( /*event*/ ) {
                    scrollInfo.method = 'swipe';
                }
            );

            editable.attachListener(
                editable.getDocument(),
                'mousewheel',
                function( /*event*/ ) {
                    scrollInfo.method = 'mousewheel';
                }
            );

            editable.attachListener(editable.getDocument(), 'mousedown', function(
                event
            ) {
                if (event.data.$.which === 1) {
                    scrollInfo.method = 'mouse/trackpad';
                }
            });

            editable.attachListener(editable.getDocument(), 'mouseup', function(
                event
            ) {
                if (event.data.$.which === 1) {
                    scrollInfo.method = 'swipe'; // swipe will be the default since we should be able to detect the others
                }
            });
        }
    };

    /**
     * This class represents a stack of pressed keys and stores information
     * about how many `input` events each key press has caused.
     *
     * @since 4.4.5
     * @private
     * @class CKEDITOR.plugins.keystrokelog.KeyEventsStack
     * @constructor
     */
    var KeyEventsStack = (CKEDITOR.plugins.keystrokelog.KeyEventsStack = function() {
        /**
         * @readonly
         */
        this.stack = [];
    });

    KeyEventsStack.prototype = {
        /**
         * Clears the stack.
         * garyfeng:
         */
        clearStack: function() {
            this.stack = [];
        },
        /**
         * Pushes a literal object with two keys: `keyCode` and `inputs` (whose initial value is set to `0`) to stack.
         * It is intended to be called on the `keydown` event.
         *
         * @param {Number} keyCode
         * @param {Number} timeStamp, from the Keydown event
         */
        push: function(keyCode, timeStamp) {
            var length = this.stack.push({
                keyCode: keyCode,
                inputs: 0,
                t: timeStamp
            });
            return this.stack[length - 1];
        },

        /**
         * Called at Keyup, to calculate the keyTravelTime, which is defined as
         * time the currentTime - the t for the matching keycode. Return null if
         * no matching keycode
         *
         * @param {Number} keyCode
         * @param {Number} timeStamp, from the Keyup event
         */
        getKeyTravelTime: function(keyCode, timeStamp) {
            // compare to the last keydown of this keycode
            var index = this.getLastIndex(keyCode);
            if (index != -1) {
                return timeStamp - this.stack[index].t;
            } else {
                return null;
            }
        },

        /**
         * Returns the index of the last registered `keyCode` in the stack.
         * If no `keyCode` is provided, then the function will return the index of the last item.
         * If an item is not found, it will return `-1`.
         *
         * @param {Number} [keyCode]
         * @returns {Number}
         */
        getLastIndex: function(keyCode) {
            if (typeof keyCode != 'number') {
                return this.stack.length - 1; // Last index or -1.
            } else {
                var i = this.stack.length;
                while (i--) {
                    if (this.stack[i].keyCode == keyCode) {
                        return i;
                    }
                }
                return -1;
            }
        },

        /**
         * Returns the last key recorded in the stack. If `keyCode` is provided, then it will return
         * the  last record for this `keyCode`.
         *
         * @param {Number} [keyCode]
         * @returns {Object} Last matching record or `null`.
         */
        getLast: function(keyCode) {
            var index = this.getLastIndex(keyCode);
            if (index != -1) {
                return this.stack[index];
            } else {
                return null;
            }
        },

        /**
         * Increments registered input events for stack record for a given `keyCode`.
         *
         * @param {Number} keyCode
         */
        increment: function(keyCode) {
            var found = this.getLast(keyCode);
            if (!found) {
                // %REMOVE_LINE%
                throw new Error(
                    'Trying to increment, but could not found by keyCode: ' +
                    keyCode +
                    '.'
                ); // %REMOVE_LINE%
            } // %REMOVE_LINE%

            found.inputs++;
        },

        /**
         * Removes the last record from the stack for the provided `keyCode`.
         *
         * @param {Number} keyCode
         */
        remove: function(keyCode) {
            var index = this.getLastIndex(keyCode);

            if (index !== -1) {
                this.stack.splice(index, 1);
            }
        },

        /**
         * Resets the `inputs` value to `0` for a given `keyCode` or in entire stack if a
         * `keyCode` is not specified.
         *
         * @param {Number} [keyCode]
         */
        resetInputs: function(keyCode) {
            if (typeof keyCode == 'number') {
                var last = this.getLast(keyCode);

                if (!last) {
                    // %REMOVE_LINE%
                    throw new Error(
                        'Trying to reset inputs count, but could not found by keyCode: ' +
                        keyCode +
                        '.'
                    ); // %REMOVE_LINE%
                } // %REMOVE_LINE%

                last.inputs = 0;
            } else {
                var i = this.stack.length;
                while (i--) {
                    this.stack[i].inputs = 0;
                }
            }
        },

        /**
         * Sums up inputs number for each key code and returns it.
         *
         * @returns {Number}
         */
        getTotalInputs: function() {
            var i = this.stack.length,
                total = 0;

            while (i--) {
                total += this.stack[i].inputs;
            }
            return total;
        },

        /**
         * Cleans the stack based on a provided `keydown` event object. The rationale behind this method
         * is that some keystrokes cause the `keydown` event to be fired in the editor, but not the `keyup` event.
         * For instance, *Alt+Tab* will fire `keydown`, but since the editor is blurred by it, then there is
         * no `keyup`, so the keystroke is not removed from the stack.
         *
         * @param {CKEDITOR.dom.event} event
         */
        cleanUp: function(event) {
            var nativeEvent = event.data.$;

            if (!(nativeEvent.ctrlKey || nativeEvent.metaKey)) {
                this.remove(17);
            }
            if (!nativeEvent.shiftKey) {
                this.remove(16);
            }
            if (!nativeEvent.altKey) {
                this.remove(18);
            }
        }
    };
})();

/**
 * The number of undo steps to be saved. The higher value is set, the more
 * memory is used for it.
 *
 *		config.undoStackSize = 50;
 *
 * @cfg {Number} [undoStackSize=20]
 * @member CKEDITOR.config
 */

/**
 * Fired when the editor is about to save an undo snapshot. This event can be
 * fired by plugins and customizations to make the editor save undo snapshots.
 *
 * @event saveSnapshot
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 */

/**
 * Fired before an undo image is to be created. An *undo image* represents the
 * editor state at some point. It is saved into the undo store, so the editor is
 * able to recover the editor state on undo and redo operations.
 *
 * @since 3.5.3
 * @event beforeUndoImage
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @see CKEDITOR.editor#afterUndoImage
 */

/**
 * Fired after an undo image is created. An *undo image* represents the
 * editor state at some point. It is saved into the undo store, so the editor is
 * able to recover the editor state on undo and redo operations.
 *
 * @since 3.5.3
 * @event afterUndoImage
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @see CKEDITOR.editor#beforeUndoImage
 */

/**
 * Fired when the content of the editor is changed.
 *
 * Due to performance reasons, it is not verified if the content really changed.
 * The editor instead watches several editing actions that usually result in
 * changes. This event may thus in some cases be fired when no changes happen
 * or may even get fired twice.
 *
 * If it is important not to get the `change` event fired too often, you should compare the
 * previous and the current editor content inside the event listener. It is
 * not recommended to do that on every `change` event.
 *
 * Please note that the `change` event is only fired in the {@link #property-mode wysiwyg mode}.
 * In order to implement similar functionality in the source mode, you can listen for example to the {@link #key}
 * event or the native [`input`](https://developer.mozilla.org/en-US/docs/Web/Reference/Events/input)
 * event (not supported by Internet Explorer 8).
 *
 *		editor.on( 'mode', function() {
 *			if ( this.mode == 'source' ) {
 *				var editable = editor.editable();
 *				editable.attachListener( editable, 'input', function() {
 *					// Handle changes made in the source mode.
 *				} );
 *			}
 *		} );
 *
 * @since 4.2
 * @event change
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 */
