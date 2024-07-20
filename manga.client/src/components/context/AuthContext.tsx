import { createContext, useState, ReactNode, useEffect} from 'react';
import { authService } from '../../api/authService';

// 認証情報の型定義
interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthContextType {
  authState: AuthState;
  updateAuthState: (newState: Partial<AuthState>) => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false
};

const AuthContext = createContext<AuthContextType>({
  authState: initialAuthState,
  updateAuthState: () => {}
});
// グローバルな状態更新関数
let globalUpdateAuthState: (newState: Partial<AuthState>) => void;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const updateAuthState = (newState: Partial<AuthState>) => {
    setAuthState(prevState => ({ ...prevState, ...newState }));
  };

  globalUpdateAuthState = updateAuthState; // グローバル変数に関数を割り当てる

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.refreshToken();
        updateAuthState({ isAuthenticated: true, isInitialized: true });
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
        updateAuthState({ isAuthenticated: false, isInitialized: true });
      }
    };

    initializeAuth();
  }, []);

  // 現在の状態と更新関数をログに出力
  //console.log('現在の認証状態:', authState);
  //console.log('状態更新関数:', updateAuthState);

  return (
    <AuthContext.Provider value={{ authState, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

// コンポーネント外から呼び出せるようにエクスポート

export const updateGlobalAuthState = (newState: Partial<AuthState>) => {
  if (globalUpdateAuthState) {
    globalUpdateAuthState(newState);
  }
};
export { AuthContext };
