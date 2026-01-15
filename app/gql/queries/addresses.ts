import {gql} from "nuxt-graphql-request/utils";

export const addressesQuery = gql`
  query GetAddresses {
    customer {
      billing {
        firstName
        lastName
        company
        address1
        address2
        city
        postcode
        country
        email
        phone
      }
      shipping {
        firstName
        lastName
        company
        address1
        address2
        city
        postcode
        country
      }
    }
  }
`;