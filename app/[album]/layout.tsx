import Link from "next/link";
import {Albums} from "@/app/photos/route";
import {Metadata, Viewport} from "next";

export default async function Layout({params, children}: { params: { album: string }, children: any }) {
    const selectedAlbum = params.album.toLowerCase();
    const photos = await Albums()
    return (
        <main className="flex w-full flex-col items-center">
            <header
                className={"w-full sticky top-0 p-8 justify-between flex items-center z-10 mb-6"}>
                <p className={"flex flex-col gap-1 font-bold cursor-pointer text-5xl max-md:text-4xl"}>
                    <Link href={"/"} className={"fascinate"}>DAN<br/> LYU</Link>
                </p>
                <div className={"flex gap-8 max-md:gap-6"}>
                    {Object.keys(photos).concat(["about"]).map((album) => (
                        <Link key={album}
                              href={`/${album}`}
                              className={`max-sm:text-sm font-extrabold flex flex-col gap-2 ${album === selectedAlbum ? 'underline-offset-2 underline' : ''}`}>
                            {album.toUpperCase()}
                        </Link>
                    ))}
                </div>
            </header>
            {children}
        </main>
    );
}


type Props = {
    params: { album: string }
}

export const viewport: Viewport = {
    themeColor: '#3b3b3b',
}

export async function generateMetadata(
    {params}: Props
): Promise<Metadata> {
    const id = params.album.toLowerCase()
    const idDisplay = uppercaseFirst(id)
    const photos = await Albums()
    const realId = Object.keys(photos).find((album) => album.toLowerCase() === id)
    const photoCount = photos[id]?.photos?.length
    const description = !photoCount ? '٩(˘◡˘)۶' : `${photoCount} photos  |  ٩(˘◡˘)۶`
    return {
        title: `${idDisplay} - Dan Lyu`,
        description,
        applicationName: "Photosite",
        keywords: ["photography", "portfolio", "dan lyu", idDisplay, "gallery", "software engineer"],
        creator: "Dan Lyu",
        publisher: "Dan Lyu",
        openGraph: {
            title: `${idDisplay} - Dan Lyu`,
            images: realId ? `${process.env.NEXT_PUBLIC_HOST!}/static/preview/${realId}/cover.jpg` :
                `${process.env.NEXT_PUBLIC_HOST!}/static/preview/cover.jpg`,
            authors: ["Dan Lyu"],
            creators: ["Dan Lyu"],
            description,
            siteName: "Dan's Photo Gallery",
            url: `${process.env.NEXT_PUBLIC_HOST!}/${id}`
        },
        twitter: {
            card: "summary_large_image"
        }
    }
}

function uppercaseFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
