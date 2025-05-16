const InterviewsRepository = require('../repositories/interviewsRepository');
const { NotFound } = require('../errors/customError');
const ApplicationsRepository = require('../repositories/applicationsRepository');

class InterviewsService {
  /**
   * Creates a new interview in the database.
   * @param {Object} interview - The interview object.
   * @returns {Promise<Object>} The created interview.
   * @throws {Error} If there is an issue creating the interview.
   */
  static async createInterview(interview) {
    try {
      const { application_id } = interview;

      const applicationExists =
        await ApplicationsRepository.getApplicationById(application_id);
      if (!applicationExists) {
        throw new NotFound(`Application with ID ${application_id} not found.`);
      }

      // Ensure reminder_sent is always false
      interview.reminder_sent = false;

      return await InterviewsRepository.createInterview(interview);
    } catch (error) {
      console.error(
        'Error in InterviewsService while creating interview:',
        error
      );
      throw error;
    }
  }

  /**
   * Updates an interview by its ID.
   * @param {number} id - The ID of the interview to update.
   * @param {Object} updateData - Fields to update.
   * @returns {Promise<Object>} The updated interview.
   * @throws {NotFound|Error} If the interview is not found or there's a database error.
   */
  static async updateInterview(id, updateData) {
    try {
      // Check if the interview exists
      const existingInterview = await InterviewsRepository.getInterviewById(id);
      if (!existingInterview) {
        throw new NotFound(`Interview with ID ${id} not found.`);
      }

      if (updateData.application_id) {
        const applicationExists =
          await ApplicationsRepository.getApplicationById(
            updateData.application_id
          );
        if (!applicationExists) {
          throw new NotFound(
            `Application with ID ${updateData.application_id} not found.`
          );
        }
      }

      const updatedInterview = await InterviewsRepository.updateInterview(
        id,
        updateData
      );

      return updatedInterview;
    } catch (error) {
      console.error(
        'Error in InterviewsService while updating interview:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves all interviews from the database.
   * @returns {Promise<Object[]>} List of interviews.
   * @throws {Error} If there is an issue fetching interviews.
   */
  static async getAllInterviews() {
    try {
      return await InterviewsRepository.getAllInterviews();
    } catch (error) {
      console.error(
        'Error in InterviewsService while fetching all interviews:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves an interview by its ID.
   * @param {number} id - The ID of the interview.
   * @returns {Promise<Object>} The interview object.
   * @throws {NotFound|Error} If the interview is not found or there's a database error.
   */
  static async getInterviewById(id) {
    try {
      const interview = await InterviewsRepository.getInterviewById(id);

      if (!interview) {
        throw new NotFound(`Interview with ID ${id} not found.`);
      }

      return interview;
    } catch (error) {
      console.error(
        'Error in InterviewsService while fetching interview by ID:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves interviews by date.
   * @param {Date} date - The date of the interview.
   * @returns {Promise<Object[]>} List of interviews on the given date.
   * @throws {NotFound|Error} If no interviews are found or there's a database error.
   */
  static async getInterviewsByDate(date) {
    try {
      const interviews = await InterviewsRepository.getInterviewsByDate(date);

      if (!interviews || interviews.length === 0) {
        throw new NotFound(`No interviews found for date ${date}.`);
      }

      return interviews;
    } catch (error) {
      console.error(
        'Error in InterviewsService while fetching interviews by date:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves interviews by location.
   * @param {string} loc - The location of the interview.
   * @returns {Promise<Object[]>} List of interviews in the given location.
   * @throws {NotFound|Error} If no interviews are found or there's a database error.
   */
  static async getInterviewsByLocation(loc) {
    try {
      const interviews =
        await InterviewsRepository.getInterviewsByLocation(loc);

      if (!interviews || interviews.length === 0) {
        throw new NotFound(`No interviews found for location ${loc}.`);
      }

      return interviews;
    } catch (error) {
      console.error(
        'Error in InterviewsService while fetching interviews by location:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves interviews by reminder status.
   * @param {boolean} reminder - Whether a reminder was sent.
   * @returns {Promise<Object[]>} List of interviews matching the reminder status.
   * @throws {NotFound|Error} If no interviews are found or there's a database error.
   */
  static async getInterviewsByReminder(reminder) {
    try {
      const interviews =
        await InterviewsRepository.getInterviewsByReminder(reminder);

      if (!interviews || interviews.length === 0) {
        throw new NotFound(
          `No interviews found with reminder status ${reminder}.`
        );
      }

      return interviews;
    } catch (error) {
      console.error(
        'Error in InterviewsService while fetching interviews by reminder status:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves interviews by status.
   * @param {string} status - The status of the interviews ('scheduled', 'completed', etc.).
   * @returns {Promise<Object[]>} List of interviews with the given status.
   * @throws {NotFound|Error} If no interviews are found or there's a database error.
   */
  static async getInterviewsByStatus(status) {
    try {
      const interviews =
        await InterviewsRepository.getInterviewsByStatus(status);

      if (!interviews || interviews.length === 0) {
        throw new NotFound(`No interviews found with status ${status}.`);
      }

      return interviews;
    } catch (error) {
      console.error(
        'Error in InterviewsService while fetching interviews by status:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves interviews by application ID.
   * @param {number} applicationId - The ID of the associated application.
   * @returns {Promise<Object[]>} List of interviews linked to the given application ID.
   * @throws {NotFound|Error} If no interviews are found or there's a database error.
   */
  static async getInterviewsByApplicationId(applicationId) {
    try {
      const interviews =
        await InterviewsRepository.getInterviewsByApplicationId(applicationId);

      if (!interviews || interviews.length === 0) {
        throw new NotFound(
          `No interviews found for application ID ${applicationId}.`
        );
      }

      return interviews;
    } catch (error) {
      console.error(
        'Error in InterviewsService while fetching interviews by application ID:',
        error
      );
      throw error;
    }
  }

  /**
   * Counts the number of interviews for status.
   * @param {string} status - status value to filter interviews by.
   * @returns {Promise<Object>} A mapping of status to the count of interviews in that status.
   * @throws {Error} If there is an issue fetching the interview count.
   */
  static async countInterviewsByStatus(status) {
    try {
      return await InterviewsRepository.countInterviewsByStatus(status);
    } catch (error) {
      console.error(
        'Error in InterviewsService while counting interviews by status:',
        error
      );
      throw error;
    }
  }

  /**
   * Deletes an interview by its ID.
   * @param {number} id - The unique ID of the interview.
   * @returns {Promise<boolean>} True if the interview was deleted, false otherwise.
   * @throws {NotFound|Error} If the interview is not found or there's a database error.
   */
  static async deleteInterview(id) {
    try {
      const interview = await InterviewsRepository.getInterviewById(id);
      if (!interview) throw new NotFound(`Interview with ID ${id} not found.`);

      return await InterviewsRepository.deleteInterview(id);
    } catch (error) {
      console.error(
        'Error in InterviewsService while deleting interview:',
        error
      );
      throw error;
    }
  }
}

module.exports = InterviewsService;
