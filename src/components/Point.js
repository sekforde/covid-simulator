class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(point) {
    this.x = point.x;
    this.y = point.y;
  }

  add(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  distanceFrom(p) {
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  angleTo(p) {
    let angle = (Math.atan2(p.y - this.y, p.x - this.x) * 180) / Math.PI;
    if (angle < 0) {
      angle = 360 + angle;
    }
    return angle;
  }
}

export default Point;
