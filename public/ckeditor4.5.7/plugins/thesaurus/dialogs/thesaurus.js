/*
    Dialog for eNAEP thesaurus plugin for CKEditor
*/

CKEDITOR.dialog.add('thesaurus', function(editor) {
    return {
        title: 'Thesaurus',
        minWidth: 300,
        minHeight: 120,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents: [
            {
                id: 'ThesaurusTab',
                label: 'Thesaurus',
                title: 'Thesaurus',
                elements: [
                    {
                        //type: 'fieldset',
                        //style: 'border: none;margin-top: 13px;padding: 10px 0 10px 10px',
                        //children: [
                        //    {
                        type: 'hbox',
                        id: 'outer_box',
                        children: [
                            {
                                type: 'vbox',
                                id: 'leftbox',
                                //widths: ['100%', '100%'],
                                children: [
                                    {
                                        type: 'text',
                                        id: 'lookedUpWord',
                                        width: '150px',
                                        labelLayout: 'vertical',
                                        label: 'Looked Up:'
                                    },
                                    {
                                        type: 'select',
                                        id: 'meaningsBox',
                                        inputStyle: 'width: 150px; height: auto;',
                                        labelLayout: 'vertical',
                                        label: 'Meanings:',
                                        size: '7',
                                        items: [['loading...']]
                                    }
                                ]
                            },
                            {
                                type: 'vbox',
                                id: 'rightbox',
                                children: [
                                    {
                                        type: 'text',
                                        id: 'replaceWord',
                                        width: '150px',
                                        labelLayout: 'vertical',
                                        label: 'Replace With:'
                                    },
                                    {
                                        type: 'select',
                                        id: 'synonymsList',
                                        inputStyle: 'width: 150px; height: auto;',
                                        //labelLayout: 'vertical',
                                        //label: 'Meanings',
                                        size: '8',
                                        items: [['loading...']]
                                    }
                                ]
                            }
                        ],
                        onShow: function() {

                        }
                        //    }
                        //]
                    }
                ]
            }
        ],
        buttons: [
            CKEDITOR.tools.extend({
                id: 'changeButton',
                type: 'button',
                style: 'width:75px',
                label: 'Change'
                //'class': 'cke_dialog_ui_button_ok'
            }),
            CKEDITOR.tools.extend({
                id: 'lookupButton',
                type: 'button',
                style: 'width:75px',
                label: 'Look Up'
                //'class': 'cke_dialog_ui_button_ok'
            }),
            CKEDITOR.tools.extend({
                id: 'prevButton',
                type: 'button',
                style: 'width:75px',
                label: 'Previous'
                //'class': 'cke_dialog_ui_button_ok'
            }),
            CKEDITOR.dialog.cancelButton(editor, {
                style: 'width:75px'
            })
        ],
        onOk: function() {
        }
    };

});
