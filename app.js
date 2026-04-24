
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gestureBox = document.getElementById('gestureBox');
const startScreen = document.getElementById('startScreen');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

var action = [0.0, 0.0, 0.0, 0.0];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hands;
let camera;

// ========================
// INICIALIZAÇÃO
// ========================
function startApp(mode) {
  startScreen.style.display = "none";

  initMediaPipe(mode);
  initCamera();
}

// ========================
// GEOMETRIA 3D
// ========================
function getAngle3D(a, b, c) {
  const ab = [a.x - b.x, a.y - b.y, a.z - b.z];
  const cb = [c.x - b.x, c.y - b.y, c.z - b.z];

  const dot = ab[0]*cb[0] + ab[1]*cb[1] + ab[2]*cb[2];

  const magAB = Math.hypot(ab[0], ab[1], ab[2]);
  const magCB = Math.hypot(cb[0], cb[1], cb[2]);

  const angleRad = Math.acos(dot / (magAB * magCB));
  return angleRad;
}

function getAngle(a, b, c, v1, v2) {
  // const ab = [a.x - b.x, a.y - b.y, a.z - b.z];
  // const cb = [c.x - b.x, c.y - b.y, c.z - b.z];
  const ab = new THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  const cb = new THREE.Vector3(c.x - b.x, c.y - b.y, c.z - b.z);
  var n = ab.clone();
  n.cross(cb);
  n.normalize();

  // const n = [
  //       ab[1] * cb[2] - ab[2] * cb[1],
  //       ab[2] * cb[0] - ab[0] * cb[2],
  //       ab[0] * cb[1] - ab[1] * cb[0] ];

  const v = new THREE.Vector3(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
  v.normalize();
  // const dot = Math.abs(v[0]*n[0] + v[1]*n[1] + v[2]*n[2]);
  const dot = n.dot(v);


  // const magV = Math.hypot(v[0], v[1], v[2]);
  // const magN = Math.hypot(n[0], n[1], n[2]);
  const magV = v.length();
  const magN = n.length();

  const angleRad = Math.acos(dot / (magV * magN));

  // console.log(n.toArray(), v.toArray());
  // console.log(angleRad, toDeg(angleRad));
  // console.log(Object.values(a), Object.values(b), Object.values(c));
  // console.log(Object.values(v1), Object.values(v2));
  return angleRad;
}

function getAngle2(a, b, c, d) {
  const ab = [a.x - b.x, a.y - b.y, a.z - b.z];
  const cb = [d.x - c.x, d.y - c.y, d.z - c.z];

  const dot = ab[0]*cb[0] + ab[1]*cb[1] + ab[2]*cb[2];

  const magAB = Math.hypot(ab[0], ab[1], ab[2]);
  const magCB = Math.hypot(cb[0], cb[1], cb[2]);

  const angleRad = Math.acos(dot / (magAB * magCB));
  return angleRad;
}
/*
function isExtended(a, b, c, d) {

  const ba = new THREE.Vector3(b.x - a.x, b.y - a.y, b.z - a.z);
  const cb = new THREE.Vector3(c.x - b.x, c.y - b.y, c.z - b.z);
  const dc = new THREE.Vector3(d.x - c.x, d.y - c.y, d.z - c.z);

  const da = new THREE.Vector3(d.x - a.x, d.y - a.y, d.z - a.z);

  const total_length = 3 * cb.length();//ba.length() + cb.length() + dc.length();

  const da_mag = da.length();

  // console.log(da_mag, total_length * 0.8);
  return da_mag > total_length * 0.8;
  
}
*/
function isExtended(a, b, c, d) {

  const ba = new THREE.Vector3(b.x - a.x, b.y - a.y, b.z - a.z);
  const dc = new THREE.Vector3(d.x - c.x, d.y - c.y, d.z - c.z);

 
  const ba_mag = ba.length();
  const dc_mag = dc.length();

  return dc_mag > ba_mag * 0.8;
  
}
// converter para graus
function toDeg(rad) {
  return rad * (180 / Math.PI);
}

// ========================
// DETECÇÃO DE DEDO
// ========================
function isFingerExtended(angleRad) {
  return angleRad > 2.5;
}

// ========================
// DETECÇÃO DE GESTO + DEBUG
// ========================
function detectGesture(landmarks) {

  // calcular ângulos
  const falangeIndexAngle = getAngle3D(landmarks[5], landmarks[6], landmarks[7]);
  const falangeMiddleAngle = getAngle3D(landmarks[9], landmarks[10], landmarks[11]);
  const falangeRingAngle = getAngle3D(landmarks[13], landmarks[14], landmarks[15]);
  const falangePinkyAngle = getAngle3D(landmarks[17], landmarks[18], landmarks[19]);
  const falangeThumbAngle = getAngle2(landmarks[1], landmarks[2], landmarks[3], landmarks[4]);
  
  // const IndexAngle = getAngle(landmarks[0], landmarks[9], landmarks[13], landmarks[5], landmarks[6]);
  // const IndexAngle = getAngle3D(landmarks[0], landmarks[5], landmarks[6]);
  // const MiddleAngle = getAngle3D(landmarks[0], landmarks[9], landmarks[10]);
  // const RingAngle = getAngle3D(landmarks[0], landmarks[13], landmarks[14]);
  // const PinkyAngle = getAngle3D(landmarks[0], landmarks[17], landmarks[18]);
  // const ThumbAngle = getAngle3D(landmarks[1], landmarks[2], landmarks[3]);

  const IndexAngle = getAngle2(landmarks[0], landmarks[5], landmarks[7], landmarks[8]);
  const MiddleAngle = getAngle2(landmarks[0], landmarks[9], landmarks[11], landmarks[12]);
  const RingAngle = getAngle2(landmarks[0], landmarks[13], landmarks[15], landmarks[16]);
  const PinkyAngle = getAngle2(landmarks[0], landmarks[17], landmarks[19], landmarks[20]);
  
  const ThumbAngle = getAngle2(landmarks[0], landmarks[1], landmarks[3], landmarks[4]);
  
  
  

  // estados
  const falange_index = isFingerExtended(falangeIndexAngle);
  const falange_middle = isFingerExtended(falangeMiddleAngle);
  const falange_ring = isFingerExtended(falangeRingAngle);
  const falange_pinky = isFingerExtended(falangePinkyAngle);
  const falange_thumb = isFingerExtended(falangeThumbAngle);

  const index = isFingerExtended(IndexAngle);
  const middle = isFingerExtended(MiddleAngle);
  const ring = isFingerExtended(RingAngle);
  const pinky = isFingerExtended(PinkyAngle);
  const thumb = isFingerExtended(ThumbAngle);

  // const index = isExtended(landmarks[0], landmarks[5], landmarks[5], landmarks[8]);
  // const middle = isExtended(landmarks[0], landmarks[9], landmarks[9], landmarks[12]);
  // const ring = isExtended(landmarks[0], landmarks[13], landmarks[13], landmarks[16]);
  // const pinky = isExtended(landmarks[0], landmarks[17], landmarks[17], landmarks[20]);
  // const thumb = isExtended(landmarks[1], landmarks[2], landmarks[3], landmarks[4]);
  

  //   contabilização
  const fingers = [falange_index, falange_middle, falange_ring, falange_pinky];
  const metacarpo = [index, middle, ring, pinky];
  // console.log(fingers, falange_thumb);

  const fCount = fingers.filter(f => f).length;
  const metaCount = metacarpo.filter(f => f).length;
  
  const escalar = 0.80;
  action.forEach((valor, i, arr) => {
    arr[i] = (valor * escalar);
  });
  let gesture = "Desconhecido";

  // if (fCount === 4 && metaCount === 4 && thumb && falange_thumb) gesture = "Mão aberta";
  //   else if (fCount === 0 && metaCount === 0 && !(thumb && falange_thumb)) gesture = "Punho fechado";
  //   else if (fCount === 0 && metaCount === 0 && thumb && falange_thumb) gesture = "Positivo";
  //   else if (fCount === 1 && metaCount == 1 && falange_index && index ) gesture = "Apontando";
  if (fCount === 4 && falange_thumb){ gesture = "Mão aberta"; action[0] = clamp(action[0] + 0.2, 0.0, 1.0);}
    else if (fCount === 0 && !falange_thumb) {gesture = "Punho fechado"; action[1] = clamp(action[1] + 0.2, 0.0, 1.0);}
    else if (fCount === 0 &&  falange_thumb) {gesture = "Positivo"; action[2] = clamp(action[2] + 0.2, 0.0, 1.0);}
    else if ((fCount == 1 && falange_index && !falange_thumb) || (metaCount == 1 && index && !thumb)) {gesture = "Apontando"; action[3] = clamp(action[3] + 0.2, 0.0, 1.0);}

  // ========================
  // DEBUG NA TELA
  // ========================
  gestureBox.innerText = `Gesto: ${gesture} `;
  /* 
  Polegar: ${toDeg(ThumbAngle).toFixed(1)}° ${toDeg(falangeThumbAngle).toFixed(1)}° 
  Indicador: ${toDeg(IndexAngle).toFixed(1)}° ${toDeg(falangeIndexAngle).toFixed(1)}° 
  Médio: ${toDeg(MiddleAngle).toFixed(1)}° ${toDeg(falangeMiddleAngle).toFixed(1)}° 
  Anelar: ${toDeg(RingAngle).toFixed(1)}° ${toDeg(falangeRingAngle).toFixed(1)}° 
  Mindinho: ${toDeg(PinkyAngle).toFixed(1)}° ${toDeg(falangePinkyAngle).toFixed(1)}° 
  ${action.map(f => f.toFixed(2))}
  */

  return gesture;
}

// ========================
// MEDIAPIPE
// ========================
function initMediaPipe(mode) {

  hands = new Hands({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: mode === "gpu" ? 1 : 0,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  hands.onResults(results => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
      });

      drawLandmarks(ctx, landmarks, {
        color: '#FF0000',
        lineWidth: 1
      });

      detectGesture(landmarks);
    }
  });
}

// ========================
// WEBCAM
// ========================
function initCamera() {
  camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640,
    height: 480
  });

  camera.start();
}