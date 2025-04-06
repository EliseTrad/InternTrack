const ApplicationsRepository = require('../repositories/applicationsRepository');
const { NotFound } = require('../errors/customError');
const UsersRepository = require('../repositories/usersRepository');
const ResumesRepository = require('../repositories/resumesRepository');
const CoverLettersRepository = require('../repositories/coverLettersRepository');

class ApplicationsService {
  /**
   * Creates a new application.
   * @param {Object} applicationData - The validated application object.
   * @returns {Promise<Object>} The created application object.
   * @throws {NotFound|Error} If related entities (e.g., user, resume) are not
   *                          found or if there's a database error.
   */
  static async createApplication(applicationData) {
    try {
      // Validate related entities
      const { user_id, resume_id, cover_letter_id } = applicationData;

      const userExists = await UsersRepository.getUserById(user_id);
      if (!userExists) {
        throw new NotFound(`User with ID ${user_id} not found.`);
      }

      const resumeExists = await ResumesRepository.getResumeById(resume_id);
      if (!resumeExists) {
        throw new NotFound(`Resume with ID ${resume_id} not found.`);
      }

      if (cover_letter_id) {
        const coverLetterExists =
          await CoverLettersRepository.getCoverLetterById(cover_letter_id);
        if (!coverLetterExists) {
          throw new NotFound(
            `Cover letter with ID ${cover_letter_id} not found.`
          );
        }
      }

      // Create the application
      return await ApplicationsRepository.createApplication(applicationData);
    } catch (error) {
      console.error(
        'Error in ApplicationsService while creating application:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Updates an application's details by its ID.
   * Only updates the fields provided in the request.
   *
   * @param {number} id - The ID of the application to update.
   * @param {Object} updateData - Fields to update (optional fields handled gracefully).
   * @returns {Promise<Object>} The updated application object.
   * @throws {NotFound|Error} If the application or related entities are not found or there's a database error.
   */
  static async updateApplicationById(id, updateData) {
    try {
      // Check if the application exists
      const existingApplication =
        await ApplicationsRepository.getApplicationById(id);
      if (!existingApplication) {
        throw new NotFound(`Application with ID ${id} not found.`);
      }

      // Validate related entities if provided
      if (updateData.user_id) {
        const userExists = await UsersRepository.getUserById(
          updateData.user_id
        );
        if (!userExists) {
          throw new NotFound(`User with ID ${updateData.user_id} not found.`);
        }
      }

      if (updateData.resume_id) {
        const resumeExists = await ResumesRepository.getResumeById(
          updateData.resume_id
        );
        if (!resumeExists) {
          throw new NotFound(
            `Resume with ID ${updateData.resume_id} not found.`
          );
        }
      }

      if (updateData.cover_letter_id !== undefined) {
        const coverLetterExists =
          await CoverLettersRepository.getCoverLetterById(
            updateData.cover_letter_id
          );
        if (!coverLetterExists && updateData.cover_letter_id !== null) {
          throw new NotFound(
            `Cover letter with ID ${updateData.cover_letter_id} not found.`
          );
        }
      }

      // Update the application
      return await ApplicationsRepository.updateApplicationById(id, updateData);
    } catch (error) {
      console.error(
        'Error in ApplicationsService while updating application:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves all applications.
   * @returns {Promise<Object[]>} A list of applications (empty array if none found).
   * @throws {Error} If there is an issue fetching applications.
   */
  static async getAllApplications() {
    try {
      return await ApplicationsRepository.getAllApplications();
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching all applications:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves an application by its unique ID.
   * @param {number} id - The unique ID of the application.
   * @returns {Promise<Object>} The application object if found.
   * @throws {NotFound|Error} If the application is not found or there's a database error.
   */
  static async getApplicationById(id) {
    try {
      const application = await ApplicationsRepository.getApplicationById(id);
      if (!application) {
        throw new NotFound(`Application with ID ${id} not found.`);
      }
      return application;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching application by ID:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves applications by user ID.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Object[]>} A list of applications associated with the user
   *                                (empty array if none found).
   * @throws {NotFound|Error} If the user does not exist or if there's a database error.
   */
  static async getApplicationsForUser(userId) {
    try {
      const userExists = await UsersRepository.getUserById(userId);
      if (!userExists) {
        throw new NotFound(`User with ID ${userId} not found.`);
      }

      return await ApplicationsRepository.getApplicationsForUser(userId);
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by user ID:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves applications by company name.
   * @param {string} name - The company name of the application.
   * @returns {Promise<Object[]>} A list of applications matching the company name.
   * @throws {NotFound|Error} If no applications are found or there's a database error.
   */
  static async getApplicationsByCompanyName(name) {
    try {
      const applications =
        await ApplicationsRepository.getApplicationsByCompanyName(name);
      if (!applications || applications.length === 0) {
        throw new NotFound(`No applications found for company name: ${name}`);
      }
      return applications;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by company name:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves applications by position title.
   * @param {string} title - The position title of the application.
   * @returns {Promise<Object[]>} A list of applications matching the position title.
   * @throws {NotFound|Error} If no applications are found or there's a database error.
   */
  static async getApplicationsByPositionTitle(title) {
    try {
      const applications =
        await ApplicationsRepository.getApplicationByPositionTitle(title);
      if (!applications || applications.length === 0) {
        throw new NotFound(
          `No applications found for position title: ${title}`
        );
      }
      return applications;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by position title:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves applications by status.
   * @param {string} status - The status of the application.
   * @returns {Promise<Object[]>} A list of applications matching the status.
   * @throws {NotFound|Error} If no applications are found or there's a database error.
   */
  static async getApplicationsByStatus(status) {
    try {
      const applications = await ApplicationsRepository.getApplicationsByStatus(
        status
      );
      if (!applications || applications.length === 0) {
        throw new NotFound(`No applications found for status: ${status}`);
      }
      return applications;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by status:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves applications by deadline.
   * @param {string} deadline - The deadline date of the application ('YYYY-MM-DD').
   * @returns {Promise<Object[]>} A list of applications matching the deadline.
   * @throws {NotFound|Error} If no applications are found or there's a database error.
   */
  static async getApplicationsByDeadline(deadline) {
    try {
      const applications =
        await ApplicationsRepository.getApplicationsByDeadline(deadline);
      if (!applications || applications.length === 0) {
        throw new NotFound(`No applications found for deadline: ${deadline}`);
      }
      return applications;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by deadline:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves applications by date.
   * @param {string} date - The date of the application ('YYYY-MM-DD').
   * @returns {Promise<Object[]>} A list of applications matching the date.
   * @throws {NotFound|Error} If no applications are found or there's a database error.
   */
  static async getApplicationsByDate(date) {
    try {
      const applications = await ApplicationsRepository.getApplicationsByDate(
        date
      );
      if (!applications || applications.length === 0) {
        throw new NotFound(`No applications found for date: ${date}`);
      }
      return applications;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by date:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves applications by source.
   * @param {string} source - The source of the application.
   * @returns {Promise<Object[]>} A list of applications matching the source.
   * @throws {NotFound|Error} If no applications are found or there's a database error.
   */
  static async getApplicationsBySource(source) {
    try {
      const applications = await ApplicationsRepository.getApplicationsBySource(
        source
      );
      if (!applications || applications.length === 0) {
        throw new NotFound(`No applications found for source: ${source}`);
      }
      return applications;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by source:',
        error
      );
      throw error;
    }
  }

  /**
   * Deletes an application by its ID.
   * @param {number} id - The ID of the application to delete.
   * @returns {Promise<boolean>} True if the application was deleted, false if not found.
   * @throws {NotFound|Error} If the application does not exist or if there's a database error.
   */
  static async deleteApplicationById(id) {
    try {
      const applicationExists = await ApplicationsRepository.getApplicationById(
        id
      );
      if (!applicationExists) {
        throw new NotFound(`Application with ID ${id} not found.`);
      }

      return await ApplicationsRepository.deleteApplicationById(id);
    } catch (error) {
      console.error(
        'Error in ApplicationsService while deleting application:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves applications by resume ID.
   * @param {number} id - The ID of the resume.
   * @returns {Promise<Object[]>} A list of applications associated with the resume.
   * @throws {NotFound|Error} If the resume or applications are not found or
   *                          there's a database error.
   */
  static async getApplicationsByResumeId(id) {
    try {
      const resume = await ResumesRepository.getResumeById(id);
      if (!resume) {
        throw new NotFound(`Resume with ID ${id} not found.`);
      }

      const applications =
        await ApplicationsRepository.getApplicationsByResumeId(id);
      if (!applications || applications.length === 0) {
        throw new NotFound(`No applications found for resume ID: ${id}`);
      }
      return applications;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by resume ID:',
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves applications by cover letter ID.
   * @param {number} coverId - The ID of the cover letter.
   * @returns {Promise<Object[]>} A list of applications associated with the cover letter.
   * @throws {NotFound|Error} If the cover letter or applications are not found or
   *                           there's a database error.
   */
  static async getApplicationsByCoverLetterId(coverId) {
    try {
      const coverLetter = await CoverLettersRepository.getCoverLetterById(
        coverId
      );
      if (!coverLetter) {
        throw new NotFound(`Cover letter with ID ${coverId} not found.`);
      }

      const applications =
        await ApplicationsRepository.getApplicationsByCoverLetterId(coverId);
      if (!applications || applications.length === 0) {
        throw new NotFound(
          `No applications found for cover letter ID: ${coverId}`
        );
      }
      return applications;
    } catch (error) {
      console.error(
        'Error in ApplicationsService while fetching applications by cover letter ID:',
        error
      );
      throw error;
    }
  }

  /**
   * Counts the number of applications associated with a specific user ID.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<number>} The count of applications associated with the user.
   * @throws {NotFound|Error} If the user does not exist or if there's a database error.
   */
  static async countApplicationsForUser(userId) {
    try {
      const userExists = await UsersRepository.getUserById(userId);
      if (!userExists) {
        throw new NotFound(`User with ID ${userId} not found.`);
      }

      return await ApplicationsRepository.countApplicationsForUser(userId);
    } catch (error) {
      console.error(
        'Error in ApplicationsService while counting applications:',
        error
      );
      throw error;
    }
  }
}

module.exports = ApplicationsService;
