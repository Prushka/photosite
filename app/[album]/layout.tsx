'use client'

import Link from "next/link";
import {useRecoilState} from "recoil";
import {albumsState} from "@/app/loader";
import {useState} from "react";

export default function Layout({ params, children }: { params: { album: string }, children: any }) {
    const [selectedAlbum, setSelectedAlbum] = useState<string>(params.album.toLowerCase());

    const [photos] = useRecoilState(albumsState);
    return (
        <main className="flex w-full flex-col items-center">
            <header
                className={"w-full sticky top-0 p-8 justify-between flex items-center z-10 mb-6"}>
                <p className={"flex flex-col gap-1 font-bold cursor-pointer text-5xl"}>
                    <Link href={"/"} className={"fascinate"}>DAN<br/> LYU</Link>
                </p>
                <div className={"flex gap-8"}>
                    {Object.keys(photos).map((album) => (
                        <Link key={album}
                              href={`/${album}`}
                              className={`font-extrabold flex flex-col gap-2 ${album === selectedAlbum ? 'underline-offset-2 underline' : ''}`}>
                            {album.toUpperCase()}
                        </Link>
                    ))}
                </div>
            </header>
            {children}
        </main>
    );
}
