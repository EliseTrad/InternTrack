const ApplicationsRepository = require('../repositories/applicationsRepository');

class ApplicationsService {
    // Create a new application
    async createApplication({ company_name, position_title, application_date, status,
        deadline, notes, application_source, user_id, resume_id, cover_letter_id }) {
        try {
            return await ApplicationsRepository.createApplication({
                company_name, position_title, application_date, status,
                deadline, notes, application_source, user_id, resume_id,
                cover_letter_id
            });
        } catch (error) {
            throw new Error('Unable to create the application at the moment. Please try again later.');
        }

    }

    // Update an application by ID
    async updateApplication(id, updatedFields) {
        try {
            return await ApplicationsRepository.updateApplication(id, updatedFields);
        } catch (error) {
            throw new Error('Unable to update the application at the moment. Please try again later.');
        }
    }

    // Get all applications
    async getAllApplications() {
        try {
            return await ApplicationsRepository.getAllApplications();
        } catch (error) {
            throw new Error('Unable to display the applications at the moment. Please try again later.');
        }
    }

    // Get an application by ID
    async getApplicationById(id) {
        try {
            return await ApplicationsRepository.getApplicationById(id);
        } catch (error) {
            throw new Error(`Unable to display the application with ID ${id}. 
                Please try again later.`);
        }
    }

    // Get applications by user ID
    async getApplicationsByUserId(id) {
        try {
            return await ApplicationsRepository.getApplicationsByUserId(id);
        } catch (error) {
            throw new Error(`Unable to display the application(s) with user ID ${id}. 
                Please try again later.`);
        }
    }

    // Get applications by company name
    async getApplicationsByCompanyName(name) {
        try {
            return await ApplicationsRepository.getApplicationsByCompanyName(name);
        } catch (error) {
            throw new Error(`Unable to display the application(s) with company name ${name}. 
                            Please try again later.`);
        }
    }

    // Get applications by position title
    async getApplicationsByPositionTitle(title) {
        try {
            return await ApplicationsRepository.getApplicationsByPositionTitle(title);
        } catch (error) {
            throw new Error(`Unable to display the application(s) with position title ${title}. 
                            Please try again later.`);
        }
    }

    // Get applications by status
    async getApplicationsByStatus(status) {
        try {
            return await ApplicationsRepository.getApplicationsByStatus(status);
        } catch (error) {
            throw new Error(`Unable to display the application(s) with status ${status}. 
                Please try again later.`);
        }
    }

    // Get applications by deadline
    async getApplicationsByDeadline(deadline) {
        try {
            return await ApplicationsRepository.getApplicationsByDate(deadline);
        } catch (error) {
            throw new Error(`Unable to display the application(s) with deadline ${deadline}. 
                Please try again later.`);
        }
    }

    // Get applications by source
    static async getApplicationsBySource(source) {
        try {
            return await ApplicationsRepository.getApplicationsBySource(source);
        } catch (error) {
            throw new Error(`Unable to display the application(s) with application source ${source}. 
                            Please try again later.`);
        }
    }

    // Delete an application by ID
    async deleteApplicationById(id) {
        try {
            return await ApplicationsRepository.deleteApplicationById(id);
        } catch (error) {
            throw new Error(`Unable to delete the application with ID ${id}. Please try again later.`);
        }
    }

    // Get applications by resume ID
    static async getApplicationsByResumeId(id) {
        try {
            return await ApplicationsRepository.getApplicationsByResumeId(id);
        } catch (error) {
            throw new Error(`Unable to display the application(s) with resume id ${id}. 
                            Please try again later.`);
        }

    }

    // Get applications by cover letter ID
    async getApplicationsByCoverLetterId(id) {
        try {
            return await ApplicationsRepository.getApplicationsByCoverLetterId(id);
        } catch (error) {
            throw new Error(`Unable to display the application(s) with cover letter id ${id}. 
                            Please try again later.`);
        }
    }

    // Count applications by status
    async countApplicationsByStatuses(statuses) {
        try {
            return await ApplicationsRepository.countApplicationsByStatuses(statuses);
        } catch (error) {
            throw new Error('Unable to count applications by status.')
        }
    }
}

module.exports = ApplicationsService;
