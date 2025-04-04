const { body } = require('express-validator');
const ApplicationsService = require('../services/applicationsService');

class ApplicationsController {

    static async createApplication(req, res) {
        try {
            const { company_name, position_title, application_date, status,
                deadline, notes, application_source, user_id, resume_id, cover_letter_id } = req.body;

            const result = await ApplicationsService.createApplication({
                company_name, position_title, application_date, status,
                deadline, notes, application_source, user_id, resume_id, cover_letter_id
            });

            res.status(201).json({ message: 'Application created successfully', result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }

    static async updateApplication(req, res) {
        try {
            const { id } = req.params;
            const { company_name, position_title, application_date, status,
                deadline, notes, application_source, user_id, resume_id, cover_letter_id } = req.body;

            const result = await ApplicationsService.createApplication(id, {
                company_name, position_title, application_date, status,
                deadline, notes, application_source, user_id, resume_id, cover_letter_id
            });
            res.status(201).json({ message: 'Application updated successfully', result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }

    static async getAllApplications(req, res) {
        try {
            const result = await ApplicationsService.getAllApplications();
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getApplicationById(req, res) {
        try {
            const { id } = req.params;
            const application = await ApplicationsService.getApplicationById(id);
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }
            res.status(201).json(application);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getApplicationsByUserId(req, res) {
        try {
            const { id } = req.params;
            const applications = await ApplicationsService.getApplicationsByUserId(id);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getApplicationsByCompanyName(req, res) {
        try {
            const { name } = req.params;
            const applications = await ApplicationsService.getApplicationsByCompanyName(name);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getApplicationsByPositionTitle(req, res) {
        try {
            const { title } = req.params;
            const applications = await ApplicationsService.getApplicationsByPositionTitle(title);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getApplicationsByStatus(req, res) {
        try {
            const { status } = req.params;
            const applications = await ApplicationsService.getApplicationsByStatus(status);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getApplicationsByDeadline(req, res) {
        try {
            const { deadline } = req.params;
            const applications = await ApplicationsService.getApplicationsByDate(deadline);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getApplicationsBySource(req, res) {
        try {
            const { source } = req.params;
            const applications = await ApplicationsService.getApplicationsBySource(source);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteApplicationById(req, res) {
        try {
            const { id } = req.params;
            const result = await ApplicationsService.deleteApplicationById(id);
            if (!result) {
                return res.status(404).json({ message: 'Application not found' });
            }
            res.status(200).json({ message: 'Application deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    static async getApplicationsByResumeId(req, res) {
        try {
            const { id } = req.params;
            const applications = await ApplicationsService.getApplicationsByResumeId(id);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getApplicationsByCoverLetterId(req, res) {
        try {
            const { id } = req.params;
            const applications = await ApplicationsService.getApplicationsByCoverLetterId(id);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async countApplicationsByStatuses(req, res) {
        try {
            const { statuses } = req.body;
            if (!Array.isArray(statuses) || statuses.length === 0) {
                return res.status(400).json({ message: 'Invalid or empty statuses array' });
            }
            const applications = await ApplicationsService.countApplicationsByStatus(statuses);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(200).json({ applications });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async countApplicationsByUserId(req, res) {
        try {
            const { id } = req.body;
            const applications = await ApplicationsService.countApplicationsByUserId(id);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(200).json({ applications });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Export applications to Excel
    static async exportApplicationsToExcel(req, res) {
        try {
            const { userId } = req.params;
            const applications = await applicationService.getApplicationsByUserId(userId);

            // Create a new Excel workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Applications');
            worksheet.columns = [
                { header: 'ID', key: 'id' },
                { header: 'Company name', key: 'company_name' },
                { header: 'Position', key: 'position_title' },
                { header: 'Date', key: 'application_date' },
                { header: 'Status', key: 'status' },
                { header: 'Deadline', key: 'deadline' },
                { header: 'Notes', key: 'notes' },
                { header: 'Source', key: 'application_source' },
                { header: 'Resume ID', key: 'resume_id' },
                { header: 'Cover letter ID', key: 'cover_letter_id' },
            ];

            // Add rows to the Excel sheet, replacing null values with "N/A"
            applications.forEach(application => {
                const appData = application.toJSON();
                const rowData = Object.keys(appData).reduce((acc, key) => {
                    acc[key] = appData[key] === null ? 'N/A' : appData[key];
                    return acc;
                }, {});

                worksheet.addRow(rowData);
            });

            // Set response headers for Excel file
            res.setHeader('Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            res.status(500).json({ message: 'Error exporting to Excel: ' + error.message });
        }
    };

    // Export applications to PDF
    static async exportApplicationsToPDF(req, res) {
        const { userId } = req.params;

        try {
            const applications = await applicationService.getApplicationsByUserId(userId);

            const doc = new PDFDocument();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=applications.pdf');

            doc.pipe(res);
            doc.fontSize(16).text(`Applications for User: ${userId}`, { align: 'center' });
            doc.moveDown();

            applications.forEach(application => {
                // Replace null values with 'N/A' for PDF output
                doc.text(`ID: ${application.application_id || 'N/A'}`);
                doc.text(`Company name: ${application.company_name || 'N/A'}`);
                doc.text(`Position: ${application.position_title || 'N/A'}`);
                doc.text(`Date: ${application.application_date || 'N/A'}`);
                doc.text(`Status: ${application.status || 'N/A'}`);
                doc.text(`Deadline: ${application.deadline || 'N/A'}`);
                doc.text(`Notes: ${application.notes || 'N/A'}`);
                doc.text(`Source: ${application.source || 'N/A'}`);
                doc.text(`Resume ID: ${application.resume_id || 'N/A'}`);
                doc.text(`Cover letter ID: ${application.cover_letter_id || 'N/A'}`);
                doc.moveDown();
            });

            doc.end();
        } catch (error) {
            res.status(500).json({ message: 'Error exporting to PDF: ' + error.message });
        }
    }

}

module.exports = ApplicationsController;
