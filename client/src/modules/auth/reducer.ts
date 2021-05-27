import { IAuthState, IChangeAuthAction, CHANGE_AUTH } from "./types";

const initialState: IAuthState = {
  userName: localStorage.getItem("username")
    ? (localStorage.getItem("username") as string)
    : "User",
  token: localStorage.getItem("token")
};

const reducer = (
  state = initialState,
  action: IChangeAuthAction
): IAuthState => {
  switch (action.type) {
    case CHANGE_AUTH:
      if (action.payload) {
        localStorage.setItem("username", action.payload.username);
        localStorage.setItem("token", action.payload.token);
        // to open a new socket connection, we refresh

        setTimeout(() => {
          window.location.reload();
        }, 10);
        return {
          ...state,
          userName: action.payload.username,
          token: action.payload.token
        };
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        // to close the old socket connection, we refresh

        setTimeout(() => {
          window.location.reload();
        }, 10);
        return { ...state, userName: "User", token: null };
      }
  }

  return state;
};

export default reducer;
