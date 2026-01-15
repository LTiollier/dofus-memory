import { create } from 'zustand';

interface Point {
  x: number;
  y: number;
}

interface GridState {
  rows: number;
  cols: number;
  topLeft: Point;
  bottomRight: Point;
  isCalibrating: boolean;
  rotation: number;
  rotationX: number;
  setRows: (rows: number) => void;
  setCols: (cols: number) => void;
  setTopLeft: (point: Point) => void;
  setBottomRight: (point: Point) => void;
  setIsCalibrating: (isCalibrating: boolean) => void;
  setRotation: (rotation: number) => void;
  setRotationX: (rotation: number) => void;
  resetGrid: () => void;
}

export const useGridStore = create<GridState>((set) => ({
  rows: 6,
  cols: 4,
  topLeft: { x: 10, y: 10 },
  bottomRight: { x: 90, y: 90 },
  isCalibrating: false,
  rotation: 0,
  rotationX: 0,
  setRows: (rows) => set({ rows }),
  setCols: (cols) => set({ cols }),
  setTopLeft: (topLeft) => set({ topLeft }),
  setBottomRight: (bottomRight) => set({ bottomRight }),
  setIsCalibrating: (isCalibrating) => set({ isCalibrating }),
  setRotation: (rotation) => set({ rotation }),
  setRotationX: (rotationX) => set({ rotationX }),
  resetGrid: () => set({ 
    rows: 6, 
    cols: 4, 
    topLeft: { x: 10, y: 10 }, 
    bottomRight: { x: 90, y: 90 }, 
    isCalibrating: false,
    rotation: 0,
    rotationX: 0
  }),
}));
