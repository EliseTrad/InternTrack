const ResumesRepository = require('../repositories/resumesRepository');
const { NotFound, ConflictError } = require('../errors/customError');
const UsersRepository = require('../repositories/usersRepository');

/**
 * ResumesService class provides business logic for resume-related operations.
 * Each method interacts with the ResumesRepository to perform CRUD operations on resumes.
 */
class ResumesService {
  /**
   * Creates a new resume in the database.
   *
   * @param {Object} resumeData - The data for the new resume.
   * @param {string} resumeData.resume_file_path - The file path (URL) of the resume.
   * @param {string} resumeData.resume_file_name - The file name of the resume.
   * @param {number} resumeData.user_id - The ID of the user associated with the resume.
   * @param {Date} [resumeData.resume_upload_date=new Date()] - The upload date of the resume 
   *                                                            (defaults to current date).
   * @returns {Promise<Object>} The created resume object.
   * @throws {Error} If there is an issue creating the resume.
   */
  static async createResume({
    resume_file_path,
    resume_file_name,
    resume_upload_date = new Date(),
    user_id,
  }) {
    try {
      return await ResumesRepository.createResume({
        resume_file_path,
        resume_file_name,
        resume_upload_date,
        user_id,
      });
    } catch (error) {
      console.error('Error in ResumesService while creating resume:', error);
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Updates a resume's details by its ID.
   * Validates the existence of related entities (e.g., user) if provided in the update data.
   *
   * @param {number} id - The ID of the resume to update.
   * @param {Object} updateData - An object containing the fields to update.
   * @param {string} [updateData.resume_file_path] - The updated file path of the resume (optional).
   * @param {string} [updateData.resume_file_name] - The updated file name of the resume (optional).
   * @param {number} [updateData.user_id] - The updated ID of the user associated with the resume (optional).
   * @returns {Promise<Object>} The updated resume object.
   * @throws {NotFound} If the resume or related entities (e.g., user) are not found.
   * @throws {Error} If there is an issue updating the resume.
   */
  static async updateResumeById(id, updateData) {
    try {
      // Check if the resume exists
      const existingResume = await ResumesRepository.getResumeById(id);
      if (!existingResume) {
        throw new NotFound(`Resume with ID ${id} not found.`);
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

      // Update the resume
      return await ResumesRepository.updateResumeById(id, updateData);
    } catch (error) {
      console.error('Error in ResumesService while updating resume:', error);
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves all resumes from the database.
   *
   * @returns {Promise<Object[]>} A list of all resumes.
   * @throws {Error} If there is an issue fetching resumes.
   */
  static async getAllResumes() {
    try {
      return await ResumesRepository.getAllResumes();
    } catch (error) {
      console.error(
        'Error in ResumesService while fetching all resumes:',
        error
      );
      throw new Error('Unable to fetch resumes. Please try again later.');
    }
  }

  /**
   * Retrieves all resumes associated with a user by their user ID.
   *
   * @param {number} userId - The ID of the user whose resumes to retrieve.
   * @returns {Promise<Object[]>} A list of resumes for the user.
   * @throws {NotFound} If the user is not found.
   * @throws {Error} If there is an issue fetching the resumes.
   */
  static async getResumesByUserId(userId) {
    try {
      // Check if the user exists
      const user = await UsersRepository.getUserById(userId);
      if (!user) throw new NotFound(`User with ID ${userId} not found.`);

      // Fetch resumes for the user
      return await ResumesRepository.getResumesByUserId(userId);
    } catch (error) {
      console.error(
        'Error in ResumesService while fetching resumes by user ID:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves all resumes associated with a specific file name.
   *
   * @param {number} name - The file name of the resumes to retrieve.
   * @returns {Promise<Resume[]>} A list of resumes.
   * @throws {Error} If there is an issue fetching the resumes.
   */
  static async getResumesByName(name) {
    try {
      // Check if the resume exists
      const resume = await ResumesRepository.getResumesByName(name);
      if (!resume) throw new NotFound(`Resume with ID ${name} not found.`);

      // Fetch resumes for the user
      return resume;
    } catch (error) {
      console.error(
        'Error in ResumesService while fetching resumes by name:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves a resume by its unique ID.
   *
   * @param {number} id - The unique ID of the resume.
   * @returns {Promise<Object>} The resume object if found.
   * @throws {NotFound} If the resume is not found.
   * @throws {Error} If there is an issue fetching the resume.
   */
  static async getResumeById(id) {
    try {
      const resume = await ResumesRepository.getResumeById(id);
      if (!resume) throw new NotFound(`Resume with ID ${id} does not exist.`);

      return resume;
    } catch (error) {
      console.error(
        'Error in ResumesService while fetching resume by ID:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Deletes a resume by its unique ID.
   *
   * @param {number} id - The unique ID of the resume to delete.
   * @returns {Promise<boolean>} True if the resume was deleted, false if not found.
   * @throws {NotFound} If the resume is not found.
   * @throws {Error} If there is an issue deleting the resume.
   */
  static async deleteResumeById(id) {
    try {
      // Check if the resume exists
      const resume = await ResumesRepository.getResumeById(id);
      if (!resume) throw new NotFound(`Resume with ID ${id} does not exist.`);

      // Delete the resume
      return await ResumesRepository.deleteResumeById(id);
    } catch (error) {
      console.error('Error in ResumesService while deleting resume:', error);

      // Handle foreign key constraint errors
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new ConflictError();
      }

      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Deletes multiple resumes by their IDs.
   *
   * @param {number} userId - The ID of the user deleting the resumes.
   * @param {Array<number>} resumeIds - An array of resume IDs to delete.
   * @returns {Promise<void>} Resolves if resumes were deleted successfully.
   * @throws {NotFound} If the user session is expired or no resumes are selected.
   * @throws {Error} If there is an issue deleting the resumes.
   */
  static async deleteResumes(userId, resumeIds) {
    try {
      if (!userId) throw new NotFound('User session expired.');
      if (!resumeIds || resumeIds.length === 0)
        throw new Error('No resumes selected.');

      const deletedCount = await ResumesRepository.deleteResumesByUser(
        userId,
        resumeIds
      );
      if (deletedCount === 0) throw new NotFound('No resumes were deleted.');
    } catch (error) {
      console.error('Error in service when deleting resumes:', error);
      throw error;
    }
  }

  /**
   * Retrieves resumes by their file name and user ID.
   *
   * @param {string} name - The name of the resume file.
   * @param {number} userId - The ID of the user to filter by.
   * @returns {Promise<Resume[]>} A list of resumes matching the name and user ID.
   * @throws {NotFound} If the user is not found.
   * @throws {Error} If there is an issue fetching the resumes.
   */
  static async getResumesByNameAndUserId(name, userId) {
    try {
      // Check if the user exists
      const user = await UsersRepository.getUserById(userId);
      if (!user) throw new NotFound(`User with ID ${userId} not found.`);
      
      let resume = await ResumesRepository.getResumesByNameAndUserId(
        name,
        userId
      );

      if (!resume) {
        resume = [];
      }

      return resume;
    } catch (error) {
      console.error(
        'Error in ResumesService while fetching resume by name and user ID:',
        error
      );
      throw error; // Let the controller handle it
    }
  }
}

module.exports = ResumesService;
