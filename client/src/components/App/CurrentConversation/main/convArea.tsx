import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { connect } from "react-redux";
import { AppState } from "../../../../modules/indexReducer";
import { ILocalMessage } from "../types";
import { getDataFromCache } from "../../../../APIs/indexedDB/messages";
import {
  SyncMessagesOnSelection,
  DumpMessages,
  SelectConversation
} from "../../../../modules/app/conversation/actionCreator";

import Colors from "../../../../colors";
import store from "../../../../store";
import ConvHeader from "./convArea/ConvHeader";
import SettingsPage from "./convArea/settingsPage";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.5em 0.5em;
  padding-bottom: 6.5em;
  padding-top: 0;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  animation: ${fadeIn} 250ms;
`;
const MessageContainer = styled.div`
  position: relative;
  display: inline-block;
`;
const TopRightArrow = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0.5em 0.5em 0;
  border-color: transparent black transparent transparent;
  position: absolute;
  top: 0.15em;
  left: -0.3em;
`;
const TopLeftArrow = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.5em 0.5em 0 0;
  border-color: black transparent transparent transparent;
  position: absolute;
  top: 0.15em;
  right: -0.3em;
`;
const MessageBody = styled.div<{ isSelf: boolean }>`
  border-radius: 0.25em;
  border-top-left-radius: ${props => (props.isSelf ? "0.25em" : 0)};
  border-top-right-radius: ${props => (props.isSelf ? 0 : "0.25em")};
  border: ${props => (props.isSelf ? "none" : "2px solid black")};
  padding: 0.35em;
  background: ${props => (props.isSelf ? Colors.black : Colors.white)};
  color: ${props => (props.isSelf ? Colors.white : Colors.black)};
  margin: 0.15em;
  text-align: ${props => (props.isSelf ? "right" : "left")};
`;

const NewLineWrapper = styled.div<{ isSelf: boolean }>`
  display: block;
  direction: ${props => (props.isSelf ? "rtl" : "ltr")};
  margin-bottom: 0.2em;
`;

const MessageFrom = styled.div`
  display: block;
  font-size: inherit;
  margin-bottom: 0.1em;
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.9em;
`;

const AdminBubble = styled.div`
  border-radius: 5px;
  background: ${Colors.lightBlack};
  opacity: 0.5;
  padding: 0.25em 0.5em;
  font-size: 1em;
  display: inline-block;
`;

const Wordart = styled.div`
  font-size: 2em;
  color: ${Colors.black};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  cursor: default;
`;

interface IProps {
  conversations: ILocalMessage[];
  userName: string;
  activeConversation: string | null;
  syncMessages(messages: ILocalMessage[]): void;
  dumpMessages(): void;
  goBack(): void;
  twoParticipants?: boolean;
  mobileMode: boolean;
}

const checkIf2Participants = () => {
  const state = store.getState().app.conversation;
  if (
    state.activeConversation &&
    state.participantInfo[state.activeConversation]
  ) {
    return state.participantInfo[state.activeConversation].length === 2
      ? true
      : false;
  } else {
    return false;
  }
};

const checkIfPersonal = (parsedName: string) => {
  if (
    parsedName.slice(0, 2) == "_$" &&
    parsedName.slice(parsedName.length - 2, parsedName.length) == "$_"
  )
    return true;

  return false;
};

const Conversation: React.FC<IProps> = (props: IProps) => {
  const participant_2 = useRef<boolean>(false);

  useEffect(() => {
    participant_2.current =
      checkIf2Participants() &&
      checkIfPersonal(props.activeConversation || "xxxxx");
  }, [props.activeConversation]);

  if (!props.activeConversation)
    return (
      <Container>
        <Wordart>QuickChat</Wordart>
      </Container>
    );

  return (
    <ConversationView
      {...props}
      twoParticipants={participant_2.current}
      mobileMode={props.mobileMode}
    />
  );
};

const scrollToBottom = () => {
  var objDiv = document.getElementById("scrollDownOnMessage");
  if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
};

const holdScrollPosition = (val: number) => {
  var objDiv = document.getElementById("scrollDownOnMessage");
  if (objDiv) objDiv.scrollTop = objDiv.scrollHeight - val;
};

const ConversationView: React.FC<IProps> = (props: IProps) => {
  const [settings, changeSettings] = useState(false);

  const stayScroll = useRef(false);
  const prevHeight = useRef(0);
  const cursor = useRef<number | undefined>();

  const syncMessages = async (isNew?: true) => {
    let myCursor = isNew ? undefined : cursor.current;
    console.log("Our cursor", myCursor);
    const data = await getDataFromCache(
      props.activeConversation as string,
      myCursor
    );
    if (data) {
      console.log("new cursor", data.cursor);
      cursor.current = data.cursor;
      props.syncMessages(data.messages);
    }
  };

  const handleLoad = () => {
    const container = document.getElementById("scrollDownOnMessage");
    //@ts-ignore
    if (container && container.scrollTop === 0) {
      console.log("reached top");
      prevHeight.current = container.scrollHeight;
      console.log("STARTING LOAD CURSOR", cursor.current);
      if (cursor.current) {
        syncMessages();
        stayScroll.current = true;
      }
    }
  };

  useEffect(() => {
    if (!stayScroll.current) {
      scrollToBottom();
    } else {
      holdScrollPosition(prevHeight.current);
    }

    stayScroll.current = false;
  }, [props.conversations.length]);

  useEffect(() => {
    if (props.activeConversation) {
      syncMessages(true);
      setTimeout(() => {
        const container = document.getElementById("scrollDownOnMessage");
        console.log(container);
        if (container) {
          console.log("added listner");
          container.addEventListener("scroll", handleLoad);
        }
      }, 200);
    }

    return () => {
      props.dumpMessages();
      const container = document.getElementById("scrollDownOnMessage");
      console.log("dumping scroll", container);
      if (container) {
        container.removeEventListener("scroll", handleLoad);
      }
    };
  }, [props.activeConversation]);

  if (props.conversations.length === 0) {
    return null;
  }

  if (settings) {
    return (
      <React.Fragment>
        <ConvHeader
          mobileMode={true}
          goBack={() => {
            changeSettings(false);
          }}
          goToSettings={() => {}}
        />
        <SettingsPage />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ConvHeader
        mobileMode={props.mobileMode}
        goBack={props.goBack}
        goToSettings={() => changeSettings(true)}
      />
      <Container id="scrollDownOnMessage">
        {props.conversations.map((message, i) => {
          return (
            <Message
              renderfrom={!props.twoParticipants || false}
              key={i}
              {...message}
              userName={props.userName}
            >
              {" "}
            </Message>
          );
        })}
      </Container>
    </React.Fragment>
  );
};

interface IMessage extends ILocalMessage {
  userName: string;
  renderfrom: boolean;
}

const Message: React.FC<IMessage> = (props: IMessage) => {
  if (props.from === "__Admin__") {
    return (
      <div
        style={{
          textAlign: "center",
          cursor: "default",
          margin: "0.4em 0"
        }}
      >
        <AdminBubble>{props.payload}</AdminBubble>
      </div>
    );
  }

  const isSelf = props.from === props.userName ? true : false;

  return (
    <NewLineWrapper isSelf={isSelf}>
      <MessageContainer>
        {isSelf ? <TopLeftArrow /> : <TopRightArrow />}

        <MessageBody isSelf={isSelf}>
          {props.renderfrom && !isSelf ? (
            <MessageFrom>{props.from}</MessageFrom>
          ) : null}
          {props.payload}
        </MessageBody>
      </MessageContainer>
    </NewLineWrapper>
  );
};

const mapState = (state: AppState) => {
  return {
    conversations: state.app.conversation.conversationArray,
    userName: state.authenticationState.userName,
    activeConversation: state.app.conversation.activeConversation
  };
};

const mapdispatch = (dispatch: any) => {
  return {
    syncMessages: (messages: ILocalMessage[]) => {
      dispatch(SyncMessagesOnSelection(messages));
    },
    dumpMessages: () => {
      dispatch(DumpMessages());
    },
    goBack: () => {
      dispatch(DumpMessages());
      dispatch(SelectConversation(null));
    }
  };
};

export default connect(
  mapState,
  mapdispatch
)(Conversation);
