import * as Enums from './enums';

export interface Hexagon <THexagonValue = any> {
  x: number;
  y: number;
  z: number;
  value: THexagonValue;
}

export interface HexagonCubeCoords {
  type: Enums.HexagonCoordsType.Cube;
  x: number;
  y: number;
  z: number;
}

export interface HexagonOffsetCoords {
  type: Enums.HexagonCoordsType.Offset;
  col: number;
  row: number;
}
export interface HexagonAxialCoords {
  type: Enums.HexagonCoordsType.Axial;
  col: number;
  row: number;
}

export type HexagonCoords = HexagonOffsetCoords | HexagonAxialCoords | HexagonCubeCoords;
