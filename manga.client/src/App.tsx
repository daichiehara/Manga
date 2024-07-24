import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
  ScrollRestoration
} from 'react-router-dom';
import { Box } from '@mui/material';
import MainSearch from './pages/MainSearch';
import MangaDetail from './pages/MangaDetail';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import MainNotification from './pages/MainNotification';
import MainMyBook from './pages/MainMyBook';
import MSell from './pages/MSell.tsx';
import MainMyPage from './pages/MainMyPage';
import LoginPage from './pages/LoginPage';
import MpFavoList from './pages/MpFavoList.tsx';
import TestRefreshToken from './pages/TestRefreshToken.tsx';
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      <Route path="/item/favorite" element={<MainSearch initialTab={0} />} />
        <Route path="/" element={<MainSearch initialTab={1} />} />
        <Route path="/item/new" element={<MainSearch initialTab={2} />} />
        <Route path="/item/:sellId" element={<MangaDetail />} />
        <Route path="/notification" element={<MainNotification />} /> {/* 通知ページのルート */}
        <Route path="/main-mybook" element={<MainMyBook />} /> {/* マイ本棚のルート */}
        <Route path="/main-sell" element={<MSell />} />
        <Route path="/login-page" element={<LoginPage />} /> {/* ログインページのルート */}
        <Route path="/test" element={<TestRefreshToken />} /> {/* test */}
        <Route path="/mypage" element={<MainMyPage />} /> {/* マイページのルート */}
        <Route path="/mypage/favolist" element={<MpFavoList />} /> {/* test */}
        <Route path="/mypage/changeemailpassword" element={<MpChangeEmailPassword />} />
        <Route path="/mypage/addressupdate" element={<MpAdressUpadate />} />
        <Route path="/mypage/mysell" element={<MpMySell />} />
        <Route path="/mypage/matchedsell" element={<MpMatchedSell />} />
        <Route path="/mypage/verification" element={<MpIdVerification />} />
        <Route path="/mypage/verification/camera" element={<IdCamera />} />
        <Route path="/mypage/requestedsell" element={<MpRequestSell />} />
        <Route path='/mypage/contact' element={<MpContact />} />
        <Route path="/sell" element={<SellForm />} />
        <Route path="/sell/:sellId" element={<SellForm />} />
        <Route path="/sell/draft" element={<DraftList />} />
        <Route path="/mypage/profile" element={<MpProfile />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/item/:sellId/comment" element={<CommentPage />} />
        <Route path="/login-page/signup" element={<SignupPage />} />
        <Route path="/login-page/signup/Email" element={<SignupByEmail />} />
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