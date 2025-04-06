const Interview = require('../models/Interview');

class InterviewsRepository {
  /**
   * Create a new interview record in the database.
   * @param {Object} interview - The interview details to be saved.
   * @returns {Promise<Interview>} The newly created interview.
   */
  static async createInterview(interview) {
    try {
      return await Interview.create(interview);
    } catch (error) {
      console.error('Failed to create interview:', error);
      throw error;
    }
  }

  /**
   * Update an existing interview by its ID.
   * @param {number} id - ID of the interview to update.
   * @param {Object} updateData - New values to update the interview with.
   * @returns {Promise<Interview|null>} The updated interview or null if not found.
   */
  static async updateInterview(id, updateData) {
    try {
      const [updatedRowsCount] = await Interview.update(updateData, {
        where: { interview_id: id },
      });

      if (updatedRowsCount === 0) {
        return null; // No interview found with the given ID
      }

      // Return the updated interview
      return await Interview.findByPk(id);
    } catch (error) {
      console.error('Failed to update interview:', error);
      throw error;
    }
  }

  /**
   * Fetch all interview records.
   * @returns {Promise<Interview[]>} All interviews in the database.
   */
  static async getAllInterviews() {
    try {
      return await Interview.findAll();
    } catch (error) {
      console.error('Failed to fetch all interviews:', error);
      throw error;
    }
  }

  /**
   * Get an interview by its ID.
   * @param {number} id - The interview's unique ID.
   * @returns {Promise<Interview|null>} The matching interview or null if not found.
   */
  static async getInterviewById(id) {
    try {
      return await Interview.findByPk(id);
    } catch (error) {
      console.error('Failed to fetch interview by ID:', error);
      throw error;
    }
  }

  /**
   * Find interviews scheduled on a specific date.
   * @param {Date} date - Interview date to search for.
   * @returns {Promise<Interview[]>} Interviews on the given date.
   */
  static async getInterviewsByDate(date) {
    try {
      return await Interview.findAll({ where: { interview_date: date } });
    } catch (error) {
      console.error('Failed to fetch interviews by date:', error);
      throw error;
    }
  }

  /**
   * Find interviews by location.
   * @param {string} loc - Location to filter interviews by.
   * @returns {Promise<Interview[]>} Interviews at the specified location.
   */
  static async getInterviewsByLocation(loc) {
    try {
      return await Interview.findAll({ where: { location: loc } });
    } catch (error) {
      console.error('Failed to fetch interviews by location:', error);
      throw error;
    }
  }

  /**
   * Filter interviews based on reminder status.
   * @param {boolean} reminder - Whether the reminder has been sent.
   * @returns {Promise<Interview[]>} Interviews matching the reminder status.
   */
  static async getInterviewsByReminder(reminder) {
    try {
      return await Interview.findAll({ where: { reminder_sent: reminder } });
    } catch (error) {
      console.error('Failed to fetch interviews by reminder status:', error);
      throw error;
    }
  }

  /**
   * Retrieve interviews by their current status.
   * @param {string} status - Status to filter interviews by (e.g. 'scheduled').
   * @returns {Promise<Interview[]>} Interviews matching the given status.
   */
  static async getInterviewsByStatus(status) {
    try {
      return await Interview.findAll({ where: { interview_status: status } });
    } catch (error) {
      console.error('Failed to fetch interviews by status:', error);
      throw error;
    }
  }

  /**
   * Get all interviews linked to a specific application.
   * @param {number} applicationId - Application ID to search for.
   * @returns {Promise<Interview[]>} Interviews linked to the application.
   */
  static async getInterviewsByApplicationId(applicationId) {
    try {
      return await Interview.findAll({
        where: { application_id: applicationId },
      });
    } catch (error) {
      console.error('Failed to fetch interviews by application ID:', error);
      throw error;
    }
  }

  /**
   * Count how many interviews exist for a given status.
   * @param {Array<string>} status - Array of statuses to count (e.g., ['scheduled']).
   * @returns {Promise<Object>} An object mapping status to interview count.
   */
  static async countInterviewsByStatus(status) {
    try {
      const count = await Interview.count({
        where: { interview_status: status },
      });

      return { [status]: count || 0 };
    } catch (error) {
      console.error('Failed to count interviews by status:', error);
      throw error;
    }
  }

  /**
   * Delete an interview by its ID.
   * @param {number} id - ID of the interview to delete.
   * @returns {Promise<boolean>} True if deletion was successful, otherwise false.
   */
  static async deleteInterview(id) {
    try {
      const deleted = await Interview.destroy({
        where: { interview_id: id },
      });
      return deleted > 0;
    } catch (error) {
      console.error('Failed to delete interview:', error);
      throw error;
    }
  }
}

module.exports = InterviewsRepository;
