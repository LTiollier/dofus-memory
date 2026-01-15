import { create } from 'zustand';

interface StreamState {
  stream: MediaStream | null;
  videoRef: HTMLVideoElement | null;
  status: 'idle' | 'active' | 'error';
  error: string | null;
  setStream: (stream: MediaStream | null) => void;
  setVideoRef: (ref: HTMLVideoElement | null) => void;
  setStatus: (status: 'idle' | 'active' | 'error') => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useStreamStore = create<StreamState>((set) => ({
  stream: null,
  videoRef: null,
  status: 'idle',
  error: null,
  setStream: (stream) => set({ stream }),
  setVideoRef: (videoRef) => set({ videoRef }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set({ stream: null, status: 'idle', error: null }),
}));
