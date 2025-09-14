import { getPaymentGateways } from '~/gql/queries/getPaymentGateways';
import { requestQuery } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async () => {
    return await requestQuery(getPaymentGateways);
});