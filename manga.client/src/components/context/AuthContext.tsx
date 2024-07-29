import { createContext, useState, ReactNode, useEffect, useCallback, useRef} from 'react';
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

const REFRESH_INTERVAL = 28 * 60 * 1000; // 28分をミリ秒で表現
const MAX_RETRY_COUNT = 3;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const retryCount = useRef(0);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const updateAuthState = useCallback((newState: Partial<AuthState>) => {
    setAuthState(prevState => ({ ...prevState, ...newState }));
  }, []);

  globalUpdateAuthState = updateAuthState; // グローバル変数に関数を割り当てる

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      updateAuthState({ isAuthenticated: false });
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [updateAuthState]);

  const refreshTokenAndUpdateState = useCallback(async () => {
    try {
      console.log('refreshTokenAndUpdateState');
      await authService.refreshToken();
      updateAuthState({ isAuthenticated: true, isInitialized: true });
      retryCount.current = 0;
    } catch (error) {
      console.error('Failed to refresh tokentoken:', error);
      console.log(authState.isInitialized)
      retryCount.current++;
      if (retryCount.current >= MAX_RETRY_COUNT) {
        console.log('Max retry count reached. Logging out...');
        await logout();
      } else {
        updateAuthState({ isAuthenticated: false, isInitialized: true });
      }
    }
  }, [updateAuthState, logout]);

  useEffect(() => {
    refreshTokenAndUpdateState();

    intervalId.current = setInterval(refreshTokenAndUpdateState, REFRESH_INTERVAL);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [refreshTokenAndUpdateState]);

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
