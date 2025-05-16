const { body } = require('express-validator');
const ApplicationsService = require('../services/applicationsService');
const { NotFound, ConflictError } = require('../errors/customError');
const ExcelJS = require('exceljs');

/**
 * ApplicationsController class provides methods to handle HTTP requests related to applications.
 * Each method interacts with the ApplicationsService to perform CRUD operations on applications.
 */
class ApplicationsController {
  /**
   * Creates a new application in the system.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - Validated application data.
   * @param {string} req.body.companyName - The name of the company.
   * @param {string} req.body.positionTitle - The title of the position applied for.
   * @param {Date} req.body.applicationDate - The date of the application.
   * @param {string} req.body.status - The status of the application ('waitlist', 'rejected', etc.).
   * @param {Date|null} [req.body.deadline] - Optional deadline date of the application.
   * @param {string} [req.body.notes] - Optional notes about the application.
   * @param {string} req.body.source - The source of the application.
   * @param {number} req.body.userId - The ID of the user who created the application.
   * @param {number} req.body.resumeId - The ID of the resume used in the application.
   * @param {number|null} [req.body.coverId] - Optional ID of the cover letter used in the application.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the created application or an error message.
   * @throws {NotFound|Error} If related entities (e.g., user, resume) are not found or if there's a
   *                          database error.
   */
  static async createApplication(req, res) {
    try {
      // Extract fields from the request body
      const {
        companyName,
        positionTitle,
        applicationDate,
        status,
        deadline,
        notes,
        source,
        userId,
        resumeId,
        coverId,
      } = req.body;

      // Call the service to create the application
      const result = await ApplicationsService.createApplication({
        company_name: companyName,
        position_title: positionTitle,
        application_date: applicationDate,
        status: status,
        deadline: deadline || null, // Ensure optional fields have default values
        notes: notes || null,
        application_source: source,
        user_id: userId,
        resume_id: resumeId,
        cover_letter_id: coverId || null,
      });

      // Respond with success message and created application
      res.status(201).json({
        message: 'Application created successfully',
        result,
      });
    } catch (error) {
      console.error(
        'Error in ApplicationsController while creating application:',
        error
      );

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
   * Updates an application by its ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {number} req.params.id - The ID of the application to update.
   * @param {Object} req.body - Validated fields to update.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the updated application or an error message.
   * @throws {NotFound|Error} If the application or related entities are not found or there's
   *                          a database error.
   */
  static async updateApplicationById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Call the service to update the application
      const updatedApplication =
        await ApplicationsService.updateApplicationById(id, updateData);

      res.status(200).json(updatedApplication);
    } catch (error) {
      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the application.' });
      }
    }
  }

  /**
   * Retrieves all applications associated with a specific user ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {number} req.params.id - The unique ID of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications for the user or an error message.
   * @throws {NotFound|Error} If the user does not exist or if there's a database error.
   */
  static async getApplicationsByUserId(req, res) {
    try {
      const { id } = req.params;
      const applications = await ApplicationsService.getApplicationsForUser(id);

      // If no applications are found, return an empty array (not 404)
      res.status(200).json(applications);
    } catch (error) {
      console.error(
        'Error in ApplicationController while fetching applications by user ID:',
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
   * Retrieves all applications.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Response} A list of applications or an error message.
   */
  static async getAllApplications(req, res) {
    try {
      const applications = await ApplicationsService.getAllApplications();
      return res.status(200).json(applications);
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching all applications:',
        error
      );
      return res
        .status(500)
        .json({ message: 'An error occurred while fetching applications.' });
    }
  }

  /**
   * Retreive an application by its ID.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Response} The application object or an error message.
   */
  static async getApplicationById(req, res) {
    try {
      const { id } = req.params;
      const application = await ApplicationsService.getApplicationById(id);
      return res.status(200).json(application);
    } catch (error) {
      if (error instanceof NotFound) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error(
        'Error in ApplicationsController while fetching application by ID:',
        error
      );
      return res
        .status(500)
        .json({ message: 'An error occurred while fetching the application.' });
    }
  }

  /**
   * Retrieves applications by company name.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {string} req.params.name - The company name of the application.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications matching the company name or
   *                          an error message.
   * @throws {NotFound|Error} If no applications are found or if there's a database error.
   */
  static async getApplicationsByCompanyName(req, res) {
    try {
      const { name } = req.params;
      const applications =
        await ApplicationsService.getApplicationsByCompanyName(name);

      res.status(200).json(applications); // OK
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching applications by company name:',
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
   * Retrieves applications by position title.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {string} req.params.title - The position title of the application.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications matching the position title or
   *                          an error message.
   * @throws {NotFound|Error} If no applications are found or if there's a database error.
   */
  static async getApplicationsByPositionTitle(req, res) {
    try {
      const { title } = req.params;
      const applications =
        await ApplicationsService.getApplicationsByPositionTitle(title);

      res.status(200).json(applications); // OK
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching applications by position title:',
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
   * Retrieves applications by status.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {string} req.params.status - The status of the application.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications matching the status or an error message.
   * @throws {NotFound|Error} If no applications are found or if there's a database error.
   */
  static async getApplicationsByStatus(req, res) {
    try {
      const { status } = req.params;
      const applications = await ApplicationsService.getApplicationsByStatus(
        status
      );

      res.status(200).json(applications); // OK
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching applications by status:',
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
   * Retrieves applications by deadline.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {string} req.params.deadline - The deadline date of the application ('YYYY-MM-DD').
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications matching the deadline or an error message.
   * @throws {NotFound|Error} If no applications are found or if there's a database error.
   */
  static async getApplicationsByDeadline(req, res) {
    try {
      const { deadline } = req.params;
      const applications = await ApplicationsService.getApplicationsByDeadline(
        deadline
      );

      res.status(200).json(applications); // OK
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching applications by deadline:',
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
   * Retrieves applications by date.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {string} req.params.date - The date of the application ('YYYY-MM-DD').
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications matching the date or an error message.
   * @throws {NotFound|Error} If no applications are found or if there's a database error.
   */
  static async getApplicationsByDate(req, res) {
    try {
      const { date } = req.params;
      const applications = await ApplicationsService.getApplicationsByDate(
        date
      );

      res.status(200).json(applications); // OK
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching applications by date:',
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
   * Retrieves applications by source.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {string} req.params.source - The source of the application.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications matching the source or an error message.
   * @throws {NotFound|Error} If no applications are found or if there's a database error.
   */
  static async getApplicationsBySource(req, res) {
    try {
      const { source } = req.params;
      const applications = await ApplicationsService.getApplicationsBySource(
        source
      );

      res.status(200).json(applications); // OK
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching applications by source:',
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
   * Deletes an application by its unique ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {number} req.params.id - The unique ID of the application to delete.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with a success message or an error message.
   * @throws {NotFound|Error} If the application does not exist or if there's a database error.
   */
  static async deleteApplicationById(req, res) {
    try {
      const { id } = req.params;
      const isDeleted = await ApplicationsService.deleteApplicationById(id);

      res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
      console.error(
        'Error in ApplicationController while deleting application:',
        error
      );

      if (error instanceof NotFound || error instanceof ConflictError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Retrieves applications by resume ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {number} req.params.id - The ID of the resume.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications associated with the resume or an error message.
   * @throws {NotFound|Error} If the resume or applications are not found or if there's a database error.
   */
  static async getApplicationsByResumeId(req, res) {
    try {
      const { id } = req.params; // Assuming resume ID is passed as a route parameter
      const applications = await ApplicationsService.getApplicationsByResumeId(
        id
      );

      res.status(200).json(applications); // OK
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching applications by resume ID:',
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
   * Retrieves applications by cover letter ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {number} req.params.coverId - The ID of the cover letter.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications associated with the cover letter
   *                          or an error message.
   * @throws {NotFound|Error} If the cover letter or applications are not found or if there's a
   *                          database error.
   */
  static async getApplicationsByCoverLetterId(req, res) {
    try {
      const { coverId } = req.params; // Assuming cover letter ID is passed as a route parameter
      const applications =
        await ApplicationsService.getApplicationsByCoverLetterId(coverId);

      res.status(200).json(applications); // OK
    } catch (error) {
      console.error(
        'Error in ApplicationsController while fetching applications by cover letter ID:',
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
   * Counts the number of applications associated with a specific user ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters of the request.
   * @param {number} req.params.id - The unique ID of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the count of applications or an error message.
   * @throws {NotFound|Error} If the user does not exist or if there's a database error.
   */
  static async countApplicationsForUser(req, res) {
    try {
      const { userId } = req.params; // Assuming the user ID is passed in the param
      const count = await ApplicationsService.countApplicationsForUser(userId);

      res.status(200).json({ count }); // Return the count as part of the response
    } catch (error) {
      console.error(
        'Error in ApplicationController while counting applications by user ID:',
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
   * Exports applications as an Excel file.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters of the request.
   * @param {number} req.params.userId - The unique ID of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with an Excel file containing the user's applications or an error message.
   * @throws {NotFound|Error} If the user or applications are not found or if there's a database error.
   */
  static async exportApplicationsToExcel(req, res) {
    try {
      // Get the user ID from the request parameters
      const { userId } = req.params;

      // Fetch all applications for the user
      const applications = await ApplicationsService.getApplicationsForUser(
        userId
      );

      // Check if no applications were found for the user
      if (applications.length === 0) {
        return res
          .status(404)
          .json({ message: 'No applications found for this user.' });
      }

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Applications');

      // Add column headers
      worksheet.columns = [
        { header: 'Company Name', key: 'company_name' },
        { header: 'Position', key: 'position_title' },
        { header: 'Date', key: 'application_date' },
        { header: 'Status', key: 'status' },
        { header: 'Deadline', key: 'deadline' },
        { header: 'Notes', key: 'notes' },
        { header: 'Source', key: 'application_source' },
        { header: 'Resume ID', key: 'resume_id' },
        { header: 'Cover Letter ID', key: 'cover_letter_id' },
      ];

      // Add rows with data
      applications.forEach((app) => {
        worksheet.addRow({
          company_name: app.company_name || 'N/A',
          position_title: app.position_title || 'N/A',
          application_date: app.application_date || 'N/A',
          status: app.status || 'N/A',
          deadline: app.deadline || 'N/A',
          notes: app.notes || 'N/A',
          application_source: app.application_source || 'N/A',
          resume_id: app.resume_id || 'N/A',
          cover_letter_id: app.cover_letter_id || 'N/A',
        });
      });

      // Set response headers to download the Excel file
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=applications.xlsx'
      );

      // Write the Excel file to the response
      await workbook.xlsx.write(res);
      res.end(); // End the response after sending the file
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      // If the error is a NotFound error, return a 404
      if (error instanceof NotFound) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      // If another error occurs, send a generic error message
      return res
        .status(500)
        .json({ message: 'Could not export applications to Excel.' });
    }
  }

  /**
   * Retrieves applications by company name for a specific user.
   *
   * @route GET /applications/company/:name/user/:userId
   * @param {Object} req - The Express request object.
   * @param {string} req.params.name - The company name to search applications by.
   * @param {string} req.params.userId - The ID of the user.
   * @param {Object} res - The Express response object.
   * @returns {Object[]} 200 - A list of applications matching the company name for the user.
   * @throws {NotFound} If the user does not exist or no applications are found.
   */
  static async getApplicationsByCompanyNameAndUser(req, res) {
    try {
      const { name, userId } = req.params;
      const applications =
        await ApplicationsService.getApplicationsByCompanyNameAndUser(
          name,
          userId
        );
      res.status(200).json(applications); // OK
    } catch (error) {
      let errorCode = 500;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof NotFound) {
        errorCode = error.statusCode;
        errorMessage = error.message;
      }
      console.error(
        'Error in ApplicationsController while fetching applications by company name and user ID:',
        error
      );
      res.status(errorCode).json({ message: errorMessage });
    }
  }

  /**
   * Retrieves applications by position title for a specific user.
   *
   * @route GET /applications/position/:title/user/:userId
   * @param {Object} req - The Express request object.
   * @param {string} req.params.title - The position title to search applications by.
   * @param {string} req.params.userId - The ID of the user.
   * @param {Object} res - The Express response object.
   * @returns {Object[]} 200 - A list of applications matching the position title for the user.
   * @throws {NotFound} If the user does not exist or no applications are found.
   */
  static async getApplicationsByPositionTitleAndUser(req, res) {
    try {
      const { title, userId } = req.params;
      const applications =
        await ApplicationsService.getApplicationsByPositionTitleAndUser(
          title,
          userId
        );
      res.status(200).json(applications);
    } catch (error) {
      let errorCode = 500;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof NotFound) {
        errorCode = error.statusCode;
        errorMessage = error.message;
      }
      console.error(
        'Error in ApplicationsController while fetching applications by position title and user ID:',
        error
      );
      res.status(errorCode).json({ message: errorMessage });
    }
  }

  /**
   * Retrieves applications by status for a specific user.
   *
   * @route GET /applications/status/:status/user/:userId
   * @param {Object} req - The Express request object.
   * @param {string} req.params.status - The status to search applications by.
   * @param {string} req.params.userId - The ID of the user.
   * @param {Object} res - The Express response object.
   * @returns {Object[]} 200 - A list of applications matching the status for the user.
   * @throws {NotFound} If the user does not exist or no applications are found.
   */
  static async getApplicationsByStatusAndUser(req, res) {
    try {
      const { status, userId } = req.params;
      const applications =
        await ApplicationsService.getApplicationsByStatusAndUser(
          status,
          userId
        );
      res.status(200).json(applications);
    } catch (error) {
      let errorCode = 500;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof NotFound) {
        errorCode = error.statusCode;
        errorMessage = error.message;
      }
      console.error(
        'Error in ApplicationsController while fetching applications by status and user ID:',
        error
      );
      res.status(errorCode).json({ message: errorMessage });
    }
  }

  /**
   * Retrieves applications by deadline for a specific user.
   *
   * @route GET /applications/deadline/:deadline/user/:userId
   * @param {Object} req - The Express request object.
   * @param {string} req.params.deadline - The deadline date in 'YYYY-MM-DD' format.
   * @param {string} req.params.userId - The ID of the user.
   * @param {Object} res - The Express response object.
   * @returns {Object[]} 200 - A list of applications matching the deadline for the user.
   * @throws {NotFound} If the user does not exist or no applications are found.
   */
  static async getApplicationsByDeadlineAndUser(req, res) {
    try {
      const { deadline, userId } = req.params;
      const applications =
        await ApplicationsService.getApplicationsByDeadlineAndUser(
          deadline,
          userId
        );
      res.status(200).json(applications);
    } catch (error) {
      let errorCode = 500;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof NotFound) {
        errorCode = error.statusCode;
        errorMessage = error.message;
      }
      console.error(
        'Error in ApplicationsController while fetching applications by deadline and user ID:',
        error
      );
      res.status(errorCode).json({ message: errorMessage });
    }
  }

  /**
   * Retrieves applications by date for a specific user.
   *
   * @route GET /applications/date/:date/user/:userId
   * @param {Object} req - The Express request object.
   * @param {string} req.params.date - The application date in 'YYYY-MM-DD' format.
   * @param {string} req.params.userId - The ID of the user.
   * @param {Object} res - The Express response object.
   * @returns {Object[]} 200 - A list of applications matching the date for the user.
   * @throws {NotFound} If the user does not exist or no applications are found.
   */
  static async getApplicationsByDateAndUser(req, res) {
    try {
      const { date, userId } = req.params;
      const applications =
        await ApplicationsService.getApplicationsByDateAndUser(date, userId);
      res.status(200).json(applications);
    } catch (error) {
      let errorCode = 500;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof NotFound) {
        errorCode = error.statusCode;
        errorMessage = error.message;
      }
      console.error(
        'Error in ApplicationsController while fetching applications by date and user ID:',
        error
      );
      res.status(errorCode).json({ message: errorMessage });
    }
  }

  /**
   * Retrieves applications by source for a specific user.
   *
   * @route GET /applications/source/:source/user/:userId
   * @param {Object} req - The Express request object.
   * @param {string} req.params.source - The source of the application.
   * @param {string} req.params.userId - The ID of the user.
   * @param {Object} res - The Express response object.
   * @returns {Object[]} 200 - A list of applications matching the source for the user.
   * @throws {NotFound} If the user does not exist or no applications are found.
   */
  static async getApplicationsBySourceAndUser(req, res) {
    try {
      const { source, userId } = req.params;
      const applications =
        await ApplicationsService.getApplicationsBySourceAndUser(
          source,
          userId
        );
      res.status(200).json(applications);
    } catch (error) {
      let errorCode = 500;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof NotFound) {
        errorCode = error.statusCode;
        errorMessage = error.message;
      }
      console.error(
        'Error in ApplicationsController while fetching applications by source and user ID:',
        error
      );
      res.status(errorCode).json({ message: errorMessage });
    }
  }
}

module.exports = ApplicationsController;
