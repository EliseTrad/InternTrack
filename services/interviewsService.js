const InterviewsRepository = require("../repositories/interviewsRepository");

class InterviewsService {
    // Create a new interview record.
    static async createInterview(interview) {
        try {
            return await InterviewsRepository.createInterview(interview);
        } catch (error) {
            throw new Error('Unable to create the interview at the moment. Please try again later.');
        }
    }

    // Updates an interview by its ID.
    static async updateInterview(id, updatedFields) {
        try {
            return await InterviewsRepository.updateInterview(id, updatedFields);
        } catch (error) {
            throw new Error('Unable to update the interview at the moment. Please try again later.');
        }
    }

    // Retrieves all interviews.
    static async getAllInterviews() {
        try {
            return await InterviewsRepository.getAllInterviews();
        } catch (error) {
            throw new Error('Unable to retrieve interviews at the moment. Please try again later.');
        }
    }

    // Retrieves an interview by its ID.
    static async getInterviewById(id) {
        try {
            return await InterviewsRepository.getInterviewById(id);
        } catch (error) {
            throw new Error(`Unable to retrieve the interview with ID ${id}. Please try again later.`);
        }
    }

    // Retrieves interviews by date.
    static async getInterviewsByDate(date) {
        try {
            return await InterviewsRepository.getInterviewsByDate(date);
        } catch (error) {
            throw new Error(`Unable to retrieve the interview(s) with date ${date}. 
                Please try again later.`);
        }
    }

    // Retrieves interviews by location.
    static async getInterviewsByLocation(loc) {
        try {
            return await InterviewsRepository.getInterviewsByLocation(loc);
        } catch (error) {
            throw new Error(`Unable to retrieve the interview(s) with the location ${loc}. 
                Please try again later.`);
        }
    }

    // Retrieves interviews by sent reminder.
    static async getInterviewsByReminder(reminder) {
        try {
            return await InterviewsRepository.getInterviewsByReminder(reminder);
        } catch (error) {
            throw new Error(`Unable to retrieve the interview(s) with the reminder sent: ${reminder}. 
                Please try again later.`);
        }
    }

    // Retrieves interviews by their status.
    static async getInterviewsByStatus(status) {
        try {
            return await InterviewsRepository.getInterviewsByStatus(status);
        } catch (error) {
            throw new Error(`Unable to retrieve interviews with status ${status}. 
                Please try again later.`);
        }
    }

    // Retrieves interviews by application ID.
    static async getInterviewsByApplicationId(applicationId) {
        try {
            return await InterviewsRepository.getInterviewsByApplicationId(applicationId);
        } catch (error) {
            throw new Error(`Unable to retrieve interviews for application ID ${applicationId}. 
                Please try again later.`);
        }
    }

    // Counts the number of interview for each status.
    static async countInterviewsByStatuses(statuses) {
        try {
            return InterviewsRepository.countInterviewsByStatuses;
        } catch (error) {
            throw new Error("Unable to count interviews by status.");
        }
    }

    // Deletes an interview by its ID.
    static async deleteInterview(id) {
        try {
            return InterviewsRepository.deleteInterview(id);
        } catch (error) {
            throw new Error(`Unable to delete the interview with ID ${id}. Please try again later.`);
        }
    }
}

module.exports = InterviewsService;
