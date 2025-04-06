const CoverLetter = require('../models/CoverLetter');

class CoverLettersRepository {
  /**
   * Creates a new cover letter in the database.
   * @param {Object} cover - The object for the cover letter to be created.
   * @param {string} cover.cover_file_path - The file path (using URL) of the cover letter.
   * @param {string} cover.cover_file_name - The file name of the cover letter.
   * @param {Date} cover.cover_upload_date - The upload date of the cover letter.
   * @param {number} cover.user_id - The user ID associated with the cover letter.
   * @returns {Promise<Object>} The created cover letter object.
   * @throws {Error} If there is an issue creating the cover letter.
   */
  static async createCoverLetter(cover) {
    try {
      return await CoverLetter.create(cover);
    } catch (error) {
      console.error('Error creating cover letter:', error);
      throw error;
    }
  }

  /**
   * Updates the cover letter by its ID.
   * @static
   * @param {number} id - The ID of the cover letter to update.
   * @param {Object} data - The cover letter data to update.
   * @param {string} data.path - The new path to set for the cover letter file.
   * @param {string} data.name - The new name to set for the cover letter file.
   * @param {number} userId - The new ID of the user associated with the cover letter.
   * @returns {Promise<[number, CoverLetter[]]>} Result of the update operation.
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
      throw error;
    }
  }

  /**
   * Retrieves all cover letters from the database.
   * @static
   * @returns {Promise<CoverLetter[]>} List of cover letters.
   * @throws {Error} If there is an issue fetching cover letters.
   */
  static async getAllCoverLetters() {
    try {
      return await CoverLetter.findAll();
    } catch (error) {
      console.error('Error fetching letters:', error);
      throw error;
    }
  }

  /**
   * Retrieves all cover letters associated with a user by their user ID.
   * @param {number} userId - The ID of the user whose cover letters to retrieve.
   * @returns {Promise<Array>} The list of cover letters for the user.
   * @throws {Error} If there is an issue fetching the cover letters.
   */
  static async getCoverLetterByUserId(userId) {
    try {
      return await CoverLetter.findAll({ where: { user_id: userId } });
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      throw error;
    }
  }

  /**
   * Retrieves a cover letter by its ID.
   * @param {number} coverLetterId - The ID of the cover letter to retrieve.
   * @returns {Promise<Object|null>} The cover letter object if found, or null if not found.
   * @throws {Error} If there is an issue fetching the cover letter.
   */
  static async getCoverLetterById(id) {
    try {
      return await CoverLetter.findByPk(id);
    } catch (error) {
      console.error('Error fetching cover letter:', error);
      throw error;
    }
  }

  /**
   * Deletes a cover letter by its ID.
   * @param {number} coverLetterId - The ID of the cover letter to delete.
   * @returns {Promise<boolean>} Returns true if the cover letter was deleted, false if not.
   * @throws {Error} If there is an issue deleting the cover letter.
   */
  static async deleteCoverLetterById(coverLetterId) {
    try {
      const result = await CoverLetter.destroy({
        where: { cover_letter_id: coverLetterId },
      });
      return result > 0;
    } catch (error) {
      console.error('Error deleting the cover letter:', error);
      throw error;
    }
  }
}

module.exports = CoverLettersRepository;
