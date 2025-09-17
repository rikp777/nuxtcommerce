import { readBody } from 'h3';
import { checkoutMutation } from '~/gql/mutations/checkout';
import { requestMutation } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async event => {
    const body = await readBody(event);

    const input = {
        billing: body.billing,
        paymentMethod: body.paymentMethod,
        email: body.billing.email,
    };

    return await requestMutation(event, checkoutMutation, { input: body });
});