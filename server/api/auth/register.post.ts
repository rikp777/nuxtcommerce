import { registerMutation } from '~/gql/mutations/register';
import { loginMutation } from '~/gql/mutations/login';
import { requestMutation } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    await requestMutation<any>(event, registerMutation, {
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName
    });


    const loginData = await requestMutation<any>(event, loginMutation, {
        username: body.email,
        password: body.password
    });

    const token = loginData?.login?.authToken;

    if (token) {
        setCookie(event, 'auth-token', token, {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week geldig
        });
    }

    return { success: true, user: loginData?.login?.user };
});