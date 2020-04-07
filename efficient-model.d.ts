type colorValue = number; // 0-255
type positionId = number; // Index of that position
type CoordVal = number;

type Position = [CoordVal, CoordVal, CoordVal];
type Face = [positionId, positionId, positionId];

export type EfficientModel = {
  positions: Array<Position>;
  chunks: Array<{
    color: [colorValue, colorValue, colorValue];
    faces: Array<Face>;
  }>;
}
