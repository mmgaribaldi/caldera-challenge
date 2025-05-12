const express = require('express');
const ReleaseController = require('../controllers/releaseController');
const githubService = require('../services/githubService');

const router = express.Router();
const releaseController = new ReleaseController(githubService);

router.get('/:owner/:repo/bloat', releaseController.getReleaseBloat.bind(releaseController));

module.exports = router;