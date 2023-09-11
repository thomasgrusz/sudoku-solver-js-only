// # SUDOKU Solver
// ---- Board Setup ----
// A sudoku puzzle consists of a 9x9 grid of boxes, filled with digits from 1 - 9.

// We label 3 distinct entities in the board.

// boxes - the individual boxes in the board(9x9=81)
// units - rows, columns and the subsquares(3 x 9=27)
// peers - a box has peers in a row a column and a subsquare(8 + 6 + 6=20)

// ---- Encoding the board ----
// Rows will be labeled from 'A-I'
// Columns will be labeled from '1-9'

// A board will be encoded in two ways.
// 1. a long string with box contents in a series from left to right, top to bottom
// 2. a dictionary with box labels as keys, i.e. 'A1' and the box contents as values

// For both encodings, the values for empty boxes is a '.' (period).

// This is the global boardEncodings Object
boardEncodings = {
  rows: 'ABCDEFGHI',
  cols: '123456789',
  cross: function(a, b) {
  return [...a].flatMap(r => [...b].map(c => r + c));
  }
};

// Here we populate the global boardEncodings Object
boardEncodings.boxes = boardEncodings.cross(boardEncodings.rows, boardEncodings.cols)
boardEncodings.row_units = boardEncodings.rows.split('').map(r => boardEncodings.cross(r, boardEncodings.cols));
boardEncodings.column_units = boardEncodings.cols.split('').map(c => boardEncodings.cross(boardEncodings.rows, c));
boardEncodings.square_units = ['ABC', 'DEF', 'GHI'].flatMap(rs => ['123', '456', '789'].map(cs => boardEncodings.cross(rs, cs)));
boardEncodings.unitlist = boardEncodings.row_units.concat(boardEncodings.column_units, boardEncodings.square_units);
boardEncodings.units = {};
for (let s of boardEncodings.boxes) {
  const x = [];
  for (let u of boardEncodings.unitlist) {
    if (u.includes(s)) {
      x.push(u);
    }
  }
  boardEncodings.units[s] = x;
}
boardEncodings.peers = {};
for (let s of boardEncodings.boxes) {
  boardEncodings.peers[s] = new Set(
    [].concat(...boardEncodings.units[s]).filter(item => item !== s)
  );
}

// This is a more verbose version of the cross() helper function above, that creates the cell encodings, i.e. A1, A2, ...
//function cross(a, b) {
//  let result = [];
//  for (let r of a) {
//    for (let c of b) {
//      result.push(r + c);
//    }
//  }
//  return result;
//}

// Convert string representation of puzzle into dictionary
function gridValues(grid) {
    const values = [];
    const allDigits = '123456789';

    for (let c of grid) {
        if (c === '.') {
            values.push(allDigits);
        } else if (allDigits.includes(c)) {
          values.push(c);
        }
    }
    if (values.length !== 81) {
        throw new Error('Input grid does not have 81 characters!');
    }
    const result = {};
    for (let i = 0; i < boardEncodings.boxes.length; i++) {
        result[boardEncodings.boxes[i]] = values[i];
    }
    return result;
}

// ---- Display 2D grid in console (dev helper function) ----
// Input: dictionary
// function displayDot(values) {
//   const line = '------+------+------';
//   for (let r of boardEncodings.rows) {
//     let rowOutput = '';
//     for (let c of boardEncodings.cols) {
//       const value = values[r + c].length === 1 ? values[r + c] : '.';
//       rowOutput += value + ' ' + (c === '3' || c === '6' ? '|' : '');
//     }
//     console.log(rowOutput);
//     if (r === 'C' || r === 'F') {
//       console.log(line);
//     }
//   }
// }

// Display the values as a 2-D grid in console. Input: sudoku in dictionary form
// (dev helper function)
// function displayFull(values) {
//   const width = 1 + Math.max(...boardEncodings.boxes.map(s => values[s].length));
//   const line = Array.from({ length: 3 }, () => '-'.repeat(width * 3)).join('+');
//   for (let r of boardEncodings.rows) {
//     let rowOutput = '';
//     for (let c of boardEncodings.cols) {
//       rowOutput += values[r + c].padStart(width, ' ') + (c === '3' || c === '6' ? '|' : '');
//     }
//     console.log(rowOutput);
//     if (r === 'C' || r === 'F') {
//       console.log(line);
//     }
//   }
// }

// ---- Solving Algorithms ----

// Elimination strategy
// The eliminate() function will search boxes with a single digit and
// eliminate that digit from its peers.
function eliminate(values) {
  for (let box of Object.keys(values)) {
    if (values[box].length === 1) {
      const eliminationValue = values[box];
      for (let peer of boardEncodings.peers[box]) {
        values[peer] = values[peer].replace(eliminationValue, '');
      }
    }
  }
  return values;
}

// Only choice strategy
// The function will go through all the units, and if there is a unit with a
// digit that only fits in one possible box, it will assign that digit to that
// box.
function onlyChoice(values) {
  for (let unit of boardEncodings.unitlist) {
    for (let digit of '123456789') {
      const dplaces = unit.filter(box => values[box].includes(digit));
      if (dplaces.length === 1) {
        values[dplaces[0]] = digit;
      }
    }
  }
  return values;
}

// Reduce puzzle by constraint propagation
// Repeatedly apply the eliminate() and only_choice() functions until the puzzle
// is solved. This is called 'Constraint Propagation'
function reducePuzzle(values) {
  let stalled = false;
  while (!stalled) {
    const solvedValuesBefore = Object.values(values).filter(value => value.length === 1).length;
    eliminate(values);
    onlyChoice(values);
    const solvedValuesAfter = Object.values(values).filter(value => value.length === 1).length;
    stalled = solvedValuesBefore === solvedValuesAfter;
    // Sanity check for boxes with zero available values
    if (Object.values(values).some(value => value.length === 0)) {
      return false;
    }
  }
  return values;
}

// ---- Search ----
function search(values) {
  // First, reduce the puzzle using the previous function
  values = reducePuzzle(values);
  if (!values) {
    return false;
  }
  if (Object.values(values).every(value => value.length === 1)) {
    return values; // Solved!
  }
  // Using depth-first search and propagation, try all possible values.
  // Choose one of the unfilled squares with the fewest possibilities
  const [s, n] = Object.entries(values).filter(([s, value]) => value.length > 1).reduce((shortest, [s, value]) => value.length < shortest[1].length ? [s,  value] : shortest);

  // Now use recursion to solve each one of the resulting sudokus
  for (let value of values[s]) {
    const newSudoku = { ...values };  // Make a copy
    newSudoku[s] = value;
    const attempt = search(newSudoku);
    if (attempt) {
      return attempt;
    }
  }
}

// ---- Define Puzzles ----
// const puzzle_1 = '..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..'
// const puzzle_2 = '4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......'

// // Translate the puzzle string into an object mimicking an associative array (Python dict)
// let puzzle_1_grid = gridValues(puzzle_1);
// let puzzle_2_grid = gridValues(puzzle_2);

// // ---- Solving Puzzle 1 ----
// displayDot(puzzle_1_grid);
// displayFull(puzzle_1_grid);
// displayFull(search(puzzle_1_grid));

// // ---- Solving Puzzle 2 ----
// displayDot(puzzle_2_grid);
// displayFull(puzzle_2_grid);
// displayFull(search(puzzle_2_grid));
