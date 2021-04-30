/*
 * garyfeng, 21015
 * functions for logging process data
 * requires
 * <script src="FileSaver.min.js" type="text/javascript"></script>
 * <script src="Blob.js" type="text/javascript"></script>
 * <script src="log4javascript_uncompressed.js"  type="text/javascript"></script>
 * <script src="diff.js"  type="text/javascript"></script>
*/

	//////////////////////////////////
	// utilities
	// from http://stackoverflow.com/questions/2631820/im-storing-click-coordinates-in-my-db-and-then-reloading-them-later-and-showing/2631931#2631931
	function getPathTo(element) {
		if (element.id!=='')
			return "//*[@id='"+element.id+"']";

		if (element===document.body)
			return element.tagName.toLowerCase();

		var ix= 0;
		var siblings= element.parentNode.childNodes;
		for (var i= 0; i<siblings.length; i++) {
			var sibling= siblings[i];

			if (sibling===element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';

			if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
				ix++;
			}
		}
	}

	function getPageXY(element) {
		var x= 0, y= 0;
		while (element) {
			x+= element.offsetLeft;
			y+= element.offsetTop;
			element= element.offsetParent;
		}
		return [x, y];
	}

	// extending JSON.stringify() to prevent circular errors
	// see http://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
	JSON.stringifyOnce = function(obj, replacer, indent){
	    var printedObjects = [];
	    var printedObjectKeys = [];

	    function printOnceReplacer(key, value){
	        if ( printedObjects.length > 2000){ // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
	        	return 'object too long';
	        }
	        var printedObjIndex = false;
	        printedObjects.forEach(function(obj, index){
	            if(obj===value){
	                printedObjIndex = index;
	            }
	        });

	        if ( key == ''){ //root element
	             printedObjects.push(obj);
	             printedObjectKeys.push("root");
	             return value;
	        }

					// garyfeng: if the key starts with '_', don't go in.
					else if ( key.startsWith("_")){ //a private element
	             return "(private element, skipping)";
	        }

	        else if(printedObjIndex+"" != "false" && typeof(value)=="object"){
	            if ( printedObjectKeys[printedObjIndex] == "root"){
	                return "(pointer to root)";
	            }else{
	                return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
	            }
	        }else{

	            var qualifiedKey = key || "(empty key)";
	            printedObjects.push(value);
	            printedObjectKeys.push(qualifiedKey);
	            if(replacer){
	                return replacer(key, value);
	            }else{
	                return value;
	            }
	        }
	    }

			var res="unknown error"
			try {
			 	res = JSON.stringify(obj, printOnceReplacer, indent)
			} catch (e) {
				console.log(e)
			}

	    return res;
	};

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

	// alertLogError, use alert() or console.log depending on the config setting
	alertLogError = function(msg){
		if (logConfig["onErrorAlert"]) alert(msg);
		if (logConfig["onErrorLog"])   console.log("ERROR\t"+msg);
	}
	consoleDebuging= function(msg){
		if (logConfig["consoleDebuging"]) console.log("DEBUG\t"+msg)
	}

	// create the logger if does exist
	if (typeof log === 'undefined') {
		// check to see if this is in an iFrame and the parent has log
		if(! typeof parent.log == 'undefined') {
			// if parent has log, then use that one.
			log=parent.log;
		} else {
			// if no log in this or parent, then create a log

			if (typeof logConfig == 'undefined') {
				// no logConfig object
				alertLogError("Logging: logConfig is not defined")
			}

			log4javascript.setTimeStampsInMilliseconds();
			var log = log4javascript.getLogger("main");
			//var layout = new log4javascript.PatternLayout("%50r\t%d{dd MMM yyyy HH:mm:ss,SSS}\t%-5p\t%m");
			// we now use the millisecond since logger started
			var layout = new log4javascript.PatternLayout("%6r\t%m%n");

			// preparing to add AJAX appender
			if(logConfig["AjaxAppender"]) {
				var appender = new log4javascript.AjaxAppender(logConfig["serverURL"]||"logger.php");
				function requestCallback(xmlHttp) {
					consoleDebuging("Logging: ajax post succeeded")
				}
				function requestCallbackFail(xmlHttp) {
					alertLogError("Logging: ajax post FAILED")
				}
				appender.setRequestSuccessCallback(requestCallback);
				appender.setFailCallback(requestCallbackFail);
				appender.setLayout(layout);
				// set log as timed, for buffered logging
				// see http://log4javascript.org/docs/manual.html#ajaxappender
				appender.setWaitForResponse(logConfig["AjaxWaitForResponse"]);
				appender.setTimed(logConfig["AjaxSetTime"]);
				appender.setTimerInterval(logConfig["AjaxTimerInterval"]);
				appender.setBatchSize(logConfig["AjaxBatchSize"]);
				appender.setSendAllOnUnload(logConfig["AjaxSetSendAllOnUnload"]);
				// console.log("LOGCONFIG\tisWaitForResponse="+appender.isWaitForResponse())
				// console.log("LOGCONFIG\tgetBatchSize="+appender.getBatchSize())
				// console.log("LOGCONFIG\tgetisTimed="+appender.isTimed())
				// console.log("LOGCONFIG\tgetTimerInterval="+appender.getTimerInterval())
				//var appender = new log4javascript.InPageAppender();
				log.addAppender(appender);
			}
			//now adding the StringAppender, as a possible backup
			if(logConfig["StringAppender"]) {
				var strAppender = new log4javascript.StringAppender();
				strAppender.setLayout(layout);
				log.addAppender(strAppender);
			}
			//now adding the ConsoleAppender, as a possible backup
			if(logConfig["ConsoleAppender"]) {
				// not implemented yet
				// currently any appender will use logMessage, which prints to debut.
			}
			// initial logging: logger starting
			//log.info("TASK\t"+document.title);
			//log.info("NEWTASK");
			// need to log student name, booklet, etc.
			// log.info("NAVIGATION\t"+JSON.stringify({event:"taskStart", time: (new Date()).toString(), task: document.title}));
		}

	}

	// the actual logging function, message is a string
	// the standard format of message is something like: 'EVENT\t'+JSON.stringify(object)
	logMessage = function(message){
		// use console.log now for debug
		consoleDebuging(message)
		// consoleDebuging(JSON.stringifyOnce(message))
		// logging to file
		if(typeof log != 'undefined') {
			log.info(message);
		} else {
			alertLogError("Error: log object not created")
		}

	}

	////////////////////////////////
	// Logging functions and hooks
	////////////////////////////////
	// global error message logging
	// https://danlimerick.wordpress.com/2014/01/18/how-to-catch-javascript-errors-with-window-onerror-even-on-chrome-and-firefox/
	window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
		var msg={
			errorMsg: errorMsg,
			script: url,
			line: lineNumber,
			column: column,
			stackTrace: JSON.stringify(errorObj)
		}
		log.error('ERROR\t' + JSON.stringify(msg) );
		consoleDebuging('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj);
	}

  // global mouse click logging
	// remove dependency on jquery
  // $(document).click(function(e) {
	window.onclick = function(e) {
		var msg={
			"t": e.timeStamp||0,
			"evt": "MOUSECLICK",
			"extInfo":{
				"button": e.button,
				"x": e.pageX,
				"y": e.pageY,
				"cx": e.clientX,
				"cy": e.clientY
			}
		}
		// log
		logMessage(JSON.stringify(msg));
		//consoleDebuging("MOUSE\t"+JSON.stringify(msg));
	};

	/////////////////////////////
	// garyfeng: a function to bind all <a> tags with logging
	logEvent = function(event) {
		if (event===undefined) event= window.event;                     // IE hack
		var target= 'target' in event? event.target : event.srcElement; // another IE hack

		var root= document.compatMode==='CSS1Compat'? document.documentElement : document.body;
		var mxy= [event.clientX+root.scrollLeft, event.clientY+root.scrollTop];

		var path= getPathTo(target);
		var txy= getPageXY(target);
		var record = {
			id: target.id,
			time: event.timeStamp||0,
			eventType: event.type,
			className: target.className,
			xpath: path,
			mousePosX: mxy[0],
			mousePosY: mxy[1],
			targetPosX: txy[0],
			targetPosY: txy[1],
			clientX: event.clientX,
			clientY: event.clientY,
			scrollTop: root.scrollTop,
			scrollLeft: root.scrollLeft
		}
		//var message = 'EVENT\t'+target.id+"\t"+target.className +"\t"+path+'\t'+(mxy[0]-txy[0])+', '+(mxy[1]-txy[1]);
		var message = 'EVENT\t'+JSON.stringify(record);
		logMessage(message);
		consoleDebuging(message)

		//return(message)
	}


	////////////////////////////
	// handler for keypress logging, to be hooked to onkeyup/onkeydown events
	function getKeyinfo(id, e) {
		// getting the timestamp first
		var ts= e.timeStamp||0
		// consider using high precision timer
		// see http://www.html5rocks.com/en/tutorials/webperformance/usertiming/
		// var ts=window.performance.now()||-1;

		var k = e.which || e.keyCode;
		var x = e.charCode || e.keyCode;
		// see http://css-tricks.com/snippets/javascript/javascript-keycodes/
		var keyName = String.fromCharCode(x);
		if (x==8) {keyName="BACKSPACE"};
		if (x==13) {keyName="ENTER"};
		if (x==32) {keyName="SPACE"};
		if (x==46) {keyName="DEL"};

		var modifier="";
		if (e.ctrlKey) {
		  modifier+="CTRL,";
		} else if(e.shiftKey) {
		  modifier+="SHIFT,";
		} else if(e.altKey) {
		  modifier+="ALT,";
		} else if(e.metaKey) {
		  modifier+="META,";
		}

		return {
			textField: id,
			eventTime: ts,
			keyName: keyName,
			keycode: k,
			charCode: x,
			modifier: modifier
		}
	}

	function logKeyDown(id, e) {
		logMessage("KEYDOWN\t"+JSON.stringify(getKeyinfo(id, e)));
	}

	function logKeyUp(id, e) {
		logMessage("KEYUP\t"+JSON.stringify(getKeyinfo(id, e)));
	}

	// CBAL style keystroke logging using JsDiff
	// garyfeng: TODO: for CKeditor:
	//	no need for id: this is part of the editor
	// to be hooked to onkeypress and other content-changing events
	function logKeystrokes(id,e) {
		// ensure the log exists
		if(!log){
			alertLogError("Error: log is not set")
			return
		}

		// garyfeng: CKeditor: use the ckeditor snapshot
		// use an internal persistent var as the buffer for **ALL** textfields it tracks.
		if ( typeof logKeystrokes.buffer === "undefined") {
			logKeystrokes.buffer={};
		}

		// getting the timestamp first
		var ts= e.timeStamp||0

		// TO-DO: find the current pos of current caret in the textarea
		// see https://github.com/component/textarea-caret-position
		// and http://jsfiddle.net/dandv/aFPA7/
		// var coordinates = getCaretCoordinates(this, this.selectionEnd);

		// return is there is no change
		// persistent variable for olds[]

		// use CKeditor snapshot code
		var olds = "";
		if ( typeof logKeystrokes.buffer[id] === "undefined") {
			olds = "";
		} else {
			olds = logKeystrokes.buffer[id];
		}

		// garyfeng: TODO: need to replace this with new code for CKeditor
		// var news = getContent();
		var news =document.getElementById("#"+id).val();

		consoleDebuging("OLDS="+olds);
		consoleDebuging("NEWS="+news);
		consoleDebuging("logKeystrokes.buffer="+JSON.stringify(logKeystrokes.buffer))
		// don't log if no change
		// garyfeng: TODO: comparison should ignore HTML beatification
		if (news===olds) return;

		// keystroke logging with JsDiff
		// is the C4 code faster than JsDiff?
		// garyfeng: TODO: use richtext diff algorithm
		var diff = JsDiff.diffChars(olds, news);

		// actual logging
		// garyfeng: TODO: logging
		var record = {
			textField: id,
			eventTime: ts,
			textDiff: escape(JsDiff.convertChangesToXML(diff))
		};
		consoleDebuging("TEXT\t"+JSON.stringify(record));
		if(logConfig["logKeyStrokeTexts"]) logMessage("TEXT\t"+JSON.stringify(record));

		// now go through all the Diff chunks and report changes; ignore the parts that are neither added nor removed
		if (logConfig["logKeyStrokes"]) {
			var counter=1;
			var keyRecord={};
			diff.forEach(function(part){
			  keyRecord= {
					textField: id,
					eventTime: ts,
					edit: "",
					pos: counter,
					len: part.value.length,
					text: escape(part.value)
			  }
				if (part.added) {
					keyRecord["edit"] = "INS";
					logMessage("KEYSTROKE\t"+JSON.stringify(keyRecord))
					consoleDebuging("KEYSTROKE\t"+JSON.stringify(keyRecord))
				} else if (part.removed) {
					keyRecord["edit"] = "DEL";
					logMessage("KEYSTROKE\t"+JSON.stringify(keyRecord))
					consoleDebuging("KEYSTROKE\t"+JSON.stringify(keyRecord))
				} else {
					// garyfeng TODO: need to add conditions to log markup events
					// e.g., keyRecord['edit'] = 'bold', with pos and len and text
				  // parts with no change, skip
				  // log.info("Keystroke\tUnchanged\t"+counter+"\t"+escape(part.value))
				}
				// update cursor position
				counter+=part.value.length;
			});
		}
		// update the buffer for this id.
		logKeystrokes.buffer[id]=news;
	}


	/////////////////////////////////////
	// Utilities for log4javascript
	/////////////////////////////////////
	// save log to file using FileSaver.JS
	// as a backup of log4javascript
	function saveLogToLocalFile() {
		// ensure the log exists
		if(!log){
			alertLogError("Error: log is not set. No data tracked or saved.");
			return
		}
		var filename=logConfig["localLogFilename"] ||"ProcessDataLog.txt";
		// get all appenders. There may or may not be a StringAppender in there.
		var appenderList = log.getEffectiveAppenders();
		// loop through the appenders to save all strAppenders
		for (var i in appenderList) {
			// if this is a StringAppender
			if (appenderList[i].toString() === "StringAppender") {
				// only save if log length is >0
				var logContent = appenderList[i].getLog();
				if (logContent.length>0) {
					// save the log; in the case there are multiple stringAppenders, filename will be saved as xxx(1).txt
					logMessage("SAVELOCAL\t"+JSON.stringify({filename:filename, length:logContent.length}));
					var blob = new Blob(
						[appenderList[i].getLog()],
						{type: "text/plain;charset=utf-8"});
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
		if(!log){
			alertLogError("Error: log is not set. No data tracked or saved.");
			return
		}
		// flush it with this so that the buffer can be ready to send.
		for (var i = 0; i < ((logConfig["AjaxBatchSize"]+2)||12); i++ ) {
			logMessage("==========================================================================");
		}
		// wait for n-sec, and keep flushing
		var t0 = new Date().getTime();
		var appenderList = log.getEffectiveAppenders();
		// this is kinda stupid: we have to wait
		while (new Date().getTime() - t0 <logConfig["AjaxTimerInterval"]*2) {
			for (var i in appenderList) {
				// only for ajaxAppenders
				try {
					appenderList[i].sendAll();
				}
				catch (err) {
				}
			}
		}
	}
