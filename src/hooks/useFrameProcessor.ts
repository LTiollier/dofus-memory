import { useEffect, useRef } from 'react';
import { useStreamStore } from '@/context/streamStore';
import { useGridStore } from '@/context/gridStore';
import { useMemoryStore } from '@/context/memoryStore';
import { getPixelDiff, cropImage } from '@/utils/imageProcessing';

export const useFrameProcessor = () => {
  const { videoRef, status } = useStreamStore();
  const { rows, cols, topLeft, bottomRight, isCalibrating } = useGridStore();
  const { setCellKnown, resetMemory } = useMemoryStore();
  
  const processingRef = useRef<number>(0);
  const closedStateRef = useRef<Map<string, Uint8ClampedArray>>(new Map());
  const lastScanRef = useRef<number>(0);

  // Reset when starting fresh or re-calibrating
  useEffect(() => {
    if (isCalibrating) {
        closedStateRef.current.clear();
        resetMemory();
    }
  }, [isCalibrating, resetMemory]);

  useEffect(() => {
    if (status !== 'active' || isCalibrating || !videoRef) {
      if (processingRef.current) cancelAnimationFrame(processingRef.current);
      return;
    }

    const processFrame = () => {
      const now = Date.now();
      // Limit processing to 10fps to save CPU
      if (now - lastScanRef.current < 100) { 
        processingRef.current = requestAnimationFrame(processFrame);
        return;
      }
      lastScanRef.current = now;

      const video = videoRef;
      if (video.videoWidth === 0) {
        processingRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Calculate grid dimensions in video coordinates
      const vidW = video.videoWidth;
      const vidH = video.videoHeight;

      // Coordinate mapping from % to Pixels
      const startX = (topLeft.x / 100) * vidW;
      const startY = (topLeft.y / 100) * vidH;
      const endX = (bottomRight.x / 100) * vidW;
      const endY = (bottomRight.y / 100) * vidH;
      
      const gridW = endX - startX;
      const gridH = endY - startY;
      
      const cellW = gridW / cols;
      const cellH = gridH / rows;

      // Create a temporary canvas for data extraction
      // Using a small canvas reused for each cell to get pixel data
      const canvas = document.createElement('canvas');
      // Sampling size (smaller is faster) - let's take a 10x10 sample from center of cell
      const sampleSize = 10; 
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) return;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const id = `${r}-${c}`;
          
          // Calculate cell center for sampling
          const cellX = startX + c * cellW;
          const cellY = startY + r * cellH;
          
          // Draw center of cell to canvas
          ctx.drawImage(
            video, 
            cellX + (cellW / 2) - (sampleSize / 2), 
            cellY + (cellH / 2) - (sampleSize / 2), 
            sampleSize, sampleSize, 
            0, 0, sampleSize, sampleSize
          );

          const currentData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

          // Initialize closed state if missing (Assume first frame after calib is closed)
          if (!closedStateRef.current.has(id)) {
            closedStateRef.current.set(id, currentData);
            continue;
          }

          const closedData = closedStateRef.current.get(id);
          if (!closedData) continue;

          const diff = getPixelDiff(currentData, closedData);

          // Threshold for "Open". 
          // Needs tuning. 30-50 usually good for distinct colors.
          if (diff > 40) {
            // It's different from closed state!
            // Capture the FULL cell image for display
            // We use a separate larger canvas/crop function for the visual
            const imageUrl = cropImage(video, cellX, cellY, cellW, cellH);
            setCellKnown(r, c, imageUrl);
          }
        }
      }

      processingRef.current = requestAnimationFrame(processFrame);
    };

    processingRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (processingRef.current) cancelAnimationFrame(processingRef.current);
    };
  }, [status, isCalibrating, videoRef, rows, cols, topLeft, bottomRight, setCellKnown]);
};
