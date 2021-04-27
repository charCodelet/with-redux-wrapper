import React, { ReactElement } from 'react';
import Dialog from '../benchmark/Dialog';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';


const Modal = (): ReactElement => {
  const { dialogShow } = useTypedSelector((state: { dialog: any; }) => state.dialog);
  const { showDialog } = useActions();
  const onClose = () => showDialog(!dialogShow);
  return (
    <Dialog 
      title="Click outside to close"
      isOpen={dialogShow}
      onClose={onClose}  
      isDismissable={true}
    >
      <div
        style={{
          fontSize: '24px',
          fontFamily: "Calibri, Arial, Helvetica, sans-serif", 
          left: '50%',
          top: '50%',
          marginLeft: '-150px',
          marginTop: '-150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bottom: '0',       
          right: '0',      
          zIndex: 1000,
          padding: '0',
          margin: '0',      
        }}
      >
        <div 
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
              style={{
                width: '21%',
                marginLeft: 'auto',
                marginRight: '5%'
              }}
            >
              <button 
                onClick={onClose}
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
      </div>
    </div>
    </Dialog>
  );
};

export default Modal;

