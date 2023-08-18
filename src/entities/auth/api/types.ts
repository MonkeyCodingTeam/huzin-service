export type LoginRequest = {
  login: string;
  password: string;
  remember: boolean;
};

export type Session = {
  isAuthorized: boolean;
};
