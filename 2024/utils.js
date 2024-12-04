import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { styleText } from 'node:util';

/**
 * # Logging
 */

export function log(...args) {
  console.log(...args);

  return args.at(-1);
}

export function time(label) {
  console.time(label);

  return () => console.timeEnd(label);
}

export function green(value) {
  return styleText('green', value);
}

export function red(value) {
  return styleText('red', value);
}

/**
 * # Execution
 */

export function readLines(path) {
  let fullPath = resolve('../inputs/2024', path);

  return readFileSync(fullPath, 'utf8').trim().split('\n');
}

export function exec(path, fn, expected) {
  let lines = readLines(path);
  let stop = time('\n     time');
  let actual = fn(lines);

  stop();
  log('   actual:', actual);

  if (expected) {
    const passFail = actual === expected ? green('PASS') : red('FAIL');

    log(' expected:', expected, passFail);
  }

  log();
}

/**
 * # Math
 */

export function gcd(a, b) {
  return a ? gcd(b % a, a) : b;
}

export function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

/**
 * # 2D grids
 */

export function logMap(map, fn) {
  log();
  log(joinMap(map, fn));
  log();

  return map;
}

export function logMaps(maps) {
  let height = maps[0].length;

  log();
  for (let y = 0; y < height; y++) {
    log(maps.map((map) => map[y].join('')).join(' '));
  }
  log();

  return maps;
}

export function joinMap(map, fn = (x) => x) {
  if (typeof map[0] !== 'string') {
    map = map.map((row) => row.map(fn).join(''));
  }

  return map.join('\n');
}

export function splitMap(map) {
  if (typeof map === 'string') {
    map = map.split('\n');
  }

  return map.map((row) => row.split(''));
}

/**
 * # Algos
 */

export function bfs(root, fn) {
  let queue = [{ node: root, depth: 0 }];

  while (queue.length) {
    let { node, depth } = queue.shift();

    if (fn(node, depth)) return { node, depth };

    for (let child of node.children ?? []) {
      queue.push({ node: child, depth: depth + 1 });
    }
  }
}

export function dfs(root, fn) {
  let stack = [{ node: root, depth: 0 }];

  while (stack.length) {
    let { node, depth } = stack.pop();

    if (fn(node, depth)) return { node, depth };

    for (let i = node.children?.length ?? 0; i--; ) {
      stack.push({ node: node.children[i], depth: depth + 1 });
    }
  }
}

export function createHeap(heap = [], compare = (a, b) => b - a) {
  function add(item) {
    heap.push(item);
    up(heap.length - 1);
  }

  function up(i) {
    while (i > 0) {
      let next = Math.floor((i + 1) / 2) - 1;

      if (compare(heap[i], heap[next]) < 0) {
        [heap[next], heap[i]] = [heap[i], heap[next]];
      }

      i = next;
    }
  }

  function pop() {
    let root = heap[0];
    let last = heap.pop();

    if (heap.length) {
      heap[0] = last;
      down(0);
    }

    return root;
  }

  function down(i) {
    let { length } = heap;

    while (true) {
      let right = (i + 1) * 2;
      let left = right - 1;
      let next = i;

      if (right < length && compare(heap[right], heap[next]) < 0) {
        next = right;
      }

      if (left < length && compare(heap[left], heap[next]) < 0) {
        next = left;
      }

      if (next === i) {
        break;
      }

      [heap[next], heap[i]] = [heap[i], heap[next]];
      i = next;
    }
  }

  return {
    get heap() {
      return heap;
    },

    get peek() {
      return heap[0];
    },

    add,
    pop,

    *[Symbol.iterator]() {
      while (heap.length) {
        yield pop();
      }
    },
  };
}

export function createQueue(queue = []) {
  function add(item) {
    queue.push(item);
  }

  function pop() {
    return queue.shift();
  }

  return {
    add,
    pop,

    *[Symbol.iterator]() {
      while (queue.length) {
        yield pop();
      }
    },
  };
}

export function createStack(stack = []) {
  function add(item) {
    stack.push(item);
  }

  function pop() {
    return stack.pop();
  }

  return {
    add,
    pop,

    *[Symbol.iterator]() {
      while (stack.length) {
        yield pop();
      }
    },
  };
}

export function diffRanges(a, b) {
  let diff = structuredClone(a);

  b.forEach(([bStart, bEnd]) => {
    diff.forEach(([aStart, aEnd], i) => {
      if (aStart > bEnd || bStart > aEnd) {
        return;
      }

      let split = [];

      if (aStart < bStart - 1) {
        split.push([aStart, bStart - 1]);
      }

      if (bEnd + 1 < aEnd) {
        split.push([bEnd + 1, aEnd]);
      }

      if (split.length) {
        diff.splice(i, 1, ...split);
      }
    });
  });

  return diff;
}

export function unionRanges(a, b) {
  let ranges = structuredClone([...a, ...b]);
  let union = [];

  ranges.sort((a, b) => a[0] - b[0]);

  for (let range of ranges) {
    if (range[0] <= union.at(-1)?.[1]) {
      union.at(-1)[1] = Math.max(union.at(-1)[1], range[1]);
    } else {
      union.push(range);
    }
  }

  return union;
}

export function withinRange(value, [a, b]) {
  return value >= a && value <= b;
}
