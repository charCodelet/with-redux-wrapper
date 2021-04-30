'use strict';

CKEDITOR.plugins.add('paginator', {
    init: function (editor) {
        editor.once('contentDom', function () {
            paginator.initialize(editor);
            editor.on('change', paginator.paginate);
        });
    }
});

var paginator = (function() {
    'use strict';

    var ckEditor = null,
        innerDoc = null,
        cachedText = '',
        ignoreEvents = false,
        pageHeight = 12240;

    return {

        // methods
        initialize: function(editorObject) {
            ckEditor = editorObject;
            innerDoc = editorObject.document.$;
        },

        paginate: function() {

            //  Schedule the pagination kickoff for later to avoid undefined exception on "body" not being available!
            setTimeout(function () {

                if (ignoreEvents) {
                    return;
                }
                var fullTextBlockHeight = $(innerDoc.body).height();
                if (fullTextBlockHeight > pageHeight) {
                    ckEditor.setReadOnly(true);

                    // Truncate to 410 lines worth, fire length exceeded message
                    ckEditor.fire('pageLimitExceeded');

                    ignoreEvents = true;
                    ckEditor.document.getBody().setHtml(cachedText);
                    ckEditor.resetDirty();
                    ignoreEvents = false;
                }
                else {
                    cachedText = ckEditor.document.getBody().getHtml();
                }
            }, 100);
        }
    };

})();

