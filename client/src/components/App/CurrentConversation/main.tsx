import React from "react";
import styled from "styled-components";
import MessageBar from "./main/messageBar";
import Conversation from "./main/convArea";
import { connect } from "react-redux";
import { AppState } from "../../../modules/indexReducer";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
`;

interface IProps {
  active: string | null;
  mobileMode?: true;
}

const CurrentConversation: React.FC<IProps> = (props: IProps) => {
  return (
    <Container>
      <Conversation mobileMode={props.mobileMode || false} />
      {props.active && <MessageBar />}
    </Container>
  );
};

const mapstate = (state: AppState) => {
  return {
    active: state.app.conversation.activeConversation
  };
};

export default connect(mapstate)(CurrentConversation);
