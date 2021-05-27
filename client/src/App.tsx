import React, { useEffect } from "react";

import Conversation from "./Pages/Conversation";
import { connect } from "react-redux";
import { AppState } from "./modules/indexReducer";
import Auth from "./Pages/Auth";
import { handleAppBoot } from "./APIs/appBoot/handleAppBoot";

interface IProps {
  token: string | null;
}

const App: React.FC<IProps> = (props: IProps) => {
  // handle app boot whenever token changes
  useEffect(() => {
    if (props.token) handleAppBoot();
  }, [props.token]);

  if (!props.token) {
    return <Auth />;
  }

  return (
    <React.Fragment>
      <Conversation />
    </React.Fragment>
  );
};

const mapstate = (state: AppState) => {
  return {
    token: state.authenticationState.token
  };
};

export default connect(mapstate)(App);
