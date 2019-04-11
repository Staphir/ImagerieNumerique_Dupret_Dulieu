let scene = new THREE.Scene();
let chargerOBJ = new THREE.OBJLoader();
let threeLargeur = 500;
let threeHauteur = 507;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(threeLargeur,threeHauteur);
renderer.setClearColor('rgb(100,100,100)');
container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );

// Etape 2 : ajouter une caméra
let camera = new THREE.PerspectiveCamera( 70, threeLargeur/threeHauteur, 0.1, 1000 );
camera.position.set(0, 0, 5);
// pour contrôler la souris
let controls = new THREE.TrackballControls( camera, container );

// Etape 3 : ajouter une lumière ambiante
let lumiereAmbiente  = new THREE.AmbientLight( 'rgb(255,255,255)');
lumiereAmbiente.intensity = 0.5;
// scene.add( lumiereAmbiente );
// ajouter une lumière ponctuelle
let lumierePonctuelle = new THREE.PointLight( 'rgb(255,255,255)', 1, 100 );
lumierePonctuelle.position.set( -5, 5, 5 );
lumierePonctuelle.intensity = 0.5;
scene.add( lumierePonctuelle );

let boutonCreerOBJ = document.getElementById("boutonCreerOBJ");
let boutonRemplacerOBJ = document.getElementById("boutonRemplacerOBJ");
boutonCreerOBJ.addEventListener("click", creerOBJ);
boutonRemplacerOBJ.addEventListener("click", effacerScene3D);
let objTexte = document.getElementById("objTexte");

function effacerScene3D() {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    camera.position.set(0, 0, 5);
    lumierePonctuelle.position.set( -5, 5, 5 );
    scene.add( lumierePonctuelle );
    creerOBJ();
}

function creerOBJ()
{
    var objURL = 'data:text/plain;charset=utf-8;base64,' + btoa(objTexte.value);
    // alert(objTexte.value);
    // console.log(objURL);
    chargerOBJ.load(objURL, function ( object ) {
        scene.add( object );
        // objectFromOBJ = object;
    })
}

// Faire le rendu de la scène à partir de votre caméra
renderer.render( scene, camera );

function animer(){
    requestAnimationFrame( animer );
    // cube.rotation.y += 0.03;
    renderer.render( scene, camera );
    controls.update();
}
animer();