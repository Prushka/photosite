'use client'

import {useCallback, useEffect, useState} from "react";
import FadeInImage from "@/app/FadeInImage";
import {useRouter} from "next/navigation";
import {Masonry} from "react-plock";
import {Photo} from "@/app/photos/route";
import {useRecoilState} from "recoil";
import {albumsState} from "@/app/loader";
import {
    Aperture,
    Camera,
    ChevronLeft,
    ChevronRight,
    Proportions,
    ScanSearch,
    Shell,
    Telescope,
    Timer,
    X
} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Link from "next/link";

function Row({icon, title, content}: { icon: any, title: string, content: string | undefined | number }) {
    return (content && <div className={"flex gap-4 justify-between items-center text-sm"}>
        <div className={"flex gap-2 items-center justify-center"}>
            <div className={"shrink-0"}>{icon}</div>
            <p className={"font-bold"}>{title}</p>
        </div>
        <p>{content}</p>
    </div>)
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
    const [isTouch, setIsTouch] = useState<boolean>(isTouchDevice());
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTouch(isTouchDevice());
        }, 3000);
        return () => clearTimeout(timer);
    }, [setIsTouch]);
    useEffect(() => {
        setControlHidden(false);
        let timer = setTimeout(() => {
            if(!popOverOpen) {
                setControlHidden(true);
            }
        }, 1500);
        const mouseMove = () => {
            setControlHidden(false);
            clearTimeout(timer);
            timer = setTimeout(() => {
                if(!popOverOpen) {
                    setControlHidden(true);
                }
            }, 1500);
        }
        document.addEventListener('mousemove', mouseMove);
        return () => {
            clearTimeout(timer)
            document.removeEventListener('mousemove', mouseMove);
        };
    }, [slideGroup, popOverOpen]);
    useEffect(() => {
        setSlideGroup(() => {
            return {current: selected, previous: undefined}
        });
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
    }, [photos.length]);

    useEffect(() => {
        let xDown: number | null = null;
        let yDown: number | null = null;
        const handleTouchStart = (e: TouchEvent) => {
            xDown = e.touches[0].clientX;
            yDown = e.touches[0].clientY;
        }
        const handleTouchMove = (e: TouchEvent) => {
            if (!xDown || !yDown) {
                return;
            }
            let xUp = e.touches[0].clientX;
            let yUp = e.touches[0].clientY;
            let xDiff = xDown - xUp;
            let yDiff = yDown - yUp;
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff > 0) {
                    updateSelected(1);
                } else {
                    updateSelected(-1);
                }
            }
            xDown = null;
            yDown = null;
        }
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        }
    }, [updateSelected]);
    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                updateSelected(- 1);
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
        className={"fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 backdrop-blur z-50 flex flex-col items-center cursor-zoom-out " +
            `${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => {
            if(popOverOpen){
                setPopOverOpen(false);
            } else if(controlHidden) {
                setControlHidden(false);
            }else {
                setOpen(false)
            }
        }}
    >
        <div className={"flex justify-between items-center flex-1 overflow-auto w-full relative"}>

            <div className={`flex flex-row-reverse gap-3 max-md:gap-1 items-center p-2 w-full absolute top-0 right-0 z-20 transition-opacity duration-300 ${controlHidden ? 'opacity-0 pointer-events-none' :'opacity-100'}`}>
                <button className={"text-gray-50 p-2 hover:text-gray-300"}>
                    <X
                        className={"w-12 h-12 max-md:w-10 max-md:h-10"}
                        strokeWidth={1} onClick={() => setOpen(false)}/>
                </button>
                <Popover
                    open={popOverOpen}>
                    <PopoverTrigger onClick={(e) => {
                        e.stopPropagation()
                        setPopOverOpen((prev) => !prev)
                    }}>
                        <Aperture className={"w-9 h-9 max-md:w-8 max-md:h-8 transition-colors text-gray-50 hover:text-gray-300"} strokeWidth={1}
                        />
                    </PopoverTrigger>
                    <PopoverContent
                        className={"mt-4 mr-4"}
                        onClick={(e) => e.stopPropagation()}
                        align={"center"}>
                        {slideGroup.current !== undefined &&
                            <div className={"flex flex-col gap-4"}>
                                <Row icon={<Camera size={20} strokeWidth={1}/>} title={"Camera"}
                                     content={photos[slideGroup.current].exif.Image?.Model}/>
                                <Row icon={<Proportions size={20} strokeWidth={1}/>} title={"Resolution"}
                                     content={`${photos[slideGroup.current].width} x ${photos[slideGroup.current].height}`}/>
                                <Row icon={<Timer size={20} strokeWidth={1}/>} title={"Exposure Time"}
                                     content={`${photos[slideGroup.current].exif.Photo?.ExposureTime?.toFixed(4)}s`}/>
                                <Row icon={<Aperture size={20} strokeWidth={1}/>} title={"Aperture"}
                                     content={`f/${photos[slideGroup.current].exif.Photo?.FNumber}`}/>
                                <Row icon={<Shell size={20} strokeWidth={1}/>} title={"ISO"}
                                     content={`${photos[slideGroup.current].exif.Photo?.ISOSpeedRatings}`}/>
                                <Row icon={<Telescope size={20} strokeWidth={1}/>} title={"Focal Length"}
                                     content={`${photos[slideGroup.current].exif.Photo?.FocalLength}mm`}/>
                                <Row icon={<ScanSearch size={20} strokeWidth={1}/>} title={"Subject Distance"}
                                     content={`${photos[slideGroup.current].exif.Photo?.SubjectDistance !== undefined 
                                         ? photos[slideGroup.current].exif.Photo?.SubjectDistance! > 100000 ? 'MAX' : 
                                             photos[slideGroup.current].exif.Photo?.SubjectDistance : ''}`}/>
                            </div>}
                    </PopoverContent>
                </Popover>

            </div>
            <div
                className={`flex justify-between w-full absolute z-20 transition-opacity duration-300 ${controlHidden ? 'opacity-0' : 'opacity-100'} ${isTouch? 'hidden':''}`}>
                <button onClick={(e: any) => {
                    updateSelected(-1);
                    e.stopPropagation();
                }}
                        className={`text-gray-50 p-1.5 max-md:p-0.5 hover:text-gray-300 ${slideGroup.current === 0 ? 'opacity-0':''}`}>
                    <ChevronLeft
                        className={"w-16 h-16 max-md:w-12 max-md:h-12"} strokeWidth={1}/>
                </button>

                <button onClick={(e: any) => {
                    updateSelected(1);
                    e.stopPropagation();
                }}
                        className={`text-gray-50 p-1.5 max-md:p-0.5 hover:text-gray-300 ${slideGroup.current === photos.length - 1 ? 'opacity-0':''}`}>
                    <ChevronRight className={"w-16 h-16 max-md:w-12 max-md:h-12"} strokeWidth={1}/>
                </button>
            </div>

            <div className={"relative h-full flex-1 overflow-auto w-full"}>
                {slideGroup.current !== undefined && <>
                    <FadeInImage
                        key={photos[slideGroup.current].path}
                        fadeIn={false}
                        className={"absolute object-contain h-full animate-fadeIn z-10"}
                        loading={"eager"}
                        src={`${photos[slideGroup.current].path}`}
                        alt={photos[slideGroup.current].path} width={photos[slideGroup.current].width}
                        height={photos[slideGroup.current].height}/>
                    {slideGroup.previous !== undefined &&
                        <FadeInImage
                            fadeIn={false}
                            key={photos[slideGroup.previous].path}
                            className={"absolute object-contain h-full animate-fadeOut z-0 opacity-0"}
                            loading={"eager"}
                            src={`${photos[slideGroup.previous].path}`}
                            onAnimationEnd={() => setSlideGroup((prev) => {
                                return {current: prev.current, previous: undefined}
                            })}
                            alt={photos[slideGroup.previous].path} width={photos[slideGroup.previous].width}
                            height={photos[slideGroup.previous].height}/>
                    }
                </>
                }
            </div>
        </div>
    </div> : <></>
}

export default function Page({params}: { params: { album: string } }) {
    const [selectedAlbum,] = useState<string>(params.album.toLowerCase());
    const [open, setOpen] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
    const [photos] = useRecoilState(albumsState);
    const router = useRouter();
    useEffect(() => {
        if(selectedAlbum !== 'about'){
            if (photos && Object.keys(photos).length > 0 && !photos[selectedAlbum]) {
                router.push(`/${Object.keys(photos)[0]}`)
            }
        }

    }, [photos, selectedAlbum, router]);
    return (

        <div className={"px-4 w-full flex justify-center"}>
            {selectedAlbum === "about" ? <div className="flex flex-col items-center justify-center text-white">
                <section className={"flex flex-col gap-3 justify-center [&>*]:font-bold"}>
                    <Link href={"https://lyu.sh"} target={"_blank"}>Portfolio</Link>
                    <Link href={"https://www.linkedin.com/in/dan-lyu/"} target={"_blank"}>LinkedIn</Link>
                    <Link href={"https://www.figma.com/@prushka"} target={"_blank"}>Figma</Link>
                    <Link href={"https://github.com/Prushka"} target={"_blank"}>GitHub</Link>
                    <Link href={"https://github.com/Prushka/photosite"} target={"_blank"}>Made using Photosite (by me)</Link>
                </section>
            </div> :
            photos[selectedAlbum]?.photos &&
                <>
                    <ImageSlider photos={photos[selectedAlbum]?.photos} selected={selectedPhoto}
                                 open={open} setOpen={setOpen}/>
                    <Masonry
                        items={photos[selectedAlbum]?.photos}
                        config={{
                            columns: [1, 2, 3],
                            gap: [18, 18, 18],
                            media: [1000, 1400, 2500],
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
                                <FadeInImage
                                    previewOnly
                                    loading={"lazy"}
                                             src={`${data.path}`}
                                             alt={data.path} width={data.width} height={data.height}/>
                            </div>)}
                    /></>
            }
        </div>
    );
}
