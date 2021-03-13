import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

const SmallRadiusParam = Math.sqrt(3) / 2;
const DefaultRadius = 100;
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
   * Radius (r) of inscribed circle.
   *
   * https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Regular_hexagon_1.svg/200px-Regular_hexagon_1.svg.png
   */
  public smallRadius: number;
  /**
   * Radius (R) of circumscribed circle.
   *
   * https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Regular_hexagon_1.svg/200px-Regular_hexagon_1.svg.png
   */
  public radius: number = DefaultRadius;
  @Input('raius')
  set inRadius (value: number) {
    this.radius = _.isNaN(+value) === true
      ? DefaultRadius : value;
    this.updateView();
  }

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
    this.smallRadius = this.radius * SmallRadiusParam;

    this.width = this.radius * 2 + this.strokeWidth;
    this.height = this.smallRadius * 2 + this.strokeWidth;

    this.viewBox = `0 0 ${this.width} ${this.height}`;

    const pathParts = [
      `M${this.radius / 2 + this.strokeWidth / 2} ${0 + this.strokeWidth / 2}`, // Top-Left point
      `l${this.radius} ${0}`, // Top-Right point
      `l${this.radius / 2} ${this.smallRadius}`, // Right point
      `l${-this.radius / 2} ${this.smallRadius}`, // Bottom-Right point
      `l${-this.radius} ${0}`, // Bottom-Left point
      `l${-this.radius / 2} ${- this.smallRadius}`, // Left point
      `Z`, // Top-Left point
    ];
    this.path = pathParts.join(` `);

    this.changeDetection.detectChanges();
  }
}
