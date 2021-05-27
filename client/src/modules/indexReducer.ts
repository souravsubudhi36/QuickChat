import { combineReducers } from "redux";

import auth from "./auth/reducer";
import error from "./error/reducer";
import conversation from "./app/conversation/reducer";

const rootReducer = combineReducers({
  authenticationState: auth,
  errorState: error,
  app: combineReducers({
    conversation
  })
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
