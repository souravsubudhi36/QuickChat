import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../../../../../colors";
import store from "../../../../../store";
import { ChangeAuthAction } from "../../../../../modules/auth/actionCreator";

const Container = styled.div`
  float: right;
  cursor: pointer;
  font-size: 1.5em;
  color: rgba(0, 0, 0, 0.5);
  &:hover {
    color: black;
  }
  margin-left: 0.5em;
`;

const Elipses = styled.div`
  font-size: 1em;
  cursor: pointer;
  position: relative;
  width: 2em;
  text-align: center;
`;

const DropDown = styled.div`
  position: absolute;
  top: 1.5em;
  right: 0.8em;
  width: 5em;
  background: ${Colors.white};
  border: 2px solid ${Colors.lightBlack};
  z-index: 1000;
  font-size: 0.8em;
`;

const Signout = styled.div`
  width: 100%;
  padding: 0.4em;
  cursor: pointer;
`;

const OptionsElipses: React.FC = () => {
  const [openDD, changeDD] = useState(false);

  return (
    <Container>
      <Elipses
        onClick={() => {
          changeDD(true);
          setTimeout(() => {
            changeDD(false);
          }, 1500);
        }}
      >
        <i className="fas fa-ellipsis-v" />
        {openDD && (
          <DropDown>
            <Signout
              onClick={() => {
                store.dispatch(ChangeAuthAction(null));
              }}
            >
              Signout
            </Signout>
          </DropDown>
        )}
      </Elipses>
    </Container>
  );
};
export default OptionsElipses;
