const Resume = require('../models/Resume');

class ResumesRepository {
    /**
     * Creates a new resume in the database.
     * @param {Object} resume - The object for the resume to be created.
     * @param {string} resume.resume_file_path - The file path (using URL) of the resume.
     * @param {string} resume.resume_file_name - The file name of the resume.
     * @param {Date} resume.resume_upload_date - The upload date of the resume.
     * @param {number} resume.user_id - The user ID associated with the resume.
     * @returns {Promise<Object>} The created resume object.
     * @throws {Error} If there is an issue creating the resume.
     */
    static async createResume(resume) {
        try {
            return await Resume.create(resume);
        } catch (error) {
            console.error("Error creating resume:", error);
            throw new Error('Unable to create the resume at the moment. Please try again later.');
        }
    }

    /**
     * Retrieves all resumes from the database.
     * @static
     * @returns {Promise<Resume[]>} List of resumes.
     * @throws {Error} If there is an issue fetching resumes.
     */
    static async getAllResumes() {
        try {
            return await Resume.findAll();
        } catch (error) {
            console.error("Error fetching resumes:", error);
            throw new Error('Unable to display the resumes at the moment. Please try again later.');
        }
    }

    /**
     * Retrieves all resumes associated with a user by their user ID.
     * @param {number} userId - The ID of the user whose resumes to retrieve.
     * @returns {Promise<Array>} The list of resumes for the user.
     * @throws {Error} If there is an issue fetching the resumes.
     */
    static async getResumesByUserId(userId) {
        try {
            return await Resume.findAll({ where: { user_id: userId } });
        } catch (error) {
            console.error("Error fetching resumes:", error);
            throw new Error('Unable to display the resumes at the moment. Please try again later.');
        }
    }

    /**
     * Retrieves a resume by its ID.
     * @param {number} resumeId - The ID of the resume to retrieve.
     * @returns {Promise<Object|null>} The resume object if found, or null if not found.
     * @throws {Error} If there is an issue fetching the resume.
     */
    static async getResumeById(resumeId) {
        try {
            return await Resume.findByPk(resumeId);
        } catch (error) {
            console.error("Error fetching resume:", error);
            throw new Error(`Unable to display the resume with ID ${id}. Please try again later.`);
        }
    }

    /**
     * Deletes a resume by its ID.
     * @param {number} resumeId - The ID of the resume to delete.
     * @returns {Promise<boolean>} Returns true if the cover letter was deleted, false if not.
     * @throws {Error} If there is an issue deleting the cover letter.
     */
    static async deleteResumeById(resumeId) {
        try {
            const result = await Resume.destroy({ where: { resume_id: resumeId } });
            return result > 0;
        } catch (error) {
            console.error("Error deleting the resume:", error);
            throw new Error(`Unable to delete the resume with ID ${id}. Please try again later.`);
        }
    }
}

module.exports = ResumesRepository;
