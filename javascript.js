
// Add event listeners to the buttons contained on the main page and within the modal
document.getElementById("quoteGen").addEventListener("click", quoteGen);
document.getElementById("bookSelect").addEventListener("click", bookSelect);
document.getElementById("buttonSave").addEventListener("click", saveSelection);
document.getElementById("buttonCancel").addEventListener("click", cancelSelection);
document.getElementById("buttonSelectAll").addEventListener("click", selectAll);
document.getElementById("buttonDeselectAll").addEventListener("click", deselectAll);

let modal = document.getElementsByClassName("modal")[0];
let bannedBooks = [];
let bannedBooksModal = []
let quotes = [];
let quotesFiltered = [];
let chunkedText;

let getFontSize = (textLength) => {

    let textSize = 1.5;
    const maxLen = 325;
    const maxSize = 1.5;

    if (textLength < 325) return `${textSize}vw`;
    textSize = (maxLen/textLength) * maxSize;
    if (textSize < 1) textSize = 1;
    return `${textSize}em`
  }

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
            chunkedText[i][0][1][1]= chunkedText[i][0][1][1].substring(0, chunkedText[i][0][1][1].length-2).trim();
            chunkedText[i][0][1] = `${chunkedText[i][0][1][1]} ${chunkedText[i][0][1][0]}`;

        // Else we simply remove the closing bracket from the string.
        } else chunkedText[i][0][1] = chunkedText[i][0][1].substring(0, chunkedText[i][0][1].length-2);

        quotes.push({"author": chunkedText[i][0][1], "book": chunkedText[i][0][0], "quote": chunkedText[i][2]})
        quotesFiltered.push({"author": chunkedText[i][0][1], "book": chunkedText[i][0][0], "quote": chunkedText[i][2]})

    }   

    quoteGen();
    populateModal();
    }

function quoteGen() {
    let currentQuote = Math.floor(Math.random() * quotesFiltered.length-1);
    let quote = document.getElementById("quote");

    //console.log(quotesFiltered);
    quote.textContent = quotesFiltered[currentQuote].quote;
    quote.style.fontSize = getFontSize(quote.textContent.length);
    document.getElementById("author").textContent = quotesFiltered[currentQuote].author;
    document.getElementById("book").textContent = quotesFiltered[currentQuote].book;
}

function populateModal() {
    let textDiv = document.getElementById("modalTextDiv");
}

function checkboxChange(checkboxElement) {

    let thisArray = document.getElementsByClassName(checkboxElement.classList[1]);
    let book = thisArray[2].innerText.replace(/ /g, '');
    console.log(`bannedBooksModal before action: ${bannedBooksModal}`);

    if(!thisArray[0].checked) {
        if(bannedBooksModal.includes(book)) {
            console.log(`Unchecked...   Book: ${book} bannedBooksModal: ${bannedBooksModal} index: ${bannedBooksModal.indexOf(book)}`);
            bannedBooksModal.splice(bannedBooksModal.indexOf(book), 1);
        }
    } 
    else if (thisArray[0].checked && !bannedBooksModal.includes(book)) {
        bannedBooksModal.push(book);
        console.log(`Checked...   Book: ${book} bannedBooksModal: ${bannedBooksModal}`);
    }
    console.log(`bannedBooksModal after action: ${bannedBooksModal}`);
    console.log('');

}

function bookSelect () {

    modal.style.display = "flex";
    bannedBooksModal = bannedBooks;
    //bannedBooks = bannedBooksModal;
    //console.log(quotes.length);
    let uniqueBooks = Array.from(new Set(quotes.map(item => item.book)))
        .map(book => {
            return {
                author: quotes.find(item => item.book == book).author,
                book: book
            };
        });

    tableGen(uniqueBooks.length, uniqueBooks);
    
}

function tableGen(length, uniqueBooks) {

    let table = document.getElementById('modalTable');

    for(let i = 0; i < length; i++) {
        let row = document.createElement("tr");
        let checkboxCell = document.createElement("td");
        let input = document.createElement("input");
        let authorCell = document.createElement("td");
        let bookCell = document.createElement("td");

        input.type = "checkbox";
        input.checked = 0;

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
    if (bannedBooksModal.length === 0) {
        alert("Please select at least one book.")
    } else {
        bannedBooks = bannedBooksModal;
        let bannedBooksTemp = [];

        bannedBooksModal.forEach(element => {
            //console.log(element);
            bannedBooksTemp.push(element.replace(/ /g, ''));
        });
        //console.log(`Banned Books Temp: ${bannedBooksTemp}`);
        //console.log(`Quote: ${quotes[0].book.replace(/ /g, '')} In banedBooksTemp: ${bannedBooksTemp.includes(quotes[0].book.replace(/ /g, ''))}`)
        quotesFiltered = quotes.filter(function(obj) {

            //console.log(`Object.book.trim(): "${obj.book.replace(/ /g, '')}"  element: "${element.replace(/ /g, '')}"   Comparison: ${obj.book.replace(/ /g, '') === element.replace(/ /g, '')}`);
            
            return bannedBooksTemp.includes(obj.book.replace(/ /g, ''));
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
    //console.log(bannedBooksModal);
    bannedBooksModal = bannedBooks;
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

        if(bannedBooksModal.includes(book)) {console.log(`List already includes this book! ${bannedBooksModal}`);console.log(bannedBooksModal);return;   }
        else {bannedBooksModal.push(book); console.log(`Book added to list! ${bannedBooksModal}`);console.log(bannedBooksModal);}
    });
    //console.log(bannedBooksModal);
}

function deselectAll() {
    Array.from(document.body.getElementsByClassName("inputModal")).forEach(function(element) {
        
        element.checked = 0;
        let book = Array.from(
            document.body.getElementsByClassName(element.classList[element.classList.length-1]))[2]
            .innerText
            .replace(/ /g, '');
    
        //console.log(book);

        if(bannedBooksModal.includes(book)) {bannedBooksModal.splice(bannedBooksModal.indexOf(book), 1);}
            //console.log(`Book removed! ${bannedBooksModal}`); console.log(bannedBooksModal); console.log(bannedBooksModal);}
        else {console.log(`Book not in list! ${bannedBooksModal}`); console.log(bannedBooksModal); return; }
    });
    //console.log(bannedBooksModal);
}

readTextFile("http://127.0.0.1:5501/allClippings.txt");


//IDEAS

//Save user's filtered list to cache.

//Use this: 'Object.fromEntries(mainChunks)' to simplify the initial parsing process.

//Improve look and feel of landing page.