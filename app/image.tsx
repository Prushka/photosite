import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {Photo} from "@/app/photos/album";
import {HashLoader} from "react-spinners";
import Toolover from "@/components/ui/toolover";

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
                                                   isCurrent
                                               }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [previewAnimatedIn, setPreviewAnimatedIn] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    useEffect(() => {
        if (isLoaded) {
            setShowLoading(false);
        }
        const timeout = setTimeout(() => {
            setShowLoading(()=>{
                return !isLoaded;
            });
        }, 1000);
        return () => clearTimeout(timeout);
    }, [isLoaded]);

    return (
        isCurrent ? <div className={"relative w-full h-full"}> <Image
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
            {showLoading &&
                <div className={"absolute bottom-6 right-6 text-white"}>
                    <Toolover content={"Loading full resolution photo"}>
                        <HashLoader size={24} color={"#ffffff"}/>
                    </Toolover>
                </div>}
        </div> : <Image
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


export const DumbImage: React.FC<ImageProps> = ({
                                                   photo, className, loading,
                                                   onClick,
                                                   onAnimationEnd,
                                                   onTransitionEnd
                                               }) => {

    return photo ? <Image
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
            className={`hidden ${className}`}
            unoptimized
        /> : <></>;
};
