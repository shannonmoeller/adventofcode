import { exec } from '../helpers/utils.js';

function main([line]) {
  let value = 0;

  let movement = {
    '(': 1,
    ')': -1,
  };

  for (let char of line) {
    value += movement[char];
  }

  return value;
}

exec(main, '01-a', 1);
exec(main, '01-1');
