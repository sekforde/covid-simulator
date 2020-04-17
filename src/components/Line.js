import Point from './Point';

class Line {
  constructor(p1, p2) {
    this.p1 = new Point();
    this.p1.set(p1);
    this.p2 = new Point();
    this.p2.set(p2);
  }

  set(p1, p2) {
    this.p1.set(p1);
    this.p2.set(p2);
  }
}

export default Line;
