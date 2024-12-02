import ModelViewerService from '../services/modelViewerService';

class Fleet {
  constructor() {
    this.modelContainer = null;
    this.loadingElement = null;
    this.errorElement = null;
    this.detailsElement = null;
    this.initialize();
  }

  initialize() {
    // Get DOM elements
    this.modelContainer = document.getElementById('model-viewer');
    this.loadingElement = document.getElementById('loading-indicator');
    this.errorElement = document.getElementById('error-message');
    this.detailsElement = document.getElementById('aircraft-details');

    if (!this.modelContainer) {
      console.error('Model viewer container not found');
      return;
    }

    // Initialize Three.js viewer
    ModelViewerService.initialize(this.modelContainer);
    
    // Set up event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Aircraft selection buttons
    document.querySelectorAll('.aircraft-select').forEach(button => {
      button.addEventListener('click', (e) => {
        const aircraftId = e.target.dataset.aircraftId;
        if (aircraftId) {
          this.loadAircraftModel(aircraftId);
        }
      });
    });
  }

  showLoading(show) {
    if (this.loadingElement) {
      this.loadingElement.style.display = show ? 'block' : 'none';
    }
  }

  showError(message) {
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.style.display = 'block';
      setTimeout(() => {
        this.errorElement.style.display = 'none';
      }, 5000);
    }
  }

  updateAircraftDetails(aircraft) {
    if (this.detailsElement) {
      this.detailsElement.innerHTML = `
        <h2>${aircraft.name}</h2>
        <p>Manufacturer: ${aircraft.manufacturer}</p>
        <p>Range: ${aircraft.range} nm</p>
        <p>Passenger Capacity: ${aircraft.passengerCapacity}</p>
        <p>Cruising Speed: ${aircraft.cruisingSpeed} knots</p>
      `;
    }
  }

  async loadAircraftModel(aircraftId) {
    try {
      this.showLoading(true);
      
      // Get aircraft details from API
      const response = await fetch(`/api/aircraft/${aircraftId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch aircraft data');
      }
      const aircraft = await response.json();
      
      // Construct full model path
      const modelPath = `/models/${aircraft.modelPath}`;
      
      // Load the 3D model
      await ModelViewerService.loadModel(modelPath);
      
      // Update UI with aircraft details
      this.updateAircraftDetails(aircraft);
      
    } catch (error) {
      console.error('Failed to load aircraft model:', error);
      this.showError('Failed to load aircraft model');
    } finally {
      this.showLoading(false);
    }
  }

  destroy() {
    ModelViewerService.dispose();
  }
}

export default Fleet; 