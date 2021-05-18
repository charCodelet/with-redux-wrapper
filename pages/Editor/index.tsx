import React, { ReactElement, useState, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';

const Editor = (): ReactElement => {
  const { storeWiris, multipleSelect } = useActions(); // prettier-ignore
  const [width, setWidth] = useState("300px");
  const [height, setHeight] = useState("80px");
  const { tabs } = useTypedSelector((state) => state);

  useEffect(() => {
    let editor = com.wiris.jsEditor.JsEditor.newInstance({language: "en"});
    editor.insertInto(document.getElementById("editorContainer"));
    storeWiris(editor);
    document.querySelector('#editorContainer > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay > div > input').addEventListener('input', e => {
      // console.log(`'text_input_value', ${e.data}, ${tabs.tabNumber}`)
      multipleSelect('text_input_value', e.data, tabs.tabNumber);
    });
    if(document.getElementById("yabba")) {
      setWidth(window.getComputedStyle(document.getElementById("yabba")).width);
      // setHeight(window.getComputedStyle(document.getElementById("yabba")).height)
    }
  }, [tabs]);
  
 
  return (
    <>
       <div 
          id="editorContainer"
          style={{
            position: 'absolute',
            visibility: 'hidden',
            zIndex: 0,
            width: width,
            height: height,
            // overflow: 'hidden',
            // height: '328px !important',
            // maxHeight: '328px !important',
          }} 
        >  
        </div>
    </>
  );
};

export default Editor;
