const d3 = require("d3");
const THREE = require("three");
const MeshLine = require("three.meshline").MeshLine;
const MeshLineMaterial = require("three.meshline").MeshLineMaterial;
//import Stats from './jsm/libs/stats.module.js';
import {
  OrbitControls
} from "./node_modules/three/examples/jsm/controls/OrbitControls.js";



import {dragControls,dragAction} from './dragTHREE.js';



let container, stats;
let camera, scene, renderer;
let mesh;

let debug = false;

init();
animate();

function init() {
  container = document.getElementById("container");

  var width = window.innerWidth;
  var height = window.innerHeight;
  //

  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(23,89,160)"); //0x050505 );
  scene.fog = new THREE.Fog(0x050505, 2000, 3500);

  //

  scene.add(new THREE.AmbientLight(0x444444));

  const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.set(0, -1, 0);
  scene.add(light2);

  // camera = new THREE.OrthographicCamera(
  //     width / -2,
  //     width / 2,
  //     height / 2,
  //     height / -2,
  //     1,
  //     6000
  // );

  camera = new THREE.PerspectiveCamera(
      27,
      window.innerWidth / window.innerHeight,
      1,
      10000
  );

  camera.position.z = 0.7 * 2750;
  // scene.rotation.x = -200;

  //

  renderer = new THREE.WebGLRenderer({antialias:true,precision:'highp'});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  container.appendChild(renderer.domElement);

//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.25;
//   controls.enableZoom = true;
// controls.enablePan = false;
// // to disable rotation
// controls.enableRotate = false;
// 


  // function onPositionChange(o) {
  //     //console.log("position changed in object");
  //     console.log(camera.position, camera.rotation, scene.children);
  // }
  // if (debug) {
  //     controls.addEventListener("change", onPositionChange);
  // }
 






  
  
  
  
  camera.rotation.x = 0.02;
  const rot = -1.24;
  const size = 10000;
  const divisions = 1000;
  
    const scale = 400;

  var grid = new THREE.GridHelper(
      size,
      divisions,
      new THREE.Color("white"),
      new THREE.Color("whitesmoke")
  );
  grid.rotation.x = -rot;
  //grid.position.z = -scale
  grid.name = "gridHelper";
  grid.material.opacity = 0.1;
  grid.material.emissivity=111
  grid.material.transparent = true;
  scene.add(grid);
  window.g = grid;

  var grid = new THREE.GridHelper(
      size,
      divisions / 4,
      new THREE.Color("white"),
      new THREE.Color("whitesmoke")
  );
  grid.rotation.x = -rot;
  //grid.position.z = -scale*3
  grid.name = "gridHelper";
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);
  window.g = grid;
  
  var graphs = new THREE.Group()
  
  dragControls(renderer.domElement,dragAction,graphs)



  //const v = 'CRI_v2.2'

  // const material = new MeshLineMaterial({opacity:0.4,depthTest:false,transparent:true});

  // draw(-600,'MCM_v3.1')
  // draw(0,'MCM_v3.2')
  // draw(300,'MCM_v3.3.1')

  //
   draw(scale,'CRI_v2.2')


  draw(2*scale, "MCM_v3.1");


  draw(0, "CRI_v2.0.r1");

 draw(-1 * scale, "CRI_v2.0.r3");

  draw(-2 * scale, "CRI_v2.0.r5");
  // d3.range(1,6).forEach((i)=>{
  //    draw(200*i,'CRI_v2.0.r'+i)
  // })


  scene.add(graphs)
  window.e = false;

  async function draw(z = 0, v) {
      if (window.e) {
           lines(window.e, z, v);
      } else {
          d3.json("../fabundle.json").then(async p => {
              window.e = p;
              await lines(p, z, v);
          });
      }

      render();
  }

  async function lines(e, z, v) {
      var g = new THREE.Group();
      g.name = v;
      console.log("load");
      var rxn = Object.keys(e.rxns).filter(k => e.rxns[k][v] > 0);

      console.log(rxn.length, v);

      rxn.forEach(q => {
          var line = new MeshLine();

          var points = [];
          e.rxns[q].bundle.forEach(w => {
              points.push(w[0] * scale);
              points.push(w[1] * scale);
              points.push(z);
          });
          line.setPoints(points);

          line.scale;

          var material = new MeshLineMaterial({
              opacity: 0.1,
              depthTest: false,
              transparent: true,
              linewidth: e.rxns[q][v]
          });

          var mesh = new THREE.Mesh(line, material);
          g.add(mesh);
          return mesh;
      });
      console.log("d");

      //https://gero3.github.io/facetype.js/
      const loader = new THREE.FontLoader();

      loader.load("./IBMPlex.json", function(font) {
          var textGeometry = new THREE.TextGeometry(v, {
              font: font,
              size: 12,
              height: 1,
              curveSegments: 12,
              bevelEnabled: false,
              bevelThickness: 1,
              bevelSize: 1,
              bevelOffset: 0,
              bevelSegments: 5
          });

          var textMaterial = new THREE.MeshBasicMaterial({
              color: new THREE.Color("whitesmoke"),
              //specular: 0x000000
          });

          var mesh = new THREE.Mesh(textGeometry, textMaterial);
          mesh.position.x = 0.7 * scale;
          mesh.position.y = -0.7 * scale;
          mesh.position.z = z;
          //mesh.rotation.y=.3
          mesh.rotation.x = rot / 2;

          g.add(mesh);
      });

      graphs.add(g);
  }

  //stats = new Stats();
  ///	container.appendChild( stats.dom );

  //

  window.addEventListener("resize", onWindowResize, false);
  
  window.c = camera
  window.r = renderer 
  window.s = scene 
  
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);
  render();
  //stats.update();
}

function render() {
  // const time = Date.now() * 0.0001;
  //
  // scene.rotation.x = time * 0.25;
  // scene.rotation.y = time * 0.5;

  renderer.render(scene, camera);
}


import './savethree.js'
