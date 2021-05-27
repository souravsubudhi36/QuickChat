import { CHANGE_AUTH, IChangeAuthAction } from "./types";

export const ChangeAuthAction = (
  payload: { username: string; token: string } | null
): IChangeAuthAction => {
  return {
    type: CHANGE_AUTH,
    payload
  };
};
