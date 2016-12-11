const bcrypt = require('bcrypt-nodejs');

module.exports = {
    hash: (pass) => {
        return new Promise((fulfill, reject) => {
            bcrypt.hash(pass, null, null, (err, hash) => {
                if(!err) {
                    fulfill(hash);
                }
                else {
                    reject(err);
                }
            });
        });
    }
}
