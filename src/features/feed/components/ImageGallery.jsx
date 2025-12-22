import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const ImageGallery = ({ images = [] }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Render layouts based on image count
  const renderLayout = () => {
    const count = images.length;

    // 1 Image
    if (count === 1) {
      return (
        <div 
          className="w-full aspect-video md:aspect-auto md:max-h-[600px] overflow-hidden rounded-xl cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <img 
            src={images[0].url} 
            alt="Post content" 
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      );
    }

    // 2 Images
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 h-64 md:h-80 rounded-xl overflow-hidden">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="relative h-full cursor-pointer overflow-hidden"
              onClick={() => openLightbox(idx)}
            >
              <img 
                src={img.url} 
                alt={`Post content ${idx + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      );
    }

    // 3 Images
    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 h-64 md:h-96 rounded-xl overflow-hidden">
          <div 
            className="relative h-full cursor-pointer overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img 
              src={images[0].url} 
              alt="Post content 1" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="grid grid-rows-2 gap-1 h-full">
            {images.slice(1).map((img, idx) => (
              <div 
                key={idx + 1} 
                className="relative h-full cursor-pointer overflow-hidden"
                onClick={() => openLightbox(idx + 1)}
              >
                <img 
                  src={img.url} 
                  alt={`Post content ${idx + 2}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4 Images
    if (count === 4) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-64 md:h-96 rounded-xl overflow-hidden">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="relative h-full cursor-pointer overflow-hidden"
              onClick={() => openLightbox(idx)}
            >
              <img 
                src={img.url} 
                alt={`Post content ${idx + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      );
    }

    // 5+ Images
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-64 md:h-96 rounded-xl overflow-hidden">
        {images.slice(0, 3).map((img, idx) => (
          <div 
            key={idx} 
            className="relative h-full cursor-pointer overflow-hidden"
            onClick={() => openLightbox(idx)}
          >
            <img 
              src={img.url} 
              alt={`Post content ${idx + 1}`} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
        <div 
          className="relative h-full cursor-pointer overflow-hidden group"
          onClick={() => openLightbox(3)}
        >
          <img 
            src={images[3].url} 
            alt="Post content 4" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/40">
            <span className="text-white text-2xl md:text-3xl font-bold">+{count - 4}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-3 mb-1">
        {renderLayout()}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && createPortal(
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm" onClick={closeLightbox}>
          <button 
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
            onClick={closeLightbox}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors hidden md:block"
                  onClick={prevImage}
                >
                  <span className="material-symbols-outlined text-4xl">chevron_left</span>
                </button>
                <button 
                  className="absolute right-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors hidden md:block"
                  onClick={nextImage}
                >
                  <span className="material-symbols-outlined text-4xl">chevron_right</span>
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center p-4">
              <img 
                src={images[currentImageIndex].url} 
                alt={`Gallery view ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain select-none"
              />
            </div>

            {/* Dots Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 p-4">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                      currentImageIndex === idx 
                        ? 'bg-white scale-125' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ImageGallery;


