import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../../../../../colors";
import { connect } from "react-redux";
import { AppState } from "../../../../../modules/indexReducer";
import Axios from "axios";
import {
  addToConversation,
  emitAdditionToConversation,
  emitRemovalFromConversation,
  removeFromConversation
} from "../../../../../APIs/handleRelay/editConversation";

const Container = styled.div`
  padding: 3em;
`;

const Label = styled.div`
  font-size: 1.5em;
`;
const InputParticipants = styled.input`
  margin-top: 1em;
  margin-bottom: 0.75em;
  border: 0.05em solid rgba(100, 100, 100, 0.5);
  padding: 0.5em;
  border-radius: 0.2em;
  outline: none;
  font-size: 1em;
  width: 100%;
`;

const Participants = styled.div`
  font-size: 1.2em;
  margin: 0.5em 0;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: ${Colors.red};
  }
`;

const Error = styled.div`
  color: ${Colors.red};
  font-size: 0.8em;
  margin: 0.5em 0;
`;

interface IProps {
  allparticipants: { [conversation: string]: string[] };
  activeConv: string | null;
  username: string;
}

const SettingsPage: React.FC<IProps> = (props: IProps) => {
  const currentParticipants = props.allparticipants[props.activeConv as string];

  const [participant, changeParticipant] = useState("");
  const [addingError, changeAddingError] = useState("");

  const addParticipant = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    if (currentParticipants.indexOf(participant) !== -1) {
      changeAddingError("That user is already added to conversation");
      return;
    }
    const user = await Axios.post("/api/userexist", { username: participant });
    if (!user.data) {
      changeAddingError("No such user exist");
      return;
    }

    changeAddingError("");
    // now we must insert
    emitAdditionToConversation(
      props.activeConv as string,
      participant,
      currentParticipants
    );
    addToConversation(participant, props.activeConv as string);
  };

  const removeParticipant = async (participant: string) => {
    emitRemovalFromConversation(
      props.activeConv as string,
      participant,
      currentParticipants
    );
    removeFromConversation(participant, props.activeConv as string);
  };

  return (
    <Container>
      <Label>
        Add Participants <i className="fas fa-user-plus" />
      </Label>
      <InputParticipants
        placeholder="Enter username and press enter"
        value={participant}
        onChange={e => changeParticipant(e.target.value)}
        onKeyPress={e => addParticipant(e)}
      />
      {addingError.length > 0 && (
        <Error>
          <i className="fas fa-exclamation-triangle" /> {addingError}
        </Error>
      )}

      <br />
      <br />
      <br />
      <Label>Participants</Label>
      <br />

      {currentParticipants.map(part => {
        if (props.username === part) return;

        return (
          <Participants key={part} onClick={() => removeParticipant(part)}>
            <span>{part}</span>
            <i className="fas fa-trash" />
          </Participants>
        );
      })}
    </Container>
  );
};

const mapstate = (state: AppState) => {
  return {
    allparticipants: state.app.conversation.participantInfo,
    activeConv: state.app.conversation.activeConversation,
    username: state.authenticationState.userName
  };
};

export default connect(mapstate)(SettingsPage);
