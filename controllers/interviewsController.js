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

      const createdInterview = await InterviewsService.createInterview({
        interview_date,
        interviewer_name,
        interviewer_email,
        location,
        reminder_sent,
        interview_status,
        application_id,
      });
      res.status(201).json({
        message: 'Interview created successfully',
        createdInterview,
      });
    } catch (error) {
      // Handle known errors
      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        // Handle unexpected errors
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

      const updatedInterview = await InterviewsService.updateInterview(
        id,
        updateData
      );
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
      const interviews = await InterviewsService.getAllInterviews();
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
      const interview = await InterviewsService.getInterviewById(id);
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
      const interviews = await InterviewsService.getInterviewsByDate(date);
      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: 'Could not fetch interviews by date.' });
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

      const interviews = await InterviewsService.getInterviewsByLocation(loc);
      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: 'Could not fetch interviews by location.' });
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
      const interviews = await InterviewsService.getInterviewsByReminder(
        reminder
      );
      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: 'Could not fetch interviews by reminder status.' });
      }
    }
  }

  /**
   * Retrieves interviews by status.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getInterviewsByStatus(req, res) {
    try {
      const { status } = req.params;
      const interviews = await InterviewsService.getInterviewsByStatus(status);
      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: 'Could not fetch interviews by status.' });
      }
    }
  }

  /**
   * Retrieves interviews by application ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async getInterviewsByApplicationId(req, res) {
    try {
      const { id } = req.params;
      const interviews = await InterviewsService.getInterviewsByApplicationId(
        id
      );
      res.status(200).json(interviews);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: 'Could not fetch interviews by application ID.' });
      }
    }
  }

  /**
   * Counts the number of interviews for each status.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async countInterviewsByStatus(req, res) {
    try {
      const { status } = req.params;
      const counts = await InterviewsService.countInterviewsByStatus(status);
      res.status(200).json(counts);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Could not count interviews by status.' });
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
      await InterviewsService.deleteInterview(id);

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
