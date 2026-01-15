import { customerOrdersQuery } from '~/gql/queries/customerOrders';
import { requestAuthorizedQuery } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    try {
        const data = await requestAuthorizedQuery<any>(event, customerOrdersQuery);
        return data?.customer?.orders?.nodes || [];
    } catch (e) {
        return [];
    }
});