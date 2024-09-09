import type {Metadata} from "next";
import "./globals.css";
import Loader from "@/app/loader";
import RecoilRootWrapper from "@/app/RecoilRootWrapper";
import Link from "next/link";

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
        <body className={"flex flex-col"}>
        <RecoilRootWrapper>
            <Loader/>
            {children}
        </RecoilRootWrapper>

        <footer className={"w-full p-8 flex mt-auto items-center justify-center"}>
            <Link className={"text-sm text-neutral-200"} href={"https://lyu.sh"}>© 2024 Dan Lyu</Link>
        </footer>
        </body>
        </html>
    );
}
