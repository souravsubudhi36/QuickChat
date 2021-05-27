import React from "react";
import styled from "styled-components";
import LeftBar from "../../components/App/BrowseConverations/sideBar";
import CurrentConversation from "../../components/App/CurrentConversation/main";
import { connect } from "react-redux";
import { AppState } from "../../modules/indexReducer";

const MobileContainer = styled.div`
  height: 100%;
  overflow: hidden;
`;

interface IProps {
  active: string | null;
}

const Conversation: React.FC<IProps> = (props: IProps) => {
  return (
    <React.Fragment>
      <MobileContainer>
        {props.active ? <CurrentConversation mobileMode={true} /> : <LeftBar />}
      </MobileContainer>
    </React.Fragment>
  );
};

const mapstate = (state: AppState) => {
  return {
    active: state.app.conversation.activeConversation
  };
};

export default connect(mapstate)(Conversation);
