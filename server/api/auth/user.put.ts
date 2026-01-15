import { updateProfileMutation } from '~/gql/mutations/updateProfile';
import { requestAuthorizedMutation } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.id) {
        throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
    }

    const data = await requestAuthorizedMutation<any>(event, updateProfileMutation, {
        id: body.id,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
    });

    return data?.updateCustomer?.customer;
});