const ResumesService = require('../services/resumesService');
const { UserNotFoundError, NotFound } = require('../errors/customError');

class ResumesController {
  /**
   * Create a new resume.
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

      if (error instanceof UserNotFoundError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Update a resume by ID.
   */
  static async updateResumeById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Call the service to update the resume
      const updatedResume =
        await ResumesService.updateResumeById(id, updateData);

      res.status(200).json(updatedResume);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the resume.' });
      }
    }
  }

  /**
   * Retrieve all resumes.
   */
  static async getAllResumes(req, res) {
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
   * Retrieve resumes by user ID.
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

      if (error instanceof UserNotFoundError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Retrieve a resume by ID.
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
   * Delete a resume by ID.
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

      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }
}

module.exports = ResumesController;
