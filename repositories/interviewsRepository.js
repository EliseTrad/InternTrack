const Interview = require('../models/Interview');

class InterviewsRepository {
  /**
   * Create a new interview record.
   * @param {Object} interview - The interview object.
   * @returns {Promise<Interview>} The created interview object.
   */
  static async createInterview(interview) {
    try {
      return await Interview.create(interview);
    } catch (error) {
      console.error('Error creating interview:', error);
      throw error;
    }
  }

  /**
   * Updates an interview by its ID.
   * @param {number} id - The unique ID of the interview to update.
   * @param {Object} updatedData - The data to update.
   * @returns {Promise<Interview|null>} The updated interview object or null if not found.
   */
  static async updateInterview(id, updateData) {
    try {
      // Perform the update operation
      const [updatedRowsCount] = await Interview.update(updateData, {
        where: { interview_id: id },
      });

      // If no rows were updated, return null
      if (updatedRowsCount === 0) {
        return null; // Indicate that no interview was found with the given ID
      }

      // Fetch and return the updated application
      const updatedInterview = await Interview.findByPk(id);
      return updatedInterview;
    } catch (error) {
      console.error(
        'Error in InterviewsRepository while updating interview:',
        error
      );
      throw error; // Propagate the raw database error to the service layer
    }
  }

  /**
   * Retrieves all interviews.
   * @returns {Promise<Interview[]>} List of interviews.
   */
  static async getAllInterviews() {
    try {
      return await Interview.findAll();
    } catch (error) {
      console.error('Error fetching interviews:', error);
      throw error;
    }
  }

  /**
   * Retrieves an interview by its ID.
   * @param {number} id - The unique ID of the interview.
   * @returns {Promise<Interview|null>} The interview object if found, or null if not found.
   */
  static async getInterviewById(id) {
    try {
      return await Interview.findByPk(id);
    } catch (error) {
      console.error('Error fetching the interview:', error);
      throw error;
    }
  }

  /**
   * Retrieves interviews by date.
   * @param {Date} date - The date of the interview.
   * @returns {Promise<Interview[]>} List of interviews on the given date.
   */
  static async getInterviewsByDate(date) {
    try {
      return await Interview.findAll({ where: { interview_date: date } });
    } catch (error) {
      console.error('Error fetching interviews by date:', error);
      throw error;
    }
  }

  /**
   * Retrieves interviews by location.
   * @param {string} loc - The location of the interview.
   * @returns {Promise<Interview[]>} List of interviews in the given location.
   */
  static async getInterviewsByLocation(loc) {
    try {
      return await Interview.findAll({ where: { location: loc } });
    } catch (error) {
      console.error('Error fetching interviews by location:', error);
      throw error;
    }
  }

  /**
   * Retrieves interviews by sent reminder status.
   * @param {boolean} reminder - Whether a reminder was sent.
   * @returns {Promise<Interview[]>} List of interviews matching the reminder status.
   */
  static async getInterviewsByReminder(reminder) {
    try {
      return await Interview.findAll({ where: { reminder_sent: reminder } });
    } catch (error) {
      console.error('Error fetching interviews by reminder status:', error);
      throw error;
    }
  }

  /**
   * Retrieves interviews by their status.
   * @param {string} status - The status of the interviews ('scheduled', 'completed', etc.).
   * @returns {Promise<Interview[]>} List of interviews with the given status.
   */
  static async getInterviewsByStatus(status) {
    try {
      return await Interview.findAll({ where: { interview_status: status } });
    } catch (error) {
      console.error('Error fetching interviews by status:', error);
      throw error;
    }
  }

  /**
   * Retrieves interviews by application ID.
   * @param {number} applicationId - The ID of the associated application.
   * @returns {Promise<Interview[]>} List of interviews linked to the given application ID.
   */
  static async getInterviewsByApplicationId(applicationId) {
    try {
      return await Interview.findAll({
        where: { application_id: applicationId },
      });
    } catch (error) {
      console.error('Error fetching interviews by application ID:', error);
      throw error;
    }
  }

  /**
   * Counts the number of interviews for each status.
   * @param {Array<string>} status - Status values to filter interviews by
   *  (e.g., ['scheduled', 'completed']).
   * @returns {Promise<Object>} A mapping of status to the count of interviews in that status.
   */
  static async countInterviewsByStatus(status) {
    try {
      const count = await Interview.count({
        where: { interview_status: status },
      });

      return { [status]: count || 0 };
    } catch (error) {
      console.error('Error counting interviews by status:', error);
      throw error;
    }
  }

  /**
   * Deletes an interview by its ID.
   * @param {number} id - The unique ID of the interview.
   * @returns {Promise<boolean>} True if the interview was deleted, false if not found.
   */
  static async deleteInterview(id) {
    try {
      const deleted = await Interview.destroy({
        where: { interview_id: id },
      });
      return deleted > 0;
    } catch (error) {
      console.error('Error deleting interview:', error);
      throw error;
    }
  }
}

module.exports = InterviewsRepository;
