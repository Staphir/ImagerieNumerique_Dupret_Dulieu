let actuelR = 0;
let actuelG = 0;
let actuelB = 0;
let actuelA = 255;
//*********************** Create scene ******************************
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
    lumiere.intensity = 0.5;
    scene.add( lumiere );
    lumiereActuelle = "ambient";
    lumiere.name = "light";
}

function lumierePonctuelle(){
    removeLight();
    let lumiere = new THREE.PointLight('rgb('+actuelR+','+actuelG+','+actuelB+')', 1, 100);
    lumiere.position.set( -5, 5, 5 );
    scene.add( lumiere );
    lumiereActuelle = "ponctuelle";
    lumiere.name = "light";
}
lumiereAmbiante();

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
}

function remplacerOBJ() {
    effacerScene3D();
    creerOBJ();
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
        positionCamera()
    });
}

function positionCamera(){
    let idx = setInterval(()=>{
        try{
            var sphere = scene.children[0].children[0].geometry.boundingSphere;
            camera.position.set(sphere.center.x, sphere.center.y, sphere.center.z + sphere.radius);
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

// Faire le rendu de la scène à partir de votre caméra
renderer.render( scene, camera );
function animer(){
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
let sliderA = document.getElementById("sliderA");
sliderR.addEventListener("input", changerR);
sliderG.addEventListener("input", changerG);
sliderB.addEventListener("input", changerB);
sliderA.addEventListener("input", changerA);


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
    actuelR = sliderR.value;
    actuelG = sliderG.value;
    actuelB = sliderB.value;
    actuelA = 255*sliderA.value/100;
    mettreAJourCouleurLumiere();
}

//*******************************************************************

