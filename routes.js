const Joi = require('joi');

const auth = require('./Controllers/auth');
const account = require('./Controllers/account');

module.exports = [
    {
        method: 'POST',
        path: '/api/account/login',
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    pass: Joi.string().required(),
                    type: Joi.any().valid('admin', 'user').required()
                }
            },
            auth: false
        },
        handler: account.routes.login
    },
    {
        method: 'POST',
        path: '/api/account/register',
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    pass: Joi.string().required(),
                    name: Joi.string().required(),
                    organization: Joi.string().max(40).required(),
                    type: Joi.any().valid('admin', 'user').required()
                }
            },
            auth: false
        },
        handler: account.routes.register
    },
    {
        method: 'GET', path: '/sign', config: { auth: false },
        handler: function(request, reply) {
            reply({text: auth.sign()});
        }
    },
    {
        method: "GET", path: "/", config: { auth: false },
        handler: function(request, reply) {
            reply({text: 'Token not required'});
        }
    },
    {
        method: 'GET', path: '/restricted', config: { auth: 'jwt' },
        handler: function(request, reply) {
            console.log(request);
            reply({text: 'You used a Token!'})
            .header("Authorization", request.headers.authorization);
        }
    }
]
