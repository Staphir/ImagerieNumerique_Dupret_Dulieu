let sliderR = document.getElementById("sliderR");
let sliderG = document.getElementById("sliderG");
let sliderB = document.getElementById("sliderB");
let sliderA = document.getElementById("sliderA");
sliderR.addEventListener("input", changerR);
sliderG.addEventListener("input", changerG);
sliderB.addEventListener("input", changerB);
sliderA.addEventListener("input", changerA);
let actuelR = 0;
let actuelG = 0;
let actuelB = 0;
let actuelA = 255;


function changerR(event){
    let valeurR = document.getElementById("valeurR");
    valeurR.innerHTML = event.target.value;
    mettreAJourCouleurRGBA();
}
function changerG(event){
    let valeurG = document.getElementById("valeurG");
    valeurG.innerHTML = event.target.value;
    mettreAJourCouleurRGBA();
}
function changerB(event){
    let valeurB = document.getElementById("valeurB");
    valeurB.innerHTML = event.target.value;
    mettreAJourCouleurRGBA();
}
function changerA(event){
    let valeurA = document.getElementById("valeurA");
    valeurA.innerHTML = event.target.value;
    mettreAJourCouleurRGBA();
}

function mettreAJourCouleurRGBA(){
    let sliderR = document.getElementById("sliderR");
    let sliderG = document.getElementById("sliderG");
    let sliderB = document.getElementById("sliderB");
    let sliderA = document.getElementById("sliderA");
    let couleurdiv = document.getElementById("couleurdiv");
    couleurdiv.style.backgroundColor ="rgba("+sliderR.value+","+sliderG.value+","+sliderB.value+","+sliderA.value/100+")";
    let couleurActuel = document.getElementById("couleurActuel");
    couleurActuel.style.backgroundColor ="rgba("+sliderR.value+","+sliderG.value+","+sliderB.value+","+sliderA.value/100+")";
    actuelR = sliderR.value;
    actuelG = sliderG.value;
    actuelB = sliderB.value;
    actuelA = 255*sliderA.value/100;
}

function remplirCanvas(){
    for(i=0;i<imageCanvas.width;i++){
        for(j=0;j<imageCanvas.height;j++){
            index = calculerIndex(i, j, imageCanvas.width);
            imageDonnees.data[index] = actuelR;
            imageDonnees.data[index+1] = actuelG;
            imageDonnees.data[index+2] = actuelB;
            imageDonnees.data[index+3] = actuelA;
        }
    }
    imageContexte.putImageData(imageDonnees,0,0);
}


let imageCanvas = document.getElementById("image2D");
let imageContexte = imageCanvas.getContext("2d");
let imageDonnees = imageContexte.getImageData(0, 0, imageCanvas.width, imageCanvas.height);

function calculerIndex(x, y, largeur){
    return x*4 + (y*largeur*4)
}