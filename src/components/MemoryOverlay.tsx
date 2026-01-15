import { useMemoryStore } from '@/context/memoryStore';
import { useGridStore } from '@/context/gridStore';
import { Box } from '@mui/material';

export const MemoryOverlay = () => {
  const { cells } = useMemoryStore();
  const { rows, cols, topLeft, bottomRight, rotation } = useGridStore();

  const width = bottomRight.x - topLeft.x;
  const height = bottomRight.y - topLeft.y;

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${topLeft.x}%`,
        top: `${topLeft.y}%`,
        width: `${width}%`,
        height: `${height}%`,
        pointerEvents: 'none',
        zIndex: 20,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center'
      }}
    >
      {Array.from(cells.values()).map((cell) => {
        // Calculate position in % relative to the grid area
        const cellWidth = 100 / cols;
        const cellHeight = 100 / rows;
        const top = cell.row * cellHeight;
        const left = cell.col * cellWidth;

        return (
          <Box
            key={cell.id}
            sx={{
              position: 'absolute',
              top: `${top}%`,
              left: `${left}%`,
              width: `${cellWidth}%`,
              height: `${cellHeight}%`,
              padding: '2px', // Small gap
              boxSizing: 'border-box'
            }}
          >
            {cell.imageUrl && (
              <img 
                src={cell.imageUrl} 
                alt="" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  opacity: 0.9, 
                }} 
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};
