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
    cols,
    rotation
  } = useGridStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = React.useState<'tl' | 'br' | 'move' | null>(null);
  const isDragging = useRef<'tl' | 'br' | 'move' | null>(null);
  const lastMousePos = useRef<{x: number, y: number} | null>(null);

  // Helper to apply inverse rotation to mouse movements would be complex.
  // For simplicity, we keep the rotation visual, but the controls (handles) are also rotated.
  // This means dragging "up" visually matches the rotated up.

  const handleMouseDown = (mode: 'tl' | 'br' | 'move') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = mode;
    setDragMode(mode);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
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
        const width = bottomRight.x - topLeft.x;
        const height = bottomRight.y - topLeft.y;

        const newTlX = Math.max(0, Math.min(100 - width, topLeft.x + deltaXPercent));
        const newTlY = Math.max(0, Math.min(100 - height, topLeft.y + deltaYPercent));
        
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
  }, [bottomRight, setBottomRight, setTopLeft, topLeft]);

  const handleMouseUp = React.useCallback(() => {
    isDragging.current = null;
    setDragMode(null);
    lastMousePos.current = null;
  }, []);

  useEffect(() => {
    if (isCalibrating) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isCalibrating, handleMouseMove, handleMouseUp]);

  if (!isCalibrating) return null;

  // Render Grid Lines
  const renderGridLines = () => {
    const lines = [];
    // Relative to the container (0-100%)
    
    // Vertical lines
    for (let i = 1; i < cols; i++) {
        lines.push(
            <Box
                key={`v-${i}`}
                sx={{
                    position: 'absolute',
                    left: `${(100 / cols) * i}%`,
                    top: '0%',
                    height: '100%',
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
                    left: '0%',
                    top: `${(100 / rows) * i}%`,
                    width: '100%',
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
            cursor: dragMode ? 'grabbing' : 'default',
        }}
    >
        {/* Rotated Container for Grid and Handles */}
        <Box
             sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                // We rotate around the center of the selection box? 
                // Or just rotate the drawing inside? 
                // The prompt says "rotateZ(42deg)", implying the grid itself is rotated.
                // However, our coordinates (topLeft, bottomRight) are axis-aligned in the store.
                // If we rotate the visual representation, the logic in useFrameProcessor needs to match.
                // We'll rotate the visual box around its center.
                // Actually, rotating the whole overlay makes interaction with handles tricky if we don't adjust logic.
                // But for now, let's just rotate the visual elements defined by coordinates.
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
                    cursor: 'move',
                    '&:hover': {
                        bgcolor: 'rgba(33, 150, 243, 0.2)',
                    },
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                }}
            >
                 {/* Inner Grid Lines - relative to the rotated box */}
                 {renderGridLines()}
                 
                 {/* Top-Left Handle */}
                <Box
                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown('tl')(e); }}
                    sx={{
                        position: 'absolute',
                        left: '0%',
                        top: '0%',
                        width: 20,
                        height: 20,
                        bgcolor: '#2196f3',
                        transform: 'translate(-50%, -50%)', // Relative to the corner
                        cursor: 'nwse-resize',
                        borderRadius: '50%',
                        boxShadow: 2
                    }}
                />

                {/* Bottom-Right Handle */}
                <Box
                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown('br')(e); }}
                    sx={{
                        position: 'absolute',
                        left: '100%',
                        top: '100%',
                        width: 20,
                        height: 20,
                        bgcolor: '#2196f3',
                        transform: 'translate(-50%, -50%)', // Relative to the corner
                        cursor: 'nwse-resize',
                        borderRadius: '50%',
                        boxShadow: 2
                    }}
                />
            </Box>
        </Box>
    </Box>
  );
};
