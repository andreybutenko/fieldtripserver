const monk = require('monk');
const moment = require('moment');
const bcrypt = require('../lib/bcrypt');
const handler = require('../lib/handler');

const auth = require('./auth');

const db = monk('localhost/fieldtrip');
const admins = db.get('admins');
const users = db.get('users');

// routes

const login = function(request, reply) {
    let email = request.payload.email;
    let pass = request.payload.pass;
    let type = request.payload.type;
    getUser(email, pass, type)
        .then((user) => {
            reply({ status: 'success', token: auth.createToken(user) });
        },
        (err) => {
            reply(err).code(err.statusCode || 500);
        });
}

const register = function(request, reply) {
    let email = request.payload.email;
    let pass = request.payload.pass;
    let name = request.payload.name;
    let organization = request.payload.organization;
    let type = request.payload.type;
    createUser(email, pass, name, organization, type)
        .then((user) => {
            reply({ status: 'success' });
        },
        (err) => {
            reply(err).code(err.statusCode || 500);
        });

}

// utils

const getUser = (email, pass, type) => {
    return new Promise((fulfill, reject) => {
        (type == 'admin' ? admins : users).findOne({ email: email })
            .then((user) => {
                if (user != null)
                    fulfill(user);
                else
                    reject({
                        status: 'error',
                        statusCode: 401,
                        description: 'No ' + (type == 'admin' ? 'admin' : 'user') + ' with that email exists.'
                    });
            }, () => handler(reject, err));
    });
}

const userExists = (email, type) => {
    return new Promise((fulfill, reject) => {
        (type == 'admin' ? admins : users).findOne({ email: email })
            .then((user) => {
                fulfill(user != null);
            }, () => handler(reject, err));
    });
}

const createUser = (email, pass, name, organization, type) => {
    return new Promise((fulfill, reject) => {
        userExists(email, type)
            .then((userExists) => {
                if(!userExists) {
                    return bcrypt.hash(pass);
                }
                else {
                    reject({
                        status: 'error',
                        statusCode: 409,
                        description: 'A user with that email already exists.'
                    });
                    throw new Error('A user with that email already exists.');
                }
            }, () => handler(reject, err))
            .then((hash) => {
                console.log('continued')
                return (type == 'admin' ? admins : users).insert({
                    name: name,
                    organization: organization,
                    email: email,
                    password: hash,
                    trips: [],
                    creation: moment().unix()
                });
            }, () => handler(reject, err))
            .then(() => {
                fulfill();
            }, () => handler(reject, err));
    })
}



module.exports = {
    routes: {
        login: login,
        register: register
    }
}
