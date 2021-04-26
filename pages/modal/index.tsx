import React from "react";
import ReactDOM from "react-dom";
import Dialog from './../../pages/benchmark/Dialog'
import { ModalContext } from "../modalContext";

const Modal = () => {
  console.log('click modal');
  
  let { modalContent, handleModal, modal } = React.useContext(ModalContext);
  if (modal) {
    return ReactDOM.createPortal(
      <div
        style={{
          fontFamily: "Calibri, Arial, Helvetica, sans-serif",
          position: 'absolute',
          width: '300px',
          height: '300px',   
          left: '50%',
          top: '50%',
          marginLeft: '-150px',
          marginTop: '-150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bottom: '0',
          // left: '0',
          // position: 'fixed',
          right: '0',
          // top: '90rem',
          zIndex: 1000,
          // height: '100%',
          padding: '0',
          margin: '0',
          
        
        
        
        
        }}
        // className="fixed top-0 left-0 h-screen w-full flex items-center justify-center"
        // style={{ background: "rgba(0,0,0,0.8)" }}
      >
        <div 
        // className="bg-white relative p-5 shadow-lg rounded flex flex-col items-start text-lg text-gray-800"
          style={{
            maxWidth: '28em',
            background: 'inherit',
            border: '.05em solid transparent',
            borderRadius: '.25em',
            boxShadow: '0 0 3em 0.25em rgb(0 0 0 / 35%), 0 0 0.75em rgb(0 0 0 / 35%)',
            display: 'flex',
            flex: '0 0 auto',
            flexDirection: 'column',
            flexWrap: 'wrap',
            margin: 'auto',
            opacity: '1',
            position: 'relative',
            transform: 'translateY(0)',
            transition: 'background .2s,border .2s,transform .2s,opacity .2s',
          }}
        >
          <div style={{padding: '2em', overflow: 'auto'}}>
            <div>
              <div 
                style={{
                  width: '100%',
                  borderTop: 'none',
                  padding: '0',
                  display: 'flex',
                  flexFlow: 'row nowrap',
                  justifyContent: 'center',
                  alignItems: 'stretch'
                }}             
              >
                <p 
                 style={{
                  width: '100%',
                  margin: '0 0 2em',
                  paddingBottom: '0'
                }}
                >It is time to move on to the next section.</p>
              </div>
            <div 
              style={{
                width: '100%',
                borderTop: 'none',
                padding: '0',
                display: 'flex',
                flexFlow: 'row nowrap',
                justifyContent: 'center',
                alignItems: 'stretch'
              }}  
            >
              <p 
                style={{
                  width: '100%',
                  margin: '0 0 2em',
                  paddingBottom: '0'
                }}
              >Your work on this section has been saved.</p>
            </div>
          </div>
          <div 
            style={{
              width: '100%',
              borderTop: 'none',
              padding: '0',
              display: 'flex',
              flexFlow: 'row nowrap',
              justifyContent: 'flex-end',
              alignItems: 'stretch'
            }}    
          >
            <div 
              // style={{
              //   width: '21%',
              //   marginLeft: 'auto',
              //   marginRight: '5%'
              // }}
            >
              <button 
                onClick={() => handleModal()}
                style={{
                  height: '100%',
                  background: '#0068d1',
                  border: '.1em solid transparent',
                  borderRadius: '.17em',
                  boxShadow: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'inline-block',
                  letterSpacing: '.02em',
                  lineHeight: '1',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 400,
                  margin: '0 .25em',
                  padding: '.55em 1.4em',
                  position: 'relative',
                  textAlign: 'center',
                  textDecoration: 'none',
                  textShadow: 'none',
                  transition: 'background .2s,border .2s,box-shadow .2s,color .2s',
                  userSelect: 'none',
                  verticalAlign: 'middle'
                }}
              
              >OK</button>
            </div>
          </div>
        </div>
          {/* <p>{modalContent}</p> */}
      </div>
    </div>,
    document.querySelector("#modal-root")
    );
  } else return null;
};

export default Modal;
