class RecommendationService {
  /**
   * Get recommended aircraft based on route and requirements
   * @param {Number} distance - Total route distance in nautical miles
   * @param {Number} passengers - Required passenger capacity
   * @param {Number} budget - Maximum budget
   * @returns {Promise<Array>} Sorted list of recommended aircraft
   */
  async getRecommendations(distance, passengers, budget) {
    try {
      const Aircraft = require('../models/Aircraft');
      
      // Find aircraft that meet the basic criteria
      const aircraft = await Aircraft.find({
        range: { $gte: distance },
        passengerCapacity: { $gte: passengers },
        price: { $lte: budget }
      });

      // Score and sort aircraft based on how well they match requirements
      const scoredAircraft = aircraft.map(plane => ({
        ...plane.toObject(),
        score: this.calculateScore(plane, distance, passengers, budget)
      }));

      return scoredAircraft.sort((a, b) => b.score - a.score);
    } catch (error) {
      throw new Error('Error getting aircraft recommendations: ' + error.message);
    }
  }

  /**
   * Calculate a match score for an aircraft
   * @private
   */
  calculateScore(aircraft, distance, passengers, budget) {
    const rangeScore = 1 - ((aircraft.range - distance) / aircraft.range);
    const passengerScore = 1 - ((aircraft.passengerCapacity - passengers) / aircraft.passengerCapacity);
    const budgetScore = 1 - (aircraft.price / budget);

    return (rangeScore + passengerScore + budgetScore) / 3;
  }
}

module.exports = new RecommendationService(); 