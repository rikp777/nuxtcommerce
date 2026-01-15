import {gql} from "nuxt-graphql-request/utils";

export const orderQuery = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      databaseId
      orderNumber
      date
      status
      total
      subtotal
      shippingTotal
      totalTax
      paymentMethodTitle
      currency
      # AANGEPAST: billingAddress -> billing
      billing {
        firstName
        lastName
        address1
        city
        postcode
        country
        email
        phone
      }
      # AANGEPAST: shippingAddress -> shipping
      shipping {
        firstName
        lastName
        address1
        city
        postcode
        country
      }
      lineItems(first: 100) {
        nodes {
          quantity
          total
          product {
            node {
              name
              image {
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;