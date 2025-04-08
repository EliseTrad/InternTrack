const CoverLetter = require('../models/CoverLetter');

/**
 * CoverLettersRepository class provides methods to interact with the 'cover_letters' table in the database.
 * Each method handles a specific operation related to cover letter data (create, read, update, delete).
 */
class CoverLettersRepository {
  /**
   * Creates a new cover letter in the database.
   *
   * @param {Object} cover - The object containing cover letter details.
   * @param {string} cover.cover_file_path - The file path (URL) of the cover letter.
   * @param {string} cover.cover_file_name - The file name of the cover letter.
   * @param {Date} cover.cover_upload_date - The upload date of the cover letter.
   * @param {number} cover.user_id - The ID of the user associated with the cover letter.
   * @returns {Promise<Object>} The created cover letter object.
   * @throws {Error} If there is an issue creating the cover letter.
   */
  static async createCoverLetter(cover) {
    try {
      return await CoverLetter.create(cover);
    } catch (error) {
      console.error('Error creating cover letter:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Updates a cover letter's details by its ID.
   * Only updates the fields that are provided in the `updateData` object.
   *
   * @param {number} id - The ID of the cover letter to update.
   * @param {Object} updateData - An object containing the fields to update.
   * @param {string} [updateData.cover_file_path] - The updated file path of the cover letter (optional).
   * @param {string} [updateData.cover_file_name] - The updated file name of the cover letter (optional).
   * @param {number} [updateData.user_id] - The updated ID of the user associated with the cover letter (optional).
   * @returns {Promise<Object|null>} The updated cover letter object if successful, or null if no rows were updated.
   * @throws {Error} If there is an issue updating the cover letter's details.
   */
  static async updateCoverLetterById(id, updateData) {
    try {
      const [updatedRowsCount] = await CoverLetter.update(updateData, {
        where: { cover_letter_id: id },
      });

      if (updatedRowsCount === 0) return null;

      const updatedCover = await CoverLetter.findByPk(id);
      return updatedCover;
    } catch (error) {
      console.error('Error in CoverLettersRepository while updating:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves all cover letters from the database.
   *
   * @returns {Promise<CoverLetter[]>} A list of all cover letters.
   * @throws {Error} If there is an issue fetching cover letters.
   */
  static async getAllCoverLetters() {
    try {
      return await CoverLetter.findAll();
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves all cover letters associated with a user by their user ID.
   *
   * @param {number} userId - The ID of the user whose cover letters to retrieve.
   * @returns {Promise<CoverLetter[]>} A list of cover letters for the user.
   * @throws {Error} If there is an issue fetching the cover letters.
   */
  static async getCoverLetterByUserId(userId) {
    try {
      return await CoverLetter.findAll({ where: { user_id: userId } });
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves all cover letters with a specific file name.
   *
   * @param {String} name - The file name of the cover letters to retrieve.
   * @returns {Promise<CoverLetter[]>} A list of cover letters.
   * @throws {Error} If there is an issue fetching the cover letters.
   */
  static async getCoverLetterByName(name) {
    try {
      return await CoverLetter.findAll({ where: { cover_file_name: name } });
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Retrieves a cover letter by its unique ID.
   *
   * @param {number} id - The unique ID of the cover letter.
   * @returns {Promise<Object|null>} The cover letter object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the cover letter.
   */
  static async getCoverLetterById(id) {
    try {
      return await CoverLetter.findByPk(id);
    } catch (error) {
      console.error('Error fetching cover letter:', error);
      throw error; // Propagate the error to the service layer
    }
  }

  /**
   * Deletes a cover letter by its unique ID.
   *
   * @param {number} coverLetterId - The ID of the cover letter to delete.
   * @returns {Promise<boolean>} True if the cover letter was deleted, false if not found.
   * @throws {Error} If there is an issue deleting the cover letter.
   */
  static async deleteCoverLetterById(coverLetterId) {
    try {
      const result = await CoverLetter.destroy({
        where: { cover_letter_id: coverLetterId },
      });
      return result > 0; // Return true if at least one row was deleted
    } catch (error) {
      console.error('Error deleting the cover letter:', error);
      throw error; // Propagate the error to the service layer
    }
  }
}

module.exports = CoverLettersRepository;