import React from "react";
import styled from "styled-components";
import Header from "./sideBar/header";
import { connect } from "react-redux";
import { AppState } from "../../../modules/indexReducer";
import {
  SelectConversation,
  DumpMessages,
  UpdateUnreadsAction
} from "../../../modules/app/conversation/actionCreator";
import Colors from "../../../colors";
import { updateUnreadsinCache } from "../../../APIs/indexedDB/conversationData";

const Container = styled.div`
  width: 100%;
  height: calc(100% - 3em);
  overflow-x: hidden;
  overflow-y: auto;
  border-right: 1px solid ${Colors.lightBlack};
`;

const Conversation = styled.div<{ active: boolean }>`
  border-bottom: 1px solid ${Colors.lightBlack};

  padding: 0.2em 0.7em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => (props.active ? Colors.grey : Colors.white)};
  opacity: ${props => (props.active ? 0.6 : 1)};
  cursor: pointer;
  font-size: 1.5em;
`;

const UnreadCount = styled.div`
  border-radius: 50%;
  height: 0.5em;
  width: 0.5em;
  padding: 0.5em;
  font-size: 0.6em;
  background: black;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
`;

const UnreadLabel = styled.div`
  font-size: 0.8em;
  width: 100%;
  text-align: center;
`;

const ProfileImage = styled.div`
  flex: 2;
  color: inherit;
  font-size: 1.8em;
`;
const ConvLabel = styled.div`
  flex: 8;
  padding: 0.25em;
  padding-left: 0.5em;
  font-size: 0.75em;
`;

interface IProps {
  conversations: string[] | null;
  selectConveration(conv: string): void;
  activeConversation: string | null;
  username: string;
  unreads: { [x: string]: number };
}

const LeftBar: React.FC<IProps> = (props: IProps) => {
  return (
    <React.Fragment>
      <Header />
      <Container>
        {props.conversations &&
          props.conversations.map((conv, i) => {
            const isActive = props.activeConversation === conv;
            const unread = props.unreads[conv] || 0;
            let parsedName = conv;
            if (
              parsedName.slice(0, 2) == "_$" &&
              parsedName.slice(parsedName.length - 2, parsedName.length) == "$_"
            ) {
              const options = parsedName.split("$");
              if (options[1] === props.username) parsedName = options[2];
              if (options[2] === props.username) parsedName = options[1];
            }
            return (
              <Conversation
                active={isActive}
                key={i}
                onClick={() => {
                  if (props.activeConversation !== conv) {
                    props.selectConveration(conv);
                  }
                }}
              >
                <ProfileImage>
                  <i className="fas fa-user-circle" />
                </ProfileImage>
                <ConvLabel>{parsedName}</ConvLabel>
                {unread !== 0 && (
                  <UnreadCount>
                    <span>{unread}</span>
                  </UnreadCount>
                )}
              </Conversation>
            );
          })}
      </Container>
    </React.Fragment>
  );
};

const mapstate = (state: AppState) => {
  return {
    conversations: state.app.conversation.allConversations,
    activeConversation: state.app.conversation.activeConversation,
    username: state.authenticationState.userName,
    unreads: state.app.conversation.unreads
  };
};

const mapdispatch = (dispatch: any) => {
  return {
    selectConveration: (conversation: string) => {
      dispatch(DumpMessages());
      dispatch(SelectConversation(conversation));
      dispatch(UpdateUnreadsAction({ [conversation]: 0 }));
      updateUnreadsinCache(conversation, 0);
    }
  };
};

export default connect(
  mapstate,
  mapdispatch
)(LeftBar);
