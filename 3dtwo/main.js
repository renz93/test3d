// --- Smooth nav button scrolling ---
document.querySelectorAll('.nav-buttons .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// --- Parallax ---
const layers = document.querySelectorAll('section .parallax-layer .shape');
function onScrollParallax() {
  layers.forEach(el => {
    const section = el.closest('section');
    const speed = parseFloat(section?.dataset?.speed) || 0.08;
    const rect = section.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) * speed;
    el.style.transform = `translate3d(0, ${offset}px, 0) rotate(${offset / 40}deg)`;
  });
}
window.addEventListener('scroll', onScrollParallax, { passive: true });
onScrollParallax();

// --- Highlight active nav ---
const sections = document.querySelectorAll('main section');
const navButtons = document.querySelectorAll('.nav-buttons .btn');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navButtons.forEach(b => b.classList.toggle('active', b.dataset.target === id));
    }
  });
}, { threshold: 0.6 });
sections.forEach(s => observer.observe(s));

// --- THREE.JS + GLTFLoader ---
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

const scene = new THREE.Scene();
scene.background = null;

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 1.2, 3);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(3, 10, 10);
scene.add(dirLight);

// Load GLTF model
const loader = new THREE.GLTFLoader();
loader.load(
  'gibaltumpal.gltf',
  gltf => {
    scene.add(gltf.scene);
  },
  xhr => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  error => {
    console.error('An error happened loading the model:', error);
  }
);

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
