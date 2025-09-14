import {emptyCartMutation} from "~/gql/mutations/emptyCartMutation";

export default defineEventHandler(async (event) => {

    const variables = {
        input: {

            clientMutationId: crypto.randomUUID(),
        },
    };

    return await requestMutation(event, emptyCartMutation, variables);
});
