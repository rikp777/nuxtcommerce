import { updateAddressMutation } from '~/gql/mutations/updateAddress';
import { requestAuthorizedMutation } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { type, data } = body;

    const cleanData = { ...data };

    if (type === 'shipping') {
        delete cleanData.email;
        delete cleanData.phone;
    }

    Object.keys(cleanData).forEach(key => {
        if (cleanData[key] === '') {
            delete cleanData[key];
        }
    });

    const input = {
        [type]: cleanData
    };

    console.log('Sending to WP:', input);

    await requestAuthorizedMutation(event, updateAddressMutation, input);

    return { success: true };
});