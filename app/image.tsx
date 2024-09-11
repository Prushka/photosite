import React, {useState} from 'react';
import Image from "next/image";
import {Photo} from "@/app/photos/route";

interface ImageProps {
    photo: Photo;
    className?: string;
    loading: 'eager' | 'lazy';
    fadeIn?: boolean;
    onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
    onAnimationEnd?: (e: React.AnimationEvent<HTMLImageElement>) => void;
    onTransitionEnd?: (e: React.TransitionEvent<HTMLImageElement>) => void;
    isCurrent?: boolean;
}

export const PreviewImage: React.FC<ImageProps> = ({
                                                       photo, className, loading,
                                                       onClick,
                                                   }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        <Image
            src={`${window.location.origin}/static/preview/${photo.path}`}
            alt={photo.path}
            onClick={onClick}
            width={photo.width}
            height={photo.height}
            loading={loading}
            className={`${isLoaded ? 'opacity-100' : 'opacity-0'} 
            transition-opacity duration-500 delay-75 ease-in-out ${className}`}
            onLoad={handleImageLoad}
            unoptimized
        />
    );
};


export const RawImage: React.FC<ImageProps> = ({
                                                   photo, className, loading,
                                                   onClick,
                                                   onAnimationEnd,
                                                   onTransitionEnd,
                                                   isCurrent
                                               }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [previewAnimatedIn, setPreviewAnimatedIn] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        isCurrent ? <div className={"relative w-full h-full"}> <Image
                src={`${window.location.origin}/static/raw/${photo.path}`}
                alt={photo.path}
                onClick={onClick}
                width={photo.width}
                height={photo.height}
                loading={loading}
                onAnimationEnd={onAnimationEnd}
                onTransitionEnd={onTransitionEnd}
                className={`${!isLoaded || !previewAnimatedIn ? 'hidden' : ''} ${className}`}
                onLoad={handleImageLoad}
                unoptimized
            />
                {!isLoaded || !previewAnimatedIn &&
                    <Image
                        src={`${window.location.origin}/static/preview/${photo.path}`}
                        alt={photo.path}
                        onClick={onClick}
                        width={photo.width}
                        height={photo.height}
                        loading={loading}
                        onAnimationEnd={(e) => {
                            setPreviewAnimatedIn(true);
                            onAnimationEnd && onAnimationEnd(e);
                        }}
                        onTransitionEnd={onTransitionEnd}
                        className={`${className} animate-fadeIn`}
                        unoptimized
                    />}
            {/*{!isLoaded && <div className={"absolute right-0 bottom-0 z-20 mr-4 mb-4 text-neutral-200"}>*/}
            {/*    <LoaderCircle strokeWidth={1} size={36} className={"animate-spin"}/>*/}
            {/*</div>}*/}
            </div> : <Image
                src={`${window.location.origin}/static/preview/${photo.path}`}
                alt={photo.path}
                onClick={onClick}
                width={photo.width}
                height={photo.height}
                loading={loading}
                onAnimationEnd={onAnimationEnd}
                onTransitionEnd={onTransitionEnd}
                className={`animate-fadeOut ${className}`}
                unoptimized
            />
    );
};
