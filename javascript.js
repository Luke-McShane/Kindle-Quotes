// Add event listeners to the buttons contained on the main page and within the modal
let modal = document.getElementById('modal');
let allowedBooks = [];
let allowedBooksModal = [];
let quotes = [];
let quotesFiltered = [];
let chunkedText;
let book = '';
let author = '';

function parseText(text) {
	console.log(text);
	chunkedText = text.split('==========');
	for (let i = 0; i < chunkedText.length; i++) {
		chunkedText[i] = chunkedText[i].split('\n');
		for (let j = 0; j < chunkedText[i].length; j++) {
			if (chunkedText[i][j].includes('- Your Highlight on page')) {
				chunkedText[i].splice(j, 1);
			} else if (chunkedText[i][j].length <= 4) {
				chunkedText[i].splice(j, 1);
			}
		}
	}
	chunkedText.pop();
	// console.log(chunkedText);
	for (let i = 0; i < chunkedText.length; i++) {
		chunkedText[i][0] = chunkedText[i][0].split('(');
		console.log(chunkedText[i]);

		// Changing the order if the author's firstname is preceded by their lastname.
		if (chunkedText[i][0][1].includes(',')) {
			chunkedText[i][0][1] = chunkedText[i][0][1].split(',');
			chunkedText[i][0][1][1] = chunkedText[i][0][1][1].trim().replace(')', '');
			chunkedText[i][0][1] = `${chunkedText[i][0][1][1]} ${chunkedText[i][0][1][0]}`;

			// Else we simply remove the closing bracket from the string.
		} else {
			chunkedText[i][0][1] = chunkedText[i][0][1].trim().substring(0, chunkedText[i][0][1].trim().length - 1);
		}

		quotes.push({ author: chunkedText[i][0][1], book: chunkedText[i][0][0], quote: chunkedText[i][2] });
		quotesFiltered.push({ author: chunkedText[i][0][1], book: chunkedText[i][0][0], quote: chunkedText[i][2] });
	}
	quoteGen();
}

function quoteGen() {
	let currentQuote = Math.floor(Math.random() * quotesFiltered.length);
	let quote = document.getElementById('main-text-quote');
	let quoteText = quotesFiltered[currentQuote].quote;
	let firstChar = quoteText[0];
	let lastChar = quoteText[quotesFiltered[currentQuote].quote.length - 2];

	// Checking what the first and last characters are to determine what text may be added to format the string
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

function bookSelect() {
	modal.style.display = 'flex';

	// If the table has already been generated, which it will be on its first load, return
	let numRows = Array.from(document.getElementsByClassName('inputModal')).length;
	if (numRows == 0) {
		let uniqueBooks = Array.from(new Set(quotes.map((item) => item.book))).map((book) => {
			if (!allowedBooksModal.includes(book.replace(/ /g, '')) && allowedBooks.includes(book.replace(/ /g, '')))
				allowedBooks.push(book.replace(/ /g, ''));
			return {
				author: quotes.find((item) => item.book == book).author,
				book: book
			};
		});
		allowedBooksModal = allowedBooks.slice(0);
		tableGen(uniqueBooks.length, uniqueBooks);
	}
}

function tableGen(length, uniqueBooks) {
	let table = document.getElementById('table');

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
		element.addEventListener('click', function(event) {
			if (event.srcElement.classList[0] == 'inputModal') {
				checkboxChange(event.target);
			}
		})
	);
}

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

function saveSelection() {
	if (allowedBooksModal.length === 0) {
		alert('Please select at least one book.');
	} else {
		allowedBooks = allowedBooksModal.slice(0);

		quotesFiltered = quotes.filter(function(obj) {
			return allowedBooksModal.includes(obj.book.replace(/ /g, ''));
		});
		modal.style.display = 'none';
		quoteGen();
	}
}

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

function selectAll() {
	Array.from(document.body.getElementsByClassName('inputModal')).forEach(function(element) {
		element.checked = 1;
		let book = Array.from(
			document.body.getElementsByClassName(element.classList[element.classList.length - 1])
		)[2].innerText.replace(/ /g, '');

		if (allowedBooksModal.includes(book)) return;
		else allowedBooksModal.push(book);
	});
}

function deselectAll() {
	Array.from(document.body.getElementsByClassName('inputModal')).forEach(function(element) {
		element.checked = 0;
		let book = Array.from(
			document.body.getElementsByClassName(element.classList[element.classList.length - 1])
		)[2].innerText.replace(/ /g, '');

		if (allowedBooksModal.includes(book)) allowedBooksModal.splice(allowedBooksModal.indexOf(book), 1);
		else return;
	});
}

function showOverlay() {
	const [ overlay, overlayInner, overlayInnerText ] = getOverlay();
	const close = document.querySelector('#close');
	overlay.style.visibility = 'visible';
	overlayInner.style.transform = 'scale(1)';
	overlayInner.style.transitionDuration = '400ms';
	overlayInnerText.style.opacity = 1;
	overlayInnerText.style.transition = 'opacity 400ms ease 400ms';
	close.addEventListener('click', () => {
		const [ overlay, overlayInner, overlayInnerText ] = getOverlay();
		overlay.style.visibility = 'hidden';
		overlayInner.style.transform = 'scale(0)';
		overlayInnerText.style.opacity = 0;
	});
}

function getOverlay() {
	const overlay = document.querySelector('#main-help');
	const overlayInner = document.querySelector('#main-help-overlay');
	const overlayInnerText = document.querySelector('#main-help-overlay > ul');
	return [ overlay, overlayInner, overlayInnerText ];
}

function app() {
	// Setup event listeners
	document.getElementById('quoteGen').addEventListener('click', quoteGen);
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
		reader.onload = () => parseText(reader.result);
		// This allows us access to the file data outside of the object event
		data = reader.readAsText(input.files[0]);
	});
	document.querySelector('#helpBtn').addEventListener('click', showOverlay);
	getDefaultClippings();
}

function getDefaultClippings() {
	const rawFile = new XMLHttpRequest();
	let allText;
	rawFile.open('GET', 'My Clippings.txt', false);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status == 0) {
				allText = rawFile.responseText;
				parseText(rawFile.responseText);
			}
		}
	};
	rawFile.send(null);
}

app();

//IDEAS

//Save user's filtered list to cache.

//Use this: 'Object.fromEntries(mainChunks)' to simplify the initial parsing process.

//Improve look and feel of landing page.

//On Modal Cancel I must reset the buttons to what is in allowedBooks so that, when reopening, only the actually selected
// books are ticked.

//Find where books are being added to allowedBooks even when cancelled is pressed, for books should only be added to
// this list after Save is clicked.

//Add document.onReady JS equivalent to generate modal so that it isn't regerated each time you click the modal.

//TIP: In JS, saying a = b doesn't mean that a will simply copy the contents of b, it means it will point to the same variable!

//Create a reqest to receive textual data
