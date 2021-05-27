import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ModalPopup from "../../newConvModal";

const Container = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 1.5em;
  float: right;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

const AddNewConversationButton: React.FC = () => {
  const [open, changeOpen] = useState(false);

  return (
    <React.Fragment>
      <Container onClick={() => changeOpen(true)}>
        <i className="fas fa-comment-alt" />
      </Container>
      {open && <ModalPopup close={() => changeOpen(false)} />}
    </React.Fragment>
  );
};

export default AddNewConversationButton;
