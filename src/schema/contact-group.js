/**
 *  ------------------------------------------------------------------------
 *  
 *  Contact Group Request Schema
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const joi = require('joi');

const createContactGroupSchema = {
    body: {
        'name' : joi.string().required().error(new Error('Name is required'))
    }
};

const editContactGroupSchema = {
    params: {
        '_id' : joi.any().required()
    }
};

const deleteContactGroupSchema = {
    params: {
        '_id': joi.any().required()
    }
}

/**
 * Export constructor.
 */

module.exports = {
    createContactGroupSchema : createContactGroupSchema,
    editContactGroupSchema : editContactGroupSchema,
    deleteContactGroupSchema : deleteContactGroupSchema
};