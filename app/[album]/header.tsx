'use client'

import {Drawer, DrawerContent} from "@/components/ui/drawer";
import {useState} from "react";
import Link from "next/link";
import {ChevronsUpDown, Maximize, Minimize} from "lucide-react";
import {albumsState, zoomedOutState} from "@/app/loader";
import {useRecoilState} from "recoil";

export default function Header({selectedAlbum} : {selectedAlbum: string}) {
    const [open, setOpen] = useState(false)
    const [photos] = useRecoilState(albumsState);
    const [zoomedOut, setZoomedOut] = useRecoilState(zoomedOutState);
    return (
        <header
            className={"w-full sticky top-0 p-8 max-sm:px-6 justify-between flex items-center z-10 mb-6"}>
            <Drawer
                open={open}
                    onOpenChange={setOpen}
                    noBodyStyles>
                <DrawerContent>
                    <div className={"flex flex-col gap-4 justify-center items-center py-16 px-12"}>
                    {Object.keys(photos).map((album) => (
                        <Link key={album}
                              href={`/${album}`}
                              className={`flex w-full 
                               gap-1 items-center font-bold ${album === selectedAlbum ? 'underline-offset-2 underline' : ''}`}>
                            {album.toUpperCase()}
                        </Link>
                    ))}
                    </div>
                </DrawerContent>
            </Drawer>

            <p className={"flex flex-col gap-1 font-bold cursor-pointer text-5xl max-md:text-4xl"}>
                <Link href={"/"} className={"fascinate"}>DAN<br/> LYU</Link>
            </p>
            <div className={"flex gap-8 max-md:gap-6"}>
                {Object.keys(photos).map((album) => (
                    <Link key={album}
                          href={`/${album}`}
                          className={`max-md:hidden max-sm:text-sm font-extrabold ${album === selectedAlbum ? 'underline-offset-2 underline' : ''}`}>
                        {album.toUpperCase()}
                    </Link>
                ))}
                {
                    selectedAlbum !== "about" ?
                        <button
                            onClick={() => setOpen(!open)}
                            className={`flex justify-center items-center md:hidden max-sm:text-sm font-extrabold gap-0.5 underline-offset-2 underline`}>
                            {selectedAlbum.toUpperCase()}
                            <ChevronsUpDown size={18} strokeWidth={3}/>
                        </button> :
                        (Object.keys(photos)[0] && <button
                            onClick={() => setOpen(!open)}
                            className={`flex justify-center items-center md:hidden max-sm:text-sm font-extrabold gap-0.5`}>
                            {Object.keys(photos)[0].toUpperCase()}
                            <ChevronsUpDown size={18} strokeWidth={3}/>
                        </button>)
                }
                <Link key={"about"}
                      href={`/about`}
                      className={`max-sm:text-sm font-extrabold ${"about" === selectedAlbum ? 'underline-offset-2 underline' : ''}`}>
                    ABOUT
                </Link>
                <button
                onClick={() => setZoomedOut(!zoomedOut)}
                >
                    {
                        zoomedOut ?
                            <Maximize size={18} strokeWidth={3}/> :
                            <Minimize size={18} strokeWidth={3}/>
                    }
                </button>
            </div>
        </header>
)
}
