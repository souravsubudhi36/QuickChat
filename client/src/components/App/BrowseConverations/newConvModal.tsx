import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useEffect } from "react";
import { disableScroll, enableScroll } from "./Modal/preventScroll";
import {
  createLocalconversation,
  EmitNewConversationData
} from "../../../APIs/handleRelay/newConversation";
import store from "../../../store";
import Colors from "../../../colors";
import { connect } from "react-redux";
import { AppState } from "../../../modules/indexReducer";
import Axios from "axios";

const comeInFromTop = keyframes`
  0% {
    top : -10%;
  }

  100% {
    top : 50%;
  }

`;

const goOutFromTop = keyframes`
  0% {
    top : 50%;
  }

  100% {
    top : -100%;
  }

`;

const fadeOut = keyframes`
  0% {
    opacity: 1
  }

  100% {
    opacity: 0
  }
`;

const ModalContainer = styled.div`
  z-index: 10000;
  font-size: 0.9em;
`;

const Modal = styled.div<{ incoming: boolean }>`
  animation: ${props => (props.incoming ? comeInFromTop : goOutFromTop)} 400ms;
  width: 60%;
  height: 60%;
  position: fixed;
  top: 50%;
  left: 50%;
  -ms-transform: translateY(-50%) translateX(-50%);
  transform: translateY(-50%) translateX(-50%);
  z-index: 10000;
  background: white;
  padding: 2em;
  border-radius: 5px;
`;

const DarkBG = styled.div<{ incoming: boolean }>`
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  ${props =>
    !props.incoming &&
    css`
      animation: ${fadeOut} 400ms;
    `}
`;

const InputConversationName = styled.input`
  border: none;
  font-size: 2em;
  width: 100%;
  outline: none;
  &:hover {
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    transition: 250ms;
  }
  &:focus {
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    transition: 250ms;
  }
`;

const PreventOverflow = styled.div`
  box-sizing: border-box;
  max-height: 2em;
`;

const Label = styled.div`
  padding-top: 1em;
  font-size: 1.5em;
  padding-left: 0.25em;
`;

const InputParticipants = styled.input`
  margin-top: 1em;
  margin-bottom: 0.75em;
  border: 0.1px solid rgba(100, 100, 100, 0.5);
  padding: 0.5em;
  border-radius: 0.2em;
  outline: none;
  font-size: 1em;
  width: 100%;
`;

const Participants = styled.div<{ error: boolean }>`
  padding: 0.5em;
  border-radius: 0.2em;
  background: ${props => (props.error ? Colors.red : Colors.black)};
  color: ${Colors.white};
  display: block;
  width: auto;
  cursor: pointer;
  display: inline-block;
  margin-right: 0.4em;
  margin-top: 0.2em;
`;

const UserError = styled.div`
  font-size: 0.8em;
  color: ${Colors.red};
  height: 1em;
  margin-bottom: 0.5em;
`;

const Create = styled.button<{ active: boolean }>`
  border: none;
  outline: none;
  border-radius: 0.2em;
  padding: 0.25em 0.5em;
  font-size: 1.25em;
  color: white;
  &:hover {
    color: ${props => (props.active ? "black" : "white")};
    background: ${props => (props.active ? "white" : "rgba(100,100,100,0.5)")};
    border: ${props => (props.active ? "2px solid black" : "none")};
  }
  background: ${props => (props.active ? "black" : "rgba(100,100,100,0.5)")};
  position: absolute;
  bottom: 2em;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
`;

const Subtext = styled.div`
  font-size: 0.8em;
  margin-top: 0.4em;
  color: rgba(100, 100, 100, 0.5);
  margin-top: 0.5em;
`;

const Warning = styled.div`
  color: ${Colors.yellow};
  font-size: 0.8em;
  height: 2em;
  margin-top: 1em;
`;

const Cross = styled.div`
  position: absolute;
  cursor: pointer;
  font-size: 1.4em;
  top: 0.6em;
  right: 0.6em;
`;

const getUserName = () => {
  return store.getState().authenticationState.userName;
};

interface IPropsModal {
  close(): void;
  allConversations: string[] | null;
  token: string | null;
  userName: string;
}

const ModalPopup: React.FC<IPropsModal> = (props: IPropsModal) => {
  const [incoming, changeIncoming] = useState(true);
  const [participants, changeParticipants] = useState<string[]>([]);
  const [particInput, changeParticInput] = useState("");
  const [conv, changeConv] = useState("");
  const [convPlaceholder, changeConvPlaceholder] = useState(
    "Name your Conversation"
  );
  const [NameError, changeNameError] = useState<string>("");

  const [noUserError, changeNoUserError] = useState<string[]>([]);
  const [multipleUserError, changeMultipleError] = useState("");

  useEffect(() => {
    // disable scroll when modal is active
    disableScroll();
    return () => {
      enableScroll();
    };
    //@ts-ignore
  }, []);

  const handleClose = () => {
    //@ts-ignore
    changeIncoming(false);
    setTimeout(() => {
      props.close();
    }, 390);
  };

  const handleAddition = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Space") {
      const temp = particInput;
      if (participants.indexOf(temp) !== -1 || temp === props.userName) {
        changeMultipleError(temp);
        setTimeout(() => {
          changeMultipleError("");
        }, 1500);
        changeParticInput("");
        return;
      }

      if (participants.length === 0) {
        changeConvPlaceholder(particInput);
      } else if (participants.indexOf(conv) !== -1) {
        changeConvPlaceholder("Name your Conversation");
      }

      changeParticipants([...participants, temp]);
      changeParticInput("");
      // now verify if this user exists
      const user = await Axios.post("/api/userexist", { username: temp });

      if (!user.data) {
        changeNoUserError([...noUserError, temp]);
      }
    }
  };

  const handleDeletion = (index: number) => {
    const newPart = [...participants];
    const removed = newPart[index];
    if (noUserError.indexOf(removed) !== -1) {
      const newErr = [...noUserError];
      newErr.splice(newErr.indexOf(removed), 1);
      changeNoUserError(newErr);
    }
    newPart.splice(index, 1);
    if (newPart.length === 1) {
      changeConvPlaceholder(newPart[0]);
    } else if (newPart.length === 0) {
      changeConvPlaceholder("Name your Conversation");
    }
    changeParticipants(newPart);
  };

  const createConversation = async () => {
    if (props.allConversations && props.allConversations.indexOf(conv) !== -1) {
      // show error also
      verifyDuplicate();
      return;
    }

    let convers = conv;
    if (
      participants.length === 1 &&
      convPlaceholder === participants[0] &&
      conv === ""
    ) {
      convers = `_$${getUserName().trim()}$${participants[0].trim()}$_`;
    }

    createLocalconversation(convers, [...participants, getUserName()]);
    EmitNewConversationData(convers, [...participants, getUserName()]);
    handleClose();
  };

  const verifyDuplicate = () => {
    if (props.allConversations && props.allConversations.indexOf(conv) !== -1) {
      changeNameError("A conversation with this name exists");
    } else {
      changeNameError("");
    }
  };

  const checkActive = () => {
    if (
      (conv.length > 0 || convPlaceholder !== "Name your Conversation") &&
      participants.length > 0 &&
      noUserError.length === 0 &&
      multipleUserError.length === 0 &&
      NameError.length === 0
    ) {
      return true;
    }
    return false;
  };

  let active = checkActive();

  return (
    <ModalContainer>
      <DarkBG incoming={incoming} onClick={handleClose} />
      <Modal incoming={incoming} id="newConversationModal">
        <Cross onClick={handleClose}>
          <i className="fas fa-times" />
        </Cross>
        <PreventOverflow>
          <InputConversationName
            value={conv}
            onChange={e => changeConv(e.target.value)}
            onBlur={verifyDuplicate}
            placeholder={convPlaceholder}
          />
        </PreventOverflow>
        <Warning>
          {NameError.length > 0 && (
            <div>
              <i className="fas fa-exclamation-triangle" /> {NameError}
            </div>
          )}
        </Warning>
        <Label>Add Participants</Label>
        <InputParticipants
          onKeyDown={e => handleAddition(e)}
          value={particInput}
          onChange={e => changeParticInput(e.target.value)}
          placeholder="Enter Username"
        />
        <UserError>
          {noUserError.length > 0 && (
            <div>
              <i className="fas fa-exclamation-triangle" />{" "}
              {`There are no users with name ${noUserError.join(", ")}`}
            </div>
          )}
          {multipleUserError.length > 0 && (
            <div>{`Cannot add ${multipleUserError} again`}</div>
          )}
        </UserError>
        {participants.map((p, i) => {
          const isErr = noUserError.indexOf(p) === -1 ? false : true;
          return (
            <Participants
              error={isErr}
              key={i}
              onClick={() => handleDeletion(i)}
            >
              {p}
            </Participants>
          );
        })}
        {participants.length > 0 ? (
          <Subtext>Click a name to delete from conversation</Subtext>
        ) : (
          <Subtext>Press enter to insert participant</Subtext>
        )}
        <Create disabled={!active} active={active} onClick={createConversation}>
          Create Conversation
        </Create>
      </Modal>
    </ModalContainer>
  );
};

const mapstate = (state: AppState) => {
  return {
    allConversations: state.app.conversation.allConversations,
    token: state.authenticationState.token,
    userName: state.authenticationState.userName
  };
};

export default connect(mapstate)(ModalPopup);
