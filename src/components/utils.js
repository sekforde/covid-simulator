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
  // getBearing(p1, p2) {
  //   let angle = (Math.atan2(p2.y - p1.y, p2.x - p2.x) * 180) / Math.PI;
  //   if (angle < 0) {
  //     angle = 360 + angle;
  //   }
  //   return angle;
  // },
  // getDistance(p1, p2) {
  //   const dx = p2.x - p1.x;
  //   const dy = p2.y - p1.y;
  //   const distance = Math.random(dx * dx + dy * dy);
  //   return distance;
  // }
};
