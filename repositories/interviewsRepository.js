const Interview = require('../models/Interview');

class InterviewsRepository {
    /**
     * Create a new interview record.
     * @param {Object} interview - The interview object.
     * @returns {Promise<Interview>} The created interview object.
     */
    static async createInterview(interview) {
        try {
            return await Interview.create(interview);
        } catch (error) {
            console.error("Error creating interview:", error);
            throw new Error('Unable to create the interview at the moment. Please try again later.');
        }
    }

    /**
     * Updates an interview by its ID.
     * @param {number} id - The unique ID of the interview to update.
     * @param {Object} updatedFields - The fields to update.
     * @returns {Promise<Interview>} The updated interview object.
     */
    static async updateInterview(id, updatedFields) {
        try {
            const interview = await Interview.findByPk(id);
            if (!interview) 
                throw new Error("Interview not found");
            await interview.update(updatedFields);
            return interview;
        } catch (error) {
            console.error("Error updating interview:", error);
            throw new Error('Unable to update the interview at the moment. Please try again later.');
        }
    }

    /**
     * Retrieves all interviews.
     * @returns {Promise<Interview[]>} List of interviews.
     */
    static async getAllInterviews() {
        try {
            return await Interview.findAll();
        } catch (error) {
            console.error("Error fetching interviews:", error);
            throw new Error('Unable to retrieve interviews at the moment. Please try again later.');
        }
    }

    /**
     * Retrieves an interview by its ID.
     * @param {number} id - The unique ID of the interview.
     * @returns {Promise<Interview|null>} The interview object if found, or null if not found.
     */
    static async getInterviewById(id) {
        try {
            return await Interview.findByPk(id);
        } catch (error) {
            console.error("Error fetching the interview:", error);
            throw new Error(`Unable to retrieve the interview with ID ${id}. Please try again later.`);
        }
    }

    /**
     * Retrieves interviews by date.
     * @param {Date} date - The date of the interview.
     *@returns {Promise<Interview[]>|null} List of interviews or null if not found.
     */
    static async getInterviewsByDate(date) {
        try {
            return await Interview.findAll({ where: { interview_date : date }});
        } catch (error) {
            console.error("Error fetching the interview:", error);
            throw new Error(`Unable to retrieve the interview(s) with date ${date}. 
                Please try again later.`);
        }
    }

    /**
     * Retrieves interviews by location.
     * @param {String} loc - The location of the interview.
     *@returns {Promise<Interview[]>|null} List of interviews or null if not found.
     */
     static async getInterviewsByLocation(loc) {
        try {
            return await Interview.findAll({ where: { location : loc }});
        } catch (error) {
            console.error("Error fetching the interview:", error);
            throw new Error(`Unable to retrieve the interview(s) with the location ${loc}. 
                Please try again later.`);
        }
    }

    /**
     * Retrieves interviews by sent reminder.
     * @param {boolean} reminder - The boolean representing if a reminder was sent.
     *@returns {Promise<Interview[]>|null} List of interviews or null if not found.
     */
     static async getInterviewsByReminder(reminder) {
        try {
            return await Interview.findAll({ where: { reminder_sent : reminder }});
        } catch (error) {
            console.error("Error fetching the interview:", error);
            throw new Error(`Unable to retrieve the interview(s) with the reminder sent: ${reminder}. 
                Please try again later.`);
        }
    }

    /**
     * Retrieves interviews by their status.
     * @param {string} status - The status of the interviews ('scheduled', 'completed', etc.).
     * @returns {Promise<Interview[]>} List of interviews with the given status.
     */
    static async getInterviewsByStatus(status) {
        try {
            return await Interview.findAll({ where: { interview_status: status } });
        } catch (error) {
            console.error("Error fetching interviews by status:", error);
            throw new Error(`Unable to retrieve interviews with status ${status}. Please try again later.`);
        }
    }

    /**
     * Retrieves interviews by application ID.
     * @param {number} applicationId - The ID of the associated application.
     * @returns {Promise<Interview[]>} List of interviews linked to the given application ID.
     */
    static async getInterviewsByApplicationId(applicationId) {
        try {
            return await Interview.findAll({ where: { application_id: applicationId } });
        } catch (error) {
            console.error("Error fetching interviews by application ID:", error);
            throw new Error(`Unable to retrieve interviews for application ID ${applicationId}. 
                Please try again later.`);
        }
    }

    /**
    * Counts the number of interview for each status.
    * @param {Array<string>} statuses - An array of status values to filter interviews by (
    *                                      e.g., ['scheduled', 'completed']).
    * @returns {Promise<Object>} A mapping of status to the count of interviews in that status.
    * @throws {Error} If there is an issue fetching the interview count.
    */
    static async countInterviewsByStatuses(statuses) {
        try {
            // Count the number of interviews grouped by status
            const result = await Interview.count({
                where: { status: statuses },
                group: ['interview_status'],
            });
            return result;
        } catch (error) {
            console.error("Error counting interviews:", error);
            throw new Error("Unable to count interviews by status.");
        }
    }

    /**
     * Deletes an interview by its ID.
     * @param {number} id - The unique ID of the interview.
     * @returns {Promise<boolean>} True if the interview was deleted, false if not found.
     */
    static async deleteInterview(id) {
        try {
            const deletedInterview = await Interview.destroy({ where: { interview_id: id } });
            return deletedInterview > 0;
        } catch (error) {
            console.error("Error deleting interview:", error);
            throw new Error(`Unable to delete the interview with ID ${id}. Please try again later.`);
        }
    }
}

module.exports = InterviewsRepository;
