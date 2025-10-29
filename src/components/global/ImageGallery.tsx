import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface ImgGalleryProps {
  images: string[] | undefined;
}

const ImageGallery: React.FC<ImgGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <PhotoProvider>
      <div className="flex flex-col md:flex-row gap-4 w-[75.6em]">
        {/* Main Large Image */}
        <div className="w-full md:w-[100em]">
          {images[0].endsWith(".mp4") ? (
            <video
              src={images[0]}
              className="w-full h-[360px] object-cover rounded-xl"
              controls
            />
          ) : (
            <PhotoView src={images[0]}>
              <img
                src={images[0]}
                alt="Main"
                className="rounded-xl w-full h-[400px] object-cover cursor-pointer"
              />
            </PhotoView>
          )}
        </div>

        {/* Grid of Smaller Images */}
        <div className="w-full md:w-[100em] grid grid-cols-2 gap-4">
          {images.slice(1).map((img, idx) => (
            <div>
              {img.endsWith(".mp4") ? (
                <video
                  src={img}
                  className="w-full h-[190px] object-cover rounded-xl"
                  controls
                />
              ) : (
                <PhotoView key={idx} src={img}>
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="rounded-xl h-[190px] w-full object-cover cursor-pointer"
                  />
                </PhotoView>
              )}
            </div>
          ))}
        </div>
      </div>
    </PhotoProvider>
  );
};

export default ImageGallery;
