import "./styles/globals.scss";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "react-toastify/dist/ReactToastify.css";

import { Bounce, ToastContainer } from "react-toastify";
import { AppHead } from "./(users)/_components/common/app-head";
import { UserContextProvider } from "../context/user-context";
import { AuthContextProvider } from "../context/auth-context";
import { ThemeContextProvider } from "../context/theme-context";
import { CustomIcon } from "@components/ui/custom-icon";
import { ChatAlert } from "@components/chat-box/chat-alert";
import { SocketProvider } from "context/websocket-context1";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // var params = usePathname();
  // var isLogin = params.includes("/login")
  return (
    <html lang="en">
      <AppHead />
      <body>
        <UserContextProvider>
          <SocketProvider>
            <AuthContextProvider>
              <ThemeContextProvider>{children}</ThemeContextProvider>
            </AuthContextProvider>
          </SocketProvider>
        </UserContextProvider>

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
        <ChatAlert />
      </body>
    </html>
  );
}
