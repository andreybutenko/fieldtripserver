const Hapi = require('hapi');
const hapiAuthJwt = require('hapi-auth-jwt2');

const server = new Hapi.Server();

const people = {
    1: {
        id: 1,
        name: 'Jen Jones'
    }
};

const validate = function (decoded, request, callback) {
    if (!people[decoded.id]) {
        return callback(null, false);
    }
    else {
        return callback(null, true);
    }
};

server.connection({ port: 8000 });
server.register(hapiAuthJwt, function (err) {
    if(err){
        console.log(err);
    }

    server.auth.strategy('jwt', 'jwt', {
        key: 'NeverShareYourSecret',
        validateFunc: validate,
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    server.auth.default('jwt');

    server.route([
        {
            method: "GET", path: "/", config: { auth: false },
            handler: function(request, reply) {
                reply({text: 'Token not required'});
            }
        },
        {
            method: 'GET', path: '/restricted', config: { auth: 'jwt' },
            handler: function(request, reply) {
                reply({text: 'You used a Token!'})
                .header("Authorization", request.headers.authorization);
            }
        }
    ]);
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
