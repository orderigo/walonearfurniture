// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import cubeTexture from './assets/cube-texture.png'
import marbleCoffeeTableImg from './assets/images/marble-coffeetable.png'
import marbleCoffeeTableGlb from './assets/models/marble_coffee_table.glb?url'
import armchairImg from './assets/images/armchair.png'
import armchairGlb from './assets/models/armchair.glb?url'

const modelsCatalog = [
  {
    id: 'marble-coffee-table',
    image: marbleCoffeeTableImg,
    model: marbleCoffeeTableGlb
  },
  {
    id: 'armchair',
    image: armchairImg,
    model: armchairGlb
  }
]

export const initScenePipelineModule = () => {
  const purple = 0xAD50FF

  let activeModel

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add a purple cube that casts a shadow.
    const material = new THREE.MeshBasicMaterial()
    material.side = THREE.DoubleSide
    material.map = new THREE.TextureLoader().load(
      cubeTexture
    )
    material.color = new THREE.Color(0xAD50FF)

    activeModel = new THREE.Group()
    activeModel.position.set(0, 0.5, 0)
    scene.add(activeModel)

    // Add a plane that can receive shadows.
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    planeGeometry.rotateX(-Math.PI / 2)

    const planeMaterial = new THREE.ShadowMaterial()
    planeMaterial.opacity = 0.67

    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    scene.add(plane)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2, 2)
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'threejsinitscene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs

      initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.

      // Setup UI listeners
      const bottomMenu = document.getElementById('bottom-menu')
      const loader = new GLTFLoader()

      // Clear static HTML if any
      bottomMenu.innerHTML = ''

      const loadModel = (url) => {
        loader.load(url, (gltf) => {
          activeModel.clear()
          const model = gltf.scene
          
          // Auto-scale and center
          const box = new THREE.Box3().setFromObject(model)
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          
          // Normalize scale so the largest dimension is 1 meter
          if (maxDim > 0 && maxDim !== 1) {
            const scale = 1 / maxDim
            model.scale.set(scale, scale, scale)
          }
          
          // Recompute box after scaling
          box.setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          
          // Center the model in X and Z, and place it at Y=0 relative to activeModel
          model.position.x = -center.x
          model.position.y = -box.min.y // place bottom at Y=0
          model.position.z = -center.z
          
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true
              node.receiveShadow = true
            }
          })
          activeModel.add(model)
        }, undefined, (error) => {
          console.error('Error loading model:', error)
        })
      }

      // Dynamically populate UI
      modelsCatalog.forEach((item, index) => {
        const img = document.createElement('img')
        img.src = item.image
        img.className = 'menu-item'
        if (index === 0) img.classList.add('active')
        
        img.addEventListener('click', () => {
          // Update active styling
          document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'))
          img.classList.add('active')
          
          loadModel(item.model)
        })
        
        bottomMenu.appendChild(img)
      })

      // Load initial model
      if (modelsCatalog.length > 0) {
        loadModel(modelsCatalog[0].model)
      }

      let touchState = 0
      let lastTouch1 = null
      let lastTouch2 = null
      let touchMoved = false

      const getDistance = (t1, t2) => {
        return Math.sqrt(Math.pow(t1.clientX - t2.clientX, 2) + Math.pow(t1.clientY - t2.clientY, 2))
      }

      const getAngle = (t1, t2) => {
        return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX)
      }

      canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          touchState = 1
          lastTouch1 = e.touches[0]
          touchMoved = false
        } else if (e.touches.length === 2) {
          touchState = 2
          lastTouch1 = e.touches[0]
          lastTouch2 = e.touches[1]
          touchMoved = true
        }
      }, {passive: false})

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault()
        touchMoved = true
        if (touchState === 1 && e.touches.length === 1) {
          // Pan (Translate)
          const touch = e.touches[0]
          const dx = touch.clientX - lastTouch1.clientX
          const dy = touch.clientY - lastTouch1.clientY

          // Translate cube (basic pixel to world unit mapping)
          activeModel.position.x += dx * 0.005
          activeModel.position.z += dy * 0.005

          lastTouch1 = touch
        } else if (touchState === 2 && e.touches.length === 2) {
          // Pinch & Rotate
          const t1 = e.touches[0]
          const t2 = e.touches[1]

          const dist = getDistance(t1, t2)
          const angle = getAngle(t1, t2)

          const lastDist = getDistance(lastTouch1, lastTouch2)
          const lastAngle = getAngle(lastTouch1, lastTouch2)

          // Scale
          const scaleDiff = dist / lastDist
          activeModel.scale.multiplyScalar(scaleDiff)

          // Rotate
          const angleDiff = angle - lastAngle
          activeModel.rotation.y -= angleDiff

          lastTouch1 = t1
          lastTouch2 = t2
        }
      }, {passive: false})

      canvas.addEventListener('touchend', (e) => {
        if (touchState === 1 && !touchMoved && e.touches.length === 0) {
          // Tap! Recenter the content (similar to what it was before)
          XR8.XrController.recenter()
        }

        if (e.touches.length === 0) {
          touchState = 0
        } else if (e.touches.length === 1) {
          touchState = 1
          lastTouch1 = e.touches[0]
        }
      })

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion}
      )
    },
  }
}
