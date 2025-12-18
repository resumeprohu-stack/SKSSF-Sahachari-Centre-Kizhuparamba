'use client';

import * as React from 'react';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

interface HeroCarouselProps {
  images: ImagePlaceholder[];
}

export function HeroCarousel({ images }: HeroCarouselProps) {
  return (
    <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={500}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <div key={image.id} className="relative h-full w-full">
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
              priority={index === 0}
            />
          </div>
        ))}
      </Carousel>
  );
}
