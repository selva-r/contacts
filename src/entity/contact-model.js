/**
 *  ------------------------------------------------------------------------
 *  
 *  Contact Model
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mobileSchema = [{
    _id: false,
    tag: String,
    value: { type: String, minlength: 10 }
}];

const emailSchema = [{
    _id: false,
    tag: String,
    value: { type: String, trim: true, lowercase: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] } 

}];

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: mobileSchema,
        required: true
    },
    email: {
        type: emailSchema
    },
    contact_group: {
        type: [],
        ref: 'ContactGroup'
    }
},{
    collection: 'contacts',
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);