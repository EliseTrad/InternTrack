const CoverLettersService = require('../services/coverLettersService');

class CoverLettersController {

    static async createCoverLetter(req, res) {
        try {
            const { cover_file_path, cover_file_name, cover_upload_date, user_id } = req.body;
            const result = await CoverLettersService.createCoverLetter({
                cover_file_path,
                cover_file_name,
                cover_upload_date,
                user_id
            });
            res.status(201).json({message: "Cover letter created successfully", result});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
    
    static async getAllCoverLetters(req, res) {
        try {
            const letters = await CoverLettersService.getAllCoverLetters();
            res.status(200).json(letters);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getCoverLettersByUserId(req, res) {
        try {
            const {id} = req.params;
            const result = await CoverLettersService.getCoverLettersByUserId(id);
            if (!result) {
                return res.status(404).json({ message: 'Cover letter not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getCoverLetterById(req, res) {
        try {
            const {id} = req.params;
            const result = await CoverLettersService.getCoverLetterById(id);
            if (!result) {
                return res.status(404).json({ message: 'Cover letter not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteCoverLetter(req, res) {
        try {
            const { id } = req.params;
            const result = await CoverLettersService.deleteUser(id);
            if (!result) {
                return res.status(404).json({ message: 'Cover letter not found' });
            }
            res.status(200).json({ message: 'Cover letter deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = CoverLettersController;