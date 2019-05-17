let actuelR = 0;
let actuelG = 0;
let actuelB = 0;
let actuelIntensite = 255;
let listObjToRotate = "";
let actuelleVitesseRotation = 1;
let sliderVitesseRotation = document.getElementById("sliderVitesseRotation");
sliderVitesseRotation.addEventListener("input", changerVitesseRotation);
//*********************** Create scene ******************************
let selectObjRotate = document.getElementById("selectObjRotate");
let scene = new THREE.Scene();
let chargerOBJ = new THREE.OBJLoader();
let threeLargeur = 500;
let threeHauteur = 507;
let renderer = new THREE.WebGLRenderer();
let nbObjects = 0;
let lumiereActuelle = "ambient";
let vueObjetsActuelle = "filled";
renderer.setSize(threeLargeur,threeHauteur);
renderer.setClearColor('rgb(100,100,100)');
container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );

// Etape 2 : ajouter une caméra
let camera = new THREE.PerspectiveCamera( 70, threeLargeur/threeHauteur, 0.1, 1000 );
camera.position.set(-3, 1, 0);
// contrôle à la souris
let controls = new THREE.TrackballControls( camera, container );

// Etape 3 : ajouter une lumière ambiante

function lumiereAmbiante(){
    removeLight();
    let lumiere = new THREE.AmbientLight('rgb('+actuelR+','+actuelG+','+actuelB+')');
    lumiere.intensity = actuelIntensite/100;
    scene.add( lumiere );
    lumiereActuelle = "ambient";
    lumiere.name = "light";
    if(inChildren(lumiere.name) === false) {
        addObjRotate(lumiere.name);
    }
}

function lumierePonctuelle(){
    removeLight();
    let lumiere = new THREE.PointLight('rgb('+actuelR+','+actuelG+','+actuelB+')', 1, 100);
    lumiere.position.set( -5, 5, 5 );
    lumiere.intensity = actuelIntensite/100;
    scene.add( lumiere );
    lumiereActuelle = "ponctuelle";
    lumiere.name = "light";
    if(inChildren(lumiere.name) === false) {
        addObjRotate(lumiere.name);
    }
}
lumiereAmbiante();

function inChildren(value){
    for(var i=0; i<selectObjRotate.children.length; i++){
        if(selectObjRotate.children[i].value === value){
            return true;
        }
    }
    return false;
}

function removeLight(){
    for(let i=0; i<scene.children.length; i++){
        if(scene.children[i].name === "light"){
            scene.remove(scene.children[i]);
            break;
        }
    }
}

function mettreAJourCouleurLumiere(){
    if (lumiereActuelle === "ambient"){
        lumiereAmbiante();
    }else{
        lumierePonctuelle();
    }
}

let boutonCreerOBJ = document.getElementById("boutonCreerOBJ");
let boutonRemplacerOBJ = document.getElementById("boutonRemplacerOBJ");
boutonCreerOBJ.addEventListener("click", creerOBJ);
boutonRemplacerOBJ.addEventListener("click", remplacerOBJ);
let objTexte = document.getElementById("objTexte");


function effacerScene3D(){
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    majSelectObjRotate();
}

function remplacerOBJ() {
    effacerScene3D();
    nbObjects = 0;
    creerOBJ();
    majSelectObjRotate();
}

// display object write in textarea
function creerOBJ()
{
    var objURL = 'data:text/plain;charset=utf-8;base64,' + btoa(objTexte.value);
    chargerOBJ.load(objURL, function ( object ) {
        switch (vueObjetsActuelle) {
            case "filled": break;
            case "wireframe": object.children[0].material.wireframe = true; break;
            case "vertex" : break;
        }
        scene.add( object );
        object.name = "object_" + nbObjects;
        nbObjects += 1;
        addObjRotate(object.name);
        positionCamera();
    });
}

function positionCamera(){
    let idx = setInterval(()=>{
        try{
            var sphere = scene.children[0].children[0].geometry.boundingSphere;
            camera.position.set(sphere.center.x, sphere.center.y, sphere.center.z);
            clearInterval(idx);
        }catch (e) {
            // console.log(e);
        }
    },1);
}

function transformFilled(){
    vueObjetsActuelle = "filled";
    for (let i=0; i<scene.children.length; i++){
        let object = scene.children[i];
        if(object.name.split("_")[0] === "object"){
            object.children[0].material.wireframe = false
        }
    }
}

function transformWireframe(){
    vueObjetsActuelle = "wireframe";
    for (let i=0; i<scene.children.length; i++){
        let object = scene.children[i];
        if(object.name.split("_")[0] === "object"){
            object.children[0].material.wireframe = true
        }
    }
}

function transformVertex(){
    vueObjetsActuelle = "vertex";
}

function addObjRotate(nameOption) {
    var option = document.createElement("option");
    option.value = nameOption;
    option.innerHTML = nameOption;
    selectObjRotate.appendChild(option);
}

function majSelectObjRotate(){
    while (selectObjRotate.children.length > 0){
        selectObjRotate.remove(selectObjRotate.children[0]);
    }
    for(var i=0; i<scene.children.length; i++){
        var nameOption = scene.children[i].name;
        addObjRotate(nameOption);
    }
}
majSelectObjRotate();

function changerVitesseRotation(event) {
    let vitesseRotation = document.getElementById("vitesseRotation");
    vitesseRotation.innerHTML = event.target.value;
    actuelleVitesseRotation = event.target.value;
}

function objectToRotate(){
    let selectObjRotate = document.getElementById("selectObjRotate");
    listObjToRotate = selectObjRotate.value;
}

function avanceRotation(){
    if(listObjToRotate !== ""){
        for(var i=0; i<scene.children.length; i++){
            if(scene.children[i].name === listObjToRotate){
                var object = scene.children[i];
                break;
            }
        }
        if(object.name === "light"){

        }else{
            object.rotation.z += actuelleVitesseRotation/100;
        }
    }
}

// Faire le rendu de la scène à partir de votre caméra
renderer.render( scene, camera );
function animer(){
    avanceRotation();
    requestAnimationFrame( animer );
    renderer.render( scene, camera );
    controls.update();
}
animer();
//********************************************************************

//********************* Sliders change colors light *****************
let sliderR = document.getElementById("sliderR");
let sliderG = document.getElementById("sliderG");
let sliderB = document.getElementById("sliderB");
let sliderIntensite = document.getElementById("sliderIntensite");
sliderR.addEventListener("input", changerR);
sliderG.addEventListener("input", changerG);
sliderB.addEventListener("input", changerB);
sliderIntensite.addEventListener("input", changerIntensite);


function changerR(event){
    let valeurR = document.getElementById("valeurR");
    valeurR.innerHTML = event.target.value;
    mettreAJourCouleurRGB();
}
function changerG(event){
    let valeurG = document.getElementById("valeurG");
    valeurG.innerHTML = event.target.value;
    mettreAJourCouleurRGB();
}
function changerB(event){
    let valeurB = document.getElementById("valeurB");
    valeurB.innerHTML = event.target.value;
    mettreAJourCouleurRGB();
}
function changerIntensite(event){
    let valeurIntensite = document.getElementById("valeurIntensite");
    valeurIntensite.innerHTML = event.target.value + "%";
    mettreAJourIntensite();
}

function mettreAJourCouleurRGB(){
    let sliderR = document.getElementById("sliderR");
    let sliderG = document.getElementById("sliderG");
    let sliderB = document.getElementById("sliderB");
    let couleurdiv = document.getElementById("couleurdiv");
    couleurdiv.style.backgroundColor ="rgb("+sliderR.value+","+sliderG.value+","+sliderB.value+")";
    actuelR = sliderR.value;
    actuelG = sliderG.value;
    actuelB = sliderB.value;
    mettreAJourCouleurLumiere();
}

function mettreAJourIntensite(){
    let sliderIntensite = document.getElementById("sliderIntensite");
    actuelIntensite = 255*sliderIntensite.value/100;
    mettreAJourCouleurLumiere();
}

//*******************************************************************

