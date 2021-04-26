import React from "react";
import { ModalContext } from "../modalContext";

const Component = () => {
  let { handleModal } = React.useContext(ModalContext);

  // React.useEffect(() => {
  //   handleModal("This is component 2 modal content on page load");
  // }, []);

  return (
    <>
      {/* <p className="mt-12">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque quidem
        asperiores modi repellendus molestias dolore totam corrupti molestiae
        nesciunt ratione, rerum omnis sed, earum quam eveniet perspiciatis fugit
        animi expedita eaque ipsa incidunt. Officia maiores veritatis quo unde
        expedita consequatur?
      </p> */}
      <button
        style={{position: 'absolute', top: '400px', zIndex: 30}}
        className="mt-6 rounded  bg-purple-700 text-purple-100 px-5 h-12"
        onClick={() => handleModal("This is component 2 modal content")}
      >
        open this modal!
      </button>
    </>
  );
};

export default Component;
