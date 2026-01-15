import { useEffect, useRef } from 'react';
import { useStreamStore } from '@/context/streamStore';
import { useGridStore } from '@/context/gridStore';
import { useMemoryStore } from '@/context/memoryStore';
import { getPixelDiff, cropImage } from '@/utils/imageProcessing';
import { monsterMatcher } from '@/utils/monsterMatcher';

export const useFrameProcessor = () => {
  const { videoRef, status } = useStreamStore();
  const { rows, cols, topLeft, bottomRight, isCalibrating, rotation } = useGridStore();
  const { setCellKnown, resetMemory } = useMemoryStore();
  
  const processingRef = useRef<number>(0);
  const closedStateRef = useRef<Map<string, Uint8ClampedArray>>(new Map());
  const lastScanRef = useRef<number>(0);

  // Load matcher assets
  useEffect(() => {
    monsterMatcher.loadAssets();
  }, []);

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
      
      // Center of the grid for rotation
      const cx = startX + gridW / 2;
      const cy = startY + gridH / 2;
      const rad = (rotation * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

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
          
          // Calculate UNROTATED cell center for sampling
          const unrotatedCenterX = startX + c * cellW + cellW / 2;
          const unrotatedCenterY = startY + r * cellH + cellH / 2;
          
          // Rotate this point around the grid center (cx, cy)
          const dx = unrotatedCenterX - cx;
          const dy = unrotatedCenterY - cy;
          
          const rotatedCenterX = cx + (dx * cos - dy * sin);
          const rotatedCenterY = cy + (dx * sin + dy * cos);

          // We sample around this rotated center
          // Draw center of cell to canvas
          ctx.drawImage(
            video, 
            rotatedCenterX - (sampleSize / 2), 
            rotatedCenterY - (sampleSize / 2), 
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
            
            // For matching, we want to capture a box around the rotated center.
            // Since we can't easily capture a rotated box, we capture an axis-aligned box 
            // centered on the rotated point.
            // This might include some background if the rotation is steep, but for recognition it might be enough
            // if the monster is centered.
            
            const captureX = rotatedCenterX - cellW / 2;
            const captureY = rotatedCenterY - cellH / 2;

            // Try to find a matching monster
            const match = monsterMatcher.findMatch(video, captureX, captureY, cellW, cellH);

            if (match) {
               setCellKnown(r, c, match.url);
            } else {
               // Fallback to capture the FULL cell image for display
               const imageUrl = cropImage(video, captureX, captureY, cellW, cellH);
               setCellKnown(r, c, imageUrl);
            }
          }
        }
      }

      processingRef.current = requestAnimationFrame(processFrame);
    };

    processingRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (processingRef.current) cancelAnimationFrame(processingRef.current);
    };
  }, [status, isCalibrating, videoRef, rows, cols, topLeft, bottomRight, setCellKnown, rotation]);
};
