import gql from 'graphql-tag';

export const GENERATE_GITHUB_TOKEN = gql`
  mutation GenerateToken($code: String!) {
    generateGitHubToken(code: $code) {
      code
    }
  }
`;

export const LOGIN = gql`
  mutation Login($user: LoginInput!) {
    login(user: $user) {
      id
      username
      fullName
      email
      gitHubToken
      pictureUrl
      gitHubUser {
        login
      }
    }
  }
`;