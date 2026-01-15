import {gql} from "nuxt-graphql-request/utils";

export const viewerQuery = gql`
  query Viewer {
    viewer {
      id
      databaseId
      email
      firstName
      lastName
    }
  }
`;