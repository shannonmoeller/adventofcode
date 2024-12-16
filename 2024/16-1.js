import { ROOK, createGrid, exec, getPos, splitGrid } from '../utils/index.js';

function main(lines) {
  let grid = splitGrid(lines);
  let height = grid.length;
  let width = grid[0].length;

  let [sx, sy] = getPos(width, lines.join('').indexOf('S'));
  let [ex, ey] = getPos(width, lines.join('').indexOf('E'));

  let score = createGrid(width, height, Infinity);
  let queue = [{ x: sx, y: sy, d: 1, s: 0 }];

  while (queue.length) {
    let node = queue.shift();

    for (let i = -1; i <= 1; i++) {
      let d = (node.d + i + 4) % 4;
      let [xd, yd] = ROOK[d];

      let x = node.x + xd;
      let y = node.y + yd;
      if (grid[y][x] === '#') continue;

      let s = node.s + Math.abs(i) * 1000 + 1;
      if (s >= score[y][x]) continue;

      score[y][x] = s;
      queue.push({ x, y, d, s });
    }
  }

  return score[ey][ex];
}

exec(main, './16-a.txt', 7036);
exec(main, './16-b.txt', 11048);
exec(main, './16-1.txt');
