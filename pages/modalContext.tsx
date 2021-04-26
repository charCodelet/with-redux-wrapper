import React from "react";
import useModal from "./useModal";
import Modal from "./modal";

let ModalContext;
let { Provider } = (ModalContext = React.createContext(null));

let ModalProvider = ({ children }) => {
  console.log('sdfgdsgfds');
  let { modal, handleModal, modalContent } = useModal();
  return (
    <Provider value={{ modal, handleModal, modalContent }}>
      <Modal />
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
