import React, { useState } from "react";
import styled from "styled-components";

import { ISocketMessage } from "../types";
import { sendMessage } from "../../../../APIs/handleRelay/newMessage";

import { connect } from "react-redux";
import { AppState } from "../../../../modules/indexReducer";
import Colors from "../../../../colors";

const Container = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 0.5em;
  background: white;
`;
const Bar = styled.input`
  border: 1px solid ${Colors.black};
  padding: 10px 10px;
  box-sizing: border-box;
  border-radius: 1em;
  width: calc(100% - 5em);
  display: inline-block;
  outline: none;
`;

const Send = styled.button`
  border: none;
  outline: none;
  border-radius: 1em;
  padding: 0.75em 1.5em;
  background: ${Colors.black};
  color: ${Colors.white};
  display: inline-block;
  margin-left: 0.5em;
  cursor: pointer;

  &:hover {
    color: ${Colors.black};
    background: ${Colors.white};
  }
`;

interface IProps {
  participants: { [conversation: string]: string[] };
  username: string;
  active: string | null;
}

const MessageBar: React.FC<IProps> = (props: IProps) => {
  const [message, changeMessage] = useState("");

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleSend = () => {
    const socketMessage: ISocketMessage = {
      from: props.username,
      to: props.active as string,
      payload: message,
      recipients: props.participants[props.active as string]
    };
    console.log(socketMessage);
    sendMessage(socketMessage);
    changeMessage("");
  };

  return (
    <Container>
      <Bar
        type="text"
        onKeyDown={e => handleEnter(e)}
        value={message}
        onChange={e => changeMessage(e.target.value)}
      />
      <Send onClick={handleSend}>
        <i className="fas fa-paper-plane" />
      </Send>
    </Container>
  );
};

const mapstate = (state: AppState) => {
  return {
    participants: state.app.conversation.participantInfo,
    username: state.authenticationState.userName,
    active: state.app.conversation.activeConversation
  };
};

export default connect(mapstate)(MessageBar);
