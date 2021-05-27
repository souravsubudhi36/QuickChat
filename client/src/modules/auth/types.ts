export const CHANGE_AUTH = "change_auth";

export interface IChangeAuthAction {
  type: typeof CHANGE_AUTH;
  payload: { username: string; token: string } | null;
}

export interface IAuthState {
  userName: string;
  token: string | null;
}
