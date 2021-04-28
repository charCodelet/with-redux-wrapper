import React, { ReactElement } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Editor = (): ReactElement => {
  return (
    <CKEditor
      editor={ ClassicEditor }
      data="<p>Hello from CKEditor 5!</p>"
      onReady={ (editor: any) => {
          console.log( 'Editor is ready to use!', editor );
      } }
      onChange={ ( event: any, editor: { getData: () => any; } ) => {
          const data = editor.getData();
          console.log( { event, editor, data } );
      } }
      onBlur={ ( _event: any, editor: any ) => {
          console.log( 'Blur.', editor );
      } }
      onFocus={ ( _event: any, editor: any ) => {
          console.log( 'Focus.', editor );
      } }
    />
  );
};

export default Editor;

