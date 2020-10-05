// Global variables
let modal = document.getElementById('modal');
let allowedBooks = [];
let allowedBooksModal = [];
let quotes = [];
let quotesFiltered = [];
let chunkedText;
let book = '';
let author = '';

// Parse the file
// This file may be either the default file or the .txt file the user selects
function parseText(text) {
	// Split the text file into quotes based on the standard formatting used by Kindle
	chunkedText = text.split('==========');
	for (let i = 0; i < chunkedText.length; i++) {
		chunkedText[i] = chunkedText[i].split('\n');
		for (let j = 0; j < chunkedText[i].length; j++) {
			//console.log(chunkedText[i][j]);
			// If the section begins with '- Your Bookmark', there will be no quote, and we thus do not want this displaying
			if (chunkedText[i][j].includes('- Your Bookmark')) {
				chunkedText.splice(i, 1);
				i -= 1;
				break;
			} else if (chunkedText[i][j].includes('- Your Highlight on page')) {
				chunkedText[i].splice(j, 1);
			} else if (chunkedText[i][j].length <= 4) {
				//console.log(chunkedText[i])
				chunkedText[i].splice(j, 1);
			}
		}
	}
	chunkedText.pop();

	// Iterate through the array of quotes, checking for formatting each time and, where there is no formatting issue, format the array items so
	// we can extract the relevant data to be displayed on the webpage
	let error = false;
	for (let i = 0; i < chunkedText.length; i++) {
		if (chunkedText[i][0].includes('(')) {
			chunkedText[i][0] = chunkedText[i][0].split('(');

			// Changing the order if the author's firstname is preceded by their lastname.
			if (chunkedText[i][0][1].includes(',')) {
				chunkedText[i][0][1] = chunkedText[i][0][1].split(',');
				chunkedText[i][0][1][1] = chunkedText[i][0][1][1].trim().replace(')', '');
				chunkedText[i][0][1] = `${chunkedText[i][0][1][1]} ${chunkedText[i][0][1][0]}`;

				// Else we simply remove the closing bracket from the string.
			} else {
				chunkedText[i][0][1] = chunkedText[i][0][1].trim().substring(0, chunkedText[i][0][1].trim().length - 1);
			}
			// If there is no forward-bracket, then a formatting issue is present within the .txt file, which means that this iteration of the loop is skipped and the
			// user is shown the error/info message which guides them on how to format any improperly formatted items in their file
		} else {
			error = true;
			continue;
		}
		// console.log(quotes);
		// console.log(`Book: ${chunkedText[i][0][1].trim()}`);
		// console.log(`Author: ${chunkedText[i][0][0].trim()}`);
		// console.log(`Quote: ${chunkedText[i][2]}`);
		// console.log(chunkedText[i]);
		// Push all text data to the array for future use
		quotes.push({
			author: chunkedText[i][0][1].trim(),
			book: chunkedText[i][0][0].trim(),
			quote: chunkedText[i][2].trim()
		});
		quotesFiltered.push({
			author: chunkedText[i][0][1].trim(),
			book: chunkedText[i][0][0].trim(),
			quote: chunkedText[i][2].trim()
		});
	}
	// console.log(quotes);3q
	// If there is an error in reading, show the error to the user
	if (error) showError();
	quoteGen();
}

// Show the error by altering the popup's style properties
function showError() {
	const error = document.querySelector('#error');
	error.style.transform = 'translateY(0px)';
	error.style.visibility = 'visible';
	error.style.transition = 'all 500ms ease';
}

// Generate a quote and show it on the site
// This is done by selecting a random item in the filtered quotes array
function quoteGen() {
	let currentQuote;
	let quote;
	let quoteText;
	do {
		currentQuote = Math.floor(Math.random() * quotesFiltered.length);
		quote = document.getElementById('main-text-quote');
		quoteText = quotesFiltered[currentQuote].quote;
	} while (quoteText.match(/ /g) === null || quoteText.match(/ /g).length < 2);
	let firstChar = quoteText[0];
	let lastChar = quoteText[quotesFiltered[currentQuote].quote.length - 2];

	// Checking what the first and last characters are to determine what text may be added to format the string
	// We check to see if the quote has trailing text, meaning that we can add '..' to show that there is more text in the book
	if (
		(firstChar == firstChar.toLowerCase() && firstChar != firstChar.toUpperCase()) ||
		(firstChar != '“' && firstChar != '"' && !firstChar.match(/^[a-z0-9]+$/i))
	) {
		quote.textContent = `"..${quoteText}`;
	} else quote.textContent = `"${quoteText}`;

	if (lastChar != '.') {
		quote.textContent = `${quote.textContent}.."`;
	} else quote.textContent = `${quote.textContent}"`;

	document.getElementById('main-text-author').textContent =
		quotesFiltered[currentQuote].author + ': ' + quotesFiltered[currentQuote].book;
}

// Show the modal and populate it with all books from the imported text file
// Due to their likely being many quotes from the same book, we must filter the books so only one book for each set of quotes is shown
function bookSelect() {
	modal.style.display = 'flex';

	// If the table has already been generated, which it will be on its first load, return
	let numRows = Array.from(document.getElementsByClassName('inputModal')).length;
	if (numRows == 0) {
		let uniqueBooks = Array.from(new Set(quotes.map((item) => item.book))).map((book) => {
			if (
				!allowedBooksModal.includes(book.replace(/[^A-Za-z0-9]/g, '')) &&
				allowedBooks.includes(book.replace(/[^A-Za-z0-9]/g, ''))
			) {
				// console.log(book.replace(/ /g, ''));
				allowedBooks.push(book.replace(/ /g, ''));
			}
			return {
				author: quotes.find((item) => item.book == book).author,
				book: book
			};
		});
		allowedBooksModal = allowedBooks.slice(0);
		// Generate the table based on the amount of entries we need and the selection of books
		tableGen(uniqueBooks.length, uniqueBooks);
	}
}

// Create a new table item and populate it according to the amount of table rows we need and what data these rows should contain
function tableGen(length, uniqueBooks) {
	let table = document.getElementById('table');
	// console.log(uniqueBooks);
	for (let i = 0; i < length; i++) {
		let row = document.createElement('tr');
		let checkboxCell = document.createElement('td');
		let input = document.createElement('input');
		let authorCell = document.createElement('td');
		let bookCell = document.createElement('td');

		input.type = 'checkbox';
		input.checked = 1;

		input.id = `inputElement${i}`;
		authorCell.id = `authorElement${i}`;
		bookCell.id = `bookElement${i}`;

		input.classList.add('inputModal', `modalElement${i}`);
		authorCell.classList.add('authorModal', `modalElement${i}`);
		bookCell.classList.add('bookModal', `modalElement${i}`);

		authorCell.innerText = uniqueBooks[i].author;
		bookCell.innerText = uniqueBooks[i].book;

		allowedBooksModal.push(uniqueBooks[i].book.replace(/ /g, ''));

		checkboxCell.appendChild(input);
		row.appendChild(checkboxCell);
		row.appendChild(authorCell);
		row.appendChild(bookCell);
		table.appendChild(row);
	}

	allowedBooks = allowedBooksModal.slice(0);

	// Due to the HTML elements being dynamically created, event listeners must be added to each element after dynamic creation
	Array.from(document.body.getElementsByClassName('inputModal')).forEach((element) =>
		element.addEventListener('click', function (event) {
			if (event.srcElement.classList[0] == 'inputModal') {
				checkboxChange(event.target);
			}
		})
	);
}

// When the checkbox is toggled,  update the array that determines what books will be used to select quotes from
// If a user ticks a book, then we want quotes from that book to be able to be selected when generating quotes
function checkboxChange(checkboxElement) {
	let thisArray = document.getElementsByClassName(checkboxElement.classList[1]);
	let book = thisArray[2].innerText.replace(/ /g, '');
	if (!thisArray[0].checked) {
		if (allowedBooksModal.includes(book)) {
			allowedBooksModal.splice(allowedBooksModal.indexOf(book), 1);
		}
	} else if (thisArray[0].checked && !allowedBooksModal.includes(book)) {
		allowedBooksModal.push(book);
	}
}

// Ensure the user has selected at least one book to be used in the quote generation process, then create a copy of the array of allowed books
// and filter all the quotes based on the user selection of books
// Finally, hide the modal and generate a quote based on this newly filtered array of quotes
function saveSelection() {
	if (allowedBooksModal.length === 0) {
		alert('Please select at least one book.');
	} else {
		allowedBooks = allowedBooksModal.slice(0);

		quotesFiltered = quotes.filter(function (obj) {
			return allowedBooksModal.includes(obj.book.replace(/ /g, ''));
		});
		modal.style.display = 'none';
		quoteGen();
	}
}

// If the user cancels their selection, we should ignore all changes the user has made during the time the modal has been visible
function cancelSelection() {
	modal.style.display = 'none';
	allowedBooksModal = allowedBooks.slice(0);

	// For each element, compare it against the original allowedBooks list to determine whether the element should be checked or not
	Array.from(document.body.getElementsByClassName('inputModal')).forEach((element) => {
		let tableRow = document.getElementsByClassName(element.classList[1]);
		let book = tableRow[2].innerText.replace(/ /g, '');

		if (element.checked && !allowedBooks.includes(book)) {
			element.checked = 0;
		} else if (!element.checked && allowedBooks.includes(book)) element.checked = 1;

		if (!element.checked && allowedBooksModal.includes(book)) {
			allowedBooksModal.splice(allowedBooksModal.indexOf(book), 1);
		} else if (element.checked && !allowedBooksModal.includes(book)) {
			allowedBooksModal.push(book);
		}
	});
	quoteGen();
}

// Select all books in the modal and add them to the array that will be used to filter all quotes after the selection of books has been saved
function selectAll() {
	Array.from(document.body.getElementsByClassName('inputModal')).forEach(function (element) {
		element.checked = 1;
		let book = Array.from(
			document.body.getElementsByClassName(element.classList[element.classList.length - 1])
		)[2].innerText.replace(/ /g, '');

		if (allowedBooksModal.includes(book)) return;
		else allowedBooksModal.push(book);
	});
}

// Deselect all books within the modal and remove the book from the allowed books array if it is present therein
// The .replace(/ / g, '') is used to ensure all whitespace is standardized so we aren't skipping out on removing items that are identical
// This method removes all whitespace and replaces it with nothing, meaning all whitespace is removed
function deselectAll() {
	Array.from(document.body.getElementsByClassName('inputModal')).forEach(function (element) {
		element.checked = 0;
		let book = Array.from(
			document.body.getElementsByClassName(element.classList[element.classList.length - 1])
		)[2].innerText.replace(/ /g, '');

		if (allowedBooksModal.includes(book)) allowedBooksModal.splice(allowedBooksModal.indexOf(book), 1);
		else return;
	});
}

// Show the overlay that contains the data which informs the user how to use the site
// This function can only be called from mobile and tablet devices due to being called from a button that is only shown on these two device types
function showOverlay() {
	const [overlay, overlayInner, overlayInnerText] = getOverlay();
	const close = document.querySelector('#close');
	overlay.style.visibility = 'visible';
	overlayInner.style.transform = 'scale(1)';
	overlayInner.style.transitionDuration = '400ms';
	overlayInnerText.style.opacity = 1;
	overlayInnerText.style.transition = 'opacity 400ms ease 400ms';
	// Get the overlay data through destructuring and apply the relevant transformations/styles
	close.addEventListener('click', () => {
		const [overlay, overlayInner, overlayInnerText] = getOverlay();
		overlay.style.visibility = 'hidden';
		overlayInner.style.transform = 'scale(0)';
		overlayInnerText.style.opacity = 0;
	});
}

// Return the overlay elements to make the code more DRY
function getOverlay() {
	const overlay = document.querySelector('#main-help');
	const overlayInner = document.querySelector('#main-help-overlay');
	const overlayInnerText = document.querySelector('#main-help-overlay > ul');
	return [overlay, overlayInner, overlayInnerText];
}

// Setup the application
// Ensure all buttons are setup correctly before reading in the default clippings file that contains an abundance of Kindle quotes
function app() {
	// Setup event listeners
	document.getElementById('quoteGenPC').addEventListener('click', quoteGen);
	document.getElementById('quoteGenSmall').addEventListener('click', quoteGen);
	document.getElementById('bookSelect').addEventListener('click', bookSelect);
	document.getElementById('buttonSave').addEventListener('click', saveSelection);
	document.getElementById('buttonCancel').addEventListener('click', cancelSelection);
	document.getElementById('buttonSelectAll').addEventListener('click', selectAll);
	document.getElementById('buttonDeselectAll').addEventListener('click', deselectAll);
	document
		.querySelector('#linkKindle')
		.addEventListener('click', () => document.querySelector('#getPath').click(), false);
	// .stopPropogation() is used to prevent this child from inheriting the parent onclick event functionality
	document.getElementById('toolTip').addEventListener('click', (e) => e.stopPropagation());
	// Here we are setting an event listener for the getPath button to load the text data whenever the user selects
	// a .txt file from the input="file" button
	document.querySelector('#getPath').addEventListener('change', (event) => {
		let data;
		let input = event.target;
		// Crete a FileReader object that will be used to house the file information
		let reader = new FileReader();
		// When the file has been loaded, pass the contained data to the parseText method
		// This is an asynchronous method, meaning that it is ran whenever necessary, and the browser doesn't need to wait/freeze
		// for the process to finish executing for the code below to run
		reader.onload = () => {
			quotes = [];
			quotesFiltered = [];
			// console.log(reader.result);
			localStorage.setItem('text', reader.result);
			parseText(reader.result);
		};
		// This allows us access to the file data outside of the object event
		data = reader.readAsText(input.files[0]);
	});
	document.querySelector('#helpBtn').addEventListener('click', showOverlay);
	document.querySelector('#error-container-text-cancel').addEventListener('click', () => {
		const error = document.querySelector('#error');
		error.style.visibility = 'hidden';
		error.style.transform = 'translateY(300px)';
	});

	// Adds listener so that, when the screen is of a tablet size or smaller, remove the quoteGen button from
	// the main-buttons div, and append it to the main-text div
	// Next job is to reset the button position after the screen size is larger than a tablet
	// const mediaQuery = window.matchMedia('(max-width: 768px)');
	// mediaQuery.addEventListener('change', handleTabletSize);
	getDefaultClippings();
}

// function handleTabletSize(e) {
// 	let btn = document.getElementById('quoteGen');
// 	let oldParent = document.getElementById('main-buttons');
// 	let newParent = document.getElementById('main-text');
// 	newParent.appendChild(btn);
// 	oldParent.removeChild(btn);
// }

// Read in the default file
function getDefaultClippings() {
	let allText;
	if (localStorage.getItem('text') === null) {
		const rawFile = new XMLHttpRequest();
		rawFile.open('GET', 'My Clippings.txt', false);
		rawFile.onreadystatechange = function () {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 200 || rawFile.status == 0) {
					allText = rawFile.responseText;
					parseText(rawFile.responseText);
				}
			}
			rawFile.send(null);
		};
	} else parseText(localStorage.getItem('text'));
}

// Call the app function for application setup and initialization
app();
