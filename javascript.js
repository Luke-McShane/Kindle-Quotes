//document.getElementById("generateQuote").addEventListener("click", quoteGen);
//document.getElementById("selectBooks").addEventListener("click", bookSelect);
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
readTextFile("http://127.0.0.1:5501/test.txt");

function parseClippings(text) {
    let mainChunks = text.split("==========");
    //console.log(mainChunks);
    for(let i=0; i<mainChunks.length;i++) {
       //mainChunks[i] = mainChunks[i].split(/(\r\n|\n|\r)/gm);
       mainChunks[i] = mainChunks[i].split("\n");
     
       for(let j=0; j<mainChunks[i].length; j++) {
        if ( mainChunks[i][j].includes("- Your Highlight on page")){
            mainChunks[i].splice(j, 1);
         } else if (mainChunks[i][j].length <= 4) {
            mainChunks[i].splice(j, 1);
         };
        }
    }
    mainChunks.pop();
    //console.log(mainChunks);
    for(let i=0; i<mainChunks.length; i++){
        //console.log(mainChunks[i][0]);
        mainChunks[i][0] = mainChunks[i][0].split("(");
        //console.log(mainChunks[i][0][1].substring(0, mainChunks[i][0][1].length-2));
        mainChunks[i][0][1] = mainChunks[i][0][1].substring(0, mainChunks[i][0][1].length-2);
        //console.log(mainChunks[i][0]);
}
console.log(mainChunks[1][2]);
document.getElementById("quote").textContent = mainChunks[2][2];
document.getElementById("author").textContent = mainChunks[2][0][0];
document.getElementById("book").textContent = mainChunks[2][0][1];
    //console.log(mainChunks[1].split(/(\r\n|\n|\r)/gm));
    
    // mainChunks.forEach(chunk => {
    //     let secondSplit = chunk.split(/(\r\n|\n|\r)/gm);
    //     //secondSplit = secondSplit.replace(/(\r\n|\n|\r)/gm, "<br />");
       
    //     // secondSplit.forEach(element => {
    //     //     element = element.replace(/(\r\n|\n|\r)/gm, "<br />");
    //     // })
    //     console.log(secondSplit);
    //     for(let i=0; i<secondSplit.length; i++) {
    //         //console.log(secondSplit[i]);
    //         //console.log(`${secondSplit[i]} Length: ${secondSplit[i].length}`)
    //         //console.log(i);
    //         //console.log(typeof(secondSplit[i]));
    //         // if (secondSplit[i].length <= 4 || secondSplit[i].includes("- Your Highlight on page")) {
    //         //if (secondSplit[i].includes("Your Highlight") || (secondSplit[i].length <= 4)) {
    //         console.log(`Item: ${secondSplit[i]} Length: ${secondSplit[i].length}`)
    //         if ((secondSplit[i].length <= 4)) {
    //             // console.log(secondSplit[i].length);
    //             secondSplit.splice(i,1);
    //         };
    //         if((secondSplit[i].match(/^[0-9a-zA-Z]+$/))) secondSplit.splice(secondSplit[i], 1);
    //     }
    //     //console.log(secondSplit);
    // })
    

}