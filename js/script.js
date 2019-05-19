let actuelR = 0;
let actuelG = 0;
let actuelB = 0;
let actuelIntensite = 255;
let listObjToRotate = "";
let actuelleVitesseRotationX = 1;
let sliderVitesseRotationX = document.getElementById("sliderVitesseRotationX");
sliderVitesseRotationX.addEventListener("input", changerVitesseRotationX);
let actuelleVitesseRotationY = 1;
let sliderVitesseRotationY = document.getElementById("sliderVitesseRotationY");
sliderVitesseRotationY.addEventListener("input", changerVitesseRotationY);
let actuelleVitesseRotationZ = 1;
let sliderVitesseRotationZ = document.getElementById("sliderVitesseRotationZ");
sliderVitesseRotationZ.addEventListener("input", changerVitesseRotationZ);
//*********************** Create scene ******************************
let selectObjRotate = document.getElementById("selectObjRotate");
let scene = new THREE.Scene();
let chargerOBJ = new THREE.OBJLoader();
let threeLargeur = 500;
let threeHauteur = 507;
let renderer = new THREE.WebGLRenderer();
let nbObjects = 0;
let nbVertex = 0;
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

function mettreAJourLumiere(){
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
    mettreAJourLumiere();
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
        scene.add( object );
        object.name = "object_" + nbObjects;
        nbObjects += 1;
        addObjRotate(object.name);
        positionCamera();
        object.children[0].geometry.vertices = [];
        var objVertices = object.children[0].geometry.vertices;
        selectVertices(objVertices);
        switch (vueObjetsActuelle) {
            case "filled": break;
            case "wireframe": object.children[0].material.wireframe = true; break;
            case "vertex" : transformVertex(); break;
        }
    });
}

function selectVertices(objVertices) {
    var splitV = objTexte.value.split("v");
    var arrayVertexUses = vertexUses();
    for (var i=1; i<splitV.length; i++){
        if(arrayVertexUses.indexOf(i) !== -1){
            var splitCoord = splitV[i].split(" ");
            objVertices.push(new THREE.Vector3(parseFloat(splitCoord[1]),parseFloat(splitCoord[2]),parseFloat(splitCoord[3])));
        }
    }
}

function vertexUses() {
    var arrayNumVertexes = [];
    var splitF = objTexte.value.split("f");
    for(var i=1; i<splitF.length; i++){
        var splitNumV = splitF[i].split(" ");
        console.log(splitNumV);
        for(var j=1; j<splitNumV.length; j++){
            arrayNumVertexes.push(parseInt(splitNumV[j]));
            console.log(splitNumV[j]+"\n"+arrayNumVertexes);
        }
    }
    console.log(arrayNumVertexes);
    return arrayNumVertexes
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
    deleteVertex();
    for (let i=0; i<scene.children.length; i++){
        let object = scene.children[i];
        if(object.name.split("_")[0] === "object"){
            object.visible = true;
            object.children[0].material.wireframe = false
        }
    }
}

function transformWireframe(){
    vueObjetsActuelle = "wireframe";
    deleteVertex();
    for (let i=0; i<scene.children.length; i++){
        let object = scene.children[i];
        if(object.name.split("_")[0] === "object"){
            object.visible = true;
            object.children[0].material.wireframe = true
        }
    }
}

function transformVertex(){
    vueObjetsActuelle = "vertex";
    for (let i=0; i<scene.children.length; i++){
        let object = scene.children[i];
        if(object.name.split("_")[0] === "object"){
            toVertex(object);
            object.visible = false;
        }
    }
}

function toVertex(obj){
    objVertices = obj.children[0].geometry.vertices;
    for (var i=0; i<objVertices.length; i++){
        var geometry = new THREE.SphereGeometry( 0.02, 32, 32 );
        geometry.translate(objVertices[i].x,objVertices[i].y,objVertices[i].z);
        geometry.name = "vertex_" + nbVertex;
        nbVertex += 1;
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var pointVertex = new THREE.Mesh( geometry, material );
        scene.add( pointVertex );
    }
}

function deleteVertex() {
    recul = 0;
    len = scene.children.length;
    for (var i=0; i<len; i++){
        try {
            if(scene.children[i-recul].geometry.name.split("_")[0] === "vertex"){
                scene.children.splice(i-recul,1);
                recul++;
            }
        }catch (e) {
            // console.log(e);
        }
    }
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

function changerVitesseRotationX(event) {
    let vitesseRotationX = document.getElementById("vitesseRotationX");
    vitesseRotationX.innerHTML = event.target.value;
    actuelleVitesseRotationX = event.target.value;
}

function changerVitesseRotationY(event) {
    let vitesseRotationY = document.getElementById("vitesseRotationY");
    vitesseRotationY.innerHTML = event.target.value;
    actuelleVitesseRotationY = event.target.value;
}

function changerVitesseRotationZ(event) {
    let vitesseRotationZ = document.getElementById("vitesseRotationZ");
    vitesseRotationZ.innerHTML = event.target.value;
    actuelleVitesseRotationZ = event.target.value;
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
            object.rotation.x += actuelleVitesseRotationX/100;
            object.rotation.y += actuelleVitesseRotationY/100;
            object.rotation.z += actuelleVitesseRotationZ/100;
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
    mettreAJourLumiere();
}

function mettreAJourIntensite(){
    let sliderIntensite = document.getElementById("sliderIntensite");
    actuelIntensite = 255*sliderIntensite.value/100;
    mettreAJourLumiere();
}

//*******************************************************************

