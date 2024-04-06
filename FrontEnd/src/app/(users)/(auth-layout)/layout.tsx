export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <>

            <main>
                <section className="relative w-full h-full py-40 min-h-screen">
                    <div
                        className="absolute top-0 w-full h-full bg-slate-800 bg-no-repeat bg-full"
                        style={{
                            backgroundImage: "url('/image/register_bg_2.png')",
                        }}
                    ></div>
                    {children}
                </section>
            </main>
        </>
    );
}
