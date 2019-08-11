/**
 *  ------------------------------------------------------------------------
 *  
 *  Contacts Request Schema
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const joi = require('joi');

const emailSchema = joi.object().keys({
    tag : joi.string(),
    value : joi.string().email()
});

const mobileSchema = {
    tag : joi.string(),
    value : joi.string().min(10).required()
};

const listOrSearchContactSchema = {
    body : {
        index : joi.number(),
        limit : joi.number(),
        search_value : joi.string() 
    }
}

const createContactSchema = {
    body: {
        'name' : joi.string().required().error(new Error('Name is required')),
        'email' : joi.array().items(emailSchema),
        'mobile' : joi.array().items(mobileSchema).required().error(new Error('Mobile number is required')),
        'contact_group': joi.string()
    }
};

const editContactSchema = {
    params : {
        '_id' : joi.any().required()
    },
    body : {
        'name': joi.string(),
        'mobile' : joi.array().items({ '_id': joi.any(), 'tag': joi.string(), 'value' : joi.string(), 'ops': joi.string() }),
        'email' : joi.array().items({ '_id': joi.any(), 'tag': joi.string(), 'value' : joi.string(), 'ops': joi.string() }),
        'contact_group': joi.array().items({ 'ops': joi.string(), 'value':joi.any()})
    }
}

const deleteContactSchema = {
    params: {
        '_id': joi.any().required()
    }
}

/**
 * Export constructor.
 */

module.exports = {
    listOrSearchContactSchema : listOrSearchContactSchema,
    createContactSchema : createContactSchema,
    editContactSchema : editContactSchema,
    deleteContactSchema : deleteContactSchema
};