/**
 *  ------------------------------------------------------------------------
 *  
 *  Contacts Api
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const APPPATH = require('app-root-path');
const { entity } = require(APPPATH + '/src/entity');
const util = require(APPPATH + '/src/util');
const { successLog, errorLog } = require(APPPATH + '/log-helper');
const { responseCodes, statusCodes } = require(APPPATH + '/src/config');

/**
* Get all contact groups list
* @method listContactGroup
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const listContactGroup = async (req, res) => {
    try {
        let doc = await entity.ContactGroup.find();
        if(doc) {
            util.response(res, responseCodes.SUCCESS, doc, statusCodes.SUCCESS);
        } else {
            util.response(res, responseCodes.SUCCESS, 'No contact groups found!', statusCodes.NOT_FOUND);
        }
    } catch(err) {
        errorLog.error(` -- LIST CONTACT GROUP FAILED -- ${err}`);
        util.response(res, responseCodes.ERROR, 'Something went wrong!', statusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
* Create new contact group ( with name )
* @method createContactGroup
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const createContactGroup = async (req, res) => {
    try {
        let contactObj = {
            'name' : req.body.name 
        }
        let doc = await entity.ContactGroup.create(contactObj);
        util.response(res, responseCodes.SUCCESS, 'Successfully created!', statusCodes.SUCCESS);

    } catch(err) {
        errorLog.error(` -- CREATE CONTACT GROUP FAILED -- ${err}`);
        util.response(res, responseCodes.ERROR, 'Something went wrong!', statusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
* Edit contact group ( edit group name )
* @method editContactGroup
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const editContactGroup = async (req, res) => {
    try {
        let contactGroupId = req.params._id;
        let contactGroupName = req.body.group_name;
        let result = await entity.ContactGroup.findOneAndUpdate({'_id': contactGroupId},{'name': contactGroupName});
        util.response(res, responseCodes.SUCCESS, 'Successfully updated!', statusCodes.SUCCESS); 
    } catch(err) {
        errorLog.error(` -- EDIT CONTACT GROUP FAILED -- ${err}`);
        util.response(res, responseCodes.ERROR, 'Something went wrong!', statusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
* Delete contact group ( by id )
* @method deleteContactGroup
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const deleteContactGroup = async (req, res) => {
    try {
        let id = req.params._id;
        let result = await entity.Contact.findOneAndDelete({'_id': id});
        if(result) {
            util.response(res, responseCodes.SUCCESS, 'Successfully deleted!', statusCodes.SUCCESS); 
        } else {
            util.response(res, responseCodes.SUCCESS, 'No such contact group found!', statusCodes.NOT_FOUND);
        }
    } catch(err) {
        errorLog.error(` -- DELETE CONTACT GROUP FAILED -- ${err}`);
        util.response(res, responseCodes.ERROR, err, statusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Export constructor.
 */

module.exports = {
    listContactGroup : listContactGroup,
    createContactGroup : createContactGroup,
    editContactGroup : editContactGroup,
    deleteContactGroup : deleteContactGroup
};