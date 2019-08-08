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

const createContact = (req, res) => {

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

const deleteContact = (req, res) => {

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