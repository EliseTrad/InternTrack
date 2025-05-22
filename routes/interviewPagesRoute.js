const express = require('express');
const router = express.Router();
const InterviewsService = require('../services/interviewsService');
const ApplicationsService = require('../services/applicationsService');
const {
  validationUpdateInterview,
  validateInterview,
} = require('../validators/interviewsDTO');

function mapAndSortApplications(rawApps) {
  const arr = Array.isArray(rawApps) ? rawApps : [rawApps];

  const mapped = arr.map((app) => ({
    id: app.application_id,
    companyName: app.company_name,
    positionTitle: app.position_title,
    applicationDate: app.application_date,
    status: app.status,
    deadline: app.deadline,
    source: app.application_source,
    notes: app.notes,
    resumeId: app.resume_id,
    coverLetterId: app.cover_letter_id,
  }));

  // Sort by most recent application date
  return mapped.sort(
    (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
  );
}
/**
 * Helper to map raw interview records to view-friendly objects and sort by interview_date.
 * @param {Object|Object[]} rawInterviews - Single interview object or array from DB.
 * @param {'asc'|'desc'} sortOrder - The order to sort the interviews ('asc' for ascending, 'desc' for descending).
 * @returns {Array<{id: number, date: string, interviewer: string, email: string, location: string, status: string, applicationId: number}>}
 */
function mapAndSortInterviews(rawInterviews, applications = [], sortOrder = 'asc') {
  const arr = Array.isArray(rawInterviews) ? rawInterviews : [rawInterviews];

  const appMap = new Map();
  applications.forEach(app => {
    appMap.set(app.id, {
      companyName: app.companyName,
      positionTitle: app.positionTitle,
    });
  });

  const mapped = arr.map((interview) => {
    const app = appMap.get(interview.application_id);
    return {
      id: interview.interview_id,
      date: interview.interview_date,
      interviewer: interview.interviewer_name,
      reminder: interview.reminder_sent,
      email: interview.interviewer_email,
      location: interview.location,
      status: interview.interview_status,
      applicationId: interview.application_id,
      companyName: app?.companyName || 'Unknown',
      positionTitle: app?.positionTitle || 'Unknown',
    };
  });

  if (sortOrder === 'asc') {
    mapped.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortOrder === 'desc') {
    mapped.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return mapped;
}


/**
 * @route   POST /interviews/create
 * @desc    Create a new interview
 * @access  Private
 */
router.post('/create', validateInterview, async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  try {
    // Extract the interview data from the request body
    const interviewData = req.body;

    // Pass the data to the service to create the interview
    await InterviewsService.createInterview(interviewData);

    // Respond with success and redirect to the interviews page
    res.redirect(
      '/interviewPage/interviews?success=Interview created successfully'
    );
  } catch (error) {
    console.error('Error creating interview:', error);

    // Handle user-friendly error messages
    if (error.name === 'NotFound') {
      return res.status(400).render('interviews', {
        error: error.message,
        success: null,
        interviews: [],
      });
    }

    res.status(500).render('interviews', {
      error:
        'An error occurred while creating the interview. Please try again later.',
      success: null,
      interviews: [],
    });
  }
});

/**
 * @route   POST /interviews/:id/update
 * @desc    Update an existing interview
 * @access  Private
 */
router.post('/:id/update', validationUpdateInterview, async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const interviewId = parseInt(req.params.id, 10);

  try {
    // Extract the update data from the request body
    const updateData = req.body;

    // Call the service to update the interview
    const updatedInterview = await InterviewsService.updateInterview(
      interviewId,
      updateData
    );

    // Redirect to the interviews page with a success message
    res.redirect(
      '/interviewPage/interviews?success=Interview updated successfully'
    );
  } catch (error) {
    console.error('Error updating interview:', error);

    if (error.name === 'NotFound') {
      return res.status(400).render('interviews', {
        error: error.message,
        success: null,
        interviews: [],
      });
    }

    res.status(500).render('interviews', {
      error:
        'An error occurred while updating the interview. Please try again later.',
      success: null,
      interviews: [],
    });
  }
});

/**
 * @route   GET /interviews
 * @desc    View and optionally filter interviews
 * @access  Private
 */
router.get('/interviews', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  const { status, location, date_from, date_to, success } = req.query;

  try {
    // Fetch user applications
    const rawApplications =
      await ApplicationsService.getApplicationsForUser(userId);
    const userApplications = mapAndSortApplications(rawApplications);

    if (!userApplications || userApplications.length === 0) {
      return res.render('interviews', {
        error: 'No interviews found for this user.',
        success: null,
        interviews: [],
        applications: [],
        status,
        location,
        date_from,
        date_to,
        formError: null,
        mode: null,
        formData: {},
      });
    }

    // Fetch interviews for each application
    const interviewsPromises = userApplications.map((application) =>
      InterviewsService.getInterviewsByApplicationId(application.id).catch(
        (error) => {
          // Handle NotFound error specifically
          if (error.name === 'NotFound') {
            // Return an empty array for applications with no interviews
            return [];
          }
          // Rethrow other errors
          throw error;
        }
      )
    );

    let interviews = await Promise.all(interviewsPromises);
    interviews = interviews.flat();

    // Apply filters
    if (status) {
      interviews = interviews.filter(
        (interview) => interview.interview_status === status
      );
    }
    if (location) {
      interviews = interviews.filter(
        (interview) =>
          interview.location.toLowerCase() === location.toLowerCase()
      );
    }
    if (date_from) {
      const fromDate = new Date(date_from);
      interviews = interviews.filter(
        (interview) => new Date(interview.interview_date) >= fromDate
      );
    }
    if (date_to) {
      const toDate = new Date(date_to);
      interviews = interviews.filter(
        (interview) => new Date(interview.interview_date) <= toDate
      );
    }

    // Map and sort interviews
    interviews = mapAndSortInterviews(interviews, userApplications);

    // Pass all required data to the view
    res.render('interviews', {
      error: null,
      success: success || null,
      interviews,
      applications: userApplications,
      status,
      location,
      date_from,
      date_to,
      formError: null,
      mode: null,
      formData: {},
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.render('interviews', {
      error: 'An unexpected error occurred. Please try again later.',
      success: null,
      interviews: [],
      applications: [],
      status,
      location,
      date_from,
      date_to,
      formError: null,
      mode: null,
      formData: {},
    });
  }
});

/**
 * @route   POST /interviews/:id/delete
 * @desc    Delete an existing interview
 * @access  Private
 */
router.post('/:id/delete', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const interviewId = parseInt(req.params.id, 10);

  try {
    // Call the service to delete the interview
    await InterviewsService.deleteInterview(interviewId);

    // Redirect to the interviews page with a success message
    res.redirect(
      '/interviewPage/interviews?success=Interview deleted successfully'
    );
  } catch (error) {
    console.error('Error deleting interview:', error);

    // Fetch applications to prevent rendering error
    const rawApplications = await ApplicationsService.getApplicationsForUser(
      req.session.user.id
    );
    const userApplications = mapAndSortApplications(rawApplications);

    res.status(400).render('interviews', {
      error:
        error.name === 'NotFound'
          ? error.message
          : 'An error occurred while deleting the interview. Please try again later.',
      success: null,
      interviews: [],
      applications: userApplications,
      status: null,
      location: null,
      date_from: null,
      date_to: null,
      formError: null,
      mode: null,
      formData: {},
    });
  }
});

/**
 * @route   GET /interviewPage/:id/update
 * @desc    Render the form in edit mode for a specific interview
 * @access  Private
 */
router.get('/:id/update', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const interviewId = parseInt(req.params.id, 10);
  const userId = req.session.user.id;

  try {
    const interview = await InterviewsService.getInterviewById(interviewId);

    if (!interview) {
      return res.status(404).render('interviews', {
        error: 'Interview not found.',
        success: null,
        interviews: [],
        applications: [],
        status: null, // Add status here
        location: null,
        date_from: null,
        date_to: null,
        formData: {},
        formError: null,
        mode: 'create',
      });
    }

    const rawApplications =
      await ApplicationsService.getApplicationsForUser(userId);
    const userApplications = mapAndSortApplications(rawApplications);

    // Fetch all interviews again to display in the table
    const interviewsPerApp = await Promise.all(
      userApplications.map((application) =>
        InterviewsService.getInterviewsByApplicationId(application.id).catch(
          () => []
        )
      )
    );
    const allInterviews = mapAndSortInterviews(interviewsPerApp.flat(), userApplications);

    res.render('interviews', {
      error: null,
      success: null,
      interviews: allInterviews,
      applications: userApplications,
      status: null, // Add status here
      location: null,
      date_from: null,
      date_to: null,
      formError: null,
      mode: 'edit',
      editingInterviewId: interviewId,
      formData: {
        interviewer_name: interview.interviewer_name,
        interviewer_email: interview.interviewer_email,
        location: interview.location,
        interview_date: interview.interview_date,
        interview_status: interview.interview_status,
        application_id: interview.application_id,
      },
    });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).render('interviews', {
      error: 'Failed to load interview for editing.',
      success: null,
      interviews: [],
      applications: [],
      status: null, // Add status here
      location: null,
      date_from: null,
      date_to: null,
      formData: {},
      formError: null,
      mode: 'create',
    });
  }
});

module.exports = router;
