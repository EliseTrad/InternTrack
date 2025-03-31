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
            const applications = await ApplicationsService.getAllApplications();
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    static async getApplicationById(req, res) {
        try {
            const { id } = req.params;
            const application =  await ApplicationsService.getApplicationById(id);
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({message: error.message});           
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
            res.status(500).json({message: error.message});           
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
            res.status(500).json({message: error.message});           
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
            res.status(500).json({message: error.message});           
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
            res.status(500).json({message: error.message});           
        }
    }

    static async getApplicationsByDeadline(req, res) {
        try {
            const { deadline } = req.params; 
            const applications =  await ApplicationsService.getApplicationsByDate(deadline);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({message: error.message});           
        }
    }

    static async getApplicationsBySource(req, res) {
        try {
            const { source } = req.params; 
            const applications =  await ApplicationsService.getApplicationsBySource(source);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({message: error.message});           
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
            const applications =  await ApplicationsService.getApplicationsByResumeId(id);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({message: error.message});           
        }
    }

    static async getApplicationsByCoverLetterId(req, res) {
        try {
            const { id } = req.params; 
            const applications =  await ApplicationsService.getApplicationsByCoverLetterId(id);
            if (!applications) {
                return res.status(404).json({ message: 'Application(s) not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({message: error.message});           
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
    
}

module.exports = ApplicationsController;
