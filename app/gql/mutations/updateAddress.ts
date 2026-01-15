import {gql} from "nuxt-graphql-request/utils";

export const updateAddressMutation = gql`
  mutation UpdateCustomerAddress($billing: CustomerAddressInput, $shipping: CustomerAddressInput) {
    updateCustomer(input: { billing: $billing, shipping: $shipping }) {
      customer {
        databaseId
        billing {
          firstName
          lastName
          address1
          postcode
          city
        }
        shipping {
          firstName
          lastName
          address1
          postcode
          city
        }
      }
    }
  }
`;