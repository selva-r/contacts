/**
 *  ------------------------------------------------------------------------
 *  
 *  Contacts Routes
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const APPPATH = require('app-root-path');
const express = require('express');
const router = express.Router();
const expressJoi = require('express-joi-validator');
const contactSchema = require('../schema/contacts');
const contactApi = require('../api/contacts');

router.get('/contacts/list', expressJoi(contactSchema.listOrSearchContactSchema), contactApi.listOrSearchContact);
router.post('/contacts/create', expressJoi(contactSchema.createContactSchema), contactApi.createContact);
router.put('/contacts/edit', expressJoi(contactSchema.editContactSchema), contactApi.editContact);
router.delete('/contacts/remove', expressJoi(contactSchema.deleteContactSchema), contactApi.deleteContact);

module.exports = router;