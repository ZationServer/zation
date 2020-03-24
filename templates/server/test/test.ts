import {start,StartMode,Config}                   from 'zation-server';
import {when,createClient,describe,before,after}  from 'zation-assured';
import StarterConfig                              from '../src/configs/starter.config';

const TEST_PORT = 3000;

const testClient = createClient({port: TEST_PORT});

before(async () => {
    await start(Config.merge(Config.starterConfig({
        port: TEST_PORT,
        hostname: 'localhost',
        origins: '*:*',
        workers: 1,
        brokers: 1,
        debug: false
    }),StarterConfig),StartMode.Test);

    await testClient.connect();
});

describe('LoginController Test',async () => {

    when(testClient,'Test Authenticated')
        .authRequest({email: 'mytest@gmail.de',password: 'secret'})
        .assertThat()
        .isSuccessful()
        .client(testClient)
            .isAuthenticated()
            .hasAuthUserGroup('user')
            .end()
        .test();

    when(testClient,'Test Not Valid Input')
        .authRequest({email: 'notvalid.de'})
        .assertThat()
        .isNotSuccessful()
        .buildHasError()
            .presets()
            .valueIsNotTypeEmail()
            .end()
        .buildHasError()
            .presets()
            .objectPropertyIsMissing()
            .infoHas({propertyName: 'password'})
            .end()
        .test();
});