import {gql} from "nuxt-graphql-request/utils";

export const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { 
      clientMutationId: "uniqueId", 
      username: $username, 
      password: $password 
    }) {
      authToken
      refreshToken
      user {
        id
        databaseId
        email
        firstName
        lastName
      }
    }
  }
`;