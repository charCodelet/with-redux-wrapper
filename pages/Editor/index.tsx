import React, { ReactElement, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';

const Editor = (): ReactElement => {
  const { storeWiris } = useActions(); // prettier-ignore
  useEffect(() => {
    let editor = com.wiris.jsEditor.JsEditor.newInstance({language: "en"});
    editor.insertInto(document.getElementById("editorContainer"));
    storeWiris(editor);
  },[])
  return (
    <>
       <div 
          id="editorContainer"
          style={{
            position: 'absolute',
            visibility: 'hidden',
            zIndex: 0,
            width: '62%',
            height: '64px',
          }} 
        >  
        </div>
    </>
  );
};

export default Editor;
