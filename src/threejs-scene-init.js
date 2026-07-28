// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const modelsCatalog = [
  {
    id: "marble-coffee-table",
    title: "Meja Kayu",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781181257/3D%20Models/image/wood_table.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781181179/3D%20Models/wood_table.glb",
    material: "Solid Wood",
    dimensions: "120cm x 60cm x 45cm",
    price: 1500000,
    category: "Tables"
  },
  {
    id: "white-table",
    title: "Meja Putih",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781173883/3D%20Models/image/marble-coffeetable.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781173756/3D%20Models/marble_coffee_table.glb",
    material: "Marble & Metal",
    dimensions: "100cm x 60cm x 40cm",
    price: 2500000,
    category: "Tables"
  },
  {
    id: "green-chair",
    title: "Kursi Hijau",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180327/3D%20Models/image/Wood_Chair.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/wood_chair.glb",
    material: "Wood & Fabric",
    dimensions: "50cm x 50cm x 80cm",
    price: 800000,
    category: "Chairs"
  },
  {
    id: "frog-chair",
    title: "Kursi Kodok",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180327/3D%20Models/image/frog_chair.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/frog_chair.glb",
    material: "Plastic & Metal",
    dimensions: "45cm x 45cm x 75cm",
    price: 600000,
    category: "Chairs"
  },
  {
    id: "modern-wood-door",
    title: "Pintu Kayu Modern",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180327/3D%20Models/image/modern_wood_door.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/modern_wood_door.glb",
    material: "Solid Wood",
    dimensions: "210cm x 80cm x 5cm",
    price: 3500000,
    category: "Doors"
  },
  {
    id: "modern-door",
    title: "Pintu Modern",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180327/3D%20Models/image/modern_door.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/modern_door.glb",
    material: "Metal & Glass",
    dimensions: "210cm x 80cm x 4cm",
    price: 4500000,
    category: "Doors"
  },
  {
    id: "bed",
    title: "Tempat Tidur",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180327/3D%20Models/image/bed.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/bed.glb",
    material: "Wood & Fabric",
    dimensions: "200cm x 150cm x 60cm",
    price: 8500000,
    category: "Beds"
  },
  {
    id: "bed-minecraft",
    title: "Tempat Tidur Minecraft",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180327/3D%20Models/image/bed_minecraft.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/bed_minecraft.glb",
    material: "Wood & Fabric",
    dimensions: "200cm x 100cm x 50cm",
    price: 5500000,
    category: "Beds"
  },
  {
    id: "modern-wardrobe",
    title: "Lemari Modern",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781183501/3D%20Models/image/bed_wardrobe.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/modern_wardrobe.glb",
    material: "Metal & Glass",
    dimensions: "120cm x 60cm x 180cm",
    price: 6500000,
    category: "Storage"
  },
  {
    id: "wooden-wardrobe",
    title: "Lemari Kayu",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781183326/3D%20Models/image/wooden_drawer.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/wooden_wardrobe.glb",
    material: "Solid Wood",
    dimensions: "100cm x 50cm x 150cm",
    price: 4800000,
    category: "Storage"
  },
  {
    id: "table-lamp",
    title: "Lampu Meja",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180327/3D%20Models/image/table_lamp.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/table_lamp.glb",
    material: "Metal & Glass",
    dimensions: "30cm x 30cm x 50cm",
    price: 450000,
    category: "Lighting"
  },
  {
    id: "tree-lamp",
    title: "Lampu Pohon",
    image:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180327/3D%20Models/image/tree_lamp.png",
    model:
      "https://res.cloudinary.com/dv6fgxnug/image/upload/v1781180061/3D%20Models/tree_lamp.glb",
    material: "Metal & Glass",
    dimensions: "40cm x 40cm x 150cm",
    price: 1200000,
    category: "Lighting"
  },
];

// Find model by ID
const getModelById = (id) => {
  return modelsCatalog.find(model => model.id === id);
};

export const initScenePipelineModule = () => {
  const purple = 0xAD50FF

  let modelGroup

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({ scene, camera, renderer }) => {
    // Enable shadows in the renderer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    modelGroup = new THREE.Group()
    modelGroup.position.set(0, 0, 0)
    scene.add(modelGroup)

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
    onStart: ({ canvas }) => {
      const { scene, camera, renderer } = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs

      initXrScene({ scene, camera, renderer })  // Add objects set the starting camera position.

      // Setup UI listeners
      const bottomMenu = document.getElementById('bottom-menu')
      const loader = new GLTFLoader()

      // Clear static HTML if any
      bottomMenu.innerHTML = ''

      const topRightMenu = document.getElementById('top-right-menu')
      const modelTitleLabel = document.getElementById('model-title')
      const deleteBtn = document.getElementById('delete-btn')
      const infoPanel = document.getElementById('ar-info-panel');
      const btnCloseInfo = document.getElementById('btn-close-info');
      const btnMessengerOrder = document.getElementById('btn-messenger-order');
      const btnTelegramOrder = document.getElementById('btn-telegram-order');
      
      let selectedModel = null

      const selectModel = (model) => {
        // Remove highlight from previously selected model
        if (selectedModel) {
          selectedModel.traverse((node) => {
            if (node.isMesh && node.material && node.userData.originalEmissive !== undefined) {
              node.material.emissive.setHex(node.userData.originalEmissive)
            }
          })
        }

        selectedModel = model

        if (model) {
          topRightMenu.style.display = 'flex'
          modelTitleLabel.textContent = model.userData.title || 'Model'
          // Add highlight overlay (Contrasting Blue)
          model.traverse((node) => {
            if (node.isMesh && node.material) {
              node.material.emissive.setHex(0x0088ff) // High contrast blue
            }
          })
        } else {
          topRightMenu.style.display = 'none'
        }
      }

      deleteBtn.addEventListener('click', () => {
        if (selectedModel) {
          modelGroup.remove(selectedModel)
          selectModel(null)
        }
      })

      // Close info panel
      btnCloseInfo?.addEventListener('click', () => {
        if (infoPanel) {
          infoPanel.style.display = 'none';
        }
      });

      // Order buttons in info panel
      btnMessengerOrder?.addEventListener('click', () => {
        const modelData = selectedModel?.userData || {};
        const message = encodeURIComponent(`🛋️ I am interested in this furniture: ${modelData.title || 'Furniture'}
Price: MMK ${(modelData.price || 0).toLocaleString()}

I would like to place an order. Please contact me!`);
        window.open(`https://m.me/?text=${message}`, '_blank');
      });

      btnTelegramOrder?.addEventListener('click', () => {
        const modelData = selectedModel?.userData || {};
        const message = encodeURIComponent(`🛋️ I am interested in this furniture: ${modelData.title || 'Furniture'}
Price: MMK ${(modelData.price || 0).toLocaleString()}

I would like to place an order. Please contact me!`);
        window.open(`https://t.me/share?text=${message}`, '_blank');
      });

      const loadModel = (item) => {
        loader.load(item.model, (gltf) => {
          const instanceGroup = new THREE.Group()
          const model = gltf.scene.clone()

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

          // Center the model's visual bounding box inside the instanceGroup
          model.position.x = -center.x
          model.position.y = -box.min.y // place bottom at Y=0
          model.position.z = -center.z

          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true
              node.receiveShadow = true

              // Clone material so we can highlight instances independently
              if (node.material) {
                node.material = node.material.clone()
                if (node.material.emissive) {
                  node.userData.originalEmissive = node.material.emissive.getHex()
                } else {
                  node.userData.originalEmissive = 0x000000
                }
              }
            }
          })

          instanceGroup.userData = { ...item };
          instanceGroup.add(model)

          // Spawn 3.0 meters in front of the current camera position
          const spawnDistance = 3.0
          const cameraDirection = new THREE.Vector3()
          camera.getWorldDirection(cameraDirection)
          cameraDirection.y = 0 // Keep horizontal

          if (cameraDirection.lengthSq() > 0.0001) {
            cameraDirection.normalize()
          } else {
            cameraDirection.set(0, 0, -1)
          }

          const spawnPosition = camera.position.clone().add(cameraDirection.multiplyScalar(spawnDistance))
          spawnPosition.y = 0 // Ensure it's on the ground

          instanceGroup.position.copy(spawnPosition)

          // Make the object face the user (camera)
          instanceGroup.lookAt(new THREE.Vector3(camera.position.x, 0, camera.position.z))

          modelGroup.add(instanceGroup)
          selectModel(instanceGroup)
        }, undefined, (error) => {
          console.error('Error loading model:', error)
        })
      }

      let pendingModelToLoad = null
      const addMenu = document.getElementById('add-menu')
      const addBtn = document.getElementById('add-btn')

      addBtn.addEventListener('click', () => {
        if (pendingModelToLoad) {
          loadModel(pendingModelToLoad)

          // Reset add menu state after adding
          addMenu.style.display = 'none'
          document.querySelectorAll('.menu-item').forEach(m => {
            m.classList.remove('ring', 'ring-primary', 'ring-8')
          })
          pendingModelToLoad = null
        }
      })

      modelsCatalog.forEach((item, index) => {
        const img = document.createElement('img')
        img.src = item.image
        img.className = 'menu-item size-20 object-cover rounded-box cursor-pointer bg-base-100 transition-all hover:scale-105 active:scale-95'

        img.addEventListener('click', () => {
          // Update active styling
          document.querySelectorAll('.menu-item').forEach(m => {
            m.classList.remove('ring', 'ring-primary', 'ring-8')
          })
          img.classList.add('ring', 'ring-primary', 'ring-8')

          pendingModelToLoad = item
          addMenu.style.display = 'flex'
          addBtn.textContent = `Tambahkan ${item.title}`
        })

        bottomMenu.appendChild(img)
      })

      let touchState = 0
      let lastTouch1 = null
      let lastTouch2 = null
      let touchMoved = false
      let lastTapTime = 0
      let tapCount = 0

      const getDistance = (t1, t2) => {
        return Math.sqrt(Math.pow(t1.clientX - t2.clientX, 2) + Math.pow(t1.clientY - t2.clientY, 2))
      }

      const getAngle = (t1, t2) => {
        return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX)
      }

      canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          const currentTime = Date.now();
          const tapLength = currentTime - lastTapTime;
          
          // Check for double tap
          if (tapLength < 300 && tapLength > 0 && !touchMoved) {
            tapCount++;
            if (tapCount === 2) {
              // Double tap detected - show model info
              const touch = e.touches[0];
              const rect = canvas.getBoundingClientRect();
              const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
              const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

              const raycaster = new THREE.Raycaster();
              raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

              const intersects = raycaster.intersectObjects(modelGroup.children, true);

              if (intersects.length > 0) {
                let object = intersects[0].object;
                while (object.parent && object.parent !== modelGroup) {
                  object = object.parent;
                }
                
                // Show info panel with model data
                if (object.userData && object.userData.title) {
                  window.showModelInfo(object.userData);
                }
              }
              
              tapCount = 0;
              e.preventDefault();
              return;
            }
          } else {
            tapCount = 1;
          }
          
          lastTapTime = currentTime;
          
          touchState = 1
          lastTouch1 = e.touches[0]
          touchMoved = false
        } else if (e.touches.length === 2) {
          touchState = 2
          lastTouch1 = e.touches[0]
          lastTouch2 = e.touches[1]
          touchMoved = true
          tapCount = 0
        }
      }, { passive: false })

      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault()
        touchMoved = true
        tapCount = 0
        
        if (touchState === 1 && e.touches.length === 1) {
          // Pan (Translate)
          const touch = e.touches[0]
          const dx = touch.clientX - lastTouch1.clientX
          const dy = touch.clientY - lastTouch1.clientY

          // Translate selected model (basic pixel to world unit mapping)
          if (selectedModel) {
            selectedModel.position.x += dx * 0.005
            selectedModel.position.z += dy * 0.005
          }

          lastTouch1 = touch
        } else if (touchState === 2 && e.touches.length === 2) {
          // Pinch & Rotate
          const t1 = e.touches[0]
          const t2 = e.touches[1]

          const dist = getDistance(t1, t2)
          const angle = getAngle(t1, t2)

          const lastDist = getDistance(lastTouch1, lastTouch2)
          const lastAngle = getAngle(lastTouch1, lastTouch2)

          if (selectedModel) {
            // Scale
            const scaleDiff = dist / lastDist
            selectedModel.scale.multiplyScalar(scaleDiff)

            // Rotate
            const angleDiff = angle - lastAngle
            selectedModel.rotation.y -= angleDiff
          }

          lastTouch1 = t1
          lastTouch2 = t2
        }
      }, { passive: false })

      canvas.addEventListener('touchend', (e) => {
        if (touchState === 1 && !touchMoved && e.touches.length === 0 && lastTouch1) {
          // Tap! Raycast to select model
          const rect = canvas.getBoundingClientRect()
          const x = ((lastTouch1.clientX - rect.left) / rect.width) * 2 - 1
          const y = -((lastTouch1.clientY - rect.top) / rect.height) * 2 + 1

          const raycaster = new THREE.Raycaster()
          raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

          const intersects = raycaster.intersectObjects(modelGroup.children, true)

          if (intersects.length > 0) {
            let object = intersects[0].object
            while (object.parent && object.parent !== modelGroup) {
              object = object.parent
            }
            selectModel(object)
          } else {
            selectModel(null)
          }
        }

        if (e.touches.length === 0) {
          touchState = 0
        } else if (e.touches.length === 1) {
          touchState = 1
          lastTouch1 = e.touches[0]
        }
      })

      // Sync the xr controller's 6DoF position and camera parameters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        { origin: camera.position, facing: camera.quaternion }
      )
    },
  }
}

// Export model catalog for use in other modules
export { modelsCatalog, getModelById }