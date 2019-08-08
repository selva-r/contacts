/**
 *  ------------------------------------------------------------------------
 *  
 *  Utilities
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

/**
* Response Utility function
* @method response
* @param {res}     response    - response object
* @param {code}      int       - custom response code
* @param {values}    obj       - values
* @param {responseCode}  int   - http response code
*/

const response = (res, code, values, responseCode) => {
    if(code == 0) {
        var response = {
            "code"    : code,
            "status"  : "success",
            "data"    : values
        }
    } else if(code == 1){
        var response = {
            "code"     : code, 
            "status"   : "fail",
            "message"  : values
        }
    }
    else{
        var response = {
            "code"     : code,
            "status"   : "error",
            "message"  : values
        }
    }
    
    res.status(responseCode).json(response);
    
}

/**
 * Export constructor.
 */

module.exports = {
    response : response
}
