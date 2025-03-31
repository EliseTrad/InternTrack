const CoverLettersRepository = require('../repositories/coverLettersRepository');

class CoverLettersService {
    // create a cover letter
    static async createCoverLetter({ cover_file_path, cover_file_name, cover_upload_date, user_id }) {
        try {
            return await CoverLetterRepository.createCoverLetter({
                cover_file_path,
                cover_file_name,
                cover_upload_date,
                user_id
            });
        } catch (error) {
            throw new Error('Unable to create the cover letter. Please try again later.');
        }
    }

    // Retrieves all cover letters from the database.
    static async getAllCoverLetters() {
        try {
            return CoverLettersRepository.getAllCoverLetters();
        } catch (error) {
            throw new Error('Unable to display the letters at the moment. Please try again later.');
        }
    }

    // get cover letter by unique user ID
    static async getCoverLettersByUserId(userId) {
        try {
            return await CoverLettersRepository.getCoverLetterByUserId(userId);
        } catch (error) {
            throw new Error('Unable to fetch cover letters. Please try again later.');
        }
    }

    // get cover letter by its ID
    static async getCoverLetterById(coverLetterId) {
        try {
            return await CoverLettersRepository.getCoverLetterById(coverLetterId);
        } catch (error) {
            throw new Error('Unable to fetch cover letter. Please try again later.');
        }
    }

    // delete cover letter by its ID
    static async deleteCoverLetter(id) {
        try {
            return await CoverLettersRepository.deleteCoverLetterById(id);
        } catch (error) {
            throw new Error('Unable to delete cover letter. Please try again later.');
        }
    }
}

module.exports = CoverLettersService;
