// Function to create a 9x9 Sudoku grid
function createSudokuGrid() {
  // Get the section with id="board"
  let boardSection = document.getElementById("board");
  boardSection.innerHTML = "";

  // Create a table element
  let table = document.createElement("table");
  table.className = "mx-auto my-0"; // Add Bootstrap classes to center table horizontally
  
  // Create rows and cells for the Sudoku grid
  for (let r of boardEncodings.rows) {
      let row = document.createElement("tr");
      for (let c of boardEncodings.cols) {
          let cell = document.createElement("td");
          // Add a black border at the bottom, if at vertical position 3 or 6
          if (r === 'C' || r === 'F') {
            cell.className = "border-bottom border-dark";
          }
          // Add a black border at the right, if at horizontal position 3 or 6
          if (c === '3' || c === '6') {
            if (cell.className === "") {
              cell.className = "border-end border-dark";
            } else {
              cell.className += " border-end";
            }
          }
          // Create an input field for each cell
          let inputField = document.createElement("input");
          inputField.id = r + c
          inputField.type = "text";
          inputField.className = "form-control bg-light text-center"; // Add Bootstrap form-control class
          inputField.setAttribute("maxlength", "1"); // Limit input to one character
          inputField.style.width = "40px"; // Adjust the width as needed

          // Add the input field to the cell
          cell.appendChild(inputField);
          row.appendChild(cell);
      }
      table.appendChild(row);
  }
  // Append the table to the board section
  boardSection.appendChild(table);
}

// Function to create the solve-button
function createButton(buttonText, buttonCLass) {
  let button = document.createElement("button");
  button.innerHTML = "";
  button.className = buttonCLass;
  button.innerText = buttonText;
  document.getElementById("solve-button").innerHTML = "";
  document.getElementById("solve-button").appendChild(button);
}

// Function to create a red colored alert with a custom message
function injectAlert (alertMessage) {
let alertInjection =
`<div class="alert alert-danger alert-dismissible fade show mt-4">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
    class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img"
    aria-label="Warning:">
    <path
        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </svg>` + alertMessage +
  `<button id="error-close-button" type="button" data-bs-dismiss="alert" class="btn-close"></button>
  </div>
`;
document.getElementById("error").innerHTML = alertInjection;
}

// Function to solve the Sudoku puzzle
function solveSudoku() {
  // Get user input from the Sudoku grid
  let validCharacters = "123456789";
  let sudokuGrid = {};
  let tdElements = document.querySelectorAll("td input[type='text']");
  tdElements.forEach((td) => {
    sudokuGrid[td.id] = td.value || validCharacters;
  });
  // Sanitize input, ensure numbers 1-9
  if (!Object.values(sudokuGrid).every(char => [...validCharacters].includes(char) || char === validCharacters)) {
    injectAlert("Only numbers from 1-9!");
    return;
  } else if (Object.values(sudokuGrid).every(char => char === validCharacters)) {
    return;
  }
  // Send string to search() function to solve the puzzle (transform to grid values beforehand)
  sudokuSolved = search(sudokuGrid);

  // Check if there is a solution to the puzzle and if no display an error
  if (!sudokuSolved) {
    injectAlert("I did not find a solution to this Sudoku puzzle!");
    return;
  }

  // Display the solved puzzle string in the html table
  if (document.getElementById("error").firstChild) {    // Remove alert, if existing
    document.getElementById("error").removeChild(document.getElementById("error").firstChild);
  }
  const originalFields = [...tdElements].filter(td => td.value.length === 1).map(td => td.id); // Get original user input fields
  originalFields.forEach(field => document.getElementById(field).classList.add("fw-bold")); // Make original user input bold
  for ( let box of boardEncodings.boxes) {
    let inputField = document.getElementById(box);
    if (!originalFields.includes(box)) {
      inputField.value = sudokuSolved[box];
      inputField.classList.add("text-success"); // Add green color to solution input fields
    }
  }

  // Change the "solve-button" text to "Click to restart!" and reset the board
  createButton("Click to restart!", "btn btn-warning my-4");
  document.getElementById("solve-button").firstChild.addEventListener("click", startSudokuSolver);
}

// Function to start the Sudoku Solver
function startSudokuSolver() {
  createSudokuGrid();
  createButton("SOVLE", "btn btn-success my-4");
  // Add Eventlistener to solve-button
  document.getElementById("solve-button").firstChild.addEventListener("click", solveSudoku);
  // Make container div visible
  document.getElementById("container").style.display = "block";
  // Set the focus on the first input element
  document.querySelector("td input[type='text']").focus();
};

// ************* The script starts here *************
// Start the script as soon as the DOM has been completely parsed
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startSudokuSolver);
} else {
  startSudokuSolver();
}