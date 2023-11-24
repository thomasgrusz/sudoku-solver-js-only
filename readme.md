# Sudoku Solver - JavaScript Only

This project is a JavaScript-only port of another [Sudoku Solver project](https://github.com/thomasgrusz/Sudoku-Solver) that originally had a Python-based backend. The purpose of this port is to simplify deployment by using a frontend-only approach.

## Project Structure

- The `src/` folder contains all source files, including two Jupyter Notebooks I used to port the code from Python to JavaScript.
- The `docs/` folder contains minified files ready for deployment on GitHub ([gh-pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)).

## Task Runner: Gulp

To streamline the build and deployment process, this project uses the task runner **Gulp**. Gulp is responsible for copying and minifying the source files from `src/` into the distribution folder `docs/`.

### Development

To set up your development environment and install Gulp and other necessary development dependencies, run the following command:

`npm install`

(Note: Node.js and npm must be installed on your system.)

### Build and Watch

To minify the source files and automatically watch the src/ folder for changes, run the following command:

`npx gulp`

### Individual Gulp Tasks

You can also run specific Gulp tasks individually:

- `npx gulp clean` : Deletes the dist/ folder
- `npx gulp minifyHTML` : Minifies HTML files
- `npx gulp minifyJS` : Minifies JavaScript files
- `npx gulp copyStatic` : copy static files
