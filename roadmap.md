# SkyFarer MK II - Roadmap

This document outlines the milestones and features planned for the SkyFarer MK II project, focusing on delivering an ultra-modern, interactive app with advanced flight planning and jet recommendation features.

---

## Phase 1: Foundation Setup (Completed)
- [x] **HTML and CSS Framework**:
  - Created a responsive layout with sections for Home, Fleet, Mission, and Contact pages.
- [x] **Basic Three.js and Mapbox Integration**:
  - Set up a 3D model viewer for aircraft using Three.js.
  - Integrated Mapbox for displaying interactive maps.
- [x] **Search Filter Framework**:
  - Added basic filters for budget, range, and passenger capacity.

---

## Phase 2: Core Features and Enhancements (In Progress)
### **Flight Range Calculator**:
- [ ] Allow users to select multiple cities globally.
- [ ] Calculate the total travel range between selected cities using geolocation APIs.
- [ ] Visualize routes dynamically on a map with a polyline connecting the cities.
- [ ] Display route statistics, including total distance and estimated flight time.

### **Plane Recommendation System**:
- [ ] Develop an intelligent recommendation engine to filter planes based on:
  - Budget
  - Total range (calculated from selected cities)
  - Passenger count
- [ ] Rank and display results based on the best match for user criteria.

### **Search Filters**:
- [ ] Add a filter for passenger count to help narrow down options.
- [ ] Enhance the UI for filters, including dropdowns, sliders, and numeric inputs.
- [ ] Dynamically update search results in real time as filters are applied.

---

## Phase 3: Advanced Features
### **Interactive Map Enhancements**:
- [ ] Add draggable waypoints to customize flight paths.
- [ ] Include real-time distance updates when waypoints are adjusted.
- [ ] Support saved routes for frequent travelers.

### **3D Model Integration in Fleet Section**:
- [ ] Move aircraft model viewer to the Fleet page.
- [ ] Allow users to interact with 3D models of recommended planes.
- [ ] Highlight key features of each aircraft in an overlay (e.g., range, speed, capacity).

### **Loading Indicators and Animations**:
- [ ] Add loading spinners or progress bars for map updates and search results.
- [ ] Include smooth animations for transitions between pages and data updates.

---

## Phase 4: Polishing and Deployment
- [ ] **Performance Optimization**:
  - Optimize Mapbox and Three.js integrations for faster rendering and smoother interactions.
- [ ] **Responsive Design Testing**:
  - Ensure the app works seamlessly across mobile, tablet, and desktop devices.
- [ ] **Deployment**:
  - Host the app on Netlify or Vercel with a custom domain.

---

## Phase 5: Future Features
- [ ] **User Accounts and Preferences**:
  - Allow users to save favorite routes, planes, and searches.
- [ ] **Augmented Reality (AR) Features**:
  - Enable users to project aircraft into real-world spaces using AR.
- [ ] **Flight Cost Estimator**:
  - Calculate the cost of trips based on aircraft hourly rates, fuel consumption, and distance.
- [ ] **Global Airport Database**:
  - Allow users to select cities/airports directly from a comprehensive global database.

---

## Timeline
| Phase                  | Expected Completion |
|------------------------|---------------------|
| Phase 1: Foundation    | Complete           |
| Phase 2: Core Features | 3 weeks            |
| Phase 3: Advanced      | 1 month            |
| Phase 4: Polishing     | 1.5 months         |
| Phase 5: Future Plans  | Ongoing            |

---

## Notes
- Continuous feedback from users and aviation professionals will shape feature development.
- Collaborative testing with real-world data ensures accuracy for range calculations and recommendations.
- Prioritization of performance optimization is key to delivering a seamless experience.
