/**
 *  ------------------------------------------------------------------------
 *  
 *  Contact Group Routes
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const express = require('express');
const router = express.Router();
const expressJoi = require('express-joi-validator');
const contactGroupSchema = require('../schema/contact-group');
const contactGroupApi = require('../api/contact-group');

router.get('/contact-group/list', expressJoi(contactGroupSchema.listContactGroupSchema), contactGroupApi.listContactGroup);
router.post('/contact-group/create', expressJoi(contactGroupSchema.createcontactGroupSchema), contactGroupApi.createContactGroup);
router.put('/contact-group/edit/:_id', expressJoi(contactGroupSchema.editContactGroupSchema), contactGroupApi.editContactGroup);
router.delete('/contact-group/remove/:_id', expressJoi(contactGroupSchema.deletecontactGroupSchema), contactGroupApi.deleteContactGroup);

module.exports = router;