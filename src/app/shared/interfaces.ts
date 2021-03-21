import { Enums } from '.';

export interface ClickDelegateEvent {
  /**
   * data-id attribute
   */
  id: string;
  /**
   * data-type attribute
   */
  type: string;
  /**
   * CSS class.
   */
  tagSelector: string;
  /**
   * Native mouse event.
   */
  dataset: DOMStringMap;
  /**
   * Native mouse event.
   */
  event: MouseEvent;
}

export interface SelectOption {
  id: string;
  value: string;
  hint: string;
}

export interface HexagonCubeCoords {
  x: number;
  y: number;
  z: number;
}

export interface HexagonOffsetCoords {
  col: number;
  row: number;
}
export interface HexagonAxialCoords {
  col: number;
  row: number;
}

export type HexagonCoords = HexagonOffsetCoords | HexagonAxialCoords | HexagonCubeCoords;

export interface Hexagon <THexagonValue = any> extends HexagonCubeCoords {
  value?: THexagonValue;
}

export interface HexagonAction <THexagonValue = any> {
  from: Hexagon<THexagonValue>;
  to: Hexagon<THexagonValue>;
}

export interface MergeHexagonsDescriptor {
  changed: boolean;
  actions: HexagonAction<number>[];
  hexagons: Hexagon<number>[];
}

export interface GameStore {
  gameStatus: Enums.GameStatus;
  dataServerURL: string;
}
