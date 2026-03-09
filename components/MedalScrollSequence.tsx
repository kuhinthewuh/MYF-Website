"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import { Star, ChevronDown } from 'lucide-react';

const FRAME_COUNT = 120;

export default function MedalScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Framer motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth the scroll progress to avoid jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001
  });

  // Preload images
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let loadCounter = 0;

    const preloadNextImage = (index: number) => {
      if (!isMounted) return;
      if (index > FRAME_COUNT) {
        setImages(loadedImages);
        setTimeout(() => setIsReady(true), 500); // small delay for polish
        return;
      }

      const img = new Image();
      const paddedIndex = String(index).padStart(4, '0');
      img.src = `/sequence/frame_${paddedIndex}.webp`;

      img.onload = () => {
        loadedImages[index - 1] = img;
        loadCounter++;
        setLoadedCount(loadCounter);
        
        if (loadCounter === FRAME_COUNT) {
            setImages([...loadedImages]);
            setTimeout(() => setIsReady(true), 500);
        }
      };
      
      img.onerror = () => {
        console.error(`Missing frame ${index}`);
        loadCounter++;
        setLoadedCount(loadCounter);
        if (loadCounter === FRAME_COUNT) {
            setImages([...loadedImages]);
            setTimeout(() => setIsReady(true), 500);
        }
      };
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
        preloadNextImage(i);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Canvas render logic
  useEffect(() => {
    if (!isReady || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const renderFrame = (index: number) => {
      if (!canvas || !ctx || !images[index]) return;

      const img = images[index];
      
      const parent = canvas.parentElement;
      if (!parent) return;

      const lW = parent.clientWidth;
      const lH = parent.clientHeight;
      const { width: iW, height: iH } = img;
      
      // Calculate scale to "cover" the entire container
      const scale = Math.max(lW / iW, lH / iH);
      const renderW = iW * scale;
      const renderH = iH * scale;
      const x = (lW - renderW) / 2;
      const y = (lH - renderH) / 2;

      ctx.clearRect(0, 0, lW, lH);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, x, y, renderW, renderH);
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        
        ctx.resetTransform();
        ctx.scale(dpr, dpr);

        const currentIndex = Math.min(
          Math.floor(smoothProgress.get() * FRAME_COUNT),
          FRAME_COUNT - 1
        );
        renderFrame(Math.max(0, currentIndex));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const unsubscribe = smoothProgress.on("change", (latest) => {
      const frameIndex = Math.min(
        Math.floor(latest * FRAME_COUNT),
        FRAME_COUNT - 1
      );
      requestAnimationFrame(() => renderFrame(Math.max(0, frameIndex)));
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [isReady, images, smoothProgress]);

  const loadPercentage = Math.round((loadedCount / FRAME_COUNT) * 100);

  return (
    <div ref={containerRef} className="relative w-full z-10" style={{ height: '150vh' }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-transparent z-0">
        
        {!isReady && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-myf-bg text-myf-deep transition-opacity duration-1000">
            <Star className="w-12 h-12 mb-6 animate-spin duration-[3000ms] text-myf-gold" />
            <p className="text-xl font-heading mb-4 text-myf-deep tracking-widest font-light">
              PREPARING THE EXPERIENCE
            </p>
            <div className="w-64 h-1 bg-myf-soft/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-myf-blue transition-all duration-300 ease-out"
                style={{ width: `${loadPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-myf-muted text-sm tabular-nums">
              {loadPercentage}%
            </p>
          </div>
        )}

        <canvas 
          ref={canvasRef} 
          className={`w-full h-full transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`} 
        />

        <div className={`absolute top-[15%] inset-x-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center px-6 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-heading font-black text-myf-gold tracking-tighter leading-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] uppercase">
                Manteca Youth Focus
            </h1>
        </div>

        <div className={`absolute bottom-10 inset-x-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000 z-10 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="opacity-90 animate-bounce text-[#f6c453] pb-4">
            <ChevronDown className="w-10 h-10 drop-shadow-md" strokeWidth={3} />
          </div>
        </div>

        {/* Seamless transition gradient into the next section */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-myf-bg to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
