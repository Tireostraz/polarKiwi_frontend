export function mmToPx(mm: number, DPI: number): number {
  return (mm / 25.4) * DPI; //mm -> inch -> pixels
}

export function dmmToPx(dmm: number, DPI: number): number {
  return (dmm / 254) * DPI; //dmm -> inch -> pixels
}
