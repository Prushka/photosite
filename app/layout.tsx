import {Metadata, Viewport} from "next";
import "./globals.css";
import Loader from "@/app/loader";
import RecoilRootWrapper from "@/app/RecoilRootWrapper";
import Link from "next/link";
import {Albums} from "@/app/photos/album";

export async function generateMetadata(): Promise<Metadata> {
    let description = ""
    try {
        const photos = await Albums()
        const totalPhotos = Object.values(photos).reduce((acc, album) => acc + album.photos.length, 0)
        description = `${totalPhotos} photos`
    } catch (e) {
    }
    return {
        title: `Home - Dan Lyu`,
        description,
        applicationName: "Photosite",
        keywords: ["photography", "portfolio", "dan lyu", "gallery", "software engineer"],
        creator: "Dan Lyu",
        publisher: "Dan Lyu",
        openGraph: {
            title: `Home - Dan Lyu`,
            images: `${process.env.NEXT_PUBLIC_HOST!}/static/preview/cover.jpg`,
            authors: ["Dan Lyu"],
            creators: ["Dan Lyu"],
            description,
            siteName: "Dan's Photo Gallery",
            url: `${process.env.NEXT_PUBLIC_HOST!}`
        },
        icons: {
            other: {
                rel: 'alternate',
                url: `${process.env.NEXT_PUBLIC_HOST!}/oembed`,
                type: 'application/json+oembed'
            },
        },
        twitter: {
            card: "summary_large_image"
        }
    }
}

export const viewport: Viewport = {
    themeColor: '#3b3b3b',
}

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
