import React from "react";
import "./Modals.css";

function Modals(props) {
  return (
    <div className="modal"
    onClick={() => (props.onClose())}
    >
      <div className="modal_content custom-scroll"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Modals;
