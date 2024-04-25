import {UserContextProvider} from "../../context/user-context";
import ChatContextProvider from "../../context/chat-context";
import {NotificationContextProvider} from "../../context/notification-context";
import {SocketProvider} from "../../context/websocket-context1";
import {AuthContextProvider} from "../../context/oauth2-context";
import {SearchContextProvider} from "../../context/search-context";
import {ChatAlert} from "@components/chat-box/chat-alert";
import {ThemeContextProvider} from "../../context/theme-context";


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <>
            <ChatContextProvider>
                <NotificationContextProvider>
                    <SocketProvider>
                        <SearchContextProvider>
                            <ThemeContextProvider>
                                <ChatAlert/>
                                {children}
                            </ThemeContextProvider>
                        </SearchContextProvider>
                    </SocketProvider>
                </NotificationContextProvider>
            </ChatContextProvider>
        </>

    )
}