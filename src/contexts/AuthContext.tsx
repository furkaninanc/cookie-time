import { createContext, useContext } from 'react';

export interface IAuth {
  username: string;
  room: string;
}

export interface IAuthContext {
  auth: IAuth;
  setAuth: (auth: IAuth | ((prevAuth: IAuth) => IAuth)) => void;
}

export const AuthContext = createContext<IAuthContext>({
  auth: { username: '', room: '' },
  setAuth: () => {},
});

export const useAuthContext = (): IAuthContext => useContext(AuthContext);
