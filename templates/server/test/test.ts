import {start,StartMode,Config}                          from 'zation-server';
import {when,assert,createClient,describe,before,after}  from 'zation-assured';
import StarterConfig                                     from '../src/configs/starter.config';

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

describe('Login Tests',async () => {

    when(testClient,'Should be able to authenticate')
        .authRequest({email: 'mytest@gmail.de',password: 'secret'})
        .assertThat()
        .isSuccessful()
        .client()
            .isAuthenticated()
            .hasAuthUserGroup('user')
            .end()
        .test();

    when(testClient,'Should not be able to login with an invalid email and missing password')
        .authRequest({email: 'notvalid.de'})
        .assertThat()
        .isNotSuccessful()
        .hasError()
            .preset()
            .valueNotMatchesWithType()
            .atPath('email')
            .end()
        .hasError()
            .preset()
            .missingObjectProperty()
            .withInfo({propertyName: 'password'})
            .end()
        .test();
});

describe('Profile Tests', () => {

    assert.client(testClient,'Should get a user profile')
        .databox('profile/get','1')
            .data()
                .deepEqual({id: 1,name: 'Luca'})
                .end()
            .end()
        .test();
});