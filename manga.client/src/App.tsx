import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
  ScrollRestoration,
  useLocation
} from 'react-router-dom';
import { Box } from '@mui/material';
import ReactGA from "react-ga4";
import MainSearch from './pages/MainSearch';
import MangaDetail from './pages/MangaDetail';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import MainNotification from './pages/MainNotification';
import MSell from './pages/MSell.tsx';
import MainMyPage from './pages/MainMyPage';
import LoginPage from './pages/LoginPage';
import MpFavoList from './pages/MpFavoList.tsx';
import { authService } from './api/authService.ts';
import MpChangeEmailPassword from './pages/MpChangeEmailPassword.tsx';
import MpAdressUpadate from './pages/MpAdressUpdate.tsx';
import MpMySell from './pages/MpMySell.tsx';
import MpMatchedSell from './pages/MpMatchedSell.tsx';
import MpIdVerification from './pages/MpIdVerification.tsx';
import IdCamera from './pages/IdCamera.tsx';
import SellForm from './pages/MainSell.tsx';
import DraftList from './pages/DraftList.tsx';
import MpProfile from './pages/MpProfile.tsx';
import EmailConfirmation from './pages/EmailConfirmation';
import MpRequestSell from './pages/MpRequestSell.tsx';
import MpContact from './pages/MpContact.tsx';
import CommentPage from './pages/CommentPage.tsx';
import SignupPage from './pages/SignupPage.tsx';
import SignupByEmail from './pages/SignupByEmail.tsx';
import { AxiosInterceptorProvider } from './components/context/AxiosInterceptorProvider';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import TermsOfService from './pages/TermsOfService.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import MangaDeliveryMethodPage from './pages/MangaDeliveryMethod.tsx';
import HowToUsePage from './pages/HowToUsePage.tsx';
import AccountDelete from './pages/MpAccountDelete.tsx';

import path from 'path';


const AppLayout = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      boxShadow: '2px 0 4px -2px rgba(0, 0, 0, 0.2), -2px 0 4px -2px rgba(0, 0, 0, 0.2)'
    }}>
      <ScrollRestoration
      getKey={(location) => {
        return location.pathname;
      }}
       />
      <Outlet />
    </Box>
  );
};

// ページビュー追跡用のカスタムコンポーネント
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AxiosInterceptorProvider><AppLayout /><PageViewTracker /></AxiosInterceptorProvider>}>
      <Route path="/item/favorite" element={<MainSearch initialTab={0} />} />
      <Route path="/" element={<MainSearch />} />
      <Route path="/item/new" element={<MainSearch initialTab={2} />} />
      <Route path="/search" element={<MainSearch />} />
      <Route path="/item/:sellId" element={<MangaDetail />} />
      <Route path="/notification" element={<MainNotification />} /> {/* 通知ページのルート */}
      <Route path="/main-sell" element={<MSell />} />
      <Route path="/login-page" element={<LoginPage />} /> {/* ログインページのルート */}
      <Route path="/mypage" element={<MainMyPage />} /> {/* マイページのルート */}
      <Route path="/mypage/favolist" element={<MpFavoList />} /> {/* test */}
      <Route path="/mypage/changeemailpassword" element={<MpChangeEmailPassword />} />
      <Route path="/mypage/addressupdate" element={<MpAdressUpadate />} />
      <Route path="/mypage/mysell" element={<MpMySell />} />
      <Route path="/mypage/matchedsell" element={<MpMatchedSell />} />
      <Route path="/mypage/verification" element={<MpIdVerification />} />
      <Route path="/mypage/verification/camera" element={<IdCamera />} />
      <Route path="/mypage/requestedsell" element={<MpRequestSell />} />
      <Route path="/mypage/account-delete" element={<AccountDelete />} />
      <Route path='/mypage/contact' element={<MpContact />} />
      <Route path="/sell" element={<SellForm />} />
      <Route path="/sell/:sellId" element={<SellForm />} />
      <Route path="/sell/draft" element={<DraftList />} />
      <Route path="/mypage/profile" element={<MpProfile />} />
      <Route path="/email-confirmation" element={<EmailConfirmation />} />
      <Route path="/item/:sellId/comment" element={<CommentPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/Email" element={<SignupByEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/deliverymethod" element={<MangaDeliveryMethodPage />} />
      <Route path="/howtouse" element={<HowToUsePage />} />
    </Route>
  )
);

const App = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.refreshToken();
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
      }
    };

    initializeAuth();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;