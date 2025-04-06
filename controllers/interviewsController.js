const InterviewsService = require('../services/interviewsService');
const { NotFound } = require('../errors/customError');

class InterviewsController {
  /**
   * Creates a new interview.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async createInterview(req, res) {
    try {
      const {
        interview_date,
        interviewer_name,
        interviewer_email,
        location,
        reminder_sent,
        interview_status,
        application_id,
      } = req.body;

      // Call service method to create a new interview
      const createdInterview = await InterviewsService.createInterview({
        interview_date,
        interviewer_name,
        interviewer_email,
        location,
        reminder_sent,
        interview_status,
        application_id,
      });

      // Respond with success message and created interview
      res.status(201).json({
        message: 'Interview created successfully',
        createdInterview,
      });
    } catch (error) {
      // Handle known and unknown errors
      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Updates an interview by its ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async updateInterview(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Call service method to update interview
      const updatedInterview = await InterviewsService.updateInterview(id, updateData);

      // Respond with updated interview
      res.status(200).json(updatedInterview);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the interview.' });
      }
    }
  }

  /**
   * Retrieves all interviews.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getAllInterviews(req, res) {
    try {
      // Fetch all interviews from service
      const interviews = await InterviewsService.getAllInterviews();

      // Respond with list of interviews
      res.status(200).json(interviews);
    } catch (error) {
      res.status(500).json({ message: 'Could not fetch interviews.' });
    }
  }

  /**
   * Retrieves an interview by its ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getInterviewById(req, res) {
    try {
      const { id } = req.params;

      // Fetch interview by ID from service
      const interview = await InterviewsService.getInterviewById(id);

      // Respond with the interview
      res.status(200).json(interview);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not fetch the interview.' });
      }
    }
  }

  /**
   * Retrieves interviews by date.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getInterviewsByDate(req, res) {
    try {
      const { date } = req.params;

      // Fetch interviews scheduled on a specific date
      const interviews = await InterviewsService.getInterviewsByDate(date);

      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not fetch interviews by date.' });
      }
    }
  }

  /**
   * Retrieves interviews by location.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getInterviewsByLocation(req, res) {
    try {
      const { loc } = req.params;

      // Fetch interviews by location
      const interviews = await InterviewsService.getInterviewsByLocation(loc);

      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not fetch interviews by location.' });
      }
    }
  }

  /**
   * Retrieves interviews by reminder status.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getInterviewsByReminder(req, res) {
    try {
      const { reminder } = req.params;

      // Fetch interviews by reminder flag (true/false)
      const interviews = await InterviewsService.getInterviewsByReminder(reminder);

      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not fetch interviews by reminder status.' });
      }
    }
  }

  /**
   * Retrieves interviews by interview status.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getInterviewsByStatus(req, res) {
    try {
      const { status } = req.params;

      // Fetch interviews by their current status
      const interviews = await InterviewsService.getInterviewsByStatus(status);

      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not fetch interviews by status.' });
      }
    }
  }

  /**
   * Retrieves interviews by related application ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getInterviewsByApplicationId(req, res) {
    try {
      const { id } = req.params;

      // Fetch interviews tied to a specific application
      const interviews = await InterviewsService.getInterviewsByApplicationId(id);

      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not fetch interviews by application ID.' });
      }
    }
  }

  /**
   * Counts the number of interviews with a given status.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async countInterviewsByStatus(req, res) {
    try {
      const { status } = req.params;

      // Count interviews by their status
      const counts = await InterviewsService.countInterviewsByStatus(status);

      res.status(200).json(counts);
    } catch (error) {
      res.status(500).json({ message: 'Could not count interviews by status.' });
    }
  }

  /**
   * Deletes an interview by its ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async deleteInterview(req, res) {
    try {
      const { id } = req.params;

      // Call service method to delete interview by ID
      await InterviewsService.deleteInterview(id);

      // Respond with no content
      res.status(204).end();
    } catch (error) {
      console.error('Error in InterviewsController while deleting interview:', error);

      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }
}

module.exports = InterviewsController;
