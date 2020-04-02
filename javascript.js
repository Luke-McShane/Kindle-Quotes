document.getElementById("generateQuote").addEventListener("click", quoteGen);
document.getElementById("selectBooks").addEventListener("click", bookSelect);
document.getElementById("saveButton").addEventListener("click", saveSelection);
document.getElementById("cancelButton").addEventListener("click", cancelSelection);

// Get the modal
var modal = document.getElementsByClassName("modal")[0];
var bannedBooks = [];
var newBannedBooks = []
var allQuotes = [];
let mainChunks;

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
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                parseClippings(allText);
            }
        }
    }
    rawFile.send(null);
}

function parseClippings(text) {
    mainChunks = text.split("==========");
    for(let i=0; i<mainChunks.length;i++) {
       mainChunks[i] = mainChunks[i].split("\n");   
       for(let j=0; j<mainChunks[i].length; j++) {
        if ( mainChunks[i][j].includes("- Your Highlight on page")) {
            mainChunks[i].splice(j, 1);
         } else if (mainChunks[i][j].length <= 4) {
            mainChunks[i].splice(j, 1);
         };
        }
    }

    mainChunks.pop();
    for(let i=0; i<mainChunks.length; i++){
        mainChunks[i][0] = mainChunks[i][0].split("(");
        if(mainChunks[i][0][1].includes(',')) {
            mainChunks[i][0][1] = mainChunks[i][0][1].split(',');
            mainChunks[i][0][1][1]= mainChunks[i][0][1][1].substring(0, mainChunks[i][0][1][1].length-2).trim();
            mainChunks[i][0][1] = `${mainChunks[i][0][1][1]} ${mainChunks[i][0][1][0]}`; 
        } else mainChunks[i][0][1] = mainChunks[i][0][1].substring(0, mainChunks[i][0][1].length-2);

        allQuotes.push({"author": mainChunks[i][0][1], "book": mainChunks[i][0][0], "quote": mainChunks[i][2]})

    }   

    quoteGen();
    populateModal();
    }

function quoteGen() {
    let currentQuote = Math.floor(Math.random() * allQuotes.length-1);
    let quote = document.getElementById("quote");
    quote.textContent = allQuotes[currentQuote].quote;
    quote.style.fontSize = getFontSize(quote.textContent.length);
    document.getElementById("author").textContent = allQuotes[currentQuote].author;
    document.getElementById("book").textContent = allQuotes[currentQuote].book;
}

function populateModal() {
    let textDiv = document.getElementById("modalTextDiv");


}

function bookSelect () {
    modal.style.display = "flex";
    //debugger;
    console.log(allQuotes.length);
    let table = document.getElementById('modalTable');
    //let unique = (allQuotes) => allQuotes.filter((book, i) => allQuotes.indexOf(allQuotes) == i);
    //var myArray = ['a', 1, 'a', 2, '1'];
    //var unique = allQuotes.filter((v, i, a) => a.indexOf(v.book) === i.book); 
    let uniqueBooks = Array.from(new Set(allQuotes.map(item => item.book)))
        .map(book => {
            return {
                author: allQuotes.find(item => item.book == book).author,
                book: book
            };
        });
    console.log(uniqueBooks);
    for(let i = 0; i < uniqueBooks.length; i++) {

        var row = document.createElement("tr");
        var checkboxCell = document.createElement("td");
        var label = document.createElement("label");
        label.id = "checkbox";
        var input = document.createElement("input");
        input.type = "checkbox";
        input.checked = "checked";
        input.add
        var span = document.createElement("span");
        span.classList.add("checkmark")
        var authorCell = document.createElement("td");
        authorCell.id = "authorModal";
        var bookCell = document.createElement("td");
        bookCell.id = "bookModal";

        //row.id = `${i}`;
        authorCell.innerText = uniqueBooks[i].author;
        bookCell.innerText = uniqueBooks[i].book;   
        label.appendChild(input);
        label.appendChild(span);
        checkboxCell.appendChild(label);
        row.appendChild(checkboxCell);
        row.appendChild(authorCell);
        row.appendChild(bookCell);
        table.appendChild(row);
    }
}

function saveSelection() {

}

function cancelSelection() {
    modal.style.display = "none";
    allQuotes = [];
}

readTextFile("http://127.0.0.1:5501/allClippings.txt");