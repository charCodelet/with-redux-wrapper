// 'use strict';
// /**
//  * Enaep udpated, changed pageLimitCheck to 10 pages
//  */

// CKEDITOR.plugins.add('paginator', {
//   init: function(editor) {
//     editor.once('contentDom', function() {
//       paginator.initialize(editor);
//       editor.on('change', paginator.paginate);
//     });
//   }
// });

// var paginator = (function() {
//   'use strict';

//   var ckEditor = null,
//     innerDoc = null,
//     cachedText = '',
//     ignoreEvents = false,
//     // orig  pageHeight = 12240;
//     pageHeight = 1445;

//   return {
//     // methods
//     initialize: function(editorObject) {
//       ckEditor = editorObject;
//       innerDoc = editorObject.document.$;
//     },

//     paginate: function() {
//       //  Schedule the pagination kickoff for later to avoid undefined exception on "body" not being available!
//       setTimeout(function() {
//         if (ignoreEvents) {
//           return;
//         }
//         var fullTextBlockHeight = $(innerDoc.body).height();
//         // orig if (fullTextBlockHeight > pageHeight) {
//         //      ckEditor.setReadOnly(true);
//         if (fullTextBlockHeight > pageHeight * 10) {
//           // Truncate to 10 pages worth, fire length exceeded message
//           ckEditor.fire('pageLimitExceeded');

//           ignoreEvents = true;
//           ckEditor.document.getBody().setHtml(cachedText);
//           ckEditor.resetDirty();
//           ignoreEvents = false;
//         } else {
//           cachedText = ckEditor.document.getBody().getHtml();
//         }
//       }, 100);
//     }
//   };
// })();
