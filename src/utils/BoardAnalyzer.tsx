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
    const x: number = point.x;
    const y: number = point.y;

    let pointNeighbours: Array<Point> = [
      new Point(x + 0, y + 1),
      new Point(x + 0, y - 1),
      new Point(x + 1, y + 0),
      new Point(x + 1, y + 1),
      new Point(x + 1, y - 1),
      new Point(x - 1, y + 0),
      new Point(x - 1, y + 1),
      new Point(x - 1, y - 1)
    ];

    let validPointNeighbours: Array<Point> = [];
    pointNeighbours.forEach((p: Point) => {
      if (p.x >= 0 && p.y >= 0 && p.x < this.boardSize && p.y < this.boardSize) {
        validPointNeighbours.push(p);
      }
    })

    return validPointNeighbours;
  }

  private isPointInPointList(points: Array<Point>, point: Point) : boolean {
    for (let i = 0; i < points.length; i++) {
      let p = points[i];
      if (p.x == point.x && p.y == point.y) {
        return true;
      }
    }
    return false;
  }

  private getPointCombinationsAt(startPoint: Point, depth: number) : Array<Array<Point>> {
    let pointCombinations: Array<Array<Point>> = [];

    this.getPointNeighbours(startPoint).forEach((startPointNeighbour: Point) => {
      this.getPointNeighbours(startPointNeighbour).forEach((childNeighbour: Point) => {
        if (!(childNeighbour.x == startPoint.x && childNeighbour.y == startPoint.y)) {
          let pointCombination: Array<Point> = [];
          pointCombination.push(startPoint);

          if (depth > 1) {
            pointCombination.push(startPointNeighbour);
            if (depth > 2) {
              pointCombination.push(childNeighbour);
            }
          }

          pointCombinations.push(pointCombination);
        }
      })
    })

    let currentDepthPoints: Array<Array<Point>> = [...pointCombinations];

    for (let i = 0; i < depth - 3; i++) {
      let depthPoints: Array<Array<Point>> = [];

      currentDepthPoints.forEach((points: Array<Point>) => {
        let lastPoint: Point = points[points.length - 1];

        this.getPointNeighbours(lastPoint).forEach((childNeighbour: Point) => {
          if (!this.isPointInPointList(points, childNeighbour)) {
            let pointCombination: Array<Point> = [...points];
            pointCombination.push(childNeighbour);
            depthPoints.push(pointCombination);
          }
        })
      })

      depthPoints.forEach((pointCombination: Array<Point>) => {
        pointCombinations.push(pointCombination);
      })

      currentDepthPoints = [...depthPoints];
    }

    return pointCombinations;
  }

  private getAllPointCombinations(depth: number) : Array<Array<Point>> {
    let allPointCombinations: Array<Array<Point>> = [];

    for (let x = 0; x < this.boardSize; x++) {
      for (let y = 0; y < this.boardSize; y++) {
        let startPoint: Point = new Point(x, y);
        this.getPointCombinationsAt(startPoint, depth).forEach((pointCombination: Array<Point>) => {
          allPointCombinations.push(pointCombination);
        })
      }
    }

    return allPointCombinations;
  }

  private pointsToString(points: Array<Point>) : string {
    let str: string = '';
    points.forEach((point: Point) => {
      str += this.getLetterAt(point);
    })
    return str;
  }

  public getValidStringPointMap(minLength: number, maxLength: number) : Map<string, Array<Point>> {
    let validStringPointMap: Map<string, Array<Point>> = new Map<string, Array<Point>>();

    this.getAllPointCombinations(maxLength).forEach((pointCombination: Array<Point>) => {
      if (pointCombination.length >= minLength) {
        let key: string = this.pointsToString(pointCombination);
        validStringPointMap.set(key, pointCombination);
      }
    })

    return validStringPointMap;
  }
};

export default BoardAnalyzer;
