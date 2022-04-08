import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()


//Loaders
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const fontLoader = new THREE.FontLoader()


//update all the materials
const updateAllMaterials = () =>
{
    scene.traverse( (child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            child.material.envMap = environmentMap
            child.material.envMapIntensity = 3
        } 
    })
}


//Environmental Map
const environmentMap = cubeTextureLoader.load([
    '/textures/envMap/pos-x.png',
    '/textures/envMap/neg-x.png',
    '/textures/envMap/pos-y.png',
    '/textures/envMap/neg-y.png',
    '/textures/envMap/pos-z.png',
    '/textures/envMap/neg-z.png'  
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap


//Fog
const fog = new THREE.Fog('#000000', 2, 6)
scene.fog = fog


//Textures

const DarthTexture = textureLoader.load('/textures/darthvader.jpg')
DarthTexture.encoding = THREE.sRGBEncoding
DarthTexture.flipY = false


const CapTexture = textureLoader.load('/textures/Cape.png')
CapTexture.flipY = false
CapTexture.encoding = THREE.sRGBEncoding
CapTexture.wrapS = THREE.RepeatWrapping;
CapTexture.repeat.set(0.6, 0.6);
CapTexture.offset.set(- 0.9, 0.2);

const StarTexture = textureLoader.load('/textures/star/star.png')
const StarNMTexture = textureLoader.load('/textures/star/starNM.png')
const StarDMTexture = textureLoader.load('/textures/star/starDM.png')
const StarAOTexture = textureLoader.load('/textures/star/starAO.png')
StarTexture.encoding = THREE.sRGBEncoding

const FloorTexture = textureLoader.load('/textures/floor/floor.png')
FloorTexture.encoding = THREE.sRGBEncoding
const FloorMetalTexture = textureLoader.load('/textures/floor/floorMetal.png')
FloorMetalTexture.encoding = THREE.sRGBEncoding
const FloorRoughnessTexture = textureLoader.load('/textures/floor/floorRoughness.png')
FloorRoughnessTexture.encoding = THREE.sRGBEncoding
const FloorNormalTexture = textureLoader.load('/textures/floor/floorNormal.png')

FloorTexture.repeat.set(4, 4)
FloorMetalTexture.repeat.set(4, 4)
FloorNormalTexture.repeat.set(4, 4)
FloorRoughnessTexture.repeat.set(4, 4)

FloorTexture.wrapS = THREE.RepeatWrapping
FloorMetalTexture.wrapS = THREE.RepeatWrapping
FloorNormalTexture.wrapS = THREE.RepeatWrapping
FloorRoughnessTexture.wrapS = THREE.RepeatWrapping

FloorTexture.wrapT = THREE.RepeatWrapping
FloorMetalTexture.wrapT = THREE.RepeatWrapping
FloorNormalTexture.wrapT = THREE.RepeatWrapping
FloorRoughnessTexture.wrapT = THREE.RepeatWrapping

const stars = textureLoader.load('/textures/particles/1.png')

//Fonts
fontLoader.load(
    '/fonts/Regular.json',
    (font) =>
    {
        const textGeometry = new THREE.TextBufferGeometry(
            'MAY THE FORCE ',
            {
                font: font,
                size: 0.2,
                height: 0.001,
                curveSegments: 5,
                bevelEnabled: false
            }
        )
            
        const textMaterial = new THREE.MeshBasicMaterial()
        const text1 = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text1)

        text1.position.set( - 3 , 1.5, 0.3)
        text1.rotation.set( 0, 7 , 0);
    }
)

fontLoader.load(
    '/fonts/Regular.json',
    (font) =>
    {
        const textGeometry2 = new THREE.TextBufferGeometry(
            'BE WITH YOU',
            {
                font: font,
                size: 0.2,
                height: 0.001,
                curveSegments: 5,
                bevelEnabled: false
            }
        )
            
        const textMaterial = new THREE.MeshBasicMaterial()
        const text2 = new THREE.Mesh(textGeometry2, textMaterial)
        scene.add(text2)

        text2.position.set( - 3 , 1.2, 0.3)
        text2.rotation.set( 0, 7 , 0);
        
    }
)


/*
* DARTH
*/

//MATERIALS

//Cape
const CapeMaterial = new THREE.MeshStandardMaterial({ map: CapTexture })

//Darth
const DarthMaterial = new THREE.MeshStandardMaterial({ map: DarthTexture, metalness: 1 })
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath( '/draco/' );

//Unique
const UniqueMaterial= new THREE.MeshStandardMaterial({ color: '#434e54' })
UniqueMaterial.metalness = 2

//Lego
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    '/darth/lego1234.glb',
    (gltf) => {  
        
        
        const Cape = gltf.scene.children.find(child => child.name === 'Cape')          
        Cape.material = CapeMaterial  

        const DarthVader = gltf.scene.children.find(child => child.name === 'DarthVader')
        DarthVader.material = DarthMaterial
    
        const Unique = gltf.scene.children.find(child => child.name === 'UniqueID_25')
        Unique.material = UniqueMaterial

        updateAllMaterials()
               
        gltf.scene.position.set( 1, - 0.9, 0.5)
        scene.add(gltf.scene)
    }

)



//Floor
const floor = new THREE.Mesh(
    new THREE.CylinderBufferGeometry( 1.2, 1.15, 0.1, 32, 12),
    new THREE.MeshStandardMaterial({
        map: FloorTexture,
        normalMap: FloorNormalTexture,
        roughnessMap:FloorRoughnessTexture,
        metalnessMap:FloorMetalTexture,
        })
)
floor.position.x = 1
floor.position.y = - 0.96
floor.position.z =  0.2
floor.rotation.x = - Math.PI * 0.5
floor.rotation.y = - Math.PI * 0.5
floor.rotation.z = - Math.PI * 0.5
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
scene.add(floor)



//Sphere Star
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry( 1, 64, 64),
    new THREE.MeshStandardMaterial({
    map: StarTexture,
    normalMap: StarNMTexture,
    displacementMap: StarDMTexture,
    displacementScale: 0.5,
    aoMap: StarAOTexture,
    
    })
)
sphere.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(sphere.geometry.attributes.uv.array, 2))
sphere.position.set(- 4.3, 1.5, - 2)
scene.add(sphere)


/*
*  Lights
*/

const directionalLight = new THREE.DirectionalLight(0xfff5c2, 4)
directionalLight.position.set(0.5, .5, 3)
scene.add(directionalLight)


//light2
const pointLight2 = new THREE.PointLight(0xff3867, 10, 10)
pointLight2.position.x = 2
pointLight2.position.y = 1
pointLight2.position.z = 1
scene.add(pointLight2)


//light3
const pointLight3 = new THREE.PointLight(0x0000ff, 10, 10)
pointLight3.position.x = - 5.3
pointLight3.position.y = 3
pointLight3.position.z = - 1
scene.add(pointLight3)



//Particles
const particlesGeometry = new THREE.BufferGeometry()
const particlesCount = 700
const positionArray = new Float32Array(particlesCount * 3)
const colors = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++){
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 7
    positionArray[i * 3 + 1] = (Math.random() * 3) - 1
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 7
    colors[i] = Math.random()
    
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3) )

const particlesMaterial = new THREE.PointsMaterial({
    size:0.04,
    map: stars,
    transparent: true,
    alphaMap: stars,
    depthWrite: false,
    color: '#cb7ede',
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

//Points
const points = new THREE.Points(particlesGeometry, particlesMaterial )
scene.add(points)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update effect composer
    effectComposer.setSize(sizes.width, sizes.height)
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
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.autoClear = false 

//Post Processing

let RenderTargetClass = null

if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
{
    RenderTargetClass = THREE.WebGLMultisampleRenderTarget
    console.log('Using WebGLMultisampleRenderTarget')
}
else
{
    RenderTargetClass = THREE.WebGLRenderTarget
    console.log('Using WebGLRenderTarget')
}

const renderTarget = new RenderTargetClass(
    800,
    600,
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding
    }
)


//Effect composer
const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

// Render pass
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)


//bloom

const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = true
effectComposer.addPass(unrealBloomPass)

unrealBloomPass.exposure = 1
unrealBloomPass.strength = 1.5
unrealBloomPass.radius = 0.2
unrealBloomPass.threshold = 0.5



//Mouse
const mouse = new THREE.Vector2()

//POINT LIGHT TO MOUSE
   const mouseMesh = new THREE.PointLight( 0xffffff, 1)
   mouseMesh.position.z = 0.5
   scene.add(mouseMesh)

   document.addEventListener('mousemove', onMouseMove, false)

function onMouseMove(event) {
 
   event.preventDefault();
   mouse.x = (event.clientX / window.innerWidth) * 2 - 1
   mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
 
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
   vector.unproject( camera )

   const dir = vector.sub( camera.position ).normalize()
   const distance = - camera.position.z / dir.z
   const pos = camera.position.clone().add( dir.multiplyScalar( distance ) )
   mouseMesh.position.copy(pos);
 
   // Make the sphere follow the mouse
   mouseMesh.position.set(mouse.x, mouse.y, 0.5)
}



/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = - .2 * elapsedTime
   
    
    points.rotation.x = - (mouse.y * (elapsedTime * 0.0008)) * 0.5
    points.rotation.y = 0.1 * elapsedTime

    // Update Orbital Controls
    //controls.update()
    

    // Render
    // renderer.render(scene, camera)
    effectComposer.render()


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

}

tick()