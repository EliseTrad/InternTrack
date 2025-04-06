const Application = require('../models/Application');

class ApplicationsRepository {
  /**
   * Creates a new application in the database.
   * Assumes the input has already been validated by the DTO.
   *
   * @param {Object} application - The validated application object.
   * @returns {Promise<Application>} The created application object.
   * @throws {Error} If there is an issue creating the application in the database.
   */
  static async createApplication(application) {
    try {
      return await Application.create(application);
    } catch (error) {
      console.error('Database error while creating application:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Updates an application's details in the database by its ID.
   * Accepts individual fields as parameters and updates only the provided fields.
   *
   * @param {number} id - The ID of the application to update.
   * @param {string} [companyName] - The updated name of the company (optional).
   * @param {string} [positionTitle] - The updated position title of the internship (optional).
   * @param {('waitlist'|'rejected'|'not_answered'|'accepted')} [status]
   *                                    - The updated status of the application (optional).
   * @param {Date|null} [deadline] - The updated deadline date of the application (optional).
   * @param {string} [notes] - The updated notes about the application (optional).
   * @param {string} [source] - The updated source of the application (optional).
   * @param {number} [userId] - The updated ID of the owner of the application (optional).
   * @param {number} [resumeId] - The updated ID of the resume used in the application (optional).
   * @param {number|null} [coverLetterId]
   *                      - The updated ID of the cover letter used in the application (optional).
   * @returns {Object|null} - The updated object if successful, or `null` if no rows were updated.
   * @throws {Error} - If there is an issue with the database query.
   */
  static async updateApplicationById(id, updateData) {
    try {
      const [updatedRowsCount] = await Application.update(updateData, {
        where: { application_id: id },
      });

      if (updatedRowsCount === 0) return null;

      const updatedApplication = await Application.findByPk(id);
      return updatedApplication;
    } catch (error) {
      console.error('Error in ApplicationsRepository while updating:', error);
      throw error;
    }
  }

  /**
   * Retrieves all applications associated with a specific user ID.
   * Assumes the user ID has already been validated by the DTO.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Application[]>} A list of applications (empty array if none found).
   * @throws {Error} If there is an issue fetching the applications from the database.
   */
  static async getApplicationsForUser(userId) {
    try {
      return await Application.findAll({ where: { user_id: userId } });
    } catch (error) {
      console.error(
        'Database error while fetching applications by user ID:',
        error
      );
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves an application by its unique ID.
   * @param {number} id - The unique ID of the application.
   * @returns {Promise<Application|null>} The application object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the application.
   */
  static async getApplicationById(id) {
    try {
      return await Application.findByPk(id);
    } catch (error) {
      console.error('Error fetching the application:', error);
      throw error;
    }
  }

  /**
   * Retrieves applications by a resume ID.
   * @param {number} id - The ID of the resume.
   * @returns {Promise<Application[]>} A list of applications (empty array if none found).
   * @throws {Error} If there is an issue fetching the applications.
   */
  static async getApplicationsByResumeId(id) {
    try {
      return await Application.findAll({ where: { resume_id: id } });
    } catch (error) {
      console.error('Error fetching the application(s):', error);
      throw error;
    }
  }

  /**
   * Retrieves applications by a specific status.
   * @param {string} status - The status of the application.
   * @returns {Promise<Application[]>} A list of applications (empty array if none found).
   * @throws {Error} If there is an issue fetching the applications.
   */
  static async getApplicationsByStatus(applicationStatus) {
    try {
      return await Application.findAll({
        where: { status: applicationStatus },
      });
    } catch (error) {
      console.error('Error fetching the application(s):', error);
      throw error;
    }
  }

  /**
   * Retrieves applications by a cover letter ID.
   * @param {number} id - The ID of the cover letter.
   * @returns {Promise<Application[]>} A list of applications (empty array if none found).
   * @throws {Error} If there is an issue fetching the applications.
   */
  static async getApplicationsByCoverLetterId(id) {
    try {
      return await Application.findAll({ where: { cover_letter_id: id } });
    } catch (error) {
      console.error('Error fetching the application(s):', error);
      throw error;
    }
  }

  /**
   * Retrieves applications by a company name.
   * @param {string} name - The company name of the application.
   * @returns {Promise<Application[]>} A list of applications (empty array if none found).
   * @throws {Error} If there is an issue fetching the applications.
   */
  static async getApplicationsByCompanyName(name) {
    try {
      return await Application.findAll({ where: { company_name: name } });
    } catch (error) {
      console.error('Error fetching the application(s):', error);
      throw error;
    }
  }

  /**
   * Retrieves applications by a source.
   * @param {string} source - The source of the application.
   * @returns {Promise<Application[]>} A list of applications (empty array if none found).
   * @throws {Error} If there is an issue fetching the applications.
   */
  static async getApplicationsBySource(source) {
    try {
      return await Application.findAll({
        where: { application_source: source },
      });
    } catch (error) {
      console.error('Error fetching the application(s):', error);
      throw error;
    }
  }

  /**
   * Retrieves applications by a position title.
   * @param {string} title - The position title of the application.
   * @returns {Promise<Application[]>} A list of applications (empty array if none found).
   * @throws {Error} If there is an issue fetching the applications.
   */
  static async getApplicationByPositionTitle(title) {
    try {
      return await Application.findAll({ where: { position_title: title } });
    } catch (error) {
      console.error('Error fetching the application(s):', error);
      throw error;
    }
  }

  /**
   * Retrieves all applications created on a specific date.
   * @param {string} date - The application date ('YYYY-MM-DD').
   * @returns {Promise<Application[]>} A list of applications created on the given date.
   * @throws {Error} If there is an issue fetching applications by the creation date.
   */
  static async getApplicationsByDate(date) {
    try {
      return await Application.findAll({ where: { application_date: date } });
    } catch (error) {
      console.error('Error fetching the applications by creation date:', error);
      throw error;
    }
  }

  /**
   * Retrieves all applications by a specific deadline.
   * @param {string} date - The application deadline ('YYYY-MM-DD').
   * @returns {Promise<Application[]>} A list of applications that has the given deadline.
   * @throws {Error} If there is an issue fetching applications by their deadline.
   */
  static async getApplicationsByDeadline(date) {
    try {
      return await Application.findAll({ where: { deadline: date } });
    } catch (error) {
      console.error('Error fetching the applications by deadline:', error);
      throw error;
    }
  }

  /**
   * Deletes an application by its unique ID.
   * @param {number} id - The unique ID of the application.
   * @returns {Promise<boolean>} True if the application was deleted, false if not found.
   * @throws {Error} If a database error occurs or application not found.
   */
  static async deleteApplicationById(id) {
    try {
      const deletedApplication = await Application.destroy({
        where: { application_id: id },
      });
      return deletedApplication > 0;
    } catch (error) {
      console.error('Error deleting the application:', error);
      throw error;
    }
  }

  /**
   * Counts the number of applications associated with a specific user ID.
   * Assumes the user ID has already been validated by the DTO.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<number>} The count of applications associated with the user.
   * @throws {Error} If there is an issue counting the applications in the database.
   */
  static async countApplicationsForUser(userId) {
    try {
      const result = await Application.count({
        where: { user_id: userId },
      });
      return result;
    } catch (error) {
      console.error(
        'Database error while counting applications by user ID:',
        error
      );
      throw error; // Propagate the error to the service layer
    }
  }
}

module.exports = ApplicationsRepository;
