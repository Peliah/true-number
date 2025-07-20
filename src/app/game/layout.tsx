import { Navbar } from "@/components/miscellenous/navbar";

export default function GamePageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
