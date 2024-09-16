'use client'

import {useCallback, useEffect, useMemo, useState} from "react";
import {DumbImage, PreviewImage, RawImage} from "@/app/image";
import {useRouter} from "next/navigation";
import {Masonry} from "react-plock";
import {useRecoilState} from "recoil";
import {albumsState, zoomedOutState} from "@/app/loader";
import {
    Aperture,
    ChevronLeft,
    ChevronRight,
    X
} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Link from "next/link";
import {Photo} from "@/app/photos/album";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

function formatSize(size: number) {
    if (size < 1000) {
        return `${size} B`
    } else if (size < 1000000) {
        return `${(size / 1000).toFixed(2)} KB`
    } else {
        return `${(size / 1000000).toFixed(2)} MB`
    }
}

function exposureTimeToFraction(time?: number) {
    if (!time) {
        return '-';
    }
    let fraction: string;
    if (time < 1) {
        fraction = `1/${Math.round(1 / time)}`
    } else {
        fraction = `${time.toFixed(2)}`
    }
    return fraction + ' s';
}

const photoType: { [key: string]: string } = {
    "jpg": "JPEG",
    "jpeg": "JPEG",
    "avif": "AVIF",
    "webp": "WEBP",
    "png": "PNG",
    "gif": "GIF"
}

function getPhotoType(path: string | undefined) {
    const ext: string | undefined = path?.split('.').pop()
    if (!ext) {
        return undefined;
    }
    return photoType[ext] ?
        photoType[ext] : '';
}

function formatSubjectDistance(distance?: number) {
    if (!distance) {
        return '-';
    }
    if (distance > 10000) {
        return 'MAX'
    }
    if (distance < 1) {
        return `${(distance * 100).toFixed(0)} cm`
    } else {
        return `${distance.toFixed(2)} m`
    }
}

function formatDatetime(date?: Date) {
    // format to date only like 2024-08-03 (this format)
    if (!date) {
        return '';
    }
    return ` · ${new Date(date).toISOString().split('T')[0]}`;
}

function Exif({photo}: { photo: Photo }) {
    const [mp] = useMemo(() => {
        const mp = (photo.width * photo.height / 1000000).toFixed(0);
        return [mp]
    }, [photo]);
    const cell = (values: (string | undefined)[]) => {
        return values.map((value, idx) => {
            return <p key={idx}
                      className={`py-1 px-1 text-center flex-0 shrink-0 border-[#5f6264] ${idx === values.length - 1 ? '' : 'border-r'}`}
            >{value ? value : '-'}</p>
        })
    }
    return <div
        className={"drop-shadow-2xl tracking-normal items-center justify-center flex flex-col gap-1 rounded-md bg-[#222222] [&>*]:border-[#5f6264] border border-[#5f6264]"}>
        <div className={"flex w-full items-center justify-between gap-1 bg-[#323232] rounded-t-md p-3 border-b"}>
            <p className={"text-white"}>{photo.exif.Image?.Model}</p>
            {getPhotoType(photo.path) && <p className={"bg-[#565656] text-white px-1 text-sm rounded-sm"}>
                {getPhotoType(photo.path)}
            </p>}
        </div>
        <div className={"flex flex-col gap-1 p-3 text-sm w-full border-b text-[#aeaeb3]"}>
            <p>{photo.exif.Photo?.LensModel}{formatDatetime(photo.exif.Photo?.DateTimeOriginal)}</p>
            <p>{mp} MP · {photo.width} × {photo.height} · {formatSize(photo.size)}</p>
        </div>
        <div className={"grid grid-cols-5 text-sm items-center justify-center w-full pt-1 pb-2 text-[#aeaeb3]"}>
            {cell([
                `ISO ${photo.exif.Photo?.ISOSpeedRatings}`,
                `${photo.exif.Photo?.FocalLength} mm`,
                `${formatSubjectDistance(photo.exif.Photo?.SubjectDistance)}`,
                `f/${photo.exif.Photo?.FNumber}`,
                `${exposureTimeToFraction(photo.exif.Photo?.ExposureTime)}`])}
        </div>
    </div>
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0));
}

function ImageSlider({photos, selected, open, setOpen}:
                         {
                             photos: Photo[], selected: number, open: boolean,
                             setOpen: (open: boolean) => void
                         }) {

    const [slideGroup, setSlideGroup] =
        useState<{ current: number | undefined; previous: number | undefined }>({
            current: undefined, previous: undefined
        });
    const [popOverOpen, setPopOverOpen] = useState<boolean>(false);
    const [controlHidden, setControlHidden] = useState<boolean>(false);
    useEffect(() => {
        setControlHidden(false);
        let timer = setTimeout(() => {
            if (!popOverOpen) {
                setControlHidden(true);
            }
        }, isTouchDevice() ? 4000 : 2000);
        const mouseMove = () => {
            setControlHidden(false);
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!popOverOpen) {
                    setControlHidden(true);
                }
            }, isTouchDevice() ? 4000 : 2000);
        }
        document.addEventListener('mousemove', mouseMove);
        // document.addEventListener('wheel', event => {
        //     const { ctrlKey } = event
        //     if (ctrlKey) {
        //         event.preventDefault();
        //         return
        //     }
        // }, { passive: false })
        return () => {
            clearTimeout(timer)
            document.removeEventListener('mousemove', mouseMove);
        };
    }, [slideGroup, popOverOpen]);
    useEffect(() => {
        setSlideGroup(() => {
            return {current: selected, previous: undefined}
        });
    }, [selected, setSlideGroup]);
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            if (slideGroup.current !== undefined && slideGroup.current !== selected) {
                document.getElementById(`${slideGroup.current}`)?.scrollIntoView();
            }
        }
    }, [open, selected, slideGroup]);
    const updateSelected = useCallback((direction: number) => {
        setSlideGroup((prev) => {
            if ((prev.current == 0 && direction == -1) || (prev.current == photos.length - 1 && direction == 1)) {
                return prev;
            }
            return {
                current: prev.current !== undefined ? prev.current + direction : prev.current,
                previous: prev.current
            }
        });
    }, [photos]);

    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                updateSelected(-1);
            } else if (e.key === 'ArrowRight') {
                updateSelected(1);
            } else if (e.key === 'Escape') {
                setOpen(false);
            }
        }
        window.addEventListener('keydown', keyListener);
        return () => {
            window.removeEventListener('keydown', keyListener);
        }
    }, [photos.length, selected, setOpen, updateSelected]);
    return open ? <div
        className={"fixed top-0 left-0 w-full h-full bg-black bg-opacity-85 backdrop-blur z-40 " +
            `${open ? '' : 'hidden'}`}
    >
        <div className={"relative h-full w-full flex items-center"}>
            <div
                className={`pointer-events-none flex flex-row-reverse gap-3 max-md:gap-1 items-center p-2 w-full absolute top-0 right-0 z-20 transition-opacity duration-300 ${controlHidden ? 'opacity-0' : 'opacity-100'}`}>
                <button className={"text-gray-50 p-2 hover:text-gray-300"}>
                    <X
                        className={`w-12 h-12 max-md:w-10 max-md:h-10 ${controlHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}
                        strokeWidth={1} onClick={() => setOpen(false)}/>
                </button>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger onClick={() => {
                            setPopOverOpen((prev) => !prev);
                        }}>
                            <Aperture
                                className={`w-9 h-9 max-md:w-8 max-md:h-8 transition-colors text-gray-50 hover:text-gray-300 ${controlHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}
                                strokeWidth={1}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Get photo info</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Popover
                    open={popOverOpen}>
                    <PopoverTrigger></PopoverTrigger>
                    <PopoverContent
                        className={"mt-8 mr-4 w-96 max-w-[92vw] bg-transparent p-0 border-none"}
                        onClick={(e) => e.stopPropagation()}
                        align={"center"}>
                        {slideGroup.current !== undefined &&
                            <Exif photo={photos[slideGroup.current]}/>}
                    </PopoverContent>
                </Popover>

            </div>
            <div
                className={`pointer-events-none flex justify-between w-full absolute z-20 transition-opacity duration-300 ${controlHidden ? 'opacity-0' : 'opacity-100'} ${isTouchDevice() ? 'hidden' : ''}`}>
                <button onClick={(e: any) => {
                    updateSelected(-1);
                    e.stopPropagation();
                }}
                        className={`text-gray-50 p-1.5 max-md:p-0.5 hover:text-gray-300 ${slideGroup.current === 0 ? 'opacity-0 !pointer-events-none' : ''} ${controlHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                    <ChevronLeft
                        className={"w-16 h-16 max-md:w-12 max-md:h-12"} strokeWidth={1}/>
                </button>

                <button onClick={(e: any) => {
                    updateSelected(1);
                    e.stopPropagation();
                }}
                        className={`text-gray-50 p-1.5 max-md:p-0.5 hover:text-gray-300 ${slideGroup.current === photos.length - 1 ? 'opacity-0 !pointer-events-none' : ''} ${controlHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                    <ChevronRight className={"w-16 h-16 max-md:w-12 max-md:h-12"} strokeWidth={1}/>
                </button>
            </div>
            {slideGroup.current !== undefined && <>
                <RawImage
                    key={photos[slideGroup.current].path}
                    isCurrent
                    className={"absolute object-contain h-full w-full z-0"}
                    loading={"eager"}
                    onClick={(event) => {
                        const image = event.currentTarget;
                        const rect = image.getBoundingClientRect();
                        let actualWidth = image.naturalWidth * (rect.height / image.naturalHeight);
                        let actualHeight = rect.height;
                        if (actualWidth > rect.width) {
                            actualHeight = image.naturalHeight * (rect.width / image.naturalWidth);
                            actualWidth = rect.width;
                        }
                        const x = event.clientX - rect.left;
                        const y = event.clientY - rect.top;
                        const marginX = (rect.width - actualWidth) / 2;
                        const marginY = (rect.height - actualHeight) / 2;
                        if (popOverOpen) {
                            setPopOverOpen(false);
                            return;
                        }
                        if (x < marginX || x > rect.width - marginX || y < marginY || y > rect.height - marginY) {
                            if (controlHidden) {
                                setControlHidden(false);
                            } else {
                                setOpen(false);
                            }
                        } else if (isTouchDevice()) {
                            if (x < marginX + actualWidth / 2.2) {
                                updateSelected(-1);
                            } else if (x > marginX + (1.2 * actualWidth) / 2.2) {
                                updateSelected(1);
                            }
                        }
                    }}
                    photo={photos[slideGroup.current]}/>
                {slideGroup.previous !== undefined &&
                    <RawImage
                        key={photos[slideGroup.previous].path}
                        className={"absolute object-contain h-full w-full z-10 opacity-0"}
                        loading={"eager"}
                        onAnimationEnd={() => setSlideGroup((prev) => {
                            return {current: prev.current, previous: undefined}
                        })}
                        photo={photos[slideGroup.previous]}/>
                }
                <DumbImage
                    loading={"eager"}
                    photo={photos[slideGroup.current + 1]}/>
                <DumbImage
                    loading={"eager"}
                    photo={photos[slideGroup.current - 1]}/>
            </>
            }
        </div>
    </div> : <></>
}

export default function Page({params}: { params: { album: string } }) {
    const [selectedAlbum,] = useState<string>(params.album.toLowerCase());
    const [open, setOpen] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
    const [photos] = useRecoilState(albumsState);
    const router = useRouter();
    const [zoomedOut] = useRecoilState(zoomedOutState);
    useEffect(() => {
        if (selectedAlbum !== 'about') {
            if (photos && Object.keys(photos).length > 0 && !photos[selectedAlbum]) {
                router.push(`/${Object.keys(photos)[0]}`)
            }
        }

    }, [photos, selectedAlbum, router]);
    return (

        <div className={"px-4 w-full flex justify-center"}>
            {selectedAlbum === "about" ? <div className="flex flex-col items-center justify-center text-white">
                    <section className={"flex flex-col gap-3 justify-center [&>*]:font-bold"}>
                        <Link href={"mailto:dan@lyu.sh"}>dan@lyu.sh</Link>
                        <Link href={"https://lyu.sh"} target={"_blank"}>Portfolio</Link>
                        <Link href={"https://www.linkedin.com/in/dan-lyu/"} target={"_blank"}>LinkedIn</Link>
                    </section>
                </div> :
                photos[selectedAlbum]?.photos &&
                <>
                    <ImageSlider photos={photos[selectedAlbum]?.photos} selected={selectedPhoto}
                                 open={open} setOpen={setOpen}/>
                    {zoomedOut ?
                        <MasonryPhotos selectedAlbum={selectedAlbum} photos={photos} setSelectedPhoto={setSelectedPhoto}
                                       setOpen={setOpen} config={{
                            columns: [2, 3, 4],
                            gap: [10, 12, 14],
                            media: [1000, 1400, 2500],
                        }}/> :
                        <MasonryPhotos selectedAlbum={selectedAlbum} photos={photos} setSelectedPhoto={setSelectedPhoto}
                                       setOpen={setOpen} config={{
                            columns: [1, 2, 3],
                            gap: [12, 18, 18],
                            media: [1000, 1400, 2500],
                        }}/>}
                </>
            }
        </div>
    );
}


function MasonryPhotos({selectedAlbum, photos, setSelectedPhoto, setOpen, config}:
                           {
                               selectedAlbum: string, photos: { [key: string]: { name: string, photos: Photo[] } },
                               setSelectedPhoto: (idx: number) => void, setOpen: (open: boolean) => void, config: {
                                   columns: number | number[];
                                   gap: number | number[];
                                   media?: number[];
                               }
                           }) {
    return <Masonry
        items={photos[selectedAlbum]?.photos}
        config={config}
        key={JSON.stringify(config)}
        render={(data) => {
            return <div
                id={`${data.idx}`}
                key={data.path} className={"cursor-pointer relative image-container"}
                onClick={() => {
                    setSelectedPhoto(data.idx);
                    setOpen(true)
                }}
            >
                <PreviewImage
                    loading={"lazy"}
                    photo={data}/>
            </div>
        }}
    />
}
