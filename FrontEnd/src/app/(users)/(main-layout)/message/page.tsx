import {MessageMain} from "@components/chat-box/message-main";
import cn from "clsx";


export default async function Message() {
    const loading = false;
    return (
        <>
            <main
                className={cn(
                    `hover-animation flex min-h-screen w-full max-w-5xl flex-col border-x-0
         border-light-border pb-96 dark:border-dark-border xs:border-x`,
                )}
            >
                <MessageMain/>
            </main>

        </>

    );
}