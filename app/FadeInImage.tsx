import React, { useState } from 'react';
import Image from "next/image";

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    width: number;
    height: number;
    loading: 'eager' | 'lazy';
    fadeIn?: boolean;
    onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
    onAnimationEnd?: (e: React.AnimationEvent<HTMLImageElement>) => void;
    onTransitionEnd?: (e: React.TransitionEvent<HTMLImageElement>) => void;
    previewOnly?: boolean;
}

const FadeInImage: React.FC<ImageProps> = ({ src, alt, className, width, height, loading,
    fadeIn = true,
    onClick,
    onAnimationEnd,
    onTransitionEnd,
    previewOnly
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
           <> <Image
                src={`${window.location.origin}/static/${previewOnly ? 'preview' : 'raw'}/${src}`}
                alt={alt}
                onClick={onClick}
                width={width}
                height={height}
                loading={loading}
                onAnimationEnd={onAnimationEnd}
                onTransitionEnd={onTransitionEnd}
                className={`${className} ${
                 !fadeIn ? '' :  isLoaded ? 'opacity-100' : 'opacity-0'
                } ${fadeIn ? 'transition-opacity duration-500 delay-75 ease-in-out' : ''}
                ${!isLoaded && !previewOnly ? 'opacity-0' : 'opacity-100' }`}
                onLoad={handleImageLoad}
                unoptimized
            />
               {!isLoaded && !previewOnly &&
                   <Image
                       src={`${window.location.origin}/static/preview/${src}`}
                       alt={alt}
                       onClick={onClick}
                       width={width}
                       height={height}
                       loading={loading}
                       onAnimationEnd={onAnimationEnd}
                       onTransitionEnd={onTransitionEnd}
                       className={`${className} ${
                           !fadeIn ? '' :  isLoaded ? 'opacity-100' : 'opacity-0'
                       } ${fadeIn ? 'transition-opacity duration-500 delay-75 ease-in-out' : ''}`}
                       unoptimized
                   />}
           </>

    );
};

export default FadeInImage;
