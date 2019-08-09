/**
 *  ------------------------------------------------------------------------
 *  
 *  DB & Models Initialization
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const APPPATH = require('app-root-path');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const { successLog, errorLog } = require(APPPATH + '/log-helper');
const db = {};

const initDb = (uri, options) => {
    mongoose.connect(uri, options, (error)=>{
        if(error) {
            errorLog.error('-- Database connection failed -- ',error);
            process.exit(1);
        }
        successLog.info('-- Database connection success! -- ');
        initModels();
    })
}

const initModels = () => {
    fs.readdirSync(APPPATH + '/src/entity').filter((file)=>{
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }).forEach((file)=>{
        let filepath = path.join(__dirname, file);
        let imported = (require(filepath).default) ? (require(filepath).default) : require(filepath);
        if(typeof imported.modelName !== 'undefined') {
            db[imported.modelName] = imported;
        }
    })
}

const toObjectId = (id) => {
    if(typeof id!= 'undefined') {
        return mongoose.Types.ObjectId(id);
    }
}


module.exports = {
    initDb: initDb,
    entity: db,
    toObjectId: toObjectId 
};