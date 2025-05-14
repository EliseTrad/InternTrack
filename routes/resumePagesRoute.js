const express = require('express');
const router = express.Router();
const ResumesService = require('../services/resumesService');
const uploadResume = require('../middleware/uploadResume');

/**
 * Helper to map raw resume records to view-friendly objects and sort by uploadDate descending.
 * @param {Object|Object[]} raw - Single resume object or array of resume objects from DB
 * @returns {Array<{id: number, name: string, path: string, uploadDate: string}>}
 */
function mapAndSortResumes(raw) {
  const arr = Array.isArray(raw) ? raw : [raw];
  const mapped = arr.map(r => ({
    id: r.resume_id,
    name: r.resume_file_name,
    path: r.resume_file_path,
    uploadDate: r.resume_upload_date,
  }));
  // Sort newest first
  return mapped.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
}

/**
 * @route   GET /resumes
 * @desc    Display list of user resumes
 * @access  Private
 */
router.get('/resumes', async (req, res) => {
  if (!req.session.user) {
    // Redirect unauthenticated users to home page
    return res.redirect('/');
  }

  try {
    const userId = req.session.user.id;
    const rawResumes = await ResumesService.getResumesByUserId(userId);

    // Map and sort resumes for view
    const resumes = mapAndSortResumes(rawResumes);

    res.render('resumes', {
      resumes,
      error: null,
      success: resumes.length === 0 ? 'No resumes found.' : null,
    });
  } catch (err) {
    console.error('Error while fetching resumes by user ID:', err);
    res.render('resumes', {
      resumes: [],
      error: 'Error loading resumes. Please try again!',
      success: null,
    });
  }
});

/**
 * @route   POST /upload
 * @desc    Upload a new resume file
 * @access  Private
 * @middleware uploadResume - multer upload handler
 */
router.post('/upload', uploadResume, async (req, res) => {
  if (!req.session || !req.session.user) {
    // Redirect if session missing or expired
    return res.redirect('/');
  }

  const user = req.session.user;
  const userId = user.id;

  try {
    // Fetch resumes in all cases (success or failure)
    const rawResumes = await ResumesService.getResumesByUserId(userId);
    const resumes = mapAndSortResumes(rawResumes);

    // Check if multer reported an upload error
    if (req.uploadError) {
      return res.render('resumes', {
        resumes,
        error: req.uploadError,
        success: null,
      });
    }

    const file = req.file;
    if (!file) {
      // No file uploaded
      return res.render('resumes', {
        resumes,
        error: 'No file uploaded.',
        success: null,
      });
    }

    // Save the uploaded resume record in database
    await ResumesService.createResume({
      resume_file_path: `uploads/resumes/${file.filename}`,
      resume_file_name: file.originalname,
      user_id: userId,
    });

    // Fetch updated list of resumes
    const updatedRaw = await ResumesService.getResumesByUserId(userId);
    const updatedResumes = mapAndSortResumes(updatedRaw);

    res.render('resumes', {
      resumes: updatedResumes,
      success: 'Resume uploaded successfully!',
      error: null,
    });
  } catch (err) {
    console.error('Unexpected upload error:', err);
    res.render('resumes', {
      resumes: [],
      error: 'Unexpected server error. Please try again later.',
      success: null,
    });
  }
});

/**
 * @route   POST /rename
 * @desc    Rename an existing resume
 * @access  Private
 * @param   {string} req.body.resumeId - ID of resume to rename
 * @param   {string} req.body.newName - New display name for resume
 */
router.post('/rename', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  try {
    const userId = req.session.user.id;
    const { resumeId, newName } = req.body;

    if (!newName || !resumeId) {
      // Require both resumeId and newName
      const rawResumes = await ResumesService.getResumesByUserId(userId);
      const resumes = mapAndSortResumes(rawResumes);
      return res.render('resumes', {
        resumes,
        error: 'Resume name is required.',
        success: null,
      });
    }

    // Update the resume name in the database
    await ResumesService.updateResumeById(resumeId, {
      resume_file_name: newName,
      user_id: userId,
    });

    // Fetch updated resumes list after rename
    const rawResumes = await ResumesService.getResumesByUserId(userId);
    const updatedResumes = mapAndSortResumes(rawResumes);

    res.render('resumes', {
      resumes: updatedResumes,
      success: 'Resume renamed successfully!',
      error: null,
    });
  } catch (err) {
    console.error('Error while renaming resume:', err);
    
    const rawResumes = await ResumesService.getResumesByUserId(
      req.session.user.id
    );
    const resumes = mapAndSortResumes(rawResumes);

    res.render('resumes', {
      resumes,
      error: 'Update failed.',
      success: null,
    });
  }
});

/**
 * @route   POST /delete
 * @desc    Delete selected resumes
 * @access  Private
 * @param   {string[]} req.body.resumeIds - Array of resume IDs to delete
 */
router.post('/delete', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  try {
    const userId = req.session.user.id;
    const { resumeIds } = req.body;

    if (!resumeIds || resumeIds.length === 0) {
      // Must select at least one resume
      const rawResumes = await ResumesService.getResumesByUserId(userId);
      const resumes = mapAndSortResumes(rawResumes);
      return res.render('resumes', {
        resumes,
        error: 'Please select at least one resume to delete.',
        success: null,
      });
    }

    // Delete resumes via service
    await ResumesService.deleteResumes(userId, resumeIds);

    // Fetch updated list after deletion
    const rawResumes = await ResumesService.getResumesByUserId(userId);
    const updatedResumes = mapAndSortResumes(rawResumes);

    res.render('resumes', {
      resumes: updatedResumes,
      success: 'Selected resumes deleted successfully!',
      error: null,
    });
  } catch (err) {
    console.error('Error while deleting resumes:', err);

    let resumes = [];
    try {
      const rawResumes = await ResumesService.getResumesByUserId(
        req.session.user.id
      );
      resumes = mapAndSortResumes(rawResumes);
    } catch (fetchErr) {
      console.error('Also failed to fetch fallback resumes:', fetchErr);
    }

    res.render('resumes', {
      resumes,
      error: 'Delete failed.',
      success: null,
    });
  }
});

/**
 * @route   GET /search
 * @desc    Search resumes by name for logged-in user
 * @access  Private
 * @param   {string} req.query.name - Search term to filter resume names
 */
router.get('/search', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  try {
    const { name } = req.query; // from search input

    // Fetch resumes matching name filter
    const rawResumes = await ResumesService.getResumesByNameAndUserId(
      name,
      req.session.user.id
    );
    const resumes = mapAndSortResumes(rawResumes);

    res.render('resumes', {
      resumes,
      error: null,
      success:
        resumes.length > 0
          ? `Found ${resumes.length} resume(s) matching "${name}".`
          : `No resumes were found matching "${name}".`,
    });
  } catch (error) {
    console.error('Error in controller while fetching by name:', error);

    let allResumes = [];
    try {
      const rawResumes = await ResumesService.getResumesByUserId(
        req.session.user.id
      );
      allResumes = mapAndSortResumes(rawResumes);
    } catch (innerError) {
      console.error(
        'Error in resumePagesRoute while fetching all resumes:',
        innerError
      );
    }

    res.render('resumes', {
      resumes: allResumes,
      error: 'Search failed.',
      success: null,
    });
  }
});

module.exports = router;
