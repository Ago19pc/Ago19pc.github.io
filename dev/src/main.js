import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';




// Fetch the canvas
var canvReference = document.getElementById("three_canvas");

// Renderer
var renderer = new THREE.WebGLRenderer({
    antialias:true,
    canvas: canvReference
});

let canvas_size = [window.innerWidth * 0.95, window.innerHeight * 0.95]
function get_canvas_width() {return canvas_size[0]}
function get_canvas_height() {return canvas_size[1]}

renderer.setSize(get_canvas_width(), get_canvas_height());

// Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0e10);

const camera = new THREE.PerspectiveCamera(60, get_canvas_width()/get_canvas_height(), 0.1, 100);
camera.position.set(5,5,5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff,2));
const dirLight = new THREE.DirectionalLight(0xffffff,1);
dirLight.position.set(5,10,7.5);
scene.add(dirLight);

// Clickable objects setup
let clickable = [];
const clickable_names = ['arcade','lock','airplane','hat','github','linkedin','horses','scroll'];
const links = new Map([
    ['arcade','https://github.com/Ago19pc/IS24-AM04'],
    ['lock','https://github.com/Ago19pc/keccak'],
    ['airplane','http://quick-share.it'],
    ['hat',''],
    ['github',"https://github.com/Ago19pc"],
    ['linkedin',"https://www.linkedin.com/in/agostino-contemi-b0b211293/"],
    ['horses','https://github.com/fillododi/chess'],
    ['scroll',"docs/CV Contemi Agostino.pdf"]
]);

// Descriptions
const descriptions = new Map([
    ['arcade','Codex Naturalis, a Java videogame! 🕹️'],
    ['lock','Keccak, implementing faster cryptographics primitives! 🔐'],
    ['airplane','TaroccDrop, AirDrop clone for all devices! ✈️'],
    ['github','Link to my GitHub profile.'],
    ['linkedin','Link to my LinkedIn profile.'],
    ['horses','A chess game project! ♟️'],
    ['scroll','My CV as a PDF.']
]);

// Tooltip
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.pointerEvents = 'none';
tooltip.style.background = 'rgba(0,0,0,0.6)';
tooltip.style.color = '#fff';
tooltip.style.padding = '8px 12px';
tooltip.style.borderRadius = '4px';
tooltip.style.fontFamily = 'sans-serif';
tooltip.style.fontSize = '14px';
tooltip.style.display = 'none';
tooltip.style.textAlign = 'center';
tooltip.style.zIndex = '10';
document.body.appendChild(tooltip);

// Load GLTF
const loader = new GLTFLoader();
const loadingScreen = document.getElementById('loading-screen');
loader.load(
  '/models/room.glb',
  (gltf) => {
    clickable_names.forEach(name => {
      const obj = gltf.scene.getObjectByName(name);
      if(obj) clickable.push(obj);
      else console.warn(`Object "${name}" not found`);
    });
    scene.add(gltf.scene);

    // Hide loading screen
    loadingScreen.style.display = 'none';
  },
  (xhr) => {
    // Optional: progress
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    loadingScreen.innerText = `Loading... ${Math.round(percentComplete)}%`;
  },
  (error) => console.error(error)
);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;

// Postprocessing: Outline
const renderPass = new RenderPass(scene,camera);
const outlinePass = new OutlinePass(new THREE.Vector2(get_canvas_width(),get_canvas_height()), scene,camera);
outlinePass.edgeStrength = 8;
outlinePass.edgeGlow = 1;
outlinePass.edgeThickness = 2;
outlinePass.pulsePeriod = 2;
outlinePass.visibleEdgeColor.set('#00ffff');
outlinePass.hiddenEdgeColor.set('#ff00ff');

const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(outlinePass);

// Resize
window.addEventListener('resize',()=>{
    camera.aspect = get_canvas_width()/get_canvas_height();
    camera.updateProjectionMatrix();
    renderer.setSize(get_canvas_width(), get_canvas_height());
    composer.setSize(get_canvas_width(), get_canvas_height());
});

// Helper: get root clickable object
function getRootClickable(obj){
    while(obj){
        if(clickable.includes(obj)) return obj;
        obj = obj.parent;
    }
    return null;
}

// Project 3D position to screen
function toScreenPosition(obj,camera){
    const vector = new THREE.Vector3();
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    const canvas = renderer.domElement;
    const x = (vector.x+1)/2 * canvas.clientWidth;
    const y = (-vector.y+1)/2 * canvas.clientHeight;
    return {x,y};
}

window.addEventListener('mousemove', (event) => {
    const rect = renderer.domElement.getBoundingClientRect(); // get canvas position
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(clickable, true);
    if (intersects.length > 0) {
        const rootObj = getRootClickable(intersects[0].object);
        hovered = rootObj;
        outlinePass.selectedObjects = hovered ? [hovered] : [];
        document.body.style.cursor = hovered ? "pointer" : "default";

        if (hovered && descriptions.has(hovered.name)) {
            tooltip.style.display = 'block';
            tooltip.innerText = descriptions.get(hovered.name);
            const pos = toScreenPosition(hovered, camera);
            tooltip.style.left = pos.x - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = pos.y - tooltip.offsetHeight - 10 + 'px';
        } else tooltip.style.display = 'none';
    } else {
        hovered = null;
        outlinePass.selectedObjects = [];
        document.body.style.cursor = "default";
        tooltip.style.display = 'none';
    }
});

window.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickable, true);
    if (intersects.length > 0) {
        const rootObj = getRootClickable(intersects[0].object);
        if (rootObj) {
            const url = links.get(rootObj.name);
            if (url) window.open(url, "_blank");
        }
    }
});

// Animate
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    composer.render();
}
animate();
