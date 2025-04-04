const { where } = require('sequelize');
const Application = require('../models/Application');

class ApplicationsRepository {
    /**
     * Create a new application in the database.
     * @param {Object} application - The application object.
     * @param {string} application.company_name - The name of the company.
     * @param {string} application.position_title - The position title of the internship.
     * @param {Enumerator(['waitlist','rejected','not answered','accepted'])} application.status 
     *                                                          - The  status of the application.
     * @param {Date|null} application.deadline - Optional deadline date of the application.
     * @param {Text} application.notes - Optional notes about the application.
     * @param {string} application.application_source - The source of the application.
     * @param {number} application.used_id - The id of the owner of the application.
     * @param {number} application.resume_id - The id of the resume used in the application.
     * @param {number|null} application.cover_letter_id - The id of the cover letter used in the application.
     * @returns {Promise<Application>} The created application object.
     */
    static async createApplication(application) {
        try {
            return await Application.create(application);
        } catch (error) {
            console.error("Error creating application:", error);
            throw new Error('Unable to create the application at the moment. Please try again later.');
        }
    }

    /**
     * Updates an application's details by its ID.
     * Only updates the fields that are provided (e.g., name, email, password).
     * @param {string} application.company_name - The name of the company.
     * @param {string} application.position_title - The position title of the internship.
     * @param {Enumerator(['waitlist','rejected','not answered','accepted'])} application.status 
     *                                                            - The  status of the application.
     * @param {Date|null} application.deadline - Optional deadline date of the application.
     * @param {Text} application.notes - Optional notes about the application.
     * @param {string} application.application_source - The source of the application.
     * @param {number} application.used_id - The id of the owner of the application.
     * @param {number} application.resume_id - The id of the resume used in the application.
     * @param {number|null} application.cover_letter_id - The id of the cover letter used in the application.
     * @returns {number} The number of affected rows in the database.
     */
    static async updateApplication(id, updatedFields) {
        try {
            const application = await Application.findByPk(id);
            if (!application) throw new Error("Application not found");

            await application.update(updatedFields);
            return application;
        } catch (error) {
            console.error("Error updating application:", error);
            throw new Error('Unable to update the application at the moment. Please try again later.');
        }
    }

    /**
     * Retrieves all applications from the database.
     * @static
     * @returns {Promise<Application[]>} List of applications.
     * @throws {Error} If there is an issue fetching applications.
     */
    static async getAllApplications() {
        try {
            return await Application.findAll();
        } catch (error) {
            console.error("Error fetching applications:", error);
            throw new Error('Unable to display the applications at the moment. Please try again later.');
        }
    }

    /**
     * Retrieves application by the user ID.
     * @param {number} id - The unique ID of the user.
     * @returns {Promise<Application|null>} The application object if found, or null if not found.
     * @throws {Error} If there is an issue fetching the application.
     */
    static async getApplicationsByUserId(id) {
        try {
            return await Application.findAll({ where: { user_id: id } });
        } catch (error) {
            console.error("Error fetching application(s):", error);
            throw new Error(`Unable to display the application(s) with user ID ${id}. 
                Please try again later.`);
        }
    }

    /**
     * Retrieves an application by its unique ID.
     * @param {number} id - The unique ID of the application.
     * @returns {Promise<Application|null>} The application object if found, or null if not found.
     * @throws {Error} If there is an issue fetching the application.
     */
    static async getApplicationById(id) {
        try {
            return await Application.findByPk(id);
        } catch (error) {
            console.error("Error fetching the application:", error);
            throw new Error(`Unable to display the application with ID ${id}. Please try again later.`);
        }
    }

    /**
     * Retrieves applications by a resume id.
     * @param {number} id - The id of the resume.
     * @returns {Promise<Application[]|null>} The list of applications if found, or null if not found.
     * @throws {Error} If there is an issue fetching the applications.
     */
    static async getApplicationsByResumeId(id) {
        try {
            return await Application.findAll({ where: { resume_id: id } });
        } catch (error) {
            console.error("Error fetching the application(s):", error);
            throw new Error(`Unable to display the application(s) with resume id ${id}. 
                            Please try again later.`);
        }
    }

    /**
     * Retrieves applications by a specific status.
     * @param {string} status - The status of the application.
     * @returns {Promise<Application[]|null>} The list of applications if found, or null if not found.
     * @throws {Error} If there is an issue fetching the applications.
     */
    static async getApplicationsByStatus(applicationStatus) {
        try {
            return await Application.findAll({ where: { status: applicationStatus } });
        } catch (error) {
            console.error("Error fetching the application(s):", error);
            throw new Error(`Unable to display the application(s) with status ${applicationStatus}. 
                            Please try again later.`);
        }
    }

    /**
     * Retrieves applications by a cover letter id.
     * @param {number} id - The id of the resume.
     * @returns {Promise<Application[]|null>} The list of applications if found, or null if not found.
     * @throws {Error} If there is an issue fetching the applications.
     */
    static async getApplicationsByCoverLetterId(id) {
        try {
            return await Application.findAll({ where: { cover_letter_id: id } });
        } catch (error) {
            console.error("Error fetching the application(s):", error);
            throw new Error(`Unable to display the application(s) with cover letter id ${id}. 
                            Please try again later.`);
        }
    }

    /**
     * Retrieves applications by a company name.
     * @param {string} name - The company name of the application.
     * @returns {Promise<Application[]|null>} The list of applications if found, or null if not found.
     * @throws {Error} If there is an issue fetching the applications.
     */
    static async getApplicationsByCompanyName(name) {
        try {
            return await Application.findAll({ where: { company_name: name } });
        } catch (error) {
            console.error("Error fetching the application(s):", error);
            throw new Error(`Unable to display the application(s) with company name ${name}. 
                            Please try again later.`);
        }
    }

    /**
     * Retrieves applications by a application source.
     * @param {string} source - The source of the application.
     * @returns {Promise<Application[]|null>} The list of applications if found, or null if not found.
     * @throws {Error} If there is an issue fetching the applications.
     */
    static async getApplicationsBySource(source) {
        try {
            return await Application.findAll({ where: { application_source: source } });
        } catch (error) {
            console.error("Error fetching the application(s):", error);
            throw new Error(`Unable to display the application(s) with application source ${source}. 
                            Please try again later.`);
        }
    }

    /**
     * Retrieves a user by their email address.
     * @param {string} email - The email address of the user.
     * @returns {Promise<User|null>} The user object if found, or null if not found.
     * @throws {Error} If there is an issue fetching the user.
     */
    static async getApplicationByPositionTitle(title) {
        try {
            return await Application.findAll({ where: { position_title: title } });
        } catch (error) {
            console.error("Error fetching the application(s):", error);
            throw new Error(`Unable to display the application(s) with position title ${title}. 
                Please try again later.`);
        }
    }

    /**
    * Retrieves all applications created on a specific date.
    * @param {import('sequelize').DateOnlyDataType} date - 
*                       The application date to search for applications ('YYYY-MM-DD').
    * @returns {Promise<Application[]>} A list of Applications created on the given date.
    * @throws {Error} If there is an issue fetching applications by the creation date.
    */
    static async getApplicationsByDate(date) {
        try {
            return await Application.findAll({ where: { application_date: date } });
        } catch (error) {
            console.error("Error fetching the applications(s) by creation date:", error);
            throw new Error(`Unable to display the application(s) with creation date ${date}. 
                Please try again later.`);
        }
    }


    /**
     * Deletes an application by its unique ID.
     * @param {number} id - The unique ID of the application.
     * @returns {Promise<boolean>} True if the application was deleted, false if not found.
     * @throws {Error} If a database error occurs or application not found.
     */
    static async deleteApplicationById(id) {
        try {
            const deletedApplication = await Application.destroy({
                where: { application_id: id }
            });

            return deletedApplication > 0;
        } catch (error) {
            console.error("Error deleting the application:", error);
            throw new Error(`Unable to delete the application with ID ${id}. Please try again later.`);
        }
    }

    /**
    * Counts the number of applications for each status.
    * @param {Array<string>} statuses - An array of status values to filter applications by (
    *                                      e.g., ['waitlist', 'rejected']).
    * @returns {Promise<Object>} A mapping of status to the count of applications in that status.
    * @throws {Error} If there is an issue fetching the application count.
    */
    static async countApplicationsByStatuses(statuses) {
        try {
            // Count the number of applications grouped by status
            const result = await Application.count({
                where: { status: statuses },
                group: ['status'],
            });

            return result;
        } catch (error) {
            console.error("Error counting applications:", error);
            throw new Error("Unable to count applications by status.");
        }
    }

    /**
    * Counts the number of applications for user.
    * @param {number} id - id of the user
    * @returns {Promise<Object>} - the count of applications for that user.
    * @throws {Error} If there is an issue fetching the application count.
    */
    static async countApplicationsByUserId(id) {
        try {
            // Count the number of applications grouped by user_id
            const result = await Application.count({
                where: { used_id: id },
                group: ['user_id'],
            });

            return result;
        } catch (error) {
            console.error("Error counting applications:", error);
            throw new Error("Unable to count applications by user ID.");
        }
    }

}

module.exports = ApplicationsRepository;
