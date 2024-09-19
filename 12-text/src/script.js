import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axis helper

// const axes = new THREE.AxesHelper()
// scene.add(axes)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTextureDonuts = textureLoader.load('/textures/matcaps/3.png')
const matcapTextureText = textureLoader.load('/textures/matcaps/4.png')
matcapTextureDonuts.colorSpace = THREE.SRGBColorSpace
matcapTextureText.colorSpace = THREE.SRGBColorSpace


/**
 * Object
 */

// Fonts
let textWritten = 'Kike Alcocer';

const fontLoader = new FontLoader();
let textMesh; // Declare a variable to store the text mesh

fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
    const createTextMesh = () => {
        if (textMesh) scene.remove(textMesh); // Remove the old text mesh if it exists

        const textGeometry = new TextGeometry(textWritten, {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        });
        textGeometry.center(); // Center the text

        const materialText = new THREE.MeshMatcapMaterial({ matcap: matcapTextureText });
        textMesh = new THREE.Mesh(textGeometry, materialText); // Create a new text mesh
        scene.add(textMesh); // Add it to the scene
    };

    createTextMesh(); // Initial creation of the text mesh


    gui.add({ text: textWritten }, 'text').onChange((value) => {
        textWritten = value;
        createTextMesh(); // Rebuild the text mesh when the value changes
    });
    // Donuts creation (unchanged)
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const materialDonuts = new THREE.MeshMatcapMaterial({ matcap: matcapTextureDonuts });

    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, materialDonuts);
        donut.position.x = (Math.random() - 0.5) * 7;
        donut.position.y = (Math.random() - 0.5) * 7;
        donut.position.z = (Math.random() - 0.5) * 7;
        donut.rotation.x = Math.PI * Math.random();
        const scale = Math.random();
        donut.scale.set(scale, scale, scale);
        scene.add(donut);
    }
});



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()