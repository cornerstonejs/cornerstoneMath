export class Interval {
  readonly min: number;
  readonly max: number;

  constructor (min: number, max: number) {
    if (min > max) {
      throw Error('Interval: min cannot be larger than max!');
    }
    this.min = min;
    this.max = max;
  }

  doesIntersect (other: Interval, isOpen = true): boolean {
    function isLarger (a: number, b: number): boolean {
      return isOpen ? a > b : a >= b;
    }

    return isLarger(this.max, other.min) && isLarger(other.max, this.min);
  }

  getIntersection (other: Interval, isOpen = true): Interval | undefined {
    if (!this.doesIntersect(other, isOpen)) {
      return;
    }

    return new Interval(Math.max(this.min, other.min), Math.min(this.max, other.max));
  }

  length (): number {
    return this.max - this.min;
  }
}
