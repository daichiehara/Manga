import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// 認証情報の型定義
interface AuthState {
  isAuthenticated: boolean;
}

interface AuthContextType {
  authState: AuthState;
  updateAuthState: (newState: AuthState) => void; 
}

const AuthContext = createContext<AuthContextType>({
    authState: { isAuthenticated: false },
    updateAuthState: () => {} // 空の関数で初期化
  });
// グローバルな状態更新関数
let globalUpdateAuthState: (newState: AuthState) => void;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false});

  const updateAuthState = (newState: AuthState) => {
    setAuthState(newState);
  };

  globalUpdateAuthState = updateAuthState; // グローバル変数に関数を割り当てる

  // 現在の状態と更新関数をログに出力
  console.log('現在の認証状態:', authState);
  console.log('状態更新関数:', updateAuthState);

  return (
    <AuthContext.Provider value={{ authState, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

// コンポーネント外から呼び出せるようにエクスポート

export const updateGlobalAuthState = (newState: AuthState) => {
    if (!globalUpdateAuthState) {
      console.warn("updateGlobalAuthState was called before AuthProvider was mounted.");
      return;
    }
    globalUpdateAuthState(newState);
  };
export { AuthContext };
