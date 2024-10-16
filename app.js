// Get references to the HTML, CSS, and JS editor elements and the output iframe
var html = document.getElementById('html');
var css = document.getElementById('css');
var js = document.getElementById('js');
var code = document.getElementById('output').contentWindow.document;

// Function to compile and display the code
function compile() {
  const PREFIX = 'livecode-'; // Prefix for localStorage keys
  // Retrieve stored code from localStorage
  const data = ['html', 'css', 'js'].map((key) => {
    const prefixedKey = PREFIX + key;
    const jsonValue = localStorage.getItem(prefixedKey); // Get value from localStorage

    // Parse and return the JSON value if it exists
    if (jsonValue != null) return JSON.parse(jsonValue);
  });
  setInitial(data); // Set initial values in the editor
  // Update localStorage and iframe content on keyup event
  document.body.onkeyup = function () {
    localStorage.setItem('livecode-html', JSON.stringify(html.value));
    localStorage.setItem('livecode-css', JSON.stringify(css.value));
    localStorage.setItem('livecode-js', JSON.stringify(js.value));

    // Write the combined HTML, CSS, and JS to the iframe
    code.open();
    code.writeln(
      html.value +
        '<style>' +
        css.value +
        '</style>' +
        '<script>' +
        js.value +
        '</script>'
    );
    code.close();
  };
}

// Function to set initial content in the editors
function setInitial(data) {
  // Default content if no data is found in localStorage
  let htmlContent = data[0] || '<h1> Welcome to Starxer-EditorX ! </h1>';
  let cssContent =
    data[1] ||
    `body {
      background-color: #222;
    }
    h1 {
      color: #fff;
      text-align: center;
      margin-top: 10%;
    }`;
  let jsContent = data[2] || ''; // Default JS content

  // Set the values of the textareas
  css.value = cssContent;
  js.value = jsContent;
  html.value = htmlContent;

  // Write initial content to the iframe
  code.open();
  code.writeln(
    htmlContent +
      '<style>' +
      cssContent +
      '</style>' +
      '<script>' +
      jsContent +
      '</script>'
  );
  code.close();
}

// Call compile to initialize the editor
compile();

// Toggle collapse of editor sections when control buttons are clicked
document.querySelectorAll('.control').forEach((control) =>
  control.addEventListener('click', (e) => {
    e.target.parentElement.parentElement.classList.toggle('collapse');
    e.target.classList.add('close');
    e.target.parentElement.querySelector('h2').classList.toggle('hidden');
  })
);

// Clear editor content when clear buttons are clicked
document.querySelectorAll('.clear').forEach((clear) =>
  clear.addEventListener('click', (e) => {
    const ele = e.target.classList[1]; // Get the class for identifying which editor to clear
    document.querySelector(`#${ele}`).value = ''; // Clear the corresponding textarea
    localStorage.setItem(`livecode-${ele}`, JSON.stringify('')); // Clear localStorage for that editor
    compile(); // Re-compile to update the output
  })
);

// Copy buttons functionality
document.querySelectorAll('.copy-btn').forEach((copy) => {
  copy.addEventListener('click', (e) => {
    const temp = e.target.innerHTML; // Store the original text
    e.target.innerText = 'Copied!'; // Change text to indicate copy success
    setTimeout(function () {
      e.target.innerHTML = temp; // Revert text after a short delay
    }, 800);
  });
});

// Individual copy functionality for HTML, CSS, and JS
document.querySelector('.copy-html').addEventListener('click', (e) => {
  const code = document.querySelector('#html');
  copyCode(code); // Call copy function for HTML code
});

document.querySelector('.copy-css').addEventListener('click', (e) => {
  const code = document.querySelector('#css');
  copyCode(code); // Call copy function for CSS code
});

document.querySelector('.copy-js').addEventListener('click', (e) => {
  const code = document.querySelector('#js');
  copyCode(code); // Call copy function for JS code
});

// Function to copy code to clipboard
function copyCode(code) {
  code.select(); // Select the code in the textarea
  document.execCommand('copy'); // Copy the selected code to the clipboard
  // Show a success alert using SweetAlert
  swal('Copied!', 'You are ready to rock', 'Darkbreaker');
}
