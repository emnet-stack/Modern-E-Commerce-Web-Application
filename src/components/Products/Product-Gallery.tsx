"use client";

import { useState } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div className="space-y-3">
      <SafeImage
        key={current}
        src={current}
        alt={title}
        className="aspect-square w-full rounded-lg border"
      />
      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={cn(
                  "h-16 w-16 overflow-hidden rounded-md border outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  i === index && "ring-2 ring-primary",
                )}
              >
                <SafeImage
                  key={img}
                  src={img}
                  alt={`${title} thumbnail ${i + 1}`}
                  className="h-full w-full"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}