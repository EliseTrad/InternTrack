const ResumesService = require('../services/resumesService');

class ResumesController {

    static async createResume(req, res) {
        try {
            const { resume_id, resume_file_path, resume_file_name,
                resume_upload_date, user_id } = req.body;
            const result = await ResumesService.createResume({ 
                resume_id, 
                resume_file_path, 
                resume_file_name,
                resume_upload_date, 
                user_id });
            res.status(201).json({message: "Resume created successfully", result});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
    
    static async getAllResumes(req, res) {
        try {
            const resumes = await ResumesService.getAllResumes();
            res.status(200).json(resumes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getResumessByUserId(req, res) {
        try {
            const {id} = req.params;
            const result = await ResumesService.getResumesByUserId(id);
            if (!result) {
                return res.status(404).json({ message: 'Resume not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getResumeById(req, res) {
        try {
            const {id} = req.params;
            const result = await ResumesService.getResumeById(id);
            if (!result) {
                return res.status(404).json({ message: 'Resume not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteResumeById(req, res) {
        try {
            const { id } = req.params;
            const result = await ResumesService.deleteResumeById(id);
            if (!result) {
                return res.status(404).json({ message: 'Resume not found' });
            }
            res.status(200).json({ message: 'Resume deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ResumesController;