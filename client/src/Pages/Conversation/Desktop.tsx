import React from "react";
import styled from "styled-components";
import LeftBar from "../../components/App/BrowseConverations/sideBar";
import CurrentConversation from "../../components/App/CurrentConversation/main";

const DesktopContainer = styled.div`
  display: flex;
  height: 100%;
`;

const LeftContainer = styled.div`
  flex: 4;
  z-index: 100;
`;

const RightContainer = styled.div`
  flex: 6;
  overflow: hidden;
`;

const Conversation: React.FC = () => {
  return (
    <React.Fragment>
      <DesktopContainer>
        <LeftContainer>
          <LeftBar />
        </LeftContainer>
        <RightContainer>
          <CurrentConversation />
        </RightContainer>
      </DesktopContainer>
    </React.Fragment>
  );
};

export default Conversation;
