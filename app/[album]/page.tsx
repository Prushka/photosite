'use client'

import {useCallback, useEffect, useState} from "react";
import FadeInImage from "@/app/FadeInImage";
import {useRouter} from "next/navigation";
import {Masonry} from "react-plock";
import {Photo} from "@/app/photos/route";
import {useRecoilState} from "recoil";
import {albumsState} from "@/app/loader";
import {ChevronLeft, ChevronRight, X} from "lucide-react";

function ImageSlider({photos, selected, open, setOpen}:
                         {
                             photos: Photo[], selected: number, open: boolean,
                             setOpen: (open: boolean) => void
                         }) {

    const [slideGroup, setSlideGroup] =
        useState<{ current: number | undefined; previous: number | undefined }>({
            current: undefined, previous: undefined
        });
    useEffect(() => {
        if (selected !== slideGroup.current) {
            setSlideGroup((prev) => {
                return {current: selected, previous: undefined}
            });
        }
    }, [selected]);
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [open]);
    const updateSelected = useCallback((direction: number) => {
        setSlideGroup((prev) => {
            if((prev.current == 0 && direction == -1) || (prev.current == photos.length - 1 && direction == 1)) {
                return prev;
            }
            return {current: prev.current !== undefined ? prev.current + direction : prev.current,
                previous: prev.current}
        });
    }, [setSlideGroup]);
    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                updateSelected(- 1);
            } else if (e.key === 'ArrowRight') {
                updateSelected(1);
            }
        }
        window.addEventListener('keydown', keyListener);
        return () => {
            window.removeEventListener('keydown', keyListener);
        }
    }, [photos.length, selected, updateSelected]);
    return open ? <div
        className={"fixed top-0 left-0 w-full h-full bg-black bg-opacity-85 z-50 flex flex-col items-center " +
            `${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
    >
        <div className={"flex flex-row-reverse items-center p-4 w-full "}>
            <button className={"text-gray-50 p-2 hover:text-gray-300"}>
                <X size={48} strokeWidth={1} onClick={() => setOpen(false)}/>
            </button>
        </div>
        <div className={"flex justify-between items-center flex-1 overflow-auto w-full"}>
            <button onClick={(e: any) => {
                updateSelected(- 1);
                e.stopPropagation();
            }}
                    className={"text-gray-50 p-2 hover:text-gray-300"}>
                <ChevronLeft size={64} strokeWidth={1}/>
            </button>

            <div className={"relative h-full flex-1 overflow-auto w-full"}>
                {slideGroup.current !== undefined && <>
                    <FadeInImage
                        key={photos[slideGroup.current].path}
                        fadeIn={false}
                        className={"absolute object-contain h-full p-4 animate-fadeIn z-10"}
                        loading={"eager"}
                        onClick={(e) => e.stopPropagation()}
                        src={`http://localhost:3005/raw/${photos[slideGroup.current].path}`}
                        alt={photos[slideGroup.current].path} width={photos[slideGroup.current].width}
                        height={photos[slideGroup.current].height}/>
                    {slideGroup.previous !== undefined &&
                        <FadeInImage
                            fadeIn={false}
                            key={photos[slideGroup.previous].path}
                            className={"absolute object-contain h-full p-4 animate-fadeOut z-0 opacity-0"}
                            loading={"eager"}
                            onClick={(e) => e.stopPropagation()}
                            src={`http://localhost:3005/raw/${photos[slideGroup.previous].path}`}
                            onAnimationEnd={() => setSlideGroup((prev) => {
                                return {current: prev.current, previous: undefined}
                            })}
                            alt={photos[slideGroup.previous].path} width={photos[slideGroup.previous].width}
                            height={photos[slideGroup.previous].height}/>
                    }
                </>
                }
            </div>
            <button onClick={(e: any) => {
                updateSelected(1);
                e.stopPropagation();
            }}
                    className={"text-gray-50 p-2 hover:text-gray-300"}>
                <ChevronRight size={64} strokeWidth={1}/>
            </button>
        </div>
    </div> : <></>
}

export default function Page({params}: { params: { album: string } }) {
    const [selectedAlbum, setSelectedAlbum] = useState<string>(params.album.toLowerCase());
    const [open, setOpen] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
    const [photos] = useRecoilState(albumsState);
    const router = useRouter();
    useEffect(() => {
        if (photos && Object.keys(photos).length > 0 && !photos[selectedAlbum]) {
            router.push(`/${Object.keys(photos)[0]}`)
        }
    }, [photos, selectedAlbum, router]);
    return (

        <div className={"px-4 w-full flex justify-center"}>
            {photos[selectedAlbum]?.photos &&
                <>
                    <ImageSlider photos={photos[selectedAlbum]?.photos} selected={selectedPhoto}
                                 open={open} setOpen={setOpen}/>
                    <Masonry
                        items={photos[selectedAlbum]?.photos}
                        config={{
                            columns: [1, 2, 3],
                            gap: [18, 18, 18],
                            media: [900, 1300, 2500],
                        }}
                        render={(data, idx) => (
                            <div key={idx} className={"cursor-pointer relative image-container"}
                                 onClick={() => {
                                     const selected = photos[selectedAlbum]?.photos.findIndex(photo => photo.path === data.path);
                                     if (selected !== undefined) {
                                         setSelectedPhoto(selected);
                                         setOpen(true)
                                     }
                                 }}
                            >
                                <FadeInImage loading={"lazy"}
                                             src={`http://localhost:3005/raw/${data.path}`}
                                             alt={data.path} width={data.width} height={data.height}/>
                            </div>)}
                    /></>
            }
        </div>
    );
}
