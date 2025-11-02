type SignUpRequest = {
  email: string;
  password: string;
  userName?: string;
};

type SignUpResponse = {
  token: string;
  refreshToken: string;
  succcess: boolean;
  errors: string[];
};

export type { SignUpRequest, SignUpResponse };
