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
        <body className={"flex flex-col dark"}>
        <RecoilRootWrapper>
            <Loader/>
            {children}
        </RecoilRootWrapper>

        <footer className={"w-full p-8 flex mt-auto items-center justify-center [&>*]:text-neutral-300 text-sm gap-2"}>
            <Link className={"underline"} href={"https://lyu.sh"} target={"_blank"}>© 2024 Dan Lyu</Link><span>|</span>
            <Link className={"underline"} href={"https://github.com/Prushka/photosite"}
            target={"_blank"}
            >Photosite by Dan Lyu</Link>

        </footer>
        </body>
        </html>
    );
}
