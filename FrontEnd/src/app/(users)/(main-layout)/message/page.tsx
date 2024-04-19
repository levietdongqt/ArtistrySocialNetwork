
import cn from "clsx";
import dynamic from "next/dynamic";


export default function Message() {
    const loading = false;
    const MessageMain = dynamic(() =>
            import ("@components/chat-box/message-main"), {
            ssr: false
        }
    )
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