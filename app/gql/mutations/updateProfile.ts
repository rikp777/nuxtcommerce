import {gql} from "nuxt-graphql-request/utils";

export const updateProfileMutation = gql`
  mutation UpdateProfile($id: ID!, $firstName: String, $lastName: String, $email: String, $newsletter: Boolean) {
    updateCustomer(input: { 
      id: $id, 
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email,
      newsletter: $newsletter  # Direct field!
    }) {
      customer {
        id
        newsletter # Return the new value to update UI immediately
      }
    }
  }
`;