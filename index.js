const Hapi = require('hapi');
const hapiAuthJwt = require('hapi-auth-jwt2');
const auth = require('./Controllers/auth');
const routes = require('./routes')

const server = new Hapi.Server();

server.connection({ port: 8000 });
server.register(hapiAuthJwt, function (err) {
    if(err){
        console.log(err);
    }

    server.auth.strategy('jwt', 'jwt', {
        key: 'NeverShareYourSecret',
        validateFunc: auth.validate,
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    server.auth.default('jwt');

    server.route(routes);
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
