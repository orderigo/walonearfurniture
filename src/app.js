// app.js is the main entry point for your three.js 8th Wall app.

import { initScenePipelineModule } from './threejs-scene-init'
import * as THREE from 'three';

window.THREE = THREE

// Global variables for capture functionality
let mediaRecorder = null;
let recordedChunks = [];
let recordingStartTime = null;
let recordingInterval = null;

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
    { title: 'Double Tap Info', detail: 'Double tap pada furnitur untuk melihat informasi detail dan opsi pembelian.' },
    { title: 'Capture & Share', detail: 'Gunakan tombol kamera untuk mengambil foto/video dan bagikan ke Messenger/Telegram untuk pemesanan.' }
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

  // Initialize capture functionality
  initCaptureFunctionality();
});

function initCaptureFunctionality() {
  const canvas = document.getElementById('camerafeed');
  const btnCapturePhoto = document.getElementById('btn-capture-photo');
  const btnCaptureVideo = document.getElementById('btn-capture-video');
  const capturePreviewModal = document.getElementById('capture-preview-modal');
  const capturePreviewImage = document.getElementById('capture-preview-image');
  const capturePreviewVideo = document.getElementById('capture-preview-video');
  const btnClosePreview = document.getElementById('btn-close-preview');
  const btnShareMessenger = document.getElementById('btn-share-messenger');
  const btnShareTelegram = document.getElementById('btn-share-telegram');
  const btnDownloadCapture = document.getElementById('btn-download-capture');
  const recordingIndicator = document.getElementById('recording-indicator');
  const recordingTime = document.getElementById('recording-time');

  let isRecording = false;
  let capturedImageDataUrl = null;
  let capturedVideoBlob = null;

  // Photo capture
  btnCapturePhoto?.addEventListener('click', async () => {
    try {
      // Use 8th Wall's screenshot API if available
      if (window.XR8 && XR8.screenshot) {
        const screenshot = await XR8.screenshot();
        capturedImageDataUrl = screenshot;
        showCapturePreview('image');
      } else {
        // Fallback: capture canvas
        capturedImageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        showCapturePreview('image');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('Failed to capture photo. Please try again.');
    }
  });

  // Video capture
  btnCaptureVideo?.addEventListener('click', async () => {
    try {
      if (!isRecording) {
        // Start recording
        const stream = await getCameraStream();
        if (!stream) {
          alert('Could not access camera stream');
          return;
        }

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        recordedChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          capturedVideoBlob = new Blob(recordedChunks, { type: 'video/webm' });
          const videoUrl = URL.createObjectURL(capturedVideoBlob);
          capturePreviewVideo.src = videoUrl;
          capturePreviewVideo.style.display = 'block';
          capturePreviewImage.style.display = 'none';
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          showCapturePreview('video');
          
          // Reset state
          isRecording = false;
          recordingIndicator.style.display = 'none';
          clearInterval(recordingInterval);
          btnCaptureVideo.classList.remove('btn-error');
          btnCaptureVideo.classList.add('btn-secondary');
          btnCaptureVideo.innerHTML = '<i class="fas fa-video"></i>';
        };

        mediaRecorder.start();
        isRecording = true;
        recordingStartTime = Date.now();
        
        // Show recording indicator
        recordingIndicator.style.display = 'flex';
        updateRecordingTime();
        recordingInterval = setInterval(updateRecordingTime, 1000);
        
        // Change button appearance
        btnCaptureVideo.classList.remove('btn-secondary');
        btnCaptureVideo.classList.add('btn-error');
        btnCaptureVideo.innerHTML = '<i class="fas fa-stop"></i>';
        
      } else {
        // Stop recording
        mediaRecorder.stop();
      }
    } catch (error) {
      console.error('Error starting video capture:', error);
      alert('Failed to start video recording. Please try again.');
      isRecording = false;
      recordingIndicator.style.display = 'none';
      clearInterval(recordingInterval);
    }
  });

  function updateRecordingTime() {
    if (!recordingStartTime) return;
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    recordingTime.textContent = `${minutes}:${seconds}`;
  }

  function getCameraStream() {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => resolve(stream))
          .catch(error => reject(error));
      } else {
        reject(new Error('MediaDevices API not supported'));
      }
    });
  }

  function showCapturePreview(type) {
    const modal = document.getElementById('capture-preview-modal');
    const image = document.getElementById('capture-preview-image');
    const video = document.getElementById('capture-preview-video');
    
    if (type === 'image') {
      image.src = capturedImageDataUrl;
      image.style.display = 'block';
      video.style.display = 'none';
    } else {
      image.style.display = 'none';
      video.style.display = 'block';
    }
    
    modal.style.display = 'flex';
  }

  btnClosePreview?.addEventListener('click', () => {
    document.getElementById('capture-preview-modal').style.display = 'none';
    if (capturedVideoBlob) {
      URL.revokeObjectURL(capturePreviewVideo.src);
    }
  });

  btnDownloadCapture?.addEventListener('click', () => {
    if (capturedImageDataUrl) {
      const link = document.createElement('a');
      link.href = capturedImageDataUrl;
      link.download = 'furniture-ar-capture-' + new Date().getTime() + '.jpg';
      link.click();
    } else if (capturedVideoBlob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(capturedVideoBlob);
      link.download = 'furniture-ar-video-' + new Date().getTime() + '.webm';
      link.click();
      URL.revokeObjectURL(link.href);
    }
  });

  // Share to Messenger
  btnShareMessenger?.addEventListener('click', () => {
    const selectedModel = window.selectedModelForSharing || {};
    const modelTitle = selectedModel.title || 'Furniture';
    const modelPrice = selectedModel.price || 'Price on request';
    
    const message = encodeURIComponent(`🛋️ I am interested in this furniture: ${modelTitle}
Price: MMK ${modelPrice.toLocaleString()}

I would like to place an order. Please contact me!`);
    
    // Open Messenger with pre-filled message
    window.open(`https://m.me/?text=${message}`, '_blank');
    
    // Close preview after a delay
    setTimeout(() => {
      document.getElementById('capture-preview-modal').style.display = 'none';
    }, 500);
  });

  // Share to Telegram
  btnShareTelegram?.addEventListener('click', () => {
    const selectedModel = window.selectedModelForSharing || {};
    const modelTitle = selectedModel.title || 'Furniture';
    const modelPrice = selectedModel.price || 0;
    
    const message = encodeURIComponent(`🛋️ I am interested in this furniture: ${modelTitle}
Price: MMK ${modelPrice.toLocaleString()}

I would like to place an order. Please contact me!`);
    
    // Open Telegram with pre-filled message
    window.open(`https://t.me/share?text=${message}`, '_blank');
    
    // Close preview after a delay
    setTimeout(() => {
      document.getElementById('capture-preview-modal').style.display = 'none';
    }, 500);
  });

  // Close modal when clicking outside
  capturePreviewModal?.addEventListener('click', (e) => {
    if (e.target === capturePreviewModal) {
      capturePreviewModal.style.display = 'none';
    }
  });
}

// Make functions available globally for threejs-scene-init.js
window.capturePhoto = () => {
  document.getElementById('btn-capture-photo')?.click();
};

window.captureVideo = () => {
  document.getElementById('btn-capture-video')?.click();
};

window.showModelInfo = (modelData) => {
  const infoPanel = document.getElementById('ar-info-panel');
  const infoTitle = document.getElementById('info-model-title');
  const infoImage = document.querySelector('#info-model-image img');
  const infoMaterial = document.getElementById('info-material');
  const infoDimensions = document.getElementById('info-dimensions');
  const infoPrice = document.getElementById('info-price');
  const infoCategory = document.getElementById('info-category');
  
  if (!infoPanel) return;
  
  infoTitle.textContent = modelData.title || 'Model';
  infoImage.src = modelData.image || '';
  infoMaterial.textContent = modelData.material || 'Wood/Metal';
  infoDimensions.textContent = modelData.dimensions || 'Varies';
  infoPrice.textContent = modelData.price ? 'MMK ' + modelData.price.toLocaleString() : 'Contact for price';
  infoCategory.textContent = modelData.category || 'Furniture';
  
  // Store for sharing
  window.selectedModelForSharing = modelData;
  
  infoPanel.style.display = 'block';
};

window.hideModelInfo = () => {
  const infoPanel = document.getElementById('ar-info-panel');
  if (infoPanel) {
    infoPanel.style.display = 'none';
  }
};

export { startAR, initCaptureFunctionality }