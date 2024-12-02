import '../public/css/styles.css'
import { AircraftViewer } from '@components/AircraftViewer'

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D viewer if we're on the model page
  const modelContainer = document.getElementById('model-container')
  if (modelContainer) {
    const viewer = new AircraftViewer('model-container')
    viewer.animate()
  }
}) 