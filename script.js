const LOADER = document.getElementById('js-loader');

const TRAY = document.getElementById('js-tray-slide');

var cakeModel;

const MODEL_PATH = "cake.glb";

var activeOption = 'legs';
var loaded = false;

const colors = [
//red
{color: 'ffe3e3' },
{color: 'f9c0c0' },
{color: 'e86060' },
{color: 'd83939' },
{color: 'bf0000' },
{color: '9e0000' },
{color: '6b0000' },
{color: '4c0000' },
//orange
{color: 'fff1e3' },
{color: 'ffd6bd' },
{color: 'ffa071' },
{color: 'e57741' },
{color: 'd34b00' },
{color: '9e3500' },
{color: '682300' },
{color: '441800' },
//yellow
{color: 'fffde6' },
{color: 'fff4bd' },
{color: 'ffe97b' },
{color: 'f4d556' },
{color: 'd8b405' },
{color: 'ba9315' },
{color: '7a6108' },
{color: '423500' },
//green
{color: 'edffe9' },
{color: 'cbffc0' },
{color: 'a0f78d' },
{color: '71e259' },
{color: '2fb512' },
{color: '258e0e' },
{color: '246800' },
{color: '123500' },
//mint
{color: 'e9fffb' },
{color: 'c2fff5' },
{color: '8ef4e3' },
{color: '5ae0c9' },
{color: '14b297' },
{color: '108c77' },
{color: '006655' },
{color: '00332a' },
//blue
{color: 'e9f5ff' },
{color: 'c5e3ff' },
{color: '8fc3f2' },
{color: '5b9fdd' },
{color: '1566af' },
{color: '115089' },
{color: '003666' },
{color: '001b33' },
//purple//
{color: 'f0ebff' },
{color: 'd3c7ff' },
{color: 'a48fef' },
{color: '785ddb' },
{color: '4617ad' },
{color: '371287' },
{color: '200066' },
{color: '100033' }
];

const BACKGROUND_COLOR = 0xffffff;
const scene = new THREE.Scene();
scene.background = new THREE.Color(BACKGROUND_COLOR);
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

var cameraFar = 5;

document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.y = 55;

const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1});

const INITIAL_MAP = [
{ childID: "base", mtl: INITIAL_MTL },
{ childID: "cream_t", mtl: INITIAL_MTL },
{ childID: "cream_s", mtl: INITIAL_MTL },
{ childID: "cream_b", mtl: INITIAL_MTL }];

var loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, function (gltf) {
  cakeModel = gltf.scene;

  cakeModel.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  cakeModel.scale.set(0.1, 0.1, 0.1);
  cakeModel.rotation.y = Math.PI;

  cakeModel.position.y = 3.5;

  for (let object of INITIAL_MAP) {
    initColor(cakeModel, object.childID, object.mtl);
  }

  scene.add(cakeModel);

  LOADER.remove();

}, undefined, function (error) {
  console.error(error);
});

function initColor(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type;
      }
    }
  });
}

var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.position.set(0, 50, 0);  
scene.add(hemiLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(-10, 15, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);  
scene.add(dirLight);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2.5;
controls.minPolarAngle = Math.PI / 4.4;
controls.minDistance = 38;
controls.maxDistance = 48;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = true;
controls.autoRotateSpeed = 3;

function animate() {

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

animate();

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');

    if (color.texture)
    {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
    } else
    {
      swatch.style.background = "#" + color.color;
    }

    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

const options = document.querySelectorAll(".option");

for (const option of options) {
  option.addEventListener('click', selectOption);
}

function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove('--is-active');
  }
  option.classList.add('--is-active');
}

const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

  if (color.texture) {

    let txt = new THREE.TextureLoader().load(color.texture);

    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;

    new_mtl = new THREE.MeshPhongMaterial({
      map: txt});

  } else

  {
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt('0x' + color.color)});


  }

  setMaterial(cakeModel, activeOption, new_mtl);
}

function setMaterial(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}