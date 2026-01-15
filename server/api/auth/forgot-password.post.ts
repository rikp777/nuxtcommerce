import { sendPasswordResetMutation } from '~/gql/mutations/sendPasswordReset';
import { requestMutation } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    return await requestMutation<any>(event, sendPasswordResetMutation, {
        username: body.email
    });
});