const { body } = require('express-validator');
const ApplicationsService = require('../services/applicationsService');
const { NotFound } = require('../errors/customError');
const ExcelJS = require('exceljs');

class ApplicationsController {
  /**
   * Creates a new application.
   * Assumes the request body has been validated by the DTO.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - Validated application data.
   * @param {string} req.body.companyName - Company name.
   * @param {string} req.body.positionTitle - Position title.
   * @param {Date} req.body.applicationDate - Application date.
   * @param {string} req.body.status - Application status.
   * @param {Date|null} [req.body.deadline] - Optional deadline.
   * @param {string} [req.body.notes] - Optional notes.
   * @param {string} req.body.source - Application source.
   * @param {number} req.body.userId - User ID.
   * @param {number} req.body.resumeId - Resume ID.
   * @param {number|null} [req.body.coverId] - Optional cover letter ID.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the created application or an error message.
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
        applicationSource,
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
        application_source: applicationSource,
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
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Could not update the application.' });
      }
    }
  }

  /**
   * Retrieves all applications associated with a specific user ID.
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {number} req.params.id - The unique ID of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the list of applications for the user or an error message.
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
   * Retrieves applications by company name.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
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
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
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
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
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
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
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
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
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
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
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
   * @param {Object} req - The request object.
   * @param {Object} req.params - Route parameters.
   * @param {number} req.params.id - The unique ID of the application to delete.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with a success message or an error message.
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

      if (error instanceof NotFound) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred.' });
      }
    }
  }

  /**
   * Retrieves applications by resume ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
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
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
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
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters of the request.
   * @param {number} req.params.id - The unique ID of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} Responds with the count of applications or an error message.
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
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  static async exportApplicationsToExcel(req, res) {
    try {
      // Get the user ID from the request parameters
      const { userId } = req.params;

      // Fetch all applications for the user
      const applications = await ApplicationsService.getApplicationsForUser(
        userId
      );

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
      res.end(); // End the response
    } catch (error) {
      // Log the error and send a generic error message
      console.error('Error exporting to Excel:', error);
      res
        .status(500)
        .json({ message: 'Could not export applications to Excel.' });
    }
  }
}

module.exports = ApplicationsController;
