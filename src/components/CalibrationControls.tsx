import { useGridStore } from '@/context/gridStore';
import { Box, Button, Typography, Paper, IconButton, Slider } from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export const CalibrationControls = () => {
  const { 
    isCalibrating, 
    setIsCalibrating, 
    rows, 
    cols, 
    setRows, 
    setCols,
    rotation,
    setRotation,
    rotationX,
    setRotationX
  } = useGridStore();

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
                variant={isCalibrating ? "contained" : "outlined"}
                color={isCalibrating ? "success" : "primary"}
                startIcon={isCalibrating ? <CheckIcon /> : <GridOnIcon />}
                onClick={() => setIsCalibrating(!isCalibrating)}
            >
                {isCalibrating ? "Terminer la Calibration" : "Calibrer la Grille"}
            </Button>
        </Box>

        {isCalibrating && (
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" display="block">Lignes</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" onClick={() => setRows(Math.max(2, rows - 1))}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 1, minWidth: 20 }}>{rows}</Typography>
                        <IconButton size="small" onClick={() => setRows(Math.min(10, rows + 1))}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" display="block">Colonnes</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" onClick={() => setCols(Math.max(2, cols - 1))}>
                            <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ mx: 1, minWidth: 20 }}>{cols}</Typography>
                        <IconButton size="small" onClick={() => setCols(Math.min(10, cols + 1))}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                     <Typography variant="caption" display="block">Rotation Z ({rotation}°)</Typography>
                     <Slider
                        size="small"
                        min={-90}
                        max={90}
                        value={rotation}
                        onChange={(_, v) => setRotation(v as number)}
                        valueLabelDisplay="auto"
                     />
                </Box>

                <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                     <Typography variant="caption" display="block">Rotation X ({rotationX}°)</Typography>
                     <Slider
                        size="small"
                        min={0}
                        max={80}
                        value={rotationX}
                        onChange={(_, v) => setRotationX(v as number)}
                        valueLabelDisplay="auto"
                     />
                </Box>
            </Box>
        )}
      </Box>
      
      {isCalibrating && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Ajustez le cadre bleu sur la grille de jeu en déplaçant les coins. Modifiez le nombre de lignes et colonnes pour correspondre.
        </Typography>
      )}
    </Paper>
  );
};
