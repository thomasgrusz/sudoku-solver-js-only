"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _createForOfIteratorHelper(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=_unsupportedIterableToArray(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,l=!0,i=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return l=e.done,e},e:function(e){i=!0,a=e},f:function(){try{l||null==r.return||r.return()}finally{if(i)throw a}}}}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function detectTouchScreen(){return"ontouchstart"in window||navigator.maxTouchPoints}function createSudokuGrid(){var e=document.getElementById("board");e.innerHTML="";var t=document.createElement("table");t.className="mx-auto my-0";var r,n=_createForOfIteratorHelper(boardEncodings.rows);try{for(n.s();!(r=n.n()).done;){var o,a=r.value,l=document.createElement("tr"),i=_createForOfIteratorHelper(boardEncodings.cols);try{for(i.s();!(o=i.n()).done;){var u=o.value,d=document.createElement("td");"C"!==a&&"F"!==a||(d.className="border-bottom border-dark"),"3"!==u&&"6"!==u||(""===d.className?d.className="border-end border-dark":d.className+=" border-end");var c=document.createElement("input");detectTouchScreen()?c.type="number":c.type="text",c.id=a+u,c.className="form-control bg-light border-dark-subtle text-center input-field",c.setAttribute("maxlength","1"),c.style.maxWidth="40px",c.style.minWidth="35px",d.appendChild(c),l.appendChild(d)}}catch(e){i.e(e)}finally{i.f()}t.appendChild(l)}}catch(e){n.e(e)}finally{n.f()}e.appendChild(t)}function createButton(e,t){var r=document.createElement("button");r.innerHTML="",r.className=t,r.innerText=e,document.getElementById("solve-button").innerHTML="",document.getElementById("solve-button").appendChild(r)}function injectAlert(e){var t='<div class="row justify-content-center ">\n    <div class="alert alert-danger alert-dismissible fade show mt-4 col-auto">\n      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"\n        class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img"\n        aria-label="Warning:">\n        <path\n            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />\n      </svg>'+e+'<button id="error-close-button" type="button" data-bs-dismiss="alert" class="btn-close"></button>\n    </div>\n    </div>\n    ';document.getElementById("error").innerHTML=t}function solveSudoku(){var e="123456789",t={},r=document.querySelectorAll("td input.input-field");if(r.forEach((function(r){t[r.id]=r.value||e})),Object.values(t).every((function(t){return _toConsumableArray(e).includes(t)||t===e}))){if(!Object.values(t).every((function(t){return t===e}))){var n=search(t);if(n){document.getElementById("error").firstChild&&document.getElementById("error").removeChild(document.getElementById("error").firstChild);var o=_toConsumableArray(r).filter((function(e){return 1===e.value.length})).map((function(e){return e.id}));o.forEach((function(e){return document.getElementById(e).classList.add("fw-bold")}));var a,l=_createForOfIteratorHelper(boardEncodings.boxes);try{for(l.s();!(a=l.n()).done;){var i=a.value,u=document.getElementById(i);o.includes(i)||(u.value=n[i],u.classList.add("text-success"))}}catch(e){l.e(e)}finally{l.f()}createButton("Click to restart!","btn btn-warning my-4"),document.getElementById("solve-button").firstChild.addEventListener("click",startSudokuSolver)}else injectAlert("I did not find a solution to this Sudoku puzzle!")}}else injectAlert("Only numbers from 1-9!")}function startSudokuSolver(){createSudokuGrid(),createButton("SOLVE","btn btn-success my-4"),document.getElementById("solve-button").firstChild.addEventListener("click",solveSudoku),document.getElementById("container").style.display="block",document.querySelector("td input.input-field").focus()}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",startSudokuSolver):startSudokuSolver();