import {gql} from "nuxt-graphql-request/utils";

export const sendPasswordResetMutation = gql`
  mutation SendPasswordReset($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      user {
        databaseId
      }
    }
  }
`;