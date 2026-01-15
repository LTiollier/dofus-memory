import { useEffect, useRef } from 'react';
import { useStreamStore } from '@/context/streamStore';
import { useScreenCapture } from '@/hooks/useScreenCapture';
import { useFrameProcessor } from '@/hooks/useFrameProcessor';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { CalibrationOverlay } from './CalibrationOverlay';
import { CalibrationControls } from './CalibrationControls';
import { MemoryOverlay } from './MemoryOverlay';
import { useGridStore } from '@/context/gridStore';
import { useMemoryStore } from '@/context/memoryStore';
import DeleteIcon from '@mui/icons-material/Delete';

export const VideoSource = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, status, error, setVideoRef } = useStreamStore();
  const { startCapture, stopCapture } = useScreenCapture();
  const { isCalibrating } = useGridStore();
  const { resetMemory } = useMemoryStore();

  // Activate Frame Processor
  useFrameProcessor();

  // Bind video ref to store on mount
  useEffect(() => {
    if (videoRef.current) {
      setVideoRef(videoRef.current);
    }
  }, [setVideoRef]);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Source Vidéo</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {status === 'active' && !isCalibrating && (
                <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<DeleteIcon />}
                    onClick={resetMemory}
                >
                    Effacer Mémoire
                </Button>
            )}
            {status === 'active' ? (
                <Button 
                variant="contained" 
                color="error" 
                startIcon={<VideocamOffIcon />} 
                onClick={stopCapture}
                >
                Arrêter la capture
                </Button>
            ) : (
                <Button 
                variant="contained" 
                color="primary" 
                startIcon={<VideocamIcon />} 
                onClick={startCapture}
                >
                Sélectionner une fenêtre
                </Button>
            )}
          </Box>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ 
          width: '100%', 
          bgcolor: 'black', 
          borderRadius: 1, 
          overflow: 'hidden',
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {status !== 'active' && (
            <Typography color="text.secondary">
              Aucune source vidéo active
            </Typography>
          )}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: status === 'active' ? 'block' : 'none'
            }}
          />
          {status === 'active' && !isCalibrating && <MemoryOverlay />}
          {status === 'active' && <CalibrationOverlay />}
        </Box>
      </Paper>
      
      {status === 'active' && <CalibrationControls />}
    </Box>
  );
};
