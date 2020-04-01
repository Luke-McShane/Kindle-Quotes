document.getElementById("generateQuote").addEventListener("click", quoteGen);
document.getElementById("selectBooks").addEventListener("click", bookSelect);
document.getElementById("saveButton").addEventListener("click", saveSelection);
document.getElementById("cancelButton").addEventListener("click", cancelSelection);

// Get the modal
var modal = document.getElementsByClassName("modal")[0];


let totalQuotes = 0;
let mainChunks;
let naughtyArray = [];

let getFontSize = (textLength) => {
    //console.log(textLength);
    let textSize = 1.5;
    if (textLength < 325) return `${textSize}vw`;

    const maxLen = 325;
    const maxSize = 1.5;
    console.log(textLength);
    textSize = (maxLen/textLength) * maxSize;
    if (textSize < 1) textSize = 1;
    console.log(textSize);
    console.log('');
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
//readTextFile("http://127.0.0.1:5501/test2.txt");
readTextFile("http://127.0.0.1:5501/allClippings.txt");

function parseClippings(text) {
    mainChunks = text.split("==========");
    totalQuotes = mainChunks.length-1;
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
    }   

    quoteGen();
    populateModal();
}

function quoteGen() {
    let currentQuote = Math.floor(Math.random() * totalQuotes);
    let quote = document.getElementById("quote");
    //console.log(mainChunks[currentQuote]);
    quote.textContent = mainChunks[currentQuote][2];
    quote.style.fontSize = getFontSize(quote.textContent.length);
    document.getElementById("author").textContent = mainChunks[currentQuote][0][0];
    document.getElementById("book").textContent = mainChunks[currentQuote][0][1];
}

function populateModal() {
    let textDiv = document.getElementById("modalTextDiv");

}

function bookSelect () {
    modal.style.display = "flex";
}

function saveSelection() {

}

function cancelSelection() {
    modal.style.display = "none";
}