import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { GameDataArbiter } from '../services/game-data.arbiter';

const DefaultStroke = 5;

@Component({
  selector: 'eg-hexagon',
  templateUrl: './hexagon.component.svg',
  styleUrls: [ './hexagon.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexagonComponent implements OnInit {
  /**
   * Path points of `path` tag with a hexagon.
   */
  public path: string;
  /**
   * SVG view box.
   */
  public viewBox: string;
  /**
   * Width of SVG tag.
   */
  public width: number;
  /**
   * Height of SVG tag.
   */
  public height: number;

  /**
   * Width of hexagon stroke.
   */
  public strokeWidth: number = DefaultStroke;
  @Input('strokeWidth')
  set isStrokeWidth (value: number) {
    this.strokeWidth = _.isNaN(+value) === true
      ? DefaultStroke : value;
    this.updateView();
  }

  constructor (
    private changeDetection: ChangeDetectorRef,
    // Services
    private gameDataArbiter: GameDataArbiter,
  ) {
    this.changeDetection.detach();
  }

  /**
   * Inits component.
   */
  ngOnInit (): void {
    this.updateView();
  }

  /**
   * Recalculates:
   *  - width and height of SVG tag
   *  - view box of SVG tag
   *  - hexagon path
   *
   * @return {void}
   */
  updateView (
  ): void {
    const cRadius = this.gameDataArbiter.cHexagonRadius;
    const iRadius = this.gameDataArbiter.iHexagonRadius;

    this.width = this.gameDataArbiter.hexagonWidth + this.strokeWidth;
    this.height = this.gameDataArbiter.hexagonHeight + this.strokeWidth;

    this.viewBox = `0 0 ${this.width} ${this.height}`;

    const pathParts = [
      `M${cRadius / 2 + this.strokeWidth / 2} ${0 + this.strokeWidth / 2}`, // Top-Left point
      `l${cRadius} ${0}`, // Top-Right point
      `l${cRadius / 2} ${iRadius}`, // Right point
      `l${-cRadius / 2} ${iRadius}`, // Bottom-Right point
      `l${-cRadius} ${0}`, // Bottom-Left point
      `l${-cRadius / 2} ${- iRadius}`, // Left point
      `Z`, // Top-Left point
    ];
    this.path = pathParts.join(` `);

    this.changeDetection.detectChanges();
  }
}
