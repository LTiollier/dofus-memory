import React, { useRef, useEffect } from 'react';
import { useGridStore } from '@/context/gridStore';
import { Box } from '@mui/material';

export const CalibrationOverlay = () => {
  const { 
    isCalibrating, 
    topLeft, 
    bottomRight, 
    setTopLeft, 
    setBottomRight,
    rows,
    cols
  } = useGridStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<'tl' | 'br' | 'move' | null>(null);
  const lastMousePos = useRef<{x: number, y: number} | null>(null);

  const handleMouseDown = (mode: 'tl' | 'br' | 'move') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = mode;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current || !lastMousePos.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
    
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Calculate delta for move
    const deltaXPixels = e.clientX - lastMousePos.current.x;
    const deltaYPixels = e.clientY - lastMousePos.current.y;
    const deltaXPercent = (deltaXPixels / rect.width) * 100;
    const deltaYPercent = (deltaYPixels / rect.height) * 100;

    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (isDragging.current === 'move') {
        const newTlX = Math.max(0, Math.min(100 - (bottomRight.x - topLeft.x), topLeft.x + deltaXPercent));
        const newTlY = Math.max(0, Math.min(100 - (bottomRight.y - topLeft.y), topLeft.y + deltaYPercent));
        
        const width = bottomRight.x - topLeft.x;
        const height = bottomRight.y - topLeft.y;

        setTopLeft({ x: newTlX, y: newTlY });
        setBottomRight({ x: newTlX + width, y: newTlY + height });
    } else if (isDragging.current === 'tl') {
        // Prevent crossing
        const newX = Math.min(xPercent, bottomRight.x - 5);
        const newY = Math.min(yPercent, bottomRight.y - 5);
        setTopLeft({ x: newX, y: newY });
    } else if (isDragging.current === 'br') {
        const newX = Math.max(xPercent, topLeft.x + 5);
        const newY = Math.max(yPercent, topLeft.y + 5);
        setBottomRight({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = null;
    lastMousePos.current = null;
  };

  useEffect(() => {
    if (isCalibrating) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isCalibrating, topLeft, bottomRight]);

  if (!isCalibrating) return null;

  // Render Grid Lines
  const renderGridLines = () => {
    const lines = [];
    const width = bottomRight.x - topLeft.x;
    const height = bottomRight.y - topLeft.y;

    // Vertical lines
    for (let i = 1; i < cols; i++) {
        lines.push(
            <Box
                key={`v-${i}`}
                sx={{
                    position: 'absolute',
                    left: `${topLeft.x + (width / cols) * i}%`,
                    top: `${topLeft.y}%`,
                    height: `${height}%`,
                    width: '1px',
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    pointerEvents: 'none'
                }}
            />
        );
    }

    // Horizontal lines
    for (let i = 1; i < rows; i++) {
        lines.push(
            <Box
                key={`h-${i}`}
                sx={{
                    position: 'absolute',
                    left: `${topLeft.x}%`,
                    top: `${topLeft.y + (height / rows) * i}%`,
                    width: `${width}%`,
                    height: '1px',
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    pointerEvents: 'none'
                }}
            />
        );
    }
    return lines;
  };

  return (
    <Box 
        ref={containerRef}
        sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 10,
            cursor: isDragging.current ? 'grabbing' : 'default'
        }}
    >
        {/* Selection Area Border & Move Handler */}
        <Box
            onMouseDown={handleMouseDown('move')}
            sx={{
                position: 'absolute',
                left: `${topLeft.x}%`,
                top: `${topLeft.y}%`,
                width: `${bottomRight.x - topLeft.x}%`,
                height: `${bottomRight.y - topLeft.y}%`,
                border: '2px solid #2196f3',
                bgcolor: 'rgba(33, 150, 243, 0.1)',
                cursor: 'move', // Cursor indicating it can be moved
                '&:hover': {
                    bgcolor: 'rgba(33, 150, 243, 0.2)',
                }
            }}
        />

        {renderGridLines()}

        {/* Top-Left Handle */}
        <Box
            onMouseDown={handleMouseDown('tl')}
            sx={{
                position: 'absolute',
                left: `${topLeft.x}%`,
                top: `${topLeft.y}%`,
                width: 20,
                height: 20,
                bgcolor: '#2196f3',
                transform: 'translate(-50%, -50%)',
                cursor: 'nwse-resize',
                borderRadius: '50%',
                boxShadow: 2
            }}
        />

        {/* Bottom-Right Handle */}
        <Box
            onMouseDown={handleMouseDown('br')}
            sx={{
                position: 'absolute',
                left: `${bottomRight.x}%`,
                top: `${bottomRight.y}%`,
                width: 20,
                height: 20,
                bgcolor: '#2196f3',
                transform: 'translate(-50%, -50%)',
                cursor: 'nwse-resize',
                borderRadius: '50%',
                boxShadow: 2
            }}
        />
    </Box>
  );
};
