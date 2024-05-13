import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Home from "../pages/Home";
import Profile from "../pages/Profile/Profile";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import Chat from "../pages/Chat/Chat";
import NotFound from "../pages/NotFound/NotFound";
import HomeAdmin from "../pages/Admin/HomeAdmin";
import PaymentResult from "../pages/Payment/PaymentResult";
import BookingDetails from "../pages/Booking/BookingDetails";
import { ProtectedRoute } from "../context/ProtectedRoute.context";
import LayoutSideBar from "../Layout/LayoutSideBar/LayoutSideBar";
import LayoutHeader from "../Layout/LayoutOnlyHeader/LayoutHeader";
import ProfileUser from "../pages/Details/PageEntDetail/Introduce/ProfileUser";
import TrendingPage from "../pages/Trending/TrendingPage";
import SearchPgt from "../pages/SearchPgt/SearchPgt";
import PageInterpreterDetail from "../pages/Details/PageHintDetail/PageHINTDetail";
import RegisterInterpreters from "../pages/RegisterInterpreters/RegisterInterpreters";
import DestinationPage from "../pages/Destination/DestinationPage";
import CreatePostPage from "../pages/POST/CreatePostPage";
import DetailPostPage from "../pages/POST/DetailPostPage";
import ListPostPage from "../pages/POST/ListPostPage";
import DestinationListPage from "../pages/Destination/DestinationListPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/" element={
            <LayoutHeader>
              <Home />
            </LayoutHeader>}
        />
        <Route
          path="/home" element={
            <LayoutHeader>
              <Home />
            </LayoutHeader>}
        />
        <Route
          path="/hint" element={
            <LayoutHeader>
              <SearchPgt />
            </LayoutHeader>}
        />
        <Route
          path="/field/:id" element={
            <LayoutHeader>
              <Home />
            </LayoutHeader>}
        />
        <Route
          path="/hint/:id"
          element={
            <LayoutHeader>
              <PageInterpreterDetail />
            </LayoutHeader>}
        />
        <Route
          path="/destination/:id"
          element={
            <LayoutHeader>
              <DestinationPage />
            </LayoutHeader>}
        />
        <Route
          path="/destination"
          element={
            <LayoutHeader>
              <DestinationListPage />
            </LayoutHeader>}
        />
        <Route
          path="/trending"
          element={
            <LayoutHeader>
              <TrendingPage />
            </LayoutHeader>}
        />
        <Route
          path="register-hint"
          element={
            <LayoutHeader>
              <ProtectedRoute Component={RegisterInterpreters} />
            </LayoutHeader>}
        />
        <Route
          path="user-home"
          element={
            <LayoutSideBar>
              <ProfileUser />
            </LayoutSideBar>}
        />
        <Route
          path="chat"
          element={
            <LayoutHeader>
              <ProtectedRoute Component={Chat} />
            </LayoutHeader>}
        />

        <Route
          path="/setting/:id"
          element={
            <LayoutHeader>
              <ProtectedRoute Component={Profile} />
            </LayoutHeader>}
        />
        <Route
          path="/create-post"
          element={
            <LayoutHeader>
              <ProtectedRoute Component={CreatePostPage} />
            </LayoutHeader>}
        />
        <Route
          path="/post/:id"
          element={
            <LayoutHeader>
              <DetailPostPage />
            </LayoutHeader>
          }
        />
        <Route
          path="/post"
          element={
            <LayoutHeader>
              <ListPostPage />
            </LayoutHeader>
          }
        />
        <Route
          path="/vnpay/return"
          element={<LayoutHeader>
            <ProtectedRoute Component={PaymentResult} />
          </LayoutHeader>}
        />
        <Route
          path="/bookings/:id"
          element={<ProtectedRoute Component={BookingDetails} />}
        />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route
          path="/admin"
          // element={<ProtectedRoute Component={HomeAdmin} role={"ADMIN"} />}
          element={<HomeAdmin Component={HomeAdmin} role={"ADMIN"} />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default Router;
