import {gql} from "nuxt-graphql-request/utils";

export const customerOrdersQuery = gql`
  query CustomerOrders {
    customer {
      orders(first: 20) {
        nodes {
          id
          databaseId
          orderNumber
          date
          status
          total
          currency
          lineItems(first: 3) {
            nodes {
              product {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;