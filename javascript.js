
// Add event listeners to the buttons contained on the main page and within the modal
document.getElementById("quoteGen").addEventListener("click", quoteGen);
document.getElementById("bookSelect").addEventListener("click", bookSelect);
document.getElementById("buttonSave").addEventListener("click", saveSelection);
document.getElementById("buttonCancel").addEventListener("click", cancelSelection);
document.getElementById("buttonSelectAll").addEventListener("click", selectAll);
document.getElementById("buttonDeselectAll").addEventListener("click", deselectAll);

let modal = document.getElementsByClassName("modal")[0];
let allowedBooks = [];
let allowedBooksModal = []
let quotes = [];
let quotesFiltered = [];
let chunkedText;
let book = "";
let author = "";

function readTextFile(file){

    let rawFile = new XMLHttpRequest();

    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                let allText = rawFile.responseText;
                parseText(allText);
            }
        }
    }
    rawFile.send(null);
}

function parseText(text) {
    chunkedText = text.split("==========");
    for(let i=0; i<chunkedText.length;i++) {
        chunkedText[i] = chunkedText[i].split("\n");   
       for(let j=0; j<chunkedText[i].length; j++) {
        if ( chunkedText[i][j].includes("- Your Highlight on page")) {
            chunkedText[i].splice(j, 1);
         } else if (chunkedText[i][j].length <= 4) {
            chunkedText[i].splice(j, 1);
         };
        }
    }
    chunkedText.pop();
    
    for(let i=0; i<chunkedText.length; i++){
        chunkedText[i][0] = chunkedText[i][0].split("(");

        // Changing the order if the author's firstname is preceded by their lastname.
        if(chunkedText[i][0][1].includes(',')) {
            chunkedText[i][0][1] = chunkedText[i][0][1].split(',');
            chunkedText[i][0][1][1]= chunkedText[i][0][1][1].trim().replace(')', '');
            chunkedText[i][0][1] = `${chunkedText[i][0][1][1]} ${chunkedText[i][0][1][0]}`;

        // Else we simply remove the closing bracket from the string.
        } else {console.log(chunkedText[i][0][1].trim().replace(')', ''));
            chunkedText[i][0][1] = chunkedText[i][0][1].trim().substring(0, chunkedText[i][0][1].length-2);}

        quotes.push({"author": chunkedText[i][0][1], "book": chunkedText[i][0][0], "quote": chunkedText[i][2]})
        quotesFiltered.push({"author": chunkedText[i][0][1], "book": chunkedText[i][0][0], "quote": chunkedText[i][2]})

    }   

    quoteGen();
    populateModal();
    }

function quoteGen() {
    let currentQuote = Math.floor(Math.random() * quotesFiltered.length);
    let quote = document.getElementById("quote");
    console.log(quotesFiltered);
    let quoteText = quotesFiltered[currentQuote].quote;
    let firstChar = quoteText[0];
    let lastChar = quoteText[quotesFiltered[currentQuote].quote.length-2]
    
    if ((firstChar == firstChar.toLowerCase() && firstChar != firstChar.toUpperCase()) ||
            ((firstChar != '“' && firstChar != '"') && !firstChar.match(/^[a-z0-9]+$/i))) {
        quote.textContent = `"..${quoteText}`
    } else quote.textContent = `"${quoteText}`;
    
    if (lastChar != '.') {
        quote.textContent = `${quote.textContent}.."`
    } else quote.textContent = `${quote.textContent}"`

    document.getElementById("authorBook").textContent = quotesFiltered[currentQuote].author +
            ": " + quotesFiltered[currentQuote].book;
    
}

function populateModal() {
    let textDiv = document.getElementById("modalTextDiv");
}

function checkboxChange(checkboxElement) {

    let thisArray = document.getElementsByClassName(checkboxElement.classList[1]);
    let book = thisArray[2].innerText.replace(/ /g, '');

    if(!thisArray[0].checked) {
        if(allowedBooksModal.includes(book)) {
            console.log(`Unchecked...   Book: ${book} allowedBooksModal: ${allowedBooksModal} index: ${allowedBooksModal.indexOf(book)}`);
            allowedBooksModal.splice(allowedBooksModal.indexOf(book), 1);
        }
    } 
    else if (thisArray[0].checked && !allowedBooksModal.includes(book)) {
        allowedBooksModal.push(book);
        console.log(`Checked...   Book: ${book} allowedBooksModal: ${allowedBooksModal}`);
    }

}

function bookSelect () {

    modal.style.display = "flex";
    allowedBooksModal = allowedBooks;
    let uniqueBooks = Array.from(new Set(quotes.map(item => item.book)))
        .map(book => {
            allowedBooks
            return {
                author: quotes.find(item => item.book == book).author,
                book: book
            };
        });

    tableGen(uniqueBooks.length, uniqueBooks);
    
}

function tableGen(length, uniqueBooks) {
    console.log("WAKA");
    let table = document.getElementById('modalTable');
    
    let numRows = Array.from(document.getElementsByClassName('inputModal')).length;
    console.log(numRows);
    if (numRows > 0) return;
    
    for(let i = 0; i < length; i++) {
        let row = document.createElement("tr");
        let checkboxCell = document.createElement("td");
        let input = document.createElement("input");
        let authorCell = document.createElement("td");
        let bookCell = document.createElement("td");

        input.type = "checkbox";
        input.checked = 1;

        input.id = `inputElement${i}`;
        authorCell.id = `authorElement${i}`;
        bookCell.id = `bookElement${i}`;

        input.classList.add("inputModal", `modalElement${i}`);
        authorCell.classList.add("authorModal", `modalElement${i}`);
        bookCell.classList.add("bookModal", `modalElement${i}`);
        
        authorCell.innerText = uniqueBooks[i].author;
        bookCell.innerText = uniqueBooks[i].book;   
        
        checkboxCell.appendChild(input);
        row.appendChild(checkboxCell);
        row.appendChild(authorCell);
        row.appendChild(bookCell);
        table.appendChild(row);
    }

    Array.from(document.body.getElementsByClassName("inputModal")).forEach(element => element
        .addEventListener( 'click', function ( event ) {
        //console.log(event.srcElement.classList[0]);
        if(event.srcElement.classList[0] == 'inputModal') {
          checkboxChange(event.target);
        };
      })
    );
}

function saveSelection() {
    if (allowedBooksModal.length === 0) {
        alert("Please select at least one book.")
    } else {
        console.log(`Saved: ${allowedBooksModal}`);
        allowedBooks = allowedBooksModal;
        let allowedBooksTemp = [];

        allowedBooksModal.forEach(element => {
            //console.log(element);
            allowedBooksTemp.push(element.replace(/ /g, ''));
        });
        //console.log(`allowed Books Temp: ${allowedBooksTemp}`);
        //console.log(`Quote: ${quotes[0].book.replace(/ /g, '')} In banedBooksTemp: ${allowedBooksTemp.includes(quotes[0].book.replace(/ /g, ''))}`)
        quotesFiltered = quotes.filter(function(obj) {

            //console.log(`Object.book.trim(): "${obj.book.replace(/ /g, '')}"  element: "${element.replace(/ /g, '')}"   Comparison: ${obj.book.replace(/ /g, '') === element.replace(/ /g, '')}`);
            
            return allowedBooksTemp.includes(obj.book.replace(/ /g, ''));
        });
            
        
        modal.style.display = "none";
        //console.log(quotesFiltered);
        quoteGen();
        //console.log(mainChunks);
        //console.log(Object.fromEntries(mainChunks));
    }
}

function cancelSelection() {
    modal.style.display = "none";
    console.log(`before process: ${allowedBooks}`);    
        allowedBooksModal = allowedBooks;
    let allowedBooksTemp = [];
    allowedBooksModal.forEach(element => {
        allowedBooksTemp.push(element.replace(/ /g, ''));
    });
    //console.log(allowedBooksTemp);
    Array.from(document.body.getElementsByClassName("inputModal")).forEach(element => {
        let tableRow = document.getElementsByClassName(element.classList[1]);
        //console.log(tableRow)
        let book = tableRow[2].innerText.replace(/ /g, '');

        // if (element.checked && !allowedBooksTemp.includes(book)) {
        //     element.checked = 0;
        // } else if (!element.checked && allowedBooksTemp.includes(book)) element.checked = 1;

        //console.log(`allowedBooks: ${allowedBooks} book: ${book}`);

        // if(!thisArray[0].checked) {
        //     if(allowedBooksModal.includes(book)) {
        //         console.log(`Unchecked...   Book: ${book} allowedBooksModal: ${allowedBooksModal} index: ${allowedBooksModal.indexOf(book)}`);
        //         allowedBooksModal.splice(allowedBooksModal.indexOf(book), 1);
        //     }
        // } 
        // else if (thisArray[0].checked && !allowedBooksModal.includes(book)) {
        //     allowedBooksModal.push(book);
        //     console.log(`Checked...   Book: ${book} allowedBooksModal: ${allowedBooksModal}`);
        // }   
    });
    console.log(`After process: ${allowedBooks}`);
    // console.log(quotesFiltered);
    // console.log();
    quotes = [];
};

function selectAll() {
    Array.from(document.body.getElementsByClassName("inputModal")).forEach(function(element) {
        
        element.checked = 1;
        let book = Array.from(
            document.body.getElementsByClassName(element.classList[element.classList.length-1]))[2]
            .innerText
            .replace(/ /g, '');
    
        //console.log(book);

        if(allowedBooksModal.includes(book)) {console.log(`List already includes this book! ${allowedBooksModal}`);console.log(allowedBooksModal);return;   }
        else {allowedBooksModal.push(book); console.log(`Book added to list! ${allowedBooksModal}`);console.log(allowedBooksModal);}
    });
    console.log(allowedBooksModal);
}

function deselectAll() {
    Array.from(document.body.getElementsByClassName("inputModal")).forEach(function(element) {
        
        element.checked = 0;
        let book = Array.from(
            document.body.getElementsByClassName(element.classList[element.classList.length-1]))[2]
            .innerText
            .replace(/ /g, '');
    
        //console.log(book);

        if(allowedBooksModal.includes(book)) {allowedBooksModal.splice(allowedBooksModal.indexOf(book), 1);}
            //console.log(`Book removed! ${allowedBooksModal}`); console.log(allowedBooksModal); console.log(allowedBooksModal);}
        else { return; } //console.log(`Book not in list! ${allowedBooksModal}`); console.log(allowedBooksModal);
    });
    console.log(allowedBooksModal);
}

readTextFile("http://127.0.0.1:5501/allClippings.txt");


// let getFontSize = (textLength) => {

    //     let textSize = 1.5;
    //     const maxLen = 325;
    //     const maxSize = 1.5;
    
    //     if (textLength < 325) return `${textSize}vw`;
    //     textSize = (maxLen/textLength) * maxSize;
    //     if (textSize < 1) textSize = 1;
    //     return `${textSize}em`
    //   }

//IDEAS

//Save user's filtered list to cache.

//Use this: 'Object.fromEntries(mainChunks)' to simplify the initial parsing process.

//Improve look and feel of landing page.

//On Modal Cancel I must reset the buttons to what is in allowedBooks so that, when reopening, only the actually selected
// books are ticked.

//Find where books are being added to allowedBooks even when cancelled is pressed, for books should only be added to
// this list after Save is clicked.

//Add document.onReady JS equivalent to generate modal so that it isn't regerated each time you click the modal.