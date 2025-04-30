export default function mmToPx(mm: number, DPI: number): number {
  return (mm / 25.4) * DPI; //mm -> inch -> pixels
}
