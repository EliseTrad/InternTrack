const express = require('express');
const router = express.Router();
const ResumesService = require('../services/resumesService');
const CoverLettersService = require('../services/coverlettersService');
const {
  validateApplication,
  validationUpdate,
  sanitizeCoverLetter,
} = require('../validators/applicationsDTO');
const ApplicationsService = require('../services/applicationsService');

/**
 * Maps raw application records to view-friendly objects and sorts by application date descending.
 * @param {Object|Object[]} rawApps - Single application object or array from DB.
 * @returns {Array<{id: number, companyName: string, positionTitle: string, 
 * applicationDate: string, status: string, deadline: string|null, source: string, 
 * notes: string, resumeId: number, coverLetterId: number}>}
 */
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
 * Finds applications that appear in all filter result arrays.
 * @param {Array<Object[]>} filterResults - Array of application arrays from each filter.
 * @returns {Object[]} Applications that match all filters.
 */
function computeIntersection(filterResults) {
  if (filterResults.length === 0) return [];

  // Create a map of all application IDs from first filter
  const idMap = new Map();
  filterResults[0].forEach((app) => idMap.set(app.application_id, app));

  // For each subsequent filter, keep only IDs that exist in previous maps
  for (let i = 1; i < filterResults.length; i++) {
    const currentIds = new Set(
      filterResults[i].map((app) => app.application_id)
    );
    for (const id of idMap.keys()) {
      if (!currentIds.has(id)) {
        idMap.delete(id);
      }
    }
  }

  return Array.from(idMap.values());
}

/**
 * @route   GET /applications
 * @desc    Display list of user applications with optional filters
 * @access  Private
 */
router.get('/applications', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  let applications = [];
  let error = null;
  let success = null;
  const currentFilters = {};
  let formData = {}; // For the create form
  let formError = null;
  let formSuccess = null;

  // Initialize document arrays
  let resumes = [];
  let coverLetters = [];

  try {
    // Fetch resumes and cover letters for the form
    const [rawResumes, rawCoverLetters] = await Promise.all([
      ResumesService.getResumesByUserId(userId),
      CoverLettersService.getCoverLettersByUserId(userId),
    ]);

    // Map resumes and cover letters for the template
    resumes = rawResumes.map((r) => ({
      id: r.resume_id,
      name: r.resume_file_name,
    }));

    coverLetters = rawCoverLetters.map((c) => ({
      id: c.cover_letter_id,
      name: c.cover_file_name,
    }));

    // Determine active filters
    const filterTypes = [
      'status',
      'company',
      'position',
      'source',
      'date',
      'deadline',
    ];
    const activeFilters = filterTypes.filter((type) => req.query[type]);

    if (activeFilters.length > 0) {
      // Process filters and compute intersection
      const filterResults = await Promise.all(
        activeFilters.map(async (type) => {
          currentFilters[type] = req.query[type];
          switch (type) {
            case 'status':
              return await ApplicationsService.getApplicationsByStatusAndUser(
                req.query[type],
                userId
              );
            case 'company':
              return await ApplicationsService.getApplicationsByCompanyNameAndUser(
                req.query[type],
                userId
              );
            case 'position':
              return await ApplicationsService.getApplicationsByPositionTitleAndUser(
                req.query[type],
                userId
              );
            case 'source':
              return await ApplicationsService.getApplicationsBySourceAndUser(
                req.query[type],
                userId
              );
            case 'date':
              return await ApplicationsService.getApplicationsByDateAndUser(
                req.query[type],
                userId
              );
            case 'deadline':
              return await ApplicationsService.getApplicationsByDeadlineAndUser(
                req.query[type],
                userId
              );
            default:
              return [];
          }
        })
      );

      applications = mapAndSortApplications(computeIntersection(filterResults));
    } else {
      // Get all applications
      const rawData = await ApplicationsService.getApplicationsForUser(userId);
      applications = mapAndSortApplications(rawData);
    }

    // Enrich applications with resume and cover letter names
    applications = await Promise.all(
      applications.map(async (app) => {
        const resume = app.resumeId
          ? await ResumesService.getResumeById(app.resumeId)
          : null;
        const coverLetter = app.coverLetterId
          ? await CoverLettersService.getCoverLetterById(app.coverLetterId)
          : null;

        return {
          ...app,
          resumeName: resume ? resume.resume_file_name : 'None',
          coverLetterName: coverLetter ? coverLetter.cover_file_name : 'None',
        };
      })
    );

    // Handle empty states
    if (applications.length === 0) {
      success =
        Object.keys(currentFilters).length > 0
          ? 'No applications matched your filter criteria.'
          : "You haven't added any applications yet. Add one now!";
    }
  } catch (err) {
    console.error('Error loading applications:', err);

    error = 'Failed to load applications. Please try again.';

    // Attempt to fetch all applications in case of filtering errors
    try {
      const rawData = await ApplicationsService.getApplicationsForUser(userId);
      applications = mapAndSortApplications(rawData);

      // Enrich applications with resume and cover letter names
      applications = await Promise.all(
        applications.map(async (app) => {
          const resume = app.resumeId
            ? await ResumesService.getResumeById(app.resumeId)
            : null;
          const coverLetter = app.coverLetterId
            ? await CoverLettersService.getCoverLetterById(app.coverLetterId)
            : null;

          return {
            ...app,
            resumeName: resume ? resume.resume_file_name : 'None',
            coverLetterName: coverLetter ? coverLetter.cover_file_name : 'None',
          };
        })
      );
    } catch (fallbackErr) {
      console.error(
        'Error during fallback loading of applications:',
        fallbackErr
      );
      applications = [];
      error = 'Failed to load applications. Please contact support.';
    }
  }

  // Render the applications page
  res.render('applications', {
    applications,
    error,
    success,
    filters: currentFilters,
    resumes,
    coverLetters,
    mode: 'create', // Default to "create" mode
    formData: {}, // Empty form data for new application
    formError: null, // No form error by default
    formSuccess: null, // No form success by default
    formAction: '/applicationPage/create', // Default to the "create" action
    formButtonText: 'Submit', // Default button text
  });
});

/**
 * @route   POST /create
 * @desc    Create a new application
 * @access  Private
 */
router.post(
  '/create',
  sanitizeCoverLetter,
  validateApplication,
  async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/');
    }
    const userId = req.session.user.id;

    // Handle validation errors
    if (req.errors) {
      const formError = req.errors.map((err) => err.msg).join(' ');

      // Fetch docs + current apps
      const [rawApps, resumes, coverLetters] = await Promise.all([
        ApplicationsService.getApplicationsForUser(userId),
        ResumesService.getResumesByUserId(userId),
        CoverLettersService.getCoverLettersByUserId(userId),
      ]);

      const applications = mapAndSortApplications(rawApps);

      return res.render('applications', {
        resumes,
        coverLetters,
        applications,
        formButtonText: 'Submit',
        mode: 'create',
        formData: req.body,
        formError,
        formSuccess: null,
        error: null,
        success: null,
        filters: {},
        formAction: null,
      });
    }

    // Build payload for creation
    const form = req.body;
    const applicationData = {
      company_name: form.companyName,
      position_title: form.positionTitle,
      status: form.status || 'not_answered',
      deadline: form.deadline || null,
      notes: form.notes || null,
      application_source: form.source,
      user_id: userId,
      resume_id: parseInt(form.resumeId, 10),
      cover_letter_id:
        form.coverId === 'null' || form.coverId == null
          ? null
          : parseInt(form.coverId, 10),
    };
    console.log(' POST /applicationPage/create hit with body:', req.body);

    try {
      // Create and then redirect to fresh GET
      await ApplicationsService.createApplication(applicationData);
      return res.redirect('/applicationPage/applications');
    } catch (err) {
      console.error('Error creating application:', err);

      // On DB error, re-render with the error and existing data
      const [rawApps, resumes, coverLetters] = await Promise.all([
        ApplicationsService.getApplicationsForUser(userId),
        ResumesService.getResumesByUserId(userId),
        CoverLettersService.getCoverLettersByUserId(userId),
      ]);
      const applications = mapAndSortApplications(rawApps);

      return res.render('applications', {
        resumes,
        coverLetters,
        applications,
        mode: 'create',
        formData: form,
        formError: 'Failed to create application.',
        formSuccess: null,
        error: null,
        success: null,
        formAction: null,
        filters: {},
        formButtonText: null,
      });
    }
  }
);

/**
 * @route   POST /delete
 * @desc    Delete application
 * @access  Private
 * @param   {string[]} req.body.applicationId - id to delete
 */
router.post('/delete', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  const applicationId = parseInt(req.body.applicationId, 10); // Parse single ID

  if (!applicationId) {
    // Fetch resumes and cover letters even in error cases
    const [rawResumes, rawCoverLetters] = await Promise.all([
      ResumesService.getResumesByUserId(userId),
      CoverLettersService.getCoverLettersByUserId(userId),
    ]);

    const resumes = rawResumes.map((r) => ({
      id: r.resume_id,
      name: r.resume_file_name,
    }));

    const coverLetters = rawCoverLetters.map((c) => ({
      id: c.cover_letter_id,
      name: c.cover_file_name,
    }));

    return res.render('applications', {
      applications: [],
      error: 'Cant delete the application now. Try again later.',
      formError: null,
      formSuccess: null,
      formData: {},
      success: null,
      formAction: null,
      formButtonText: null,
      filters: {},
      resumes,
      coverLetters,
      mode: 'create',
    });
  }

  try {
    // Attempt deletion
    await ApplicationsService.deleteApplicationById(applicationId);

    // Fetch updated applications list
    const [rawData, rawResumes, rawCoverLetters] = await Promise.all([
      ApplicationsService.getApplicationsForUser(userId),
      ResumesService.getResumesByUserId(userId),
      CoverLettersService.getCoverLettersByUserId(userId),
    ]);

    const applications = mapAndSortApplications(rawData);

    const resumes = rawResumes.map((r) => ({
      id: r.resume_id,
      name: r.resume_file_name,
    }));

    const coverLetters = rawCoverLetters.map((c) => ({
      id: c.cover_letter_id,
      name: c.cover_file_name,
    }));

    return res.render('applications', {
      applications,
      success: 'Application deleted successfully!',
      error: null,
      formError: null,
      formSuccess: null,
      formAction: '/applicationPage/create', // Default to "create" action
      formButtonText: 'Submit',
      formData: {}, // Empty form data
      filters: {}, // Reset filters after deletion
      resumes,
      coverLetters,
      mode: 'create', // Default to "create" mode after deletion
    });
  } catch (err) {
    console.error('Error deleting application:', err);

    // Fetch resumes and cover letters even in error cases
    const [rawData, rawResumes, rawCoverLetters] = await Promise.all([
      ApplicationsService.getApplicationsForUser(userId),
      ResumesService.getResumesByUserId(userId),
      CoverLettersService.getCoverLettersByUserId(userId),
    ]);

    const applications = mapAndSortApplications(rawData);

    const resumes = rawResumes.map((r) => ({
      id: r.resume_id,
      name: r.resume_file_name,
    }));

    const coverLetters = rawCoverLetters.map((c) => ({
      id: c.cover_letter_id,
      name: c.cover_file_name,
    }));

    return res.render('applications', {
      applications,
      success: null,
      error: 'Failed to delete application. Please try again.',
      formError: null,
      formSuccess: null,
      formAction: '/applicationPage/create', // Default to "create" action
      formButtonText: 'Submit',
      formData: {}, // Empty form data
      filters: {}, // Reset filters after deletion
      resumes,
      coverLetters,
      mode: 'create', // Default to "create" mode after deletion
    });
  }
});

/**
 * @route   POST /applicationPage/:id/update
 * @desc    Update an application
 * @access  Private
 * @param   {string} req.params.id - Application ID
 */
router.post('/:id/update', validationUpdate, async (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.redirect('/');

  // Handle validation errors
  if (req.errors) {
    const formError = req.errors.map((err) => err.msg).join(' ');
  }

  const appId = parseInt(req.params.id, 10);
  const { position, company, resumeId, coverId, status, deadline, notes } =
    req.body;

  const updateData = {
    position_title: position,
    company_name: company,
    resume_id: resumeId ? parseInt(resumeId, 10) : null,
    cover_letter_id:
      coverId === 'null' || coverId == null ? null : parseInt(coverId, 10),
    status,
    deadline: deadline || null,
    notes: notes || null,
  };

  try {
    await ApplicationsService.updateApplicationById(appId, updateData);
    return res.redirect('/applicationPage/applications');
  } catch (error) {
    console.error('Error updating application:', error);
    res.render('applications', {
      mode: 'edit',
      formError: 'Error updating the application. Please try again.',
      editingAppId: appId,
      formData: req.body, // Pre-fill the form with the submitted data
      resumes,
      coverLetters,
      applications: [],
    });
  }
});

/**
 * @route   GET /applicationPage/:id/update
 * @desc    Render the form to edit an existing application
 * @access  Private
 * @param   {string} req.params.id - Application ID
 */
router.get('/:id/update', async (req, res) => {
  const appId = parseInt(req.params.id, 10);
  const userId = req.session.user?.id;
  if (!userId) return res.redirect('/');

  try {
    const app = await ApplicationsService.getApplicationById(appId);
    const [rawResumes, rawCoverLetters] = await Promise.all([
      ResumesService.getResumesByUserId(userId),
      CoverLettersService.getCoverLettersByUserId(userId),
    ]);

    // Map resumes and cover letters for the template
    resumes = rawResumes.map((r) => ({
      id: r.resume_id,
      name: r.resume_file_name,
    }));

    coverLetters = rawCoverLetters.map((c) => ({
      id: c.cover_letter_id,
      name: c.cover_file_name,
    }));

    res.render('applications', {
      mode: 'edit', // Enables edit mode in the template
      error: null,
      success: null,
      editingAppId: appId,
      formData: app, // Pass application data for pre-filling the form
      formAction: `/applicationPage/${appId}/update`, // Correct action URL
      formButtonText: 'Update Application', // Update button text
      formError: null,
      formSuccess: null,
      filters: {},
      resumes,
      coverLetters,
      applications: [app], // Pass the application being edited
    });
  } catch (err) {
    console.error('Error fetching application for edit:', err);
    res.redirect('/applicationPage/applications');
  }
});

module.exports = router;
