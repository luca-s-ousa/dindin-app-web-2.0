export type Token = {
  clientId: number;
  refreshToken: string;
};

export type TokenDecode = {
  clientId: number;
  refreshToken: string;
  iat: number;
  exp: number;
};

export type RefreshToken = {
  id: string;
  expiresIn: number;
  user_id: number;
};
