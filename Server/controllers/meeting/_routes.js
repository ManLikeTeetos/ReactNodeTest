const express = require('express');
const meeting = require('./meeting');
const auth    = require('../../middlewares/auth');

const router = express.Router();

router.post('/add', auth, meeting.add);
router.get('/view/:id', auth, meeting.view)


module.exports = router