import React, { useState } from 'react';
import Image from "next/image";

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    width: number;
    height: number;
    loading: 'eager' | 'lazy';
}

const FadeInImage: React.FC<ImageProps> = ({ src, alt, className, width, height, loading }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div className="relative">
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                className={`${className} ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-700 delay-100 ease-in-out`}
                onLoad={handleImageLoad}
            />
            {/*{!isLoaded && (*/}
            {/*    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-200 animate-pulse" />*/}
            {/*)}*/}
        </div>
    );
};

export default FadeInImage;
