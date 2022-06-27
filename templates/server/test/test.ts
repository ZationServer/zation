import launch, {LaunchMode,Config} from "zation-server";
import {when,assert,Client,AUTH_CONTROLLER} from "zation-assured";

import "./../src/configs";

const TEST_PORT = 3000;

const testClient = Client.create({port: TEST_PORT});

before(async () => {
    Config.serverConfig({
        port: TEST_PORT,
        hostname: 'localhost',
        origins: '*:*',
        debug: false
    }).register(true);
    await launch(Config.configurations,LaunchMode.Test);
    await testClient.connect();
});

describe('Login Tests',async () => {
    when(testClient,'Should be able to authenticate')
        .request(AUTH_CONTROLLER,{email: 'mytest@gmail.de',password: 'secret'})
        .assertThat
        .isSuccessful()
        .client()
            .isAuthenticated()
            .hasAuthUserGroup('user')
            .end()
        .test();

    when(testClient,'Should not be able to login with an invalid email and missing password')
        .request(AUTH_CONTROLLER,{email: 'notvalid.de'})
        .assertThat
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
                .deepEqual({id: "1",name: 'Luca'})
                .end()
            .end()
        .test();
});