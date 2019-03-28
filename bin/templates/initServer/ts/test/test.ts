import {start,StartMode,Config}             from 'zation-server';
import {when,create,describe,before,after}  from 'zation-assured';
import StarterConfig                        from './../src/configs/starter.config';

const TEST_PORT = 3000;

const testClient = create({port : TEST_PORT});

before(async () => {
    await start(Config.merge(Config.starterConfig({
        port : TEST_PORT,
        hostname : 'localhost',
        origins : '*:*',
        workers : 1,
        brokers : 1,
        debug : false
    }),StarterConfig),StartMode.TEST);

    await testClient.connect();
});

describe('LogInController Test',async () => {

    when(testClient,'Test Authenticated')
        .authRequest({email : 'mytest@gmail.de',password : 'secret'})
        .assertThat()
        .isSuccessful()
        .client(testClient)
            .isAuthenticated()
            .hasAuthUserGroup('user')
            .end()
        .test();

    when(testClient,'Test Not Valid Input')
        .authRequest({email : 'notvalid.de'})
        .assertThat()
        .isNotSuccessful()
        .buildHasError()
            .presets()
            .inputIsNotTypeEmail()
            .end()
        .buildHasError()
            .presets()
            .inputPropertyIsMissing()
            .infoHas({propertyName  : 'password'})
            .end()
        .test();
});