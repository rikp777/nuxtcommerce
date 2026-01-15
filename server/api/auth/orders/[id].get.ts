import { orderQuery } from '~/gql/queries/order';
import { requestAuthorizedQuery } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    let id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Order ID required' });
    }


    id = decodeURIComponent(id);

    console.log('Fetching Order ID:', id);

    const data = await requestAuthorizedQuery<any>(event, orderQuery, { id });

    if (!data?.order) {
        throw createError({ statusCode: 404, statusMessage: 'Order not found' });
    }

    return data.order;
});