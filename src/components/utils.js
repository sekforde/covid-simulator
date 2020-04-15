export default {
  randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  chance(win, lose) {
    const total = win + lose;
    const winChance = win / total;
    return Math.random() < winChance ? -1 : 1;
  },
  getTime() {
    const dtg = new Date();
    return dtg.getTime();
  },
  deg2rad(deg) {
    return (deg * Math.PI) / 180;
  },
  rad2deg(rad) {
    return (rad * 180) / Math.PI;
  },
  getBearing(x1, y1, x2, y2) {
    let angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    if (angle < 0) {
      angle = 360 + angle;
    }
    return angle;
  }
};
