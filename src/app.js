// app.js is the main entry point for your three.js 8th Wall app.

import { initScenePipelineModule } from './threejs-scene-init'
import * as THREE from 'three';

window.THREE = THREE

const startAR = () => {
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('ar-ui').style.display = 'block';

  const onxrloaded = () => {
    XR8.addCameraPipelineModules([  // Add camera pipeline modules.
      // Existing pipeline modules.
      XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
      XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
      XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
      LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.
      XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
      XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
      XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
      // Custom pipeline modules.
      initScenePipelineModule(),  // Sets up the threejs camera and scene content.
    ])

    const canvas = document.getElementById('camerafeed')
    // Open the camera and start running the camera run loop.
    XR8.run({ canvas })
  }

  window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-start-ar').addEventListener('click', startAR)
  
  document.getElementById('btn-tutorial').addEventListener('click', () => {
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('tutorial-screen').style.display = 'flex';
  })

  document.getElementById('btn-back-home').addEventListener('click', () => {
    document.getElementById('tutorial-screen').style.display = 'none';
    document.getElementById('home-screen').style.display = 'flex';

  })

  document.getElementById('btn-back-ar').addEventListener('click', () => {
    // Reloading is the cleanest way to completely exit an active 8th Wall XR session
    window.location.reload();
  })

  // Render tutorial steps
  const steps = [
    { title: 'Pindai Permukaan', detail: 'Arahkan kamera ke permukaan datar seperti lantai atau meja, lalu gerakkan perangkat perlahan hingga muncul indikator penempatan.' },
    { title: 'Pilih Model', detail: 'Pilih model furnitur yang ingin ditampilkan dari menu di bagian bawah layar.' },
    { title: 'Tambahkan Model', detail: 'Tekan tombol "Tambahkan" untuk meletakkan model yang dipilih ke dalam ruangan.' },
    { title: 'Atur Posisi', detail: 'Gunakan satu jari untuk menggeser model, dan dua jari untuk memutar (mencubit memutar) atau memperbesar/memperkecil (mencubit rentang).' },
    { title: 'Hapus Model', detail: 'Pilih model yang ada di ruangan dengan mengetuknya, lalu tekan tombol "Hapus" di sudut kanan atas untuk menghapusnya.' }
  ];

  const tutorialList = document.getElementById('tutorial-list');
  steps.forEach((step, index) => {
    const item = document.createElement('div');
    item.className = 'card bg-base-100 shadow-sm mb-4 border border-base-300';
    item.innerHTML = `
      <div class="card-body p-4">
        <h3 class="card-title text-primary"><span class="badge badge-primary mr-2">${index + 1}</span> ${step.title}</h3>
        <p class="text-sm opacity-80 mt-2">${step.detail}</p>
      </div>
    `;
    tutorialList.appendChild(item);
  });
});
