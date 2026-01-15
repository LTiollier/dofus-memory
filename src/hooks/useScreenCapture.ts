import { useCallback } from 'react';
import { useStreamStore } from '@/context/streamStore';

export const useScreenCapture = () => {
  const { setStream, setStatus, setError, reset, stream } = useStreamStore();

  const startCapture = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'window', // Prefer window sharing
        },
        audio: false,
      });

      setStream(mediaStream);
      setStatus('active');
      setError(null);

      // Handle stream stop (user clicks "Stop sharing" in browser UI)
      mediaStream.getVideoTracks()[0].onended = () => {
        stopCapture();
      };

    } catch (err) {
      console.error("Error starting screen capture:", err);
      setError(err instanceof Error ? err.message : 'Unknown error during screen capture');
      setStatus('error');
    }
  }, [setStream, setStatus, setError]);

  const stopCapture = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    reset();
  }, [stream, reset]);

  return { startCapture, stopCapture };
};
