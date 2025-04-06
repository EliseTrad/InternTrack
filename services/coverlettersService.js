const CoverLettersRepository = require('../repositories/coverLettersRepository');
const { NotFound } = require('../errors/customError');
const UsersRepository = require('../repositories/usersRepository');

class CoverLettersService {
  // Create a new cover letter
  static async createCoverLetter({
    cover_file_path,
    cover_file_name,
    cover_upload_date = new Date(),
    user_id,
  }) {
    try {
      return await CoverLettersRepository.createCoverLetter({
        cover_file_path,
        cover_file_name,
        cover_upload_date,
        user_id,
      });
    } catch (error) {
      console.error('Error in coverLetterService:', error);
      throw error;
    }
  }

  static async updateCoverLetterById(id, updateData) {
    try {
      // Check if the cover letter exists
      const existingCover =
        await CoverLettersRepository.getCoverLetterById(id);
      if (!existingCover) {
        throw new NotFound(`Cover letter with ID ${id} not found.`);
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

      // Update the cover letter
      return await CoverLettersRepository.updateCoverLetterById(id, updateData);
    } catch (error) {
      console.error(
        'Error in CoverLettersService while updating cover letter:',
        error
      );
      throw error;
    }
  }

  // Retrieve all cover letters
  static async getAllCoverLetters() {
    try {
      return CoverLettersRepository.getAllCoverLetters();
    } catch (error) {
      console.error('Error in coverLetterService:', error);
      throw new Error(
        'Unable to display the letters at the moment. Please try again later.'
      );
    }
  }

  // Get cover letters by user ID
  static async getCoverLettersByUserId(userId) {
    try {
      const user = await UsersRepository.getUserById(userId);

      if (!user) throw new UserNotFoundError();

      return await CoverLettersRepository.getCoverLetterByUserId(userId);
    } catch (error) {
      console.error('Error in CoverLettersService:', error);
      throw error;
    }
  }

  // Get a cover letter by its ID
  static async getCoverLetterById(id) {
    try {
      const cover = await CoverLettersRepository.getCoverLetterById(id);
      if (!cover)
        throw new NotFound(`Cover letter with ID ${id} does not exist.`);

      return cover;
    } catch (error) {
      console.error('Error in CoverLettersService:', error);
      throw error;
    }
  }

  // Delete a cover letter by its ID
  static async deleteCoverLetter(id) {
    try {
      const cover = await CoverLettersRepository.getCoverLetterById(id);
      if (!cover)
        throw new NotFound(`Cover letter with ID ${id} does not exist.`);

      return await CoverLettersRepository.deleteCoverLetterById(id);
    } catch (error) {
      console.error('Error in CoverLettersService:', error);
      throw error;
    }
  }
}

module.exports = CoverLettersService;
