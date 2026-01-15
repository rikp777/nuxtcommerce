import { addressesQuery } from '~/gql/queries/addresses';
import { requestAuthorizedQuery } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    const data = await requestAuthorizedQuery<any>(event, addressesQuery);
    return data?.customer || { billing: {}, shipping: {} };
});