const express = require('express');
const router = express.Router();
const CoverLettersService = require('../services/coverlettersService');
const uploadCoverLetter = require('../middleware/uploadCover');

function mapAndSortCoverLetters(rawLetters) {
  const arr = Array.isArray(rawLetters) ? rawLetters : [rawLetters];
  const mapped = arr.map((c) => ({
    id: c.cover_letter_id,
    name: c.cover_file_name,
    path: c.cover_file_path,
    uploadDate: c.cover_upload_date,
  }));
  return mapped.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
}

// GET all cover letters for the user
router.get('/cover-letters', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  try {
    const userId = req.session.user.id;
    const rawLetters = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);

    res.render('cover-letters', {
      coverLetters,
      error: null,
      success: coverLetters.length === 0 ? 'No cover letters found.' : null,
    });
  } catch (err) {
    console.error('Error while fetching cover letters by user ID:', err);
    res.render('cover-letters', {
      coverLetters: [],
      error: 'Error loading cover letters. Please try again!',
      success: null,
    });
  }
});

// Upload a new cover letter
router.post('/upload', uploadCoverLetter, async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  try {
    // fetch existing letters for rendering
    const rawLetters = await CoverLettersService.getCoverLettersByUserId(
      userId
    );
    const coverLetters = mapAndSortCoverLetters(rawLetters);

    if (req.uploadError) {
      return res.render('cover-letters', {
        coverLetters,
        error: req.uploadError,
        success: null,
      });
    }

    const file = req.file;
    if (!file) {
      return res.render('cover-letters', {
        coverLetters,
        error: 'No file uploaded.',
        success: null,
      });
    }

    // Save the uploaded cover letter
    await CoverLettersService.createCoverLetter({
      cover_file_path: `uploads/covers/${file.filename}`,
      cover_file_name: file.originalname,
      user_id: userId,
    });

    // Fetch updated list and render with success
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
    res.render('cover-letters', {
      coverLetters: [],
      error: 'Unexpected server error. Please try again later.',
      success: null,
    });
  }
});

// Rename an existing cover letter
router.post('/rename', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  const { coverLetterId, newName } = req.body;

  try {
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

    await CoverLettersService.updateCoverLetterById(coverLetterId, {
      cover_file_name: newName,
      user_id: userId,
    });

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

// Delete selected cover letters
router.post('/delete', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/');
  }

  const userId = req.session.user.id;
  const { coverLetterIds } = req.body;

  try {
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

    await CoverLettersService.deleteCoverLettersByUser(userId, coverLetterIds);

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

// Search cover letters by name
router.get('/search', async (req, res) => {
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

    // Attempt to fetch fallback list if search fails
    let coverLetters = [];
    try {
      const rawLetters = await CoverLettersService.getCoverLettersByUserId(
        req.session.user.id
      );
      coverLetters = mapAndSortCoverLetters(rawLetters);
    } catch (innerErr) {
      console.error('Error fetching fallback cover letters:', innerErr);
    }

    res.render('cover-letters', {
      coverLetters,
      error: 'Search failed.',
      success: null,
    });
  }
});

module.exports = router;
