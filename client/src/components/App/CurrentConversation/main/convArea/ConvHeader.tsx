import React from "react";
import styled from "styled-components";
import Colors from "../../../../../colors";
import { connect } from "react-redux";
import { AppState } from "../../../../../modules/indexReducer";

const Container = styled.div`
  width: 100%;
  padding: 0.7em 1em;
  height: 3em;
  box-sizing: border-box;
  background: ${Colors.grey};
  border: 1px solid ${Colors.lightBlack};
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  align-items: center;
`;

const Text = styled.div`
  color: black;
  font-size: 1.5em;
  cursor: default;
`;

const Settings = styled.div`
  cursor: pointer;
  font-size: 1.5em;
  color: rgba(0, 0, 0, 0.5);
  &:hover {
    color: black;
  }
`;

interface IProps {
  current: string | null;
  username: string;
  mobileMode: boolean;
  goBack(): void;
  goToSettings(): void;
}

const ConvHeader: React.FC<IProps> = (props: IProps) => {
  let parsedName = props.current as string;
  if (
    parsedName.slice(0, 2) == "_$" &&
    parsedName.slice(parsedName.length - 2, parsedName.length) == "$_"
  ) {
    const options = parsedName.split("$");
    if (options[1] === props.username) parsedName = options[2];
    if (options[2] === props.username) parsedName = options[1];
  }
  return (
    <Container>
      <Text>
        {props.mobileMode && (
          <i
            className="fas fa-arrow-left"
            onClick={props.goBack}
            style={{ cursor: "pointer" }}
          />
        )}{" "}
        {parsedName}
      </Text>
      <Settings onClick={props.goToSettings}>
        <i className="fas fa-cog" />
      </Settings>
    </Container>
  );
};

const mapState = (state: AppState) => {
  return {
    current: state.app.conversation.activeConversation,
    username: state.authenticationState.userName
  };
};

export default connect(mapState)(ConvHeader);
