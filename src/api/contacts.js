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
const { entity, toObjectId, isValidObjectId } = require(APPPATH + '/src/entity');
const util = require(APPPATH + '/src/util');
const { successLog, errorLog } = require(APPPATH + '/log-helper');
const { responseCodes, statusCodes } = require(APPPATH + '/src/config');

/**
* Get all contacts list ( or ) contacts as per the search
* @method listOrSearchContact
* @param {req} obj  - Request object
* @param {res} obj  - Response object
*/

const listOrSearchContact = async (req, res) => {
    try {
        let searchResults = {};
        let searchCond = [];
        let matchStage = { $match: {} };
        let sortStage = { $sort: { createdAt: -1 }};
        let limitStage = { $limit : req.body.limit ? req.body.limit : 10 };
        let skipStage = { $skip : req.body.index ? req.body.index : 0 };
        let lookUpStage = {
            $lookup : {
                from : 'contactgroups',
                localField : 'contact_group',
                foreignField : '_id',
                as : 'contact_group'
            }
        }
        let projectStage = {
            $project : {
                name : 1, mobile : 1, email : 1, contact_group: 1, createdAt : 1
            }
        };
        let groupStage = {
            $group : {
                _id: null, totalDocs: { $sum: 1 }
            }
        }

        if(req.body.search_value) {
            searchCond = await constructSearchCondition(req.body.search_value);
            matchStage = { $match: { $or : searchCond }};
        } 
        
        let result = await entity.Contact.aggregate([matchStage, projectStage ,lookUpStage, sortStage, limitStage, skipStage]);
        let count = await entity.Contact.aggregate([matchStage, groupStage]);
        searchResults.data = result;
        searchResults.count = count.length ? count[0].totalDocs : 0; 
        util.response(res, responseCodes.SUCCESS, searchResults, statusCodes.SUCCESS);
    } catch(err) {
        errorLog.error(` -- LIST OR SEARCH FAILED -- ${err}`);
        util.response(res, responseCodes.ERROR, 'Something went wrong!', statusCodes.INTERNAL_SERVER_ERROR);
    }
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
        if(req.body.contact_group) {
            let groupData = req.body.contact_group.split(',');
            let groupArr = groupData.map((id)=>{
                return toObjectId(id);
            })
            contactObj.contact_group = groupArr;
        }
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

const editContact = async (req, res) => {
    try {
        const rmMob = [], adMob = [], stMob = []; 
        const rmEmail = [], adEmail = [], stEmail = []; 
        const rmCG = [], adCG = [];
        let update = false;
        let body = req.body;
        let id = req.params._id;
        if(isValidObjectId(id)) {
            let contact = await entity.Contact.findOne({'_id':id});
            if(contact) {
                //mobile
                if(body.mobile) {
                    let temp = body.mobile;
                    temp.forEach((item)=>{
                        if(item.ops === 'REMOVE') {
                            rmMob.push(item.value);
                            update = true;
                        } else if(item.ops === 'ADD') {
                            delete item.ops;
                            adMob.push(item);
                            update = true;
                        } else if(item.ops === 'EDIT') {
                            delete item.ops;
                            stMob.push(item);
                            update = true;
                        }
                    })
                }

                //email
                if(body.email) {
                    let temp = body.email;
                    temp.forEach((item)=>{
                        if(item.ops === 'REMOVE') {
                            rmEmail.push(item.value);
                            update = true;
                        } else if(item.ops === 'ADD') {
                            delete item.ops;
                            adEmail.push(item);
                            update = true;
                        } else if(item.ops === 'EDIT') {
                            delete item.ops;
                            stEmail.push(item);
                            update = true;
                        }
                    })
                }

                if(body.contact_group) {
                    let temp = body.contact_group;
                    temp.forEach((item)=>{
                        if(item.ops === 'REMOVE') {
                            rmCG.push(toObjectId(item.value));
                            update = true;
                        } else if(item.ops === 'ADD') {
                            adCG.push(toObjectId(item.value));
                            update = true;
                        } 
                    })
                }

                if(update) {

                    // delete
                    let updateData = {
                        email : {},
                        mobile : {},
                        contact_group : {}
                    };
                    if(body.name) {
                        updateData['name'] = body.name;
                    }
                    updateData['email']['$pull'] = {'email': { 'value' : { $in : rmEmail }}};                    
                    updateData['mobile']['$pull'] = {'mobile': { 'value' : { $in : rmMob }}};                    
                    updateData['contact_group']['$pull'] = {'contact_group': { $in : rmCG }};               
                    await entity.Contact.updateOne({'_id':id},updateData.email);
                    await entity.Contact.updateOne({'_id':id},updateData.mobile);
                    await entity.Contact.updateOne({'_id':id},updateData.contact_group);

                    // add
                    updateData = updateData = {
                        email : {},
                        mobile : {},
                        contact_group : {}
                    };
                    updateData['mobile']['$push'] = {'mobile' : { $each : adMob }};
                    updateData['email']['$push'] = {'email' : { $each : adEmail }};
                    updateData['contact_group']['$addToSet'] = {'contact_group' : adCG };
                    await entity.Contact.updateOne({'_id':id},updateData.mobile);
                    await entity.Contact.updateOne({'_id':id},updateData.email);
                    await entity.Contact.updateOne({'_id':id},updateData.contact_group);

                    // set
                    stMob.forEach(async(item)=>{
                        let uid = item._id;
                        delete item._id;
                        await entity.Contact.updateOne({'mobile': { $elemMatch : { '_id': uid}}},{ $set : { 'mobile.$': item}});
                    });
                    stEmail.forEach(async(item)=>{
                        let uid = item._id;
                        delete item._id;
                        await entity.Contact.updateOne({'email': { $elemMatch : { '_id': uid}}},{ $set: { 'email.$': item }});
                    })

                    util.response(res, responseCodes.SUCCESS, 'Successfully updated!', statusCodes.SUCCESS); 
                }

            } else {
                util.response(res, responseCodes.SUCCESS, 'No such contact found!', statusCodes.NOT_FOUND);
            }
        } else {
            errorLog.error(` -- EDIT CONTACT INVALID OBJECTID -- ${id}`);
            util.response(res, responseCodes.FAIL, 'Invalid ObjectId', statusCodes.BAD_REQ);
        }
    } catch(err) {
        errorLog.error(` -- EDIT CONTACT FAILED -- ${err}`);
        util.response(res, responseCodes.ERROR, 'Something went wrong!', statusCodes.INTERNAL_SERVER_ERROR);
    }
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
        if(isValidObjectId(id)) {
            let result = await entity.Contact.findOneAndDelete({'_id': id});
            if(result) {
                util.response(res, responseCodes.SUCCESS, 'Successfully deleted!', statusCodes.SUCCESS); 
            } else {
                util.response(res, responseCodes.SUCCESS, 'No such contact found!', statusCodes.NOT_FOUND);
            }
        } else {
            errorLog.error(` -- DELETE CONTACT INVALID OBJECTID -- ${id}`);
            util.response(res, responseCodes.FAIL, 'Invalid ObjectId', statusCodes.BAD_REQ);
        }
    } catch(err) {
        errorLog.error(` -- DELETE CONTACT FAILED -- ${err}`);
        util.response(res, responseCodes.ERROR, err, statusCodes.INTERNAL_SERVER_ERROR);
    }
}


/**
* Construct search object 
* @method constructSearchCondition
* @param {searchVal} String  - Search value
*/

const constructSearchCondition = (searchVal) => {
    let searchArr = [];
    let keyArr = [
        {
            key : 'name',
            ele : 'value',
            isArray : false
        },
        {
            key : 'mobile',
            ele : 'value',
            isArray : true
        },
        {
            key : 'email',
            ele : 'value',
            isArray : true
        }
    ];
    keyArr.forEach((keyObj)=>{
        if(keyObj.isArray) {
            searchArr.push({
                [keyObj.key] : {
                    $elemMatch : {
                        [keyObj.ele] : new RegExp("^" + ".*" + searchVal + ".*", "i")
                    }
                }
            });
        } else {
            searchArr.push({ [keyObj.key] : new RegExp("^" + ".*" + searchVal + ".*", "i") });
        }
    });
    return searchArr;
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