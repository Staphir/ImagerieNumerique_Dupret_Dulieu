/************************Initialisations variables***************************/
//--------Lumières + couleurs (pour la lumière)--------
let actuelR = 0;
let actuelG = 0;
let actuelB = 0;
let actuelIntensite = 100;
let lumiereActuelle = "ambient";

let sliderR = document.getElementById("sliderR");
let sliderG = document.getElementById("sliderG");
let sliderB = document.getElementById("sliderB");

sliderR.addEventListener("input", changerR);
sliderG.addEventListener("input", changerG);
sliderB.addEventListener("input", changerB);

let sliderIntensite = document.getElementById("sliderIntensite");
sliderIntensite.addEventListener("input", changerIntensite);

//-----------------Rotation--------------------------
let activationRotation = false;
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

let selectObjRotate = document.getElementById("selectObjRotate");

//-----------------Création d'objets ---------------------
let nbObjects = 0;
let nbVertex = 0;
let vueObjetsActuelle = "filled";

let chargerOBJ = new THREE.OBJLoader();

let boutonCreerOBJ = document.getElementById("boutonCreerOBJ");
boutonCreerOBJ.addEventListener("click", creerOBJ);

let boutonRemplacerOBJ = document.getElementById("boutonRemplacerOBJ");
boutonRemplacerOBJ.addEventListener("click", remplacerOBJ);

let objTexte = document.getElementById("objTexte");

/***************end Initialisations variables*********************/


/************************Création scene**************************/
let scene = new THREE.Scene();
let threeLargeur = 500;
let threeHauteur = 507;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(threeLargeur,threeHauteur);
renderer.setClearColor('rgb(100,100,100)');
container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );

let camera = new THREE.PerspectiveCamera( 70, threeLargeur/threeHauteur, 0.1, 1000 );
camera.position.set(-3, 1, 0);

let controls = new THREE.TrackballControls( camera, container );
/************************end Création scene**************************/

/**********************Exemple objet*************************/

function exemplePyramide() {
    objTexte.value =
        "# sommets\n" +
        "v 0 0 0\n" +
        "v 1 0 0\n" +
        "v 1 1 0\n" +
        "v 0 1 0\n" +
        "v 1 1 1\n" +
        "v 1 0 1\n" +
        "v 0 1 1\n" +
        "v 0 0 1\n" +
        "v 0.5 1 0.5\n" +
        "\n" +
        "# faces\n" +
        "f 6 8 1\n" +
        "f 1 2 6\n" +
        "f 1 9 2\n" +
        "f 8 9 1\n" +
        "f 6 9 8\n" +
        "f 2 9 6";
    remplacerOBJ();
}
function exempleCube() {
    objTexte.value =
        "# sommets\n" +
        "v 0 0 0\n" +
        "v 1 0 0\n" +
        "v 1 1 0\n" +
        "v 0 1 0\n" +
        "v 1 1 1\n" +
        "v 1 0 1\n" +
        "v 0 1 1\n" +
        "v 0 0 1\n" +
        "\n" +
        "# faces\n" +
        "f 1 4 3\n" +
        "f 3 2 1\n" +
        "f 2 3 5\n" +
        "f 5 6 2\n" +
        "f 6 5 7\n" +
        "f 7 8 6\n" +
        "f 8 7 4\n" +
        "f 4 1 8\n" +
        "f 4 7 5\n" +
        "f 5 3 4\n" +
        "f 8 1 2\n" +
        "f 2 6 8";
    remplacerOBJ();
}

/**********************end Exemple objet*************************/

/**************************nouvelle lumière***************************/
function lumiereAmbiante(){
    removeLight();
    //suppression sphere pointLight
    try {
        var index = indexStr("spherePonctuelle");
        supSphere(index);
    }catch (e) {
        // console.log(e);
    }
    let lumiere = new THREE.AmbientLight('rgb('+actuelR+','+actuelG+','+actuelB+')');
    lumiere.intensity = actuelIntensite;
    scene.add( lumiere );
    lumiereActuelle = "ambient";
    lumiere.name = "light";

    //on ne met pas en rotation ce type de lumière
    // if(inChildren(lumiere.name) === false) {
    //     addObjRotate(lumiere.name);
    // }
}

function lumierePonctuelle(){
    removeLight();
    let idx = setInterval(()=>{
        try{
            //suppression sphere pointLight
            try {
                var index = indexStr("spherePonctuelle");
                supSphere(index);
            }catch (e) {
                // console.log(e);
            }
            //récupération sphere englobante
            var index = indexStr("object");
            var sphere = scene.children[index].children[0].geometry.boundingSphere;
            //création lumière et positionnement
            let lumiere = new THREE.PointLight('rgb('+actuelR+','+actuelG+','+actuelB+')', 1, 100);
            lumiere.position.set(sphere.center.x + sphere.radius,sphere.center.y + sphere.radius, sphere.center.z);
            lumiere.intensity = actuelIntensite;
            scene.add( lumiere );
            lumiereActuelle = "ponctuelle";
            lumiere.name = "light";
            //création sphère représentant la lumière
            sphereLumierePonctuelle();
            //arrêt du setInterval
            clearInterval(idx);
        }catch (e) {
            // console.log(e);
        }
    },1);


}

function sphereLumierePonctuelle() {
    let idx = setInterval(()=>{
        try{
            //récupération sphere englobante
            var index = indexStr("object");
            var sphere = scene.children[index].children[0].geometry.boundingSphere;
            //création sphère représentant la lumière
            var geometry = new THREE.SphereGeometry( 0.05, 32, 32 );
            geometry.translate(sphere.center.x + sphere.radius,sphere.center.y + sphere.radius, sphere.center.z);
            var couleur = new THREE.Color('rgb('+actuelR+','+actuelG+','+actuelB+')');
            var material = new THREE.MeshBasicMaterial( {color: couleur} );
            var pointVertex = new THREE.Mesh( geometry, material );
            pointVertex.name = "spherePonctuelle";
            scene.add( pointVertex );
            //arrêt du setInterval
            clearInterval(idx);
        }catch (e) {
            // console.log(e);
        }
    },1);
}

function supSphere(index) {
    let idx = setInterval(()=>{
        try{
            scene.remove(scene.children[index]);
            //arrêt du setInterval
            clearInterval(idx);
        }catch (e) {
            // console.log(e);
        }
    },1);
}

function lumiereSpot(){
    removeLight();

    let idx = setInterval(()=>{
        try{
            //suppression sphere pointLight
            try {
                var index = indexStr("spherePonctuelle");
                supSphere(index);
            }catch (e) {
                // console.log(e);
            }
            //récupération sphere englobante
            var index = indexStr("object");
            var sphere = scene.children[index].children[0].geometry.boundingSphere;
            //création lumière et positionnement
            let lumiere = new THREE.SpotLight('rgb('+actuelR+','+actuelG+','+actuelB+')');
            lumiere.angle = 0.35;
            lumiere.position.set(sphere.center.x + sphere.radius,sphere.center.y, sphere.center.z + sphere.radius);
            lumiere.intensity = actuelIntensite;
            scene.add( lumiere );
            lumiereActuelle = "spot";
            lumiere.name = "light";
            //création spot représentant la lumière
            objectSpot();
            //arrêt du setInterval
            clearInterval(idx);
        }catch (e) {
            // console.log(e);
        }
    },1);
}

function objectSpot() {

}

lumiereAmbiante();

//Vérification dans la liste de rotation (que pour certaines lumières)
function inChildren(value){
    for(var i=0; i<selectObjRotate.children.length; i++){
        if(selectObjRotate.children[i].value === value){
            return true;
        }
    }
    return false;
}
//Retirer toutes les lumières de la scène
function removeLight(){
    for(let i=0; i<scene.children.length; i++){
        if(scene.children[i].name === "light"){
            scene.remove(scene.children[i]);
            break;
        }
    }
}
//Met à jour à chaque fois le type de lumière 
function mettreAJourLumiere(){
    switch (lumiereActuelle) {
        case "ambient": lumiereAmbiante(); break;
        case "ponctuelle": lumierePonctuelle(); break;
        case "spot": lumiereSpot(); break;
    }
}
/***************end nouvelle lumière***************************/


/***************modification couleur-intensité lumière*******************/
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
    actuelIntensite = sliderIntensite.value/100;
    mettreAJourLumiere();
}

/***************end modification couleur-intensité lumière********************/


/********************ajout-remplacement objet********************************/
function effacerScene3D(){
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    //remettre la lumière
    mettreAJourLumiere();
    //remplir la liste des objets pouvants être en rotation
    majSelectObjRotate();
}

function remplacerOBJ() {
    effacerScene3D();
    nbObjects = 0;
    creerOBJ();
    //remplir la liste des objets pouvants être en rotation
    majSelectObjRotate();
}

// display object write in textarea
function creerOBJ()
{
    var objURL = 'data:text/plain;charset=utf-8;base64,' + btoa(objTexte.value);
    chargerOBJ.load(objURL, function ( object ) {
        scene.add( object );
        //pour la sélection de seulement les objets parmis toute la scene (objet_0, objet_1, objet_2...)
        object.name = "object_" + nbObjects;
        nbObjects += 1;
        //ajout du nouvel objet à la liste des objets pouvants être en rotation
        addObjRotate(object.name);
        //positionner la camera sur le nouvel objet
        positionCamera();
        mettreAJourIntensite();
        //---stockage des vertex de l'objet-----
        object.children[0].geometry.vertices = [];
        var objVertices = object.children[0].geometry.vertices;
        selectVertices(objVertices);
        //--------------------------------------
        //mettre le nouvel objet sous la forme des autres (filled, wireframe ou vertex
        switch (vueObjetsActuelle) {
            case "filled": break;
            case "wireframe": object.children[0].material.wireframe = true; break;
            case "vertex" : transformVertex(); break;
        }
    });
}
/**********************end ajout-remplacement objet********************************/


/***************************stock vertex nouvel objet****************************/
function selectVertices(objVertices) {
    //séparation des coordonnées des vertex
    var splitV = objTexte.value.split("v");
    //tableau du numéro des vertex utilisés pour former l'objet
    var arrayVertexUses = vertexUses();
    for (var i=1; i<splitV.length; i++){
        //vérification vertex utilisé pour former l'objet
        if(arrayVertexUses.indexOf(i) !== -1){
            //séparation pour avoir les coordonnées x,y,z du vertex
            var splitCoord = splitV[i].split(" ");
            objVertices.push(new THREE.Vector3(parseFloat(splitCoord[1]),parseFloat(splitCoord[2]),parseFloat(splitCoord[3])));
        }
    }
}

function vertexUses() {
    var arrayNumVertexes = [];
    //séparation des faces
    var splitF = objTexte.value.split("f");
    for(var i=1; i<splitF.length; i++){
        //récupération des numéros des vertex utilisés pour créer la face
        var splitNumV = splitF[i].split(" ");
        for(var j=1; j<splitNumV.length; j++){
            arrayNumVertexes.push(parseInt(splitNumV[j]));
        }
    }
    return arrayNumVertexes
}
/***********************end stock vertex nouvel objet*****************************/


/**********************zoom camera lorsque nouvel objet**************************/
function positionCamera(){
    //test récupération de la sphère englobante toutes les 1ms (javascript = asynchrone)
    let idx = setInterval(()=>{
        try{
            var index = indexStr("object");
            var sphere = scene.children[index].children[0].geometry.boundingSphere;
            //placement de la caméra sur le nouvel objet
            camera.position.set(sphere.center.x + sphere.radius*2, sphere.center.y + sphere.radius*2, sphere.center.z + sphere.radius);
            //arrêt du setInterval
            clearInterval(idx);
        }catch (e) {
            // console.log(e);
        }
    },1);
}
/**********************end zoom camera lorsque nouvel objet***********************/


/*******************transformation filled-wireframe-vertex************************/
function transformFilled(){
    if(vueObjetsActuelle === "vertex"){
        deleteVertex();
    }
    vueObjetsActuelle = "filled";
    // affichage de tous les objets en filled
    for (let i=0; i<scene.children.length; i++){
        let object = scene.children[i];
        //vérification que c'est un objet
        if(object.name.split("_")[0] === "object"){
            object.visible = true;
            object.children[0].material.wireframe = false
        }
    }
}

function transformWireframe(){
    if(vueObjetsActuelle === "vertex"){
        deleteVertex();
    }
    vueObjetsActuelle = "wireframe";
    // affichage de tous les objets en wireframe
    for (let i=0; i<scene.children.length; i++){
        let object = scene.children[i];
        //vérification c'est un objet
        if(object.name.split("_")[0] === "object"){
            object.visible = true;
            object.children[0].material.wireframe = true
        }
    }
}

function transformVertex(){
    vueObjetsActuelle = "vertex";
    // affichage de tous les objets en vertex
    for (let i=0; i<scene.children.length; i++){
        let object = scene.children[i];
        //vérification que c'est un objet
        if(object.name.split("_")[0] === "object"){
            //création des vertex
            toVertex(object);
            object.visible = false;
        }
    }
}

function toVertex(obj){
    objVertices = obj.children[0].geometry.vertices;
    for (var i=0; i<objVertices.length; i++){
        //création d'une sphère jaune avec le nom vertex_x
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
/************end transformation filled - wireframe - vertex***********/


/***********************Rotation objet*******************************/
function majSelectObjRotate(){
    //suppression de la zone d'objets pouvants être en rotation
    while (selectObjRotate.children.length > 0){
        selectObjRotate.remove(selectObjRotate.children[0]);
    }
    //ajout de tous les objets pouvants être en rotation
    for(var i=0; i<scene.children.length; i++){
        var nameOption = scene.children[i].name;
        if(nameOption !== "light"){
            addObjRotate(nameOption);
        }
    }
}
majSelectObjRotate();

function addObjRotate(nameOption) {
    var option = document.createElement("option");
    option.value = nameOption;
    option.innerHTML = nameOption;
    selectObjRotate.appendChild(option);
}

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
    activationRotation = true;
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
        //rotation de l'objet (avancé entre 0.01 et 1 suivant la valeur du slider)
        object.rotation.x += actuelleVitesseRotationX/100;
        object.rotation.y += actuelleVitesseRotationY/100;
        object.rotation.z += actuelleVitesseRotationZ/100;
    }
}

function stopRotation(){
    activationRotation = false;
}
/***********************end Rotation objet*******************************/


/************************rendu de la scène*************************/
renderer.render( scene, camera );
function animer(){
    if(activationRotation === true){
        //modification des coordonnées de l'objet en rotation
        avanceRotation();
    }
    requestAnimationFrame( animer );
    renderer.render( scene, camera );
    controls.update();
}
animer();
/*******************end rotation objet*************************************************/

/***************fonctions annexes***********************/
//récupération de l'index dans la scène de l'objet avec le nom "str"
function indexStr(str) {
    if(str === "object"){
        strLastObject = "object_"+(nbObjects-1).toString();
    }else{
        strLastObject = str;
    }
    for(var i=0; i<scene.children.length; i++){
        if(scene.children[i].name === strLastObject){
            return i;
        }
    }
}