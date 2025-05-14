const express = require('express');
const router = express.Router();
const ResumesService = require('../services/resumesService');
const uploadResume = require('../middleware/uploadResume');

function mapAndSortResumes(raw) {
  const arr = Array.isArray(raw) ? raw : [raw];
  const mapped = arr.map(r => ({
    id: r.resume_id,
    name: r.resume_file_name,
    path: r.resume_file_path,
    uploadDate: r.resume_upload_date,
  }));
  return mapped.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
}


router.get('/resumes', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  try {
    const userId = req.session.user.id;
    const rawResumes = await ResumesService.getResumesByUserId(userId);

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

router.post('/upload', uploadResume, async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  const user = req.session.user;
  const userId = user.id;

  try {
    // Fetch resumes in all cases (success or failure)
    const rawResumes = await ResumesService.getResumesByUserId(userId);
    const resumes = mapAndSortResumes(rawResumes);

    // Check if multer caught an error
    if (req.uploadError) {
      return res.render('resumes', {
        resumes,
        error: req.uploadError,
        success: null,
      });
    }

    const file = req.file;
    if (!file) {
      return res.render('resumes', {
        resumes,
        error: 'No file uploaded.',
        success: null,
      });
    }

    // Save the uploaded resume
    await ResumesService.createResume({
      resume_file_path: `uploads/resumes/${file.filename}`,
      resume_file_name: file.originalname,
      user_id: userId,
    });

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

// Rename resume
router.post('/rename', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  try {
    const userId = req.session.user.id;
    const { resumeId, newName } = req.body;

    if (!newName || !resumeId) {
      const resumes = await ResumesService.getResumesByUserId(userId);
      return res.render('resumes', {
        resumes,
        error: 'Resume name is required.',
        success: null,
      });
    }

    // Call the service to update the resume
    await ResumesService.updateResumeById(resumeId, {
      resume_file_name: newName,
      user_id: userId,
    });

    // After renaming, fetch the updated list of resumes and render the page
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

// Delete selected resumes
router.post('/delete', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  try {
    const userId = req.session.user.id;
    const { resumeIds } = req.body;

    if (!resumeIds || resumeIds.length === 0) {
      const rawResumes = await ResumesService.getResumesByUserId(userId);
      const resumes = mapAndSortResumes(rawResumes);
      return res.render('resumes', {
        resumes,
        error: 'Please select at least one resume to delete.',
        success: null,
      });
    }

    // Call the service to delete the selected resumes
    await ResumesService.deleteResumes(userId, resumeIds);

    // After deletion, fetch the updated list of resumes and render the page
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

// Search by name
router.get('/search', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  try {
    const { name } = req.query; // from search bar input

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
