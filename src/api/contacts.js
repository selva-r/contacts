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
* Get all contacts list ( or ) contacts as per the search
* @method listOrSearchContact
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const listOrSearchContact = (req, res) => {

}

/**
* Create new contact ( with name, [multiple emails, multiple phone numbers] with tags)
* @method createContact
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const createContact = async (req, res) => {
    try {
        let contactObj = {
            'name' : req.body.name,
            'email': req.body.email,
            'mobile': req.body.mobile
        };
        let doc = await entity.Contact.create(contactObj);
        util.response(res, responseCodes.SUCCESS, 'Successfully created!', statusCodes.SUCCESS);

    } catch(err) {
        errorLog.error(` -- CREATE CONTACT FAILED -- ${err}`);
        util.response(res, responseCodes.ERROR, 'Something went wrong!', statusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
* Edit contact ( edit name, add or remove emails, phone numbers )
* @method editContact
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const editContact = (req, res) => {

}

/**
* Delete contact ( by id )
* @method deleteContact
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const deleteContact = async (req, res) => {
    try {
        let id = req.params._id;
        let result = await entity.Contact.findOneAndDelete({'_id': id});
        if(result) {
            util.response(res, responseCodes.SUCCESS, 'Successfully deleted!', statusCodes.SUCCESS); 
        } else {
            util.response(res, responseCodes.SUCCESS, 'No such contact found!', statusCodes.NOT_FOUND);
        }
    } catch(err) {
        util.response(res, responseCodes.ERROR, err, statusCodes.INTERNAL_SERVER_ERROR);
    }
}

/**
 * Export constructor.
 */

module.exports = {
    listOrSearchContact : listOrSearchContact,
    createContact : createContact,
    editContact : editContact,
    deleteContact : deleteContact
};