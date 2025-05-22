const express = require('express');
const router = express.Router();
const CoverLettersService = require('../services/coverlettersService');
const uploadCoverLetter = require('../middleware/uploadCover');

/**
 * Maps raw cover letter records to view-friendly objects and sorts by upload date descending.
 * @param {Object|Object[]} rawLetters - Single cover letter object or array from DB.
 * @returns {Array<{id: number, name: string, path: string, uploadDate: string}>}
 */
function mapAndSortCoverLetters(rawLetters) {
  const arr = Array.isArray(rawLetters) ? rawLetters : [rawLetters];
  const mapped = arr.map((c) => ({
    id: c.cover_letter_id,
    name: c.cover_file_name,
    path: c.cover_file_path,
    uploadDate: c.cover_upload_date,
  }));
  // Sort by most recent upload first
  return mapped.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
}

/**
 * @route   GET /cover-letters
 * @desc    Display list of user cover letters
 * @access  Private
 */
router.get('/cover-letters', async (req, res) => {
  // Redirect unauthenticated users to home
  if (!req.session.user) {
    return res.redirect('/');
  }

  try {
    const userId = req.session.user.id;
    const rawLetters = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);

    // Render cover-letters view with data or message if none found
    res.render('cover-letters', {
      coverLetters,
      error: null,
      success: coverLetters.length === 0 ? 'No cover letters found.' : null,
    });
  } catch (err) {
    console.error('Error while fetching cover letters by user ID:', err);
    // Render view with error message
    res.render('cover-letters', {
      coverLetters: [],
      error: 'Error loading cover letters. Please try again!',
      success: null,
    });
  }
});

/**
 * @route   POST /upload
 * @desc    Upload a new cover letter file
 * @access  Private
 * @middleware uploadCoverLetter - handles file upload via multer
 */
router.post('/upload', uploadCoverLetter, async (req, res) => {
  // Ensure user is authenticated
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  try {
    // Always fetch existing list for rendering
    const rawLetters = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);

    // Handle upload errors from middleware
    if (req.uploadError) {
      return res.render('cover-letters', {
        coverLetters,
        error: req.uploadError,
        success: null,
      });
    }

    const file = req.file;
    if (!file) {
      // No file provided
      return res.render('cover-letters', {
        coverLetters,
        error: 'No file uploaded.',
        success: null,
      });
    }

    // Save new cover letter record in DB
    await CoverLettersService.createCoverLetter({
      cover_file_path: `uploads/covers/${file.filename}`,
      cover_file_name: file.originalname,
      user_id: userId,
    });

    // Fetch updated list and render success message
    const updatedRaw = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const updatedLetters = mapAndSortCoverLetters(updatedRaw);

    res.render('cover-letters', {
      coverLetters: updatedLetters,
      success: 'Cover letter uploaded successfully!',
      error: null,
    });
  } catch (err) {
    console.error('Unexpected upload error:', err);
    // Render view with server error
    res.render('cover-letters', {
      coverLetters: [],
      error: 'Unexpected server error. Please try again later.',
      success: null,
    });
  }
});

/**
 * @route   POST /rename
 * @desc    Rename an existing cover letter
 * @access  Private
 * @param   {string} req.body.coverLetterId - ID of cover letter to rename
 * @param   {string} req.body.newName - New display name for cover letter
 */
router.post('/rename', async (req, res) => {
  // Ensure user is authenticated
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  const { coverLetterId, newName } = req.body;

  try {
    // Require both parameters
    if (!newName || !coverLetterId) {
      const rawLetters = await CoverLettersService.getCoverLettersByUserId(
        userId
      );
      const coverLetters = mapAndSortCoverLetters(rawLetters);
      return res.render('cover-letters', {
        coverLetters,
        error: 'Cover letter name is required.',
        success: null,
      });
    }

    // Update cover letter name in DB
    await CoverLettersService.updateCoverLetterById(coverLetterId, {
      cover_file_name: newName,
      user_id: userId,
    });

    // Fetch updated list for view
    const rawLetters = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);

    res.render('cover-letters', {
      coverLetters,
      success: 'Cover letter renamed successfully!',
      error: null,
    });
  } catch (err) {
    console.error('Error while renaming cover letter:', err);
    // On error, re-fetch list and show failure message
    const rawLetters = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);
    res.render('cover-letters', {
      coverLetters,
      error: 'Rename failed.',
      success: null,
    });
  }
});

/**
 * @route   POST /delete
 * @desc    Delete selected cover letters
 * @access  Private
 * @param   {string[]} req.body.coverLetterIds - Array of IDs to delete
 */
router.post('/delete', async (req, res) => {
  // Ensure user is authenticated
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  const { coverLetterIds } = req.body;

  try {
    // Require at least one selection
    if (!coverLetterIds || coverLetterIds.length === 0) {
      const rawLetters = await CoverLettersService.getCoverLettersByUserId(
        userId
      );
      const coverLetters = mapAndSortCoverLetters(rawLetters);
      return res.render('cover-letters', {
        coverLetters,
        error: 'Please select at least one cover letter to delete.',
        success: null,
      });
    }

    // Perform deletion via service
    await CoverLettersService.deleteCoverLettersByUser(userId, coverLetterIds);

    // Fetch updated list for view
    const rawLetters = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);
    res.render('cover-letters', {
      coverLetters,
      success: 'Selected cover letters deleted successfully!',
      error: null,
    });
  } catch (err) {
    console.error('Error while deleting cover letters:', err);
    // On error, re-fetch list and show failure message
    const rawLetters = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);
    res.render('cover-letters', {
      coverLetters,
      error: 'Delete failed.',
      success: null,
    });
  }
});

/**
 * @route   GET /search
 * @desc    Search cover letters by name for logged-in user
 * @access  Private
 * @param   {string} req.query.name - Search term for cover letter names
 */
router.get('/search', async (req, res) => {
  // Ensure user is authenticated
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  try {
    const { name } = req.query;
    const rawLetters = await CoverLettersService.getCoverLettersByNameAndUserId(
      name,
      req.session.user.id
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);

    // Render view with search results or no-match message
    res.render('cover-letters', {
      coverLetters,
      error: null,
      success:
        coverLetters.length > 0
          ? `Found ${coverLetters.length} cover letter(s) matching "${name}".`
          : `No cover letters were found matching "${name}".`,
    });
  } catch (err) {
    console.error('Error in search:', err);

    // Attempt fallback fetch on error
    let coverLetters = [];
    try {
      const rawLetters = await CoverLettersService.getCoverLettersByUserId(
        req.session.user.id
      );
      coverLetters = mapAndSortCoverLetters(rawLetters);
    } catch (innerErr) {
      console.error('Error fetching fallback cover letters:', innerErr);
    }

    // Render view with fallback data and error message
    res.render('cover-letters', {
      coverLetters,
      error: 'Search failed.',
      success: null,
    });
  }
});

module.exports = router;