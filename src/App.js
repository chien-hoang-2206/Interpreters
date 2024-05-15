import React, { useEffect } from "react";
import { AuthProvider } from "./context/auth.context";
import Router from "./router";
import { MessageProvider } from "./context/Message.context";
import { CollapseProvider } from "./context/collapse.context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from "./context/Notification.context";
import "./trans/i18n";
import { NextUIProvider } from "@nextui-org/react";
import Cookies from 'js-cookie'
import i18n from "./trans/i18n";
export default function App() {
  useEffect(() => {
    const newValue = Cookies.get('i18next');
    i18n.changeLanguage(newValue)
  },[])
  return (
    <NextUIProvider>
      <AuthProvider>
        <NotificationProvider>
          <MessageProvider>
            <CollapseProvider>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
              <Router />
            </CollapseProvider>
          </MessageProvider>
        </NotificationProvider>
      </AuthProvider >
    </NextUIProvider>
  );
}
