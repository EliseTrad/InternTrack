const CoverLettersRepository = require('../repositories/coverLettersRepository');
const { NotFound, ConflictError } = require('../errors/customError');
const UsersRepository = require('../repositories/usersRepository');

/**
 * CoverLettersService class provides business logic for cover letter-related operations.
 * Each method interacts with the CoverLettersRepository to perform CRUD operations on cover letters.
 */
class CoverLettersService {
  /**
   * Creates a new cover letter in the system.
   *
   * @param {Object} coverLetterData - The data for the new cover letter.
   * @param {string} coverLetterData.cover_file_path - The file path (URL) of the cover letter.
   * @param {string} coverLetterData.cover_file_name - The file name of the cover letter.
   * @param {number} coverLetterData.user_id - The ID of the user associated with the cover letter.
   * @returns {Promise<Object>} The created cover letter object.
   * @throws {Error} If there is an issue creating the cover letter.
   */
  static async createCoverLetter({
    cover_file_path,
    cover_file_name,
    user_id,
  }) {
    try {
      return await CoverLettersRepository.createCoverLetter({
        cover_file_path,
        cover_file_name,
        user_id,
      });
    } catch (error) {
      console.error(
        'Error in CoverLettersService while creating cover letter:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Updates a cover letter's details by its ID.
   * Validates the existence of related entities (e.g., user) if provided in the update data.
   *
   * @param {number} id - The ID of the cover letter to update.
   * @param {Object} updateData - An object containing the fields to update.
   * @param {string} [updateData.cover_file_path] - The updated file path of the cover letter (optional).
   * @param {string} [updateData.cover_file_name] - The updated file name of the cover letter (optional).
   * @param {number} [updateData.user_id] - The updated ID of the user associated with the cover letter
   *                                        (optional).
   * @returns {Promise<Object>} The updated cover letter object.
   * @throws {NotFound} If the cover letter or related entities (e.g., user) are not found.
   * @throws {Error} If there is an issue updating the cover letter.
   */
  static async updateCoverLetterById(id, updateData) {
    try {
      // Check if the cover letter exists
      const existingCover = await CoverLettersRepository.getCoverLetterById(id);
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
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves all cover letters from the database.
   *
   * @returns {Promise<Object[]>} A list of all cover letters.
   * @throws {Error} If there is an issue fetching cover letters.
   */
  static async getAllCoverLetters() {
    try {
      return await CoverLettersRepository.getAllCoverLetters();
    } catch (error) {
      console.error(
        'Error in CoverLettersService while fetching all cover letters:',
        error
      );
      throw new Error(
        'Unable to display the letters at the moment. Please try again later.'
      );
    }
  }

  /**
   * Retrieves all cover letters associated with a user by their user ID.
   *
   * @param {number} userId - The ID of the user whose cover letters to retrieve.
   * @returns {Promise<Object[]>} A list of cover letters for the user.
   * @throws {NotFound} If the user is not found.
   * @throws {Error} If there is an issue fetching the cover letters.
   */
  static async getCoverLettersByUserId(userId) {
    try {
      // Check if the user exists
      const user = await UsersRepository.getUserById(userId);
      if (!user) throw new NotFound(`User with ID ${userId} not found.`);

      // Fetch cover letters for the user
      return await CoverLettersRepository.getCoverLetterByUserId(userId);
    } catch (error) {
      console.error(
        'Error in CoverLettersService while fetching cover letters by user ID:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves all cover letters with a specific file name.
   *
   * @param {String} name - The file name of the cover letters to retrieve.
   * @returns {Promise<CoverLetter[]>} A list of cover letters.
   * @throws {Error} If there is an issue fetching the cover letters.
   */
  static async getCoverLettersByName(name) {
    try {
      const cover = await CoverLettersRepository.getCoverLetterByName(name);
      if (!cover) throw NotFound(`No cover with name ${name} is found`);
      return cover;
    } catch (error) {
      console.error(
        'Error in CoverLettersService while fetching cover letters by name:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Retrieves a cover letter by its unique ID.
   *
   * @param {number} id - The unique ID of the cover letter.
   * @returns {Promise<Object>} The cover letter object if found.
   * @throws {NotFound} If the cover letter is not found.
   * @throws {Error} If there is an issue fetching the cover letter.
   */
  static async getCoverLetterById(id) {
    try {
      const cover = await CoverLettersRepository.getCoverLetterById(id);
      if (!cover)
        throw new NotFound(`Cover letter with ID ${id} does not exist.`);

      return cover;
    } catch (error) {
      console.error(
        'Error in CoverLettersService while fetching cover letter by ID:',
        error
      );
      throw error; // Propagate the error to the controller
    }
  }

  /**
   * Deletes a cover letter by its unique ID.
   *
   * @param {number} id - The unique ID of the cover letter to delete.
   * @returns {Promise<boolean>} True if the cover letter was deleted, false if not found.
   * @throws {NotFound} If the cover letter is not found.
   * @throws {Error} If there is an issue deleting the cover letter.
   */
  static async deleteCoverLetter(id) {
    try {
      // Check if the cover letter exists
      const cover = await CoverLettersRepository.getCoverLetterById(id);
      if (!cover)
        throw new NotFound(`Cover letter with ID ${id} does not exist.`);

      // Delete the cover letter
      return await CoverLettersRepository.deleteCoverLetterById(id);
    } catch (error) {
      console.error(
        'Error in CoverLettersService while deleting cover letter:',
        error
      );

      // Handle foreign key constraint errors
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new ConflictError();
      }

      throw error; // Propagate the error to the controller
    }
  }
}

module.exports = CoverLettersService;
