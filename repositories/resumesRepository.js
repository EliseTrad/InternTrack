const Resume = require('../models/Resume');
const UsersRepository = require('../repositories/usersRepository');

class ResumesRepository {
  /**
   * Creates a new resume in the database.
   * @param {Object} resume - The object for the resume to be created.
   * @param {string} resume.resume_file_path - The file path (using URL) of the resume.
   * @param {string} resume.resume_file_name - The file name of the resume.
   * @param {Date} resume.resume_upload_date - The upload date of the resume.
   * @param {number} resume.user_id - The user ID associated with the resume.
   * @returns {Promise<Object>} The created resume object.
   * @throws {Error} If there is an issue creating the resume.
   */
  static async createResume(resume) {
    try {
      return await Resume.create(resume);
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  }

  /**
   * Updates the resume by its ID.
   * @static
   * @param {number} id - The ID of the resume to update.
   * @param {Object} data - The resume data to update.
   * @param {string} data.path - The new path to set for the resume file.
   * @param {string} data.name - The new name to set for the resume file.
   * @param {number} userId - The new ID of the user associated with the resume.
   * @returns {Promise<[number, Resume[]]>} Result of the update operation.
   * @throws {Error} If there is an issue updating the resume's details.
   */
  static async updateResumeById(id, updateData) {
    try {
      const [updatedRowsCount] = await Application.update(updateData, {
        where: { resume_id: id },
      });

      if (updatedRowsCount === 0) return null;

      const updatedResume = await Resume.findByPk(id);
      return updatedResume;
    } catch (error) {
      console.error('Error in ResumesRepository while updating:', error);
      throw error;
    }
  }

  /**
   * Retrieves all resumes from the database.
   * @static
   * @returns {Promise<Resume[]>} List of resumes.
   * @throws {Error} If there is an issue fetching resumes.
   */
  static async getAllResumes() {
    try {
      return await Resume.findAll();
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw error;
    }
  }

  /**
   * Retrieves all resumes associated with a user by their user ID.
   * @param {number} userId - The ID of the user whose resumes to retrieve.
   * @returns {Promise<Array>} The list of resumes for the user.
   * @throws {Error} If there is an issue fetching the resumes.
   */
  static async getResumesByUserId(userId) {
    try {
      return await Resume.findAll({ where: { user_id: userId } });
    } catch (error) {
      console.error('Error fetching resume(s):', error);
      throw error;
    }
  }

  /**
   * Retrieves a resume by its ID.
   * @param {number} id - The ID of the resume to retrieve.
   * @returns {Promise<Object|null>} The resume object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the resume.
   */
  static async getResumeById(id) {
    try {
      return await Resume.findByPk(id);
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  }

  /**
   * Deletes a resume by its ID.
   * @param {number} resumeId - The ID of the resume to delete.
   * @returns {Promise<boolean>} Returns true if the resume was deleted, false if not.
   * @throws {Error} If there is an issue deleting the cover letter.
   */
  static async deleteResumeById(resumeId) {
    try {
      const result = await Resume.destroy({ where: { resume_id: resumeId } });
      return result > 0;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }
}

module.exports = ResumesRepository;
