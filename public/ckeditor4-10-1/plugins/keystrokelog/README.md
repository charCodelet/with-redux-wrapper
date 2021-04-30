Keystroke Logging Plug-in for CKEditor 4
==================================================

## Development Code

This repository contains the development version of the keystrokelog
plug-in for CKEditor.

**Attention:** This repository includes a fork of CKEditor v4.4.7 dev repo.
I've created a branch called ```keystrokelog```. The ```keystrokelog``` plugin is in the ```plugins\ksytrokelog``` folder.

### Plugin Installation

 - Make sure ```keystrokelog``` is in the ```\\plugins``` folder
 - Edit ```config.js``` to make sure ```keystrokelog``` is in the plugin list.
 - A few other plugins are also modified to add custom events.
  - use the "button" plugin from this repo to raise a custom event "uiButtonCommand"
  - use the "menu" plugin from this repo to raise a custom event "menuItemCommand"
 - restart or refresh the CKeditor

### Plugin Configuration

The keystrokelog plugin can be configured to use various loggging mechanisms and to use different formats, or to track/ignore different events. The ```logConfig``` object is used to control global behaviors. It currently resides in ```eventlogging.js```, but it's a remnant of the past, when the code was part of a standalone prototype for keystroke logging. The relevant portion of the code is copied below. The newest version is in the js file, until it's refactored into somewhere else.

```
////////////////////////////////
//garyfeng: logging configuration
var logConfig = {
  // logging format
  //timeFormat: "UTC", or "JSON", or getTime() if missing
  timeFormat: "JSON",
  // format of the extendedInfo data
  formatUsingXML: false,
  formatUsingJSON: true,
  //formatAsString: true,	// no need; only for enaep

  // eNAEP call
  eNaepAPI: true, 	// the enaep.observibleData() expets a string

  // Ajax Appender setup
  AjaxAppender: false,
  AjaxSetTime: true,
  AjaxTimerInterval: 1000,
  AjaxBatchSize: 10,
  AjaxSetSendAllOnUnload:true,
  AjaxWaitForResponse: true,
  serverURL: "logger.php",
  serverLogFilename: "ProcessDataLog.txt",

  // stringAppender
  StringAppender: true,
  localLogFilename: "ProcessDataLog_"+(new Date()).toISOString().replace(/[^0-9]/g, "")+".txt",

  // consoleAppender
  ConsoleAppender: true,

  // error handling
  onErrorAlert: false,
  onErrorLog: true,
  consoleDebuging: true,

  // keystroke loging
  logKeyPresses: true,
  logKeyStrokes: true,
  logKeyStrokeTexts: true,

  // junk, to capture accidental commas
  nothing: true
}
```

### Testing

Launch the ```keystrolelog.html``` (under ```\\keystrokelog\\dev```) in Chrome or another HTML5 compliant browser. Trun on the javascript console, and you should see logs like:

```
{"t":1430154156879,"evt":"ONSAVESNAPSHOT","extInfo":{"et":1430154156879,"name":"saveSnapshot","senderID":"cke_1","senderName":"editor1"}}
```

## How the keystrokelog Plugin Works

Keystroke logging is actually not about logging the keypresses; it's about tracking what changes have been made to the content in the editor after each triggering event. Think about it: you can change the content without invoking any keypresses, e.g., by using the paste button, or using the spell checker. Logically we need to log two kinds of things:

 * triggering events: what user action triggered changes to the editor
 * consequences of the triggering events: what changes happened to the editor as a result

 In addition to doing the above, the rest of the code does the plumming, e.g., keeping a snapshot of the old content in the editor, handling eventListeners,
 The actual plugin comprises several objects.

  * ```KeystrokeManager``` was initially renamed from "undoManager"; it handles the save() function saves the snapshot (aka Image)
  * ```Image```, or the snapshot, which contains the "content" and "selections" parts.  * ```NativeEditingHandler``` handles the keyup and keydown events.
  * ```KeyEventStack``` keeps track of which keys are down and cancel them when they are up.
  * A bunch of utility functions that should have been refactored out.


### Triggering events

CKEditor's core code and official plugins use a fairly consistent approach, i.e., firing custom events for things that other parts of the editor may need to know. For example, anything that triggers a "redo-able" change should fire an event "saveSnapshot," when is taken up by the ```undo/redo``` plugin, which is technically a plugin but is almost always available. Then when you hit "CTRL-Z" or click "Undo," the undo plugin listens to (it's actually a little more complex than this but...) the triggers and handles the undo command.

My going assumption is that anything that is worth of "undo-ing" is probably worth logging. So I shamelessly took the undo plugin as my starting point. As expected, it has the notion of snapshots, although for the purpose of undoing you need to keep a deep stack but for keystroke logging you technically need only 1 snapshot.

The undo plugin doesn't care that much what triggers the undo action, but that's critical for keystroke logging. This is where the work has been. In particular, for the purpose of keystroke logging for NAEP, we have to keep track of different triggers of the same action -- e.g., bolding may be triggered by a key combination, a toolbar button, or contextual menu choice. eNAEP requires that we log the origin of the event.

The following is the order in which event handlers are called (at least the ones we logged).

 * ONKEYDOWN: actual event handler, pushing the timestamp to keyEventsStack.
 * //ONINPUT: this is triggered by ?? tablet input ??
 * //TypingStart: not critical; for updating undo/redo butters
 * //ONSAVESNAPSHOT: event handler;
 * logdiff: logic to do the diff, triggered by on('saveSnapshot') event
 * //SAVE: func to actually save the snapshot
 * //TYPE: This is ??
 * ONKEYUP: this is the keyup event handler, use the timestamp to calc the travel time.

For editing actions triggered by key combinations (e.g., CTRL-V):
 * ```eNAEPkeystrokes``` keeps track of the key combos to be tracked; some key combos are intercepted at the CKEditor's core keystroke.js and other code, where if the combination triggers a command, then the ```keydown``` event will not bubbled up any more, i.e., no other "onKeydown" handler will get this event, including the eventListerns in our keystrokelog plugin. But we will get keyup events, as well as the commands they triggered. See the ```recordCommandAfter()``` code

For editing actions triggered by right-click menus (or other menus)
 * ```menuItemCommand``` event is handled around line 567.

Similarly, for toolbar button triggered events:
 * ```uiButtonCommand``` is the event to track

### Richtext diffing

In our prior research on writing in plaintext editors we have come to a solution based on text diffs. Every change to the text can be seen as either an INSert or a DELete event, with additional information on the cursor position and the text that is taken out or inserted.

In the case of a richtext editor like CKEditor, there are two types of changes.

 * textual content changes, vs.
 * markup changes

There may be things that fall in between, such as indentations and paragraphing, depending on how they are implemented.

We are primarily interested in modeling content changes; how students bold or italize is secondary at best.

The "content" in a snapshot is essentially the innerHTML of the WYSIWYG editor iFrame. In principle I can treat the HTML code as text, and do a diff to see what changes to the HTML code have happened. Problems with this approach:
 * Markups such as ```<em>...</em>``` generates discontinuous blocks of changes
 * The discontinuous changes problem is doubled when the user selects part of a marked up text and changes the markup. In this case the DOM has to create new HTML elements so that the overlap conforms to the HTML rules. We end up with 4 or more different changes.  
 * The CKEditor may decide to make arbitrary changes to the HTML code without changing the content, e.g., adding "beautifying" white spaces, or change ```<em>``` to some other CSS styles as it sees fit. We don't want to be overwhelmed by these.

The approach I take here focuses on textual changes:
 * We convert HTML content to texts ( ```html2text()``` )
 * We then do text diffs on the text contents (```logDiff()```)
 * For markups, we log the triggering events; this takes a lot of effort
 * To facilitate the markup logging, we track changes in selections (event ```UPDATESELECTION```)
 * as a backup, we also implemented ```htmlDiff()```

### The snapshot and other plumming code

This is the remnant of the ```undo``` plugin which I haven't really cleaned up.

 * Handling the snapshot tracking and keyup/down tracking
 * Adding eventListeners
 * Converting editing events to eNAEP typeIds; see ```eventName2typeIdTable```
 * other utilities, such as JSON.stringifyOnce() or string.startWith(); they are at the top of the plugin.js script


## Data structure and format

The basic structure is

```
{
  "eventId": id as string or numeric,
  "logTime": UTC or other time format as string,
  "eventSender": which editor this came from,
  "extendedInfo": {
    "eventTime": msec of when the event was triggered,
    "otherinfo": ...
  }
}
```

The code supports several output format:
 * JSON: this is the "native" format and is best for debugging
 * XML: we serialize the JSON based on a protocol developed by Jiangang Hao et al. (2015), in which extendedInfo is all flattened to Key:Value pairs
 * eNAEP: this is actually not a format but an API call convention, in which eventType is represented as eNAEP typeId, and extendedInfo is a string of custom data (which eNAEP duely codes and saves but won't tough)

------------

## License

Licensed under the LGPL license.

For full details about the license, please check the LICENSE.md file in the CKEditor main folder.

Licenses for software libraries included in the distribution are in the ```\\keystrokelog\\dev``` folder. In some cases they are included in the javascript files.
