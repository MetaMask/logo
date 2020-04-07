type colorValue = number; // 0-255
type positionId = number; // Index of that position
type coordVal = number;

type Position = [x:CoordVal, y: CoordVal, z:CoordVal];
type Face = [positionId, positionId, positionId];

type objJson = {
  positions: Array<Position>, 
  chunks: Array<{
    color: [red:ColorValue, green:colorValue, blue:colorValue],
    faces: Array<Face>,
  }>,
}
