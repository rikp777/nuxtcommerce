import { loginMutation } from '~/gql/mutations/login';
import { requestMutation } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const data = await requestMutation<any>(event, loginMutation, {
        username: body.username,
        password: body.password
    });

    const token = data?.login?.authToken;

    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Login failed' });
    }

    setCookie(event, 'auth-token', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: data.login.user };
});