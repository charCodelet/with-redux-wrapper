import React, { ReactElement } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import MathType from '@wiris/mathtype-ckeditor5/src/plugin'; // we do not need this anymore since it is part of our new build in ckeditor...

const Editor = (): ReactElement => {
  ClassicEditor.create( document.querySelector('#editor'), {toolbar: ['MathType', 'bold', 'italic']}).catch((error: any) => console.log(error));
  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        onReady={(editor: any) => console.log('Editor is ready to use!', editor)}
        onChange={(event: any, editor: {getData: () => any}) => {
          console.log(editor.getData());
          // console.log({event, editor}, editor.getData())}
        }}
        onBlur={(_event: any, editor: any) => console.log('Blur.', editor)}
        onFocus={( _event: any, editor: any) => console.log('Focus.', editor)}
      />
    </>
  );
};

export default Editor;

