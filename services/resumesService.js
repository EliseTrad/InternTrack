const ResumesRepository = require('../repositories/resumesRepository');

class ResumesService {
    // create a resume
    static async createResume({ resume_id, resume_file_path, resume_file_name,
                                resume_upload_date, user_id }) {
        try {
            return await ResumesRepository.createResume({ resume_id, resume_file_path, resume_file_name,
                                                          resume_upload_date, user_id })
        } catch (error) {
            throw new Error('Unable to create the resume at the moment. Please try again later.');
        }
    }

    // retrieves all resumes from the database.
    static async getAllResumes() {
        try {
            return await ResumesRepository.getAllResumes();
        } catch (error) {
            throw new Error('Unable to display the resumes at the moment. Please try again later.');
        }
    }

    // retrieves all resumes associated with a user by their user ID.
    static async getResumesByUserId(userId) {
        try {
            return await ResumesRepository.getResumesByUserId(userId);
        } catch (error) {
            throw new Error('Unable to display the resumes at the moment. Please try again later.');
        }
    }

    // retrieves a resume by its ID.
    static async getResumeById(resumeId) {
        try {
            return await ResumesRepository.getResumeById(resumeId);
        } catch (error) {
            throw new Error(`Unable to display the resume with ID ${id}. Please try again later.`);
        }
    }

    // deletes a resume by its ID.
    static async deleteResumeById(resumeId) {
        try {
            const result = await ResumesRepository.deleteResumeById(resumeId);
        } catch (error) {
            throw new Error(`Unable to delete the resume with ID ${id}. Please try again later.`);
        }
    }
}

module.exports = ResumesService;
