import React, {useState} from 'react';
import Image from "next/image";
import {Photo} from "@/app/photos/album";

interface ImageProps {
    photo: Photo;
    className?: string;
    loading: 'eager' | 'lazy';
    fadeIn?: boolean;
    onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
    onAnimationEnd?: (e: React.AnimationEvent<HTMLImageElement>) => void;
    onTransitionEnd?: (e: React.TransitionEvent<HTMLImageElement>) => void;
    isCurrent?: boolean;
    scale?: number;
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
            decoding={'async'}
            draggable={false}
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
                                                   isCurrent,
    scale = 2
                                               }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [previewAnimatedIn, setPreviewAnimatedIn] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        isCurrent ? <> <Image
                decoding={'async'}
                draggable={false}
                src={`${window.location.origin}/static/raw/${photo.path}`}
                alt={photo.path}
                onClick={onClick}
                width={photo.width}
                height={photo.height}
                loading={loading}
                onAnimationEnd={onAnimationEnd}
                onTransitionEnd={onTransitionEnd}
                className={`${(!isLoaded || !previewAnimatedIn) ? 'hidden' : ''} ${className}`}
                onLoad={handleImageLoad}
                unoptimized
            />
                {(!isLoaded || !previewAnimatedIn) &&
                    <Image
                        decoding={'async'}
                        draggable={false}
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
        </> : <Image
                decoding={'async'}
                draggable={false}
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
