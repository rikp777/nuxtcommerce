import { viewerQuery } from '~/gql/queries/viewer';
import { requestAuthorizedQuery } from '~~/server/utils/wpgraphql';

export default defineEventHandler(async (event) => {
    const data = await requestAuthorizedQuery<any>(event, viewerQuery);
    return data?.viewer;
});