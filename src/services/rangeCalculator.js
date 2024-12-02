class RangeCalculator {
  /**
   * Calculate the total distance of a route
   * @param {Array} waypoints - Array of coordinate pairs [[lon1,lat1], [lon2,lat2],...]
   * @returns {Number} Total distance in nautical miles
   */
  calculateTotalDistance(waypoints) {
    let totalDistance = 0;
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      totalDistance += this.calculateDistance(
        waypoints[i],
        waypoints[i + 1]
      );
    }
    
    return totalDistance;
  }

  /**
   * Calculate distance between two points using the Haversine formula
   * @param {Array} point1 - [longitude, latitude]
   * @param {Array} point2 - [longitude, latitude]
   * @returns {Number} Distance in nautical miles
   */
  calculateDistance(point1, point2) {
    const R = 3440.065; // Earth's radius in nautical miles
    const [lon1, lat1] = point1;
    const [lon2, lat2] = point2;

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

module.exports = new RangeCalculator(); 