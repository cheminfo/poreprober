export function overlap(r1, r2, distance) {
  return (
    (Math.PI *
      (distance ** 4 -
        6 * distance ** 2 * (r1 ** 2 + r2 ** 2) +
        8 * distance * (r1 ** 3 + r2 ** 3) -
        3 * (r1 ** 2 - r2 ** 2) ** 2)) /
    (12 * distance)
  );
}
