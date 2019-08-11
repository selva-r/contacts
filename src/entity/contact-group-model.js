/**
 *  ------------------------------------------------------------------------
 *  
 *  Contact Group Model
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactGroupSchema = new Schema({
    name: {
        type: String,
        required: true
    }
},{
    collection: 'contactgroups',
    timestamps: true
});

module.exports = mongoose.model('ContactGroup', contactGroupSchema);