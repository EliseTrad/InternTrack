const Resume = require('../models/Resume');

/**
 * ResumesRepository class provides methods to interact with the 'resumes' table in the database.
 * Each method handles a specific operation related to resume data (create, read, update, delete).
 */
class ResumesRepository {
  /**
   * Creates a new resume in the database.
   *
   * @param {Object} resume - The object containing resume details.
   * @param {string} resume.resume_file_path - The file path (using URL) of the resume.
   * @param {string} resume.resume_file_name - The file name of the resume.
   * @param {Date} resume.resume_upload_date - The upload date of the resume.
   * @param {number} resume.user_id - The ID of the user associated with the resume.
   * @returns {Promise<Object>} The created resume object.
   * @throws {Error} If there is an issue creating the resume.
   */
  static async createResume(resume) {
    try {
      return await Resume.create(resume);
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Updates a resume's details by its ID.
   * Only updates the fields that are provided in the `updateData` object.
   *
   * @param {number} id - The ID of the resume to update.
   * @param {Object} updateData - An object containing the fields to update.
   * @param {string} [updateData.path] - The updated file path of the resume (optional).
   * @param {string} [updateData.name] - The updated file name of the resume (optional).
   * @param {number} [updateData.userId] - The updated ID of the user associated with the resume (optional).
   * @returns {Promise<Object|null>} The updated resume object if successful, or null if no rows were updated.
   * @throws {Error} If there is an issue updating the resume's details.
   */
  static async updateResumeById(id, updateData) {
    try {
      const [updatedRowsCount] = await Resume.update(updateData, {
        where: { resume_id: id },
      });

      if (updatedRowsCount === 0) return null;

      const updatedResume = await Resume.findByPk(id);
      return updatedResume;
    } catch (error) {
      console.error('Error in ResumesRepository while updating resume:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves all resumes from the database.
   *
   * @returns {Promise<Resume[]>} A list of all resumes.
   * @throws {Error} If there is an issue fetching resumes.
   */
  static async getAllResumes() {
    try {
      return await Resume.findAll();
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves all resumes associated with a user by their user ID.
   *
   * @param {number} userId - The ID of the user whose resumes to retrieve.
   * @returns {Promise<Resume[]>} A list of resumes for the user.
   * @throws {Error} If there is an issue fetching the resumes.
   */
  static async getResumesByUserId(userId) {
    try {
      return await Resume.findAll({ where: { user_id: userId } });
    } catch (error) {
      console.error('Error fetching resume(s):', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves all resumes associated with a specific file name.
   *
   * @param {string} name - The file name of the resumes to retrieve.
   * @returns {Promise<Resume[]>} A list of resumes.
   * @throws {Error} If there is an issue fetching the resumes.
   */
  static async getResumesByName(name) {
    try {
      return await Resume.findAll({ where: { resume_file_name: name } });
    } catch (error) {
      console.error('Error fetching resume(s):', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves a resume by its unique ID.
   *
   * @param {number} id - The unique ID of the resume.
   * @returns {Promise<Object|null>} The resume object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the resume.
   */
  static async getResumeById(id) {
    try {
      return await Resume.findByPk(id);
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Deletes a resume by its unique ID.
   *
   * @param {number} resumeId - The ID of the resume to delete.
   * @returns {Promise<boolean>} True if the resume was deleted, false if not found.
   * @throws {Error} If there is an issue deleting the resume.
   */
  static async deleteResumeById(resumeId) {
    try {
      const result = await Resume.destroy({ where: { resume_id: resumeId } });
      return result > 0; // Return true if at least one row was deleted
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Deletes multiple resumes for a given user.
   *
   * @param {number} userId - The ID of the user.
   * @param {Array<number>} resumeIds - An array of resume IDs to delete.
   * @returns {Promise<number>} The number of records deleted.
   */
  static async deleteResumesByUser(userId, resumeIds) {
    // Executes bulk deletion for specified resume IDs
    return await Resume.destroy({
      where: {
        user_id: userId,
        resume_id: resumeIds,
      },
    });
  }

  /**
   * Retrieves a single resume by name and user ID.
   *
   * @param {string} name - The file name to search by.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Resume|null>} The matching resume or null.
   * @throws {Error} If there is an issue during the fetch.
   */
  static async getResumesByNameAndUserId(name, userId) {
    try {
      const resume = await Resume.findOne({
        where: {
          resume_file_name: name,
          user_id: userId,
        },
      });

      return resume;
    } catch (error) {
      console.error(
        'Error in ResumesRepository.getResumesByNameAndUserId:',
        error
      );
      throw error; // Propagate the error to the service layer
    }
  }
}

module.exports = ResumesRepository;
