import { writeFileSync } from 'node:fs';

let [, , day] = process.argv;
let stem = day.padStart(2, '0');

let js = `import { exec, log } from './utils.js';

function main(lines) {
  let value = 0;

  for (let line of lines) {
    log({ line });
  }

  return value;
}

exec(make, './${stem}-a.txt', 0);
// exec(make, './${stem}-1.txt');`;

writeFileSync(`${stem}-1.js`, js);
writeFileSync(`../inputs/2024/${stem}-a.txt`, '');
writeFileSync(`../inputs/2024/${stem}-1.txt`, '');
