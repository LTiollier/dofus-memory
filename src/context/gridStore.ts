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
  setRows: (rows: number) => void;
  setCols: (cols: number) => void;
  setTopLeft: (point: Point) => void;
  setBottomRight: (point: Point) => void;
  setIsCalibrating: (isCalibrating: boolean) => void;
  resetGrid: () => void;
}

export const useGridStore = create<GridState>((set) => ({
  rows: 6,
  cols: 4,
  topLeft: { x: 10, y: 10 },
  bottomRight: { x: 90, y: 90 },
  isCalibrating: false,
  setRows: (rows) => set({ rows }),
  setCols: (cols) => set({ cols }),
  setTopLeft: (topLeft) => set({ topLeft }),
  setBottomRight: (bottomRight) => set({ bottomRight }),
  setIsCalibrating: (isCalibrating) => set({ isCalibrating }),
  resetGrid: () => set({ 
    rows: 6, 
    cols: 4, 
    topLeft: { x: 10, y: 10 }, 
    bottomRight: { x: 90, y: 90 }, 
    isCalibrating: false 
  }),
}));
