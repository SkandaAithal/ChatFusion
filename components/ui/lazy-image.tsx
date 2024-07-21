import { LazyImageProps } from "@/lib/types/components/ui/lazyimage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = "" }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (src) {
      setTimeout(() => setImageUrl(src), 1000);
    }
  }, [src]);

  return imageUrl ? (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      onError={() => {
        setImageUrl("/assets/placeholder-error-image.jpg");
      }}
      sizes="50dvw"
      className={twMerge("object-cover", className)}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP0+w8AAaEBT3Zl1CEAAAAASUVORK5CYII="
    />
  ) : (
    <></>
  );
};

export default LazyImage;
