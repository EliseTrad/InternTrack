const CoverLettersService = require('../services/coverLettersService');
const { UserNotFoundError, NotFound } = require('../errors/customError');

/**
 * CoverLettersController class provides methods to handle HTTP requests related to cover letters.
 * Each method interacts with the CoverLettersService to perform CRUD operations on cover letters.
 */
class CoverLettersController {
  /**
   * Creates a new cover letter in the system.
   *
   * @param {Object} req - The request object containing cover letter data in the body.
   * @param {string} req.body.path - The file path (URL) of the cover letter.
   * @param {string} req.body.name - The file name of the cover letter.
   * @param {number} req.body.userId - The ID of the user associated with the cover letter.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the created cover letter or an error message.
   */
  static async createCoverLetter(req, res) {
    try {
      const { path, name, userId } = req.body;

      // Call the service to create a cover letter
      const newCover = await CoverLettersService.createCoverLetter({
        cover_file_path: path,
        cover_file_name: name,
        user_id: userId,
      });

      // Return the created cover letter with 201 Created status
      res.status(201).json(newCover);
    } catch (error) {
      console.error(
        'Error in CoverLettersController while creating cover letter:',
        error
      );

      if (error instanceof UserNotFoundError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Updates a cover letter's details by its ID.
   *
   * @param {Object} req - The request object containing the cover letter ID in params and update 
   *                       data in the body.
   * @param {string} req.params.id - The ID of the cover letter to update.
   * @param {Object} req.body - The fields to update.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the updated cover letter or an error message.
   */
  static async updateCoverLetterById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Call the service to update the cover letter
      const updatedCover = await CoverLettersService.updateCoverLetterById(id, updateData);

      res.status(200).json(updatedCover); // OK
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the cover letter.' });
      }
    }
  }

  /**
   * Retrieves all cover letters from the database.
   *
   * @param {Object} _req - The request object (unused).
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the list of cover letters or an error message.
   */
  static async getAllCoverLetters(_req, res) {
    try {
      // Call the service to fetch all cover letters
      const covers = await CoverLettersService.getAllCoverLetters();

      // Return the list of cover letters
      res.status(200).json(covers); // OK
    } catch (error) {
      console.error(
        'Error in CoverLettersController while fetching all cover letters:',
        error
      );

      res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }

  /**
   * Retrieves all cover letters associated with a user by their user ID.
   *
   * @param {Object} req - The request object containing the user ID in params.
   * @param {string} req.params.userId - The ID of the user whose cover letters to retrieve.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the list of cover letters or an error message.
   */
  static async getCoverLettersByUserId(req, res) {
    try {
      const { userId } = req.params; // Extract user ID from route parameters

      // Call the service to fetch cover letters for the user
      const covers = await CoverLettersService.getCoverLettersByUserId(userId);

      // Return the list of cover letters
      res.status(200).json(covers); // OK
    } catch (error) {
      console.error(
        'Error in CoverLettersController while fetching cover letters by user ID:',
        error
      );

      if (error instanceof UserNotFoundError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Retrieves a cover letter by its unique ID.
   *
   * @param {Object} req - The request object containing the cover letter ID in params.
   * @param {string} req.params.id - The ID of the cover letter to retrieve.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the cover letter or an error message.
   */
  static async getCoverLetterById(req, res) {
    try {
      const { id } = req.params; // Extract cover letter ID from route parameters

      // Call the service to fetch the cover letter
      const cover = await CoverLettersService.getCoverLetterById(id);

      // Return the cover letter
      res.status(200).json(cover); // OK
    } catch (error) {
      console.error(
        'Error in CoverLettersController while fetching cover letter by ID:',
        error
      );

      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Deletes a cover letter by its unique ID.
   *
   * @param {Object} req - The request object containing the cover letter ID in params.
   * @param {string} req.params.id - The ID of the cover letter to delete.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response indicating success or failure.
   */
  static async deleteCoverLetter(req, res) {
    try {
      const { id } = req.params; // Extract cover letter ID from route parameters

      // Call the service to delete the cover letter
      await CoverLettersService.deleteCoverLetter(id);

      // Respond with 204 No Content for successful deletion
      res.status(204).end();
    } catch (error) {
      console.error(
        'Error in CoverLettersController while deleting cover letter:',
        error
      );

      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }
}

module.exports = CoverLettersController;