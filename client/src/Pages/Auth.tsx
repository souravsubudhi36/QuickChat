import React, { useState } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import store from "../store";
import { ChangeAuthAction } from "../modules/auth/actionCreator";
import Colors from "../colors";
import Axios from "axios";

const Container = styled.div`
  padding: 2em;
  padding-top: 6em;
`;

const Row = styled.div`
  display: block;
  margin-bottom: 4em;
`;

const Style = styled.div`
  -webkit-clip-path: polygon(0 86%, 100% 16%, 100% 100%, 0% 100%);
  clip-path: polygon(0 86%, 100% 16%, 100% 100%, 0% 100%);
  background: black;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
`;

const Branding = styled.div`
  position: absolute;
  bottom: 1em;
  right: 1em;
  color: white;
  font-size: 1em;
`;

const ModeSelect = styled.div<{ active: boolean }>`
  font-size: 2em;
  margin-right: 1em;
  ${props =>
    props.active &&
    css`
      border-bottom: 2px solid rgba(0, 0, 0);
    `}
  display: inline-block;
  cursor: pointer;
`;

const Inputs = styled.input`
  border: none;
  font-size: 2em;
  width: 100%;
  outline: none;
  border-bottom: 0.5px solid black;
  &:hover {
    border-bottom: 1.5px solid rgba(0, 0, 0, 0.5);
    transition: 250ms;
  }
  &:focus {
    border-bottom: 1.5px solid rgba(0, 0, 0, 0.5);
    transition: 250ms;
  }
`;

const GoButton = styled.button<{ active: boolean }>`
  border: none;
  outline: none;
  border-radius: 0.2em;
  padding: 0.5em 1em;
  font-size: 1.75em;
  color: white;
  &:hover {
    color: ${props => (props.active ? "black" : "white")};
    background: ${props => (props.active ? "white" : "rgba(100,100,100,0.5)")};
    border: ${props => (props.active ? "2px solid black" : "none")};
  }
  background: ${props => (props.active ? "black" : "rgba(100,100,100,0.5)")};
  cursor: pointer;
`;

const PreventOverflow = styled.div`
  box-sizing: border-box;
  max-height: 2.2em;
  display: inline-block;
`;

const Error = styled.div`
  color: ${Colors.red};
  font-size: 0.9em;
  margin-bottom: 1em;
`;

const getToken = () => {
  return store.getState().authenticationState.token;
};

const Auth: React.FC = () => {
  const [signupMode, changeMode] = useState(true);
  const [username, changeusername] = useState("");
  const [password, changepassword] = useState("");
  const [error, changeError] = useState("");

  const checkUserName = async () => {
    if (!signupMode) return;

    const user = await Axios.post("/api/userexist", { username: username });

    if (user.data) {
      changeError("A user with this username already exist");
    } else {
      changeError("");
    }
  };

  let isActive = false;
  if (username.length > 3 && password.length > 3) {
    isActive = true;
  }

  const handleSubmit = async () => {
    if (signupMode) {
      try {
        const token = (await axios.post("/api/signup", {
          username,
          password
        })) as any;

        if (token && token.data && token.data.token) {
          store.dispatch(
            ChangeAuthAction({
              token: token.data.token,
              username
            })
          );
        }
      } catch (e) {
        changeError("Something went wrong, Please try again");

        changepassword("");
        console.log(e);
      }
    } else {
      try {
        const token = (await axios.post("/api/signin", {
          username,
          password
        })) as any;
        console.log(token);
        if (token && token.data && token.data.token) {
          store.dispatch(
            ChangeAuthAction({
              token: token.data.token,
              username
            })
          );
        }
      } catch (e) {
        changeError("Either username or password is incorrect");
        changepassword("");
        console.log(e);
      }
    }
  };

  return (
    <Container>
      <Style />
      <Branding>
        <i className="fas fa-heart" /> QuickChat
      </Branding>
      <Row>
        <PreventOverflow>
          <ModeSelect onClick={() => changeMode(true)} active={signupMode}>
            Sign-Up
          </ModeSelect>
        </PreventOverflow>
        <PreventOverflow>
          <ModeSelect onClick={() => changeMode(false)} active={!signupMode}>
            Sign-In
          </ModeSelect>
        </PreventOverflow>
      </Row>

      <Row>
        <PreventOverflow>
          <Inputs
            value={username}
            onChange={e => changeusername(e.target.value)}
            onBlur={checkUserName}
            placeholder="Username"
          />
        </PreventOverflow>
        <br />
        <br />
        <br />
        <br />
        <PreventOverflow>
          <Inputs
            type="password"
            value={password}
            onChange={e => changepassword(e.target.value)}
            placeholder="Password"
          />
        </PreventOverflow>
      </Row>
      {error.length > 0 && (
        <Error>
          <i className="fas fa-exclamation-triangle" /> {error}
        </Error>
      )}
      <GoButton onClick={handleSubmit} active={isActive}>
        Go
      </GoButton>
    </Container>
  );
};

export default Auth;
