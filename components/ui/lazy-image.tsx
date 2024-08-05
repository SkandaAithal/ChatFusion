"use client";
import { LazyImageProps } from "@/lib/types/components/ui/lazyimage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "./skeleton";
import { isEmpty } from "@/lib/utils";

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  isLazyLoad = false,
  width,
  height,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageDimensions = width && height ? { width, height } : {};
  useEffect(() => {
    if (src && !isLazyLoad) {
      setTimeout(() => setImageUrl(src), 1000);
    }
  }, [isLazyLoad, src]);

  const handleLoad = () => {
    setIsImageLoaded(true);
  };

  const handleError = () => {
    setImageUrl("/assets/placeholder-error-image.jpg");
  };

  const isImgUrl = isLazyLoad ? src : imageUrl;
  return (
    <div className="relative h-full w-full">
      {!isImageLoaded && (
        <Skeleton
          className={twMerge(
            "object-cover w-full h-full absolute inset-0",
            className
          )}
        />
      )}

      {isImgUrl && (
        <Image
          src={isImgUrl}
          alt={alt}
          fill={isEmpty(imageDimensions)}
          onLoad={handleLoad}
          onError={handleError}
          className={twMerge(
            "object-cover transition-opacity duration-200",
            className,
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          sizes="50dvw"
          {...imageDimensions}
        />
      )}
    </div>
  );
};

export default LazyImage;
