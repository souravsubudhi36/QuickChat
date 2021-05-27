import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../../../../modules/indexReducer";

import AddNewConversationButton from "./Header/newConvButton";
import Colors from "../../../../colors";
import OptionsElipses from "./Header/optionsElipses";

const Container = styled.div`
  width: 100%;
  padding: 0.7em 1em;
  height: 3em;
  box-sizing: border-box;
  background: ${Colors.grey};
  border: 1px solid ${Colors.lightBlack};
`;

const Logo = styled.div`
  font-size: 1.5em;
  display: inline-block;
  color: rgba(0, 0, 0, 0.5);
`;
interface IProps {
  userName: string;
}

const Header: React.FC<IProps> = (props: IProps) => {
  return (
    <Container>
      <Logo>
        <i className="fas fa-bolt" />
      </Logo>
      <OptionsElipses />
      <AddNewConversationButton />
    </Container>
  );
};

const mapstate = (state: AppState) => {
  return {
    userName: state.authenticationState.userName
  };
};

export default connect(mapstate)(Header);
