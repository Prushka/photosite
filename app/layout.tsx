import type {Metadata} from "next";
import "./globals.css";
import Loader from "@/app/loader";
import RecoilRootWrapper from "@/app/RecoilRootWrapper";

export const metadata: Metadata = {
    title: "Dan Lyu - Photo Library",
    description: "A photo library",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <RecoilRootWrapper>
            <Loader/>
            {children}
        </RecoilRootWrapper>
        </body>
        </html>
    );
}
