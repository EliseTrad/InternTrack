const CoverLettersService = require('../services/coverLettersService');
const { UserNotFoundError, NotFound } = require('../errors/customError');

class CoverLettersController {
  /**
   * Create a new cover letter.
   */
  static async createCoverLetter(req, res) {
    try {
      const { path, name, userId } = req.body;

      // Call the service to create a cover
      const newCover = await CoverLettersService.createCoverLetter({
        cover_file_path: path,
        cover_file_name: name,
        user_id: userId,
      });

      // Return the created cover with 201 Created status
      res.status(201).json(newCover);
    } catch (error) {
      console.error(
        'Error in CoverLettersController while creating cover:',
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
   * Update a cover letter by ID.
   */
  static async updateCoverLetterById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Call the service to update the cover
      const updatedCover =
        await CoverLettersService.updateCoverLetterById(id, updateData);

      res.status(200).json(updatedCover);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the cover letter.' });
      }
    }
  }

  /**
   * Retrieve all cover letters.
   */
  static async getAllCoverLetters(req, res) {
    try {
      // Call the service to fetch all cover letters
      const covers = await CoverLettersService.getAllCoverLetters();

      // Return the list of cover letters
      res.status(200).json(covers); // OK
    } catch (error) {
      console.error(
        'Error in CoverLettersController while fetching all covers:',
        error
      );

      res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }

  /**
   * Retrieve cover letters by user ID.
   */
  static async getCoverLettersByUserId(req, res) {
    try {
      const { userId } = req.params; // Extract user ID from route parameters

      // Call the service to fetch cover letters for the user
      const covers = await CoverLettersService.getCoverLettersByUserId(userId);

      // Return the list of covers
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
   * Retrieve a cover letter by ID.
   */
  static async getCoverLetterById(req, res) {
    try {
      const { id } = req.params; // Extract cover letter ID from route parameters

      // Call the service to fetch the cover
      const cover = await CoverLettersService.getCoverLetterById(id);

      // Return the cover
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
   * Delete a cover letter by ID.
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
