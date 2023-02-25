import Point from '~/utils/Point';


class BoardAnalyzer {
  private boardSize: number;
  private boardLetters: Array<Array<string>>;

  public constructor(boardSize: number, boardLetters: Array<Array<string>>) {
    this.boardSize = boardSize;
    this.boardLetters = boardLetters;
  };

  private getLetterAt(point: Point) : string {
    return this.boardLetters[point.x][point.y];
  };

  private getPointNeighbours(point: Point) : Array<Point> {
    const x = point.x;
    const y = point.y;

    const pointNeighbours = [
      new Point(x + 0, y + 1),
      new Point(x + 0, y - 1),
      new Point(x + 1, y + 0),
      new Point(x + 1, y + 1),
      new Point(x + 1, y - 1),
      new Point(x - 1, y + 0),
      new Point(x - 1, y + 1),
      new Point(x - 1, y - 1)
    ];

    const validPointNeighbours = new Array<Point>;
    pointNeighbours.forEach((p) => {
      if (p.x >= 0 && p.y >= 0 && p.x < this.boardSize && p.y < this.boardSize) {
        validPointNeighbours.push(p);
      }
    });

    return validPointNeighbours;
  };

  private isPointInPointList(points: Array<Point>, point: Point) : boolean {
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.x == point.x && p.y == point.y) {
        return true;
      }
    }
    return false;
  };

  private getPointCombinationsAt(startPoint: Point, depth: number) : Array<Array<Point>> {
    const pointCombinations = new Array<Array<Point>>;

    this.getPointNeighbours(startPoint).forEach((startPointNeighbour) => {
      this.getPointNeighbours(startPointNeighbour).forEach((childNeighbour) => {
        if (!(childNeighbour.x == startPoint.x && childNeighbour.y == startPoint.y)) {
          const pointCombination = [];
          pointCombination.push(startPoint);

          if (depth > 1) {
            pointCombination.push(startPointNeighbour);
            if (depth > 2) {
              pointCombination.push(childNeighbour);
            }
          }

          pointCombinations.push(pointCombination);
        }
      });
    });

    let currentDepthPoints = [...pointCombinations];

    for (let i = 0; i < depth - 3; i++) {
      const depthPoints = new Array<Array<Point>>;

      currentDepthPoints.forEach((points) => {
        const lastPoint = points[points.length - 1];

        this.getPointNeighbours(lastPoint).forEach((childNeighbour) => {
          if (!this.isPointInPointList(points, childNeighbour)) {
            let pointCombination = [...points];
            pointCombination.push(childNeighbour);
            depthPoints.push(pointCombination);
          }
        });
      });

      depthPoints.forEach((pointCombination) => {
        pointCombinations.push(pointCombination);
      });

      currentDepthPoints = [...depthPoints];
    }

    return pointCombinations;
  };

  private getAllPointCombinations(depth: number) : Array<Array<Point>> {
    let allPointCombinations = new Array<Array<Point>>;

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        const startPoint = new Point(x, y);
        this.getPointCombinationsAt(startPoint, depth).forEach((pointCombination) => {
          allPointCombinations.push(pointCombination);
        });
      }
    }

    return allPointCombinations;
  };

  private pointsToString(points: Array<Point>) : string {
    let str = '';
    points.forEach((point) => {
      str += this.getLetterAt(point);
    })
    return str;
  };

  public getValidStringPointMap(
    minLength: number,
    maxLength: number,
    progressUpdates = {
      callback: (countFound: number) => {},
      frequency: -1
    }
  ) : Map<string, Array<Point>>
  {
    const validStringPointMap = new Map<string, Array<Point>>();

    this.getAllPointCombinations(maxLength).forEach((pointCombination) => {
      if (pointCombination.length >= minLength) {
        const key = this.pointsToString(pointCombination);
        validStringPointMap.set(key, pointCombination);

        if (progressUpdates.frequency > 0) {
          const count = validStringPointMap.size;
          if ((count % progressUpdates.frequency) == 0) {
            progressUpdates.callback(count);
          }
        }
      }
    });

    progressUpdates.callback(validStringPointMap.size);
    return validStringPointMap;
  };
};

export default BoardAnalyzer;
