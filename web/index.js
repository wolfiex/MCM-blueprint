const d3 = require("d3");
const THREE = require("three");
const MeshLine = require("three.meshline").MeshLine;
const MeshLineMaterial = require("three.meshline").MeshLineMaterial;
//import Stats from './jsm/libs/stats.module.js';
import {
  OrbitControls
} from "./node_modules/three/examples/jsm/controls/OrbitControls.js";


// 
// import {dragControls,dragAction} from './dragTHREE.js';



let container, stats;
let camera, scene, renderer;
let mesh;

init();
animate();

function init() {
  container = document.getElementById("container");
  var width = window.innerWidth;
  var height = window.innerHeight;
  //
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(23,89,160)"); //0x050505 );
  //scene.fog = new THREE.Fog(0x050505, 2000, 9500);

  //

  scene.add(new THREE.AmbientLight(0x444444));

  const light1 = new THREE.DirectionalLight(0xffffff, 10.5);
  light1.position.set(1, 1, 1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 11.5);
  light2.position.set(0, -1, 0);
  scene.add(light2);
  // 
  // camera = new THREE.OrthographicCamera(
  //     width / -2,
  //     width / 2,
  //     height / 2,
  //     height / -2,
  //     1,
  //     6000
  // );

  camera = new THREE.PerspectiveCamera(
  30,//27,
      window.innerWidth / window.innerHeight,
      1,
      6000
  );

  camera.position.z = 5044//0.7 * 2750;
  // scene.rotation.x = -200;

  //

  renderer = new THREE.WebGLRenderer({antialias:true,precision:'highp'});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
controls.enablePan = true;
// to disable rotation
controls.enableRotate = true;

// 
// controls.addEventListener("change", onPositionChange);
// scene.children.filter(d=>d.name==='graph').forEach(d=>{d.lookAt(camera.position);d.rotation.x=-2.3})
      
      //console.log("position changed in object");
      //console.log(camera.position, camera.rotation, scene.children);
  // }


/// WIDTH > HEIGHT?
 
  
  const rot = -1.24;
  const size = 20000;
  const divisions = 1000;
  
 var g= new THREE.Group()
  var grid = new THREE.GridHelper(
      size,
      divisions,
      new THREE.Color("white"),
      new THREE.Color("whitesmoke")
  );
  grid.material.opacity = 0.1;
  grid.material.transparent = true;
  g.add(grid)

  var grid = new THREE.GridHelper(
      size,
      divisions / 4,
      new THREE.Color("white"),
      new THREE.Color("whitesmoke")
  );
  grid.material.opacity = 0.1;
  grid.material.transparent = true;
  grid.position.z+=1
  grid.position.y +=1
  grid.position.x +=1

  g.add(grid)
  
  g.position.y +=1400
  g.rotation.x = -rot;
  //grid.position.z = -scale*3
  g.name = "gridHelper";

  scene.add(g);
  

  // scene.add(graphs)
const scale = Math.min(window.innerHeight/3,window.innerWidth/2)*.8;
          d3.json("../fabundle.json").then( p => {
              

              
              var vert = 600
              var vw = width/3
              var vh = height/6
              
              console.log(vw,vh,vert,scale)
              
              draw(p,vert,'MCM_v3.3.1',-vw,-4*vh,0)
              draw(p,.8*vert,'MCM_v3.2',-vw,-1.01*vh,0),
              draw(p,.6*vert,'MCM_v3.1',-vw,2*vh,0)
              
              draw(p,vert,"CRI_v2.2",vw,-4*vh,1);
              draw(p,.8*vert,"CRI_v2.0.r1",vw,-1.02*vh,1);
              draw(p,.6*vert, "CRI_v2.0.r5",vw,2*vh,1);

              window.e = p;
           });
      



  async function draw(e, z, v,x,y,q) {
      var g = new THREE.Group();
      g.name = 'graph';
      g.version = v
      console.log("load");
      var rxn = Object.keys(e.rxns).filter(k => e.rxns[k][v] > 0);

      console.log(rxn.length, v);

      rxn.forEach(q => {
          var line = new MeshLine();

          var points = [];
          e.rxns[q].bundle.forEach(w => {
              points.push(w[0] * scale);
              points.push(-w[1] * scale);
              points.push(z);
          });
          line.setPoints(points);

          line.scale;

          var material = new MeshLineMaterial({
              opacity: 0.1,
              depthTest: false,
              transparent: true,
              linewidth: e.rxns[q][v]*7
          });

          var mesh = new THREE.Mesh(line, material);
          mesh.name = 'graph'
          g.add(mesh);
      });
      console.log("d");
      g.position.x+=x
      g.position.y+=y
      g.rotation.x-=Math.PI/5
      g.rotation.z-= Math.PI/7 -Math.PI/2
      scene.add(g)
      //https://gero3.github.io/facetype.js/
      const loader = new THREE.FontLoader();

      loader.load("./IBMPlex.json", function(font) {
          var textGeometry = new THREE.TextGeometry(v, {
              font: font,
              size: 24,
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
          mesh.position.x = (q>0?.35:0.55)*scale+x//q>0?-0.9 * scale + x: 0.9*scale+x
          mesh.position.y = 0.7*scale+y
          mesh.position.z = 700;
          //mesh.rotation.y=.3
          
          // var ps = new THREE.Vector3(mesh.position.)
          // ps.z = 999999
          // mesh.lookAt(ps)
          mesh.rotation.x += rot*.7 ;
          mesh.name = 'text'

          scene.add(mesh);
      });

      //graphs.add(g);
  }

  //stats = new Stats();
  ///	container.appendChild( stats.dom );


  // onPositionChange(1)

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
