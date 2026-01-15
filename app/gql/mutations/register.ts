import {gql} from "nuxt-graphql-request/utils";

export const registerMutation = gql`
  mutation Register($email: String!, $password: String!, $firstName: String, $lastName: String) {
    registerCustomer(input: { email: $email, password: $password, firstName: $firstName, lastName: $lastName }) {
      customer {
        id
        databaseId
        email
      }
    }
  }
`;