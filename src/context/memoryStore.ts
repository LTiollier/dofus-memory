import { create } from 'zustand';

export interface CellData {
  id: string; // row-col
  row: number;
  col: number;
  imageUrl: string | null;
  isKnown: boolean;
  lastUpdate: number;
}

interface MemoryState {
  cells: Map<string, CellData>;
  setCellKnown: (row: number, col: number, imageUrl: string) => void;
  resetMemory: () => void;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  cells: new Map(),
  setCellKnown: (row, col, imageUrl) => set((state) => {
    const id = `${row}-${col}`;
    const newCells = new Map(state.cells);
    newCells.set(id, {
      id,
      row,
      col,
      imageUrl,
      isKnown: true,
      lastUpdate: Date.now()
    });
    return { cells: newCells };
  }),
  resetMemory: () => set({ cells: new Map() }),
}));
