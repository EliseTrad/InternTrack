const InterviewsService = require("../services/interviewsService");

class InterviewsController {
    static async createInterview(req, res) {
        try {
            const { interview_date, interviewer_name, interviewer_email, location,
                reminder_sent, interview_status, application_id } = req.body;
            const result = await InterviewsService.createInterview(
                {
                    interview_date, interviewer_name, interviewer_email, location,
                    reminder_sent, interview_status, application_id
                });
            res.status(201).json({ message: 'Interview created successfully', result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateInterview(req, res) {
        try {
            const { id } = req.params;
            const { interview_date, interviewer_name, interviewer_email, location,
                reminder_sent, interview_status, application_id } = req.body;
            const result = await InterviewsService.updateInterview(id,
                {
                    interview_date, interviewer_name, interviewer_email, location,
                    reminder_sent, interview_status, application_id
                });
            res.status(201).json({ message: 'Interview updated successfully', result });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllInterviews(req, res) {
        try {
            const result = await InterviewsService.getAllInterviews();
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getInterviewById(req, res) {
        try {
            const { id } = req.params;
            const result = await InterviewsService.getInterviewById(id);
            if (!result) {
                return res.status(404).json({ message: 'Interview not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getInterviewsByDate(req, res) {
        try {
            const { date } = req.params;
            const result = await InterviewsService.getInterviewByDate(date);
            if (!result) {
                return res.status(404).json({ message: 'Interview not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getInterviewsByLocation(req, res) {
        try {
            const { location } = req.params;
            const result = await InterviewsService.getInterviewsByLocation(location);
            if (!result) {
                return res.status(404).json({ message: 'Interview not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getInterviewsByReminder(req, res) {
        try {
            const { reminder } = req.params;
            const result = await InterviewsService.getInterviewsByReminder(reminder);
            if (!result) {
                return res.status(404).json({ message: 'Interview not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getInterviewsByStatus(req, res) {
        try {
            const { status } = req.params;
            const result = await InterviewsService.getInterviewsByStatus(status);
            if (!result) {
                return res.status(404).json({ message: 'Interview not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getInterviewsByApplicationId(req, res) {
        try {
            const { applicationId } = req.params;
            const result = await InterviewsService.getInterviewsByApplicationId(applicationId);
            if (!result) {
                return res.status(404).json({ message: 'Interview not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async countInterviewsByStatuses(req, res) {
        try {
            const { statuses } = req.params;
            const result = await InterviewsService.countInterviewsByStatuses(statuses);
            if (!result) {
                return res.status(404).json({ message: 'Interview not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteInterview(req, res) {
        try {
            const { id } = req.params;
            const result = await InterviewsService.countInterviewsByStatuses(id);
            if (!result) {
                return res.status(404).json({ message: 'Interview not found' });
            }
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = InterviewsController;