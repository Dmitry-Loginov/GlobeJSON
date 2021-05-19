import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { drawThreeGeo } from "./threeGeoJSON.js";

//New scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);

export var clientx = 0;
export var clienty = 0;
export var showingMessage = false;

//New Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var planet = new THREE.Object3D();

//Create a sphere to make visualization easier.
const loader = new THREE.TextureLoader();
var geometry = new THREE.SphereGeometry(30, 45, 45);

var material = new THREE.MeshPhongMaterial({
    map:         loader.load("images/earthmap1k.jpg"),
    bumpMap:     loader.load('images/earthbump1k.jpg'),
    bumpScale:   3.5,
    specularMap: loader.load('images/earthspec1k.jpg'),
    specular:    new THREE.Color('grey'),
});

var sphere = new THREE.Mesh(geometry, material);
sphere.rotation.x += 1.58;

scene.add(planet);
var light = new THREE.DirectionalLight( 0xcccccc, 0.5);
light.position.set(10, 20, 10);
scene.add(light);

const color = 0xffffff;
var lightBack = new THREE.AmbientLight(color);
lightBack.position.set(-2, 2, 10);
scene.add(lightBack);
var container = new THREE.Object3D();
planet.add(container);
planet.rotation.x += -1.55;
planet.rotation.z += -0.4;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

var colors = ['red', 'green', 'blue', 'white', 'grey', 'orange', 'pink']

$.getJSON("test_geojson/univesrity.json", function(data) {
    drawThreeGeo(data, 30.3, 'sphere', {color: colors[getRandomInt(7)]}, container);
});

var skyGeometry = new THREE.SphereGeometry(90, 50, 50);
var skyMaterial = new THREE.MeshBasicMaterial({
    map:  loader.load("images/galaxy_starfield.png"),
    side: THREE.BackSide,
});
var sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);

planet.add(sphere);
//Set the camera position
camera.position.z = 8;
camera.position.y = 19;
camera.position.x = 59;

//анимация вращения мыши
//Render the image

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.11;
controls.enableZoom = false;
controls.update();
export var rotate;
rotate = true;
var label = null;
var popup = null;

function render() {
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( container.children );
    try{
        if(!intersects[0].object.showingMessage){
            intersects[0].object.ShowMessage();
            rotate = false;
            if(label != null)
                label.object.showingMessage = false;
            label = intersects[0];
            
        }
        else{

        }
    }
    catch{
        try{
            label?.object.HideMessage();
            if(!popup.showingPopup)
                rotate = true;
        }
        catch{}
    }
    renderer.render( scene, camera );
}

function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / window.innerWidth ) * 2-1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2+1;
    clientx = event.clientX;          
    clienty = event.clientY;      
    render();
}


window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener('click', Click, false);

function Click(){

    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( container.children );
    try{
        popup = intersects[0].object;
        if(!popup.showingPopup){
            intersects[0].object.ShowPopup();
            rotate = false;
            // alert(intersects[0].object.vertices);
            // alert(intersects[0].object.position.x);
            // console.log(camera.position.x);
            // console.log(camera.position.y);
            // console.log(camera.position.z);
            // console.log(intersects);
            // console.log(camera);
            //camera.position.x = camera.position.x + 20;

            // camera.position.x = intersects[0].point.x;
            //  camera.position.x = camera.position.y + (intersects[0].point.y);
            //  camera.position.z = camera.position.x + (intersects[0].point.x);
            //  camera.position.x = camera.position.x + (-camera.position.x + intersects[0].point.x);
            // alert(mouse.x + " " + mouse.y);
            // camera.position.x = mouse.x;
            // camera.position.y = mouse.y;
            // camera.position.z = camera.position.z + 5;            

            
        }
    }
    catch{
        if(popup != null){
            popup.HidePopup();
            rotate = true;
        }
    }
}

const animate = function () {
requestAnimationFrame( animate );
// if(rotate)
//     planet.rotation.z += 0.001;
// else
//     planet.rotation.z += 0;
controls.update();
renderer.render( scene, camera );
};

animate();
window.requestAnimationFrame(render);
