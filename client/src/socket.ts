import io from "socket.io-client";
import store from "./store";

const getToken = () => {
  return store.getState().authenticationState.token;
};

const socket = io.connect(
  "http://ec2-13-233-238-129.ap-south-1.compute.amazonaws.com/",
  {
    query: "token=" + getToken()
  }
);

export default socket;
