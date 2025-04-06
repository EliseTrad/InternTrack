const ResumesRepository = require('../repositories/resumesRepository');
const { NotFound } = require('../errors/customError');
const UsersRepository = require('../repositories/usersRepository');

class ResumesService {
  /**
   * Creates a new resume.
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
      console.error('Error in resumesService:', error);
      throw error;
    }
  }

  /**
   * Updates a resume by ID.
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
      throw error;
    }
  }

  /**
   * Retrieves all resumes.
   */
  static async getAllResumes() {
    try {
      return await ResumesRepository.getAllResumes();
    } catch (error) {
      console.error('Error in resumesService:', error);
      throw new Error('Unable to fetch resumes. Please try again later.');
    }
  }

  /**
   * Retrieves resumes by user ID.
   */
  static async getResumesByUserId(userId) {
    try {
      const user = await UsersRepository.getUserById(userId);

      if (!user) throw new UserNotFoundError();

      return await ResumesRepository.getResumesByUserId(userId);
    } catch (error) {
      console.error('Error in resumesService:', error);
      throw error;
    }
  }

  /**
   * Retrieves a resume by ID.
   */
  static async getResumeById(id) {
    try {
      const resume = await ResumesRepository.getResumeById(id);
      if (!resume) throw new NotFound(`Resume with ID ${id} does not exist.`);

      return resume;
    } catch (error) {
      console.error('Error in resumesService:', error);
      throw error;
    }
  }

  /**
   * Deletes a resume by ID.
   */
  static async deleteResumeById(id) {
    try {
      const resume = await ResumesRepository.getResumeById(id);
      if (!resume)
        throw new NotFound(`Resume with ID ${resumeId} does not exist.`);

      return await ResumesRepository.deleteResumeById(id);
    } catch (error) {
      console.error('Error in resumesService:', error);
      throw error;
    }
  }
}

module.exports = ResumesService;
