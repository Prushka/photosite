'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import FadeInImage from "@/app/FadeInImage";
import {useRouter} from "next/navigation";
import Link from "next/link";
import { Masonry } from "react-plock";
import {Album, Photo} from "@/app/photos/route";
import {useRecoilState} from "recoil";
import {albumsState} from "@/app/loader";

function ImageSlider({photos, selected, setSelected, open, setOpen} :
                         { photos: Photo[], selected: number, open: boolean,
                                setSelected: (selected: number) => void, setOpen: (open: boolean) => void }) {

    return <div className={"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 " +
        `${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
    </div>
}

export default function Page({ params }: { params: { album: string } }) {
    const [selectedAlbum, setSelectedAlbum] = useState<string>(params.album.toLowerCase());
    const [open, setOpen] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
    const [photos] = useRecoilState(albumsState);
    const router = useRouter();
    useEffect(() => {
        if(photos && Object.keys(photos).length > 0 && !photos[selectedAlbum]) {
            router.push(`/${Object.keys(photos)[0]}`)
        }
    }, [photos, selectedAlbum, router]);
    useEffect(() => {
        console.log(photos[selectedAlbum]?.photos)
    }, [photos, selectedAlbum]);
    return (
        <main className="flex w-full
      h-full flex-col items-center">
            <header
                className={"w-full sticky top-0 p-8 justify-between flex items-center z-10"}>
                <p className={"flex flex-col gap-1 font-black cursor-pointer text-5xl"}>
                    <Link href={"/"} className={"fascinate"}>DAN LYU</Link>
                </p>
                <div className={"flex gap-8"}>
                    {Object.keys(photos).map((album) => (
                        <Link key={album}
                           href={`/${album}`}
                           className={`font-bold flex flex-col gap-2 ${album === selectedAlbum ? 'underline-offset-2 underline' : ''}`}>
                            {album.toUpperCase()}
                        </Link>
                    ))}
                </div>
            </header>
            <div className={"px-4 w-full flex justify-center"}>
                {photos[selectedAlbum]?.photos &&
                    <>
                    <Masonry
                        items={photos[selectedAlbum]?.photos}
                        config={{
                            columns: [1, 2, 3],
                            gap: [18, 18, 18],
                            media: [1000, 1400, 2500],
                        }}
                        render={(data, idx) => (
                            <div key={idx} className={"cursor-pointer relative image-container"}
                                 onClick={()=>{
                                        setSelectedPhoto(idx)
                                        setOpen(true)
                                 }}
                            >
                                <FadeInImage loading={"lazy"}
                                             src={`http://localhost:3005/raw/${data.path}`}
                                             alt={data.path} width={data.width} height={data.height}/>
                            </div>)}
                    /></>
                    }
            </div>
            <footer className={"w-full p-8 flex mt-auto items-center justify-center"}>
                <Link className={"text-sm text-neutral-200"} href={"https://lyu.sh"}>© 2024 Dan Lyu</Link>
            </footer>
        </main>
    );
}
