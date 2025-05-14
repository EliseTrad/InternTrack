const ResumesService = require('../services/resumesService');
const { NotFound, ConflictError } = require('../errors/customError');

/**
 * ResumesController class provides methods to handle HTTP requests related to resumes.
 * Each method interacts with the ResumesService to perform CRUD operations on resumes.
 */
class ResumesController {
  /**
   * Creates a new resume in the system.
   *
   * @param {Object} req - The request object containing resume data in the body.
   * @param {string} req.body.path - The file path (URL) of the resume.
   * @param {string} req.body.name - The file name of the resume.
   * @param {number} req.body.userId - The ID of the user associated with the resume.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the created resume or an error message.
   */
  static async createResume(req, res) {
    try {
      const { path, name, userId } = req.body;

      // Call the service to create a resume
      const newResume = await ResumesService.createResume({
        resume_file_path: path,
        resume_file_name: name,
        user_id: userId,
      });

      // Return the created resume with 201 Created status
      res.status(201).json(newResume);
    } catch (error) {
      console.error('Error in ResumesController while creating resume:', error);

      if (error instanceof FoundError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Updates a resume's details by its ID.
   *
   * @param {Object} req - The request object containing the resume ID in params and update data in the body.
   * @param {string} req.params.id - The ID of the resume to update.
   * @param {Object} req.body - The fields to update.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the updated resume or an error message.
   */
  static async updateResumeById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Call the service to update the resume
      const updatedResume = await ResumesService.updateResumeById(
        id,
        updateData
      );

      res.status(200).json(updatedResume); // OK
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the resume.' });
      }
    }
  }

  /**
   * Retrieves all resumes from the database.
   *
   * @param {Object} _req - The request object (unused).
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the list of resumes or an error message.
   */
  static async getAllResumes(_req, res) {
    try {
      // Call the service to fetch all resumes
      const resumes = await ResumesService.getAllResumes();

      // Return the list of resumes
      res.status(200).json(resumes); // OK
    } catch (error) {
      console.error(
        'Error in ResumesController while fetching all resumes:',
        error
      );

      res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }

  /**
   * Retrieves all resumes associated with a user by their user ID.
   *
   * @param {Object} req - The request object containing the user ID in params.
   * @param {string} req.params.userId - The ID of the user whose resumes to retrieve.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the list of resumes or an error message.
   */
  static async getResumesByUserId(req, res) {
    try {
      const { userId } = req.params; // Extract user ID from route parameters

      // Call the service to fetch resumes for the user
      const resumes = await ResumesService.getResumesByUserId(userId);

      // Return the list of resumes
      res.status(200).json(resumes); // OK
    } catch (error) {
      console.error(
        'Error in ResumesController while fetching resumes by user ID:',
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
   * Retrieves all resumes associated with a file name.
   *
   * @param {Object} req - The request object containing the name in params.
   * @param {string} req.params.name - The file name of the resumes to retrieve.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the list of resumes or an error message.
   */
  static async getResumesByName(req, res) {
    try {
      const { name } = req.params; // Extract file name from route parameters

      // Call the service to fetch resumes
      const resumes = await ResumesService.getResumesByName(name);

      // Return the list of resumes
      res.status(200).json(resumes); // OK
    } catch (error) {
      console.error(
        'Error in ResumesController while fetching resumes by user ID:',
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
   * Retrieves a resume by its unique ID.
   *
   * @param {Object} req - The request object containing the resume ID in params.
   * @param {string} req.params.id - The ID of the resume to retrieve.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response with the resume or an error message.
   */
  static async getResumeById(req, res) {
    try {
      const { id } = req.params; // Extract resume ID from route parameters

      // Call the service to fetch the resume
      const resume = await ResumesService.getResumeById(id);

      // Return the resume
      res.status(200).json(resume); // OK
    } catch (error) {
      console.error(
        'Error in ResumesController while fetching resume by ID:',
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
   * Deletes a resume by its unique ID.
   *
   * @param {Object} req - The request object containing the resume ID in params.
   * @param {string} req.params.id - The ID of the resume to delete.
   * @param {Object} res - The response object used to send the result back to the client.
   * @returns {Promise<void>} Sends a JSON response indicating success or failure.
   */
  static async deleteResumeById(req, res) {
    try {
      const { id } = req.params; // Extract resume ID from route parameters

      // Call the service to delete the resume
      await ResumesService.deleteResumeById(id);

      // Respond with 204 No Content for successful deletion
      res.status(204).end();
    } catch (error) {
      console.error('Error in ResumesController while deleting resume:', error);

      if (error instanceof NotFound || error instanceof ConflictError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  static async deleteResumes(req, res) {
    try {
      const userId = req.body.userId;
      const resumeIds = req.body.resumeIds;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: 'Missing userId.' });
      }

      await ResumesService.deleteResumes(userId, resumeIds);

      return res.status(200).json({
        success: true,
        message: 'Resumes deleted successfully.',
      });
    } catch (error) {
      console.error('Controller error while deleting resumes:', error);

      if (error instanceof NotFound) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }

      return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while deleting resumes.',
      });
    }
  }

  static async getResumesByNameAndUserId(req, res) {
    try {
      const name = req.params.name;
      const userId = req.body.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: 'Missing userId.' });
      }

      const resume = await ResumesService.getResumesByNameAndUserId(
        name,
        userId
      );

      if (!resume) {
        return res
          .status(404)
          .json({ success: false, message: 'Resume not found.' });
      }

      return res.status(200).json({ success: true, resume });
    } catch (error) {
      console.error('Controller error while fetching resume by name:', error);

      if (error instanceof NotFound) {
        return res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }

      return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred while fetching the resume.',
      });
    }
  }
}

module.exports = ResumesController;
