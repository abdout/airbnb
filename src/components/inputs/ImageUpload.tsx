"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { CloudinaryUploadWidgetResults } from "next-cloudinary";

declare global {
  var cloudinary: any;
}

type Props = {
  onChange: (value: string) => void;
  value: string;
};

function ImageUpload({ onChange, value }: Props) {
  const handleUpload = useCallback(
    (results: CloudinaryUploadWidgetResults) => {
      try {
        const info = results.info as { secure_url: string };
        
        if (results.event === 'success' && info?.secure_url) {
          onChange(info.secure_url);
        } else {
          console.error('Invalid upload result:', results);
        }
      } catch (error) {
        console.error('Error in handleUpload:', error);
      }
    },
    [onChange]
  );

  const handleError = (error: any) => {
    console.error('Upload error:', error);
  };

  return (
    <CldUploadWidget
      uploadPreset="social"
      onError={handleError}
      options={{
        maxFiles: 1,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          }
        }
      }}
      onSuccess={handleUpload}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  alt="upload"
                  fill
                  style={{ objectFit: "cover" }}
                  src={value}
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}

export default ImageUpload;