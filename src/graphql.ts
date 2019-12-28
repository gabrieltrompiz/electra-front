import gql from 'graphql-tag';

export const GENERATE_GITHUB_TOKEN = gql`
  mutation GenerateToken($code: String!) {
    generateGitHubToken(code: $code) {
      code
    }
  }
`;

export const GET_GITHUB_USER = gql`
  {
    viewer {
      login
      email
      avatarUrl
      name
      followers {
        totalCount
      }
      following {
        totalCount  
      }
    }
  }
`;

export const CHECK_USERNAME = gql`
  query CheckUsername($username: String!) {
    usernameExists(username: $username) {
      exists
    }
  }
`;

export const CHECK_EMAIL = gql`
  query CheckEmail($email: String!) {
    emailExists(email: $email) {
      exists
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
      workspaces {
        id
        name
        description
        # repo
        members {
          user {
            id
            username
            email
            pictureUrl
            fullName 
          }
          role
        }
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($user: RegisterInput!) {
    register(user: $user) {
      id
      email
      username
      fullName
      gitHubToken
      pictureUrl
      workspaces {
        id
        name
        description
        # repo
        members {
          user {
            id
            username
            email
            pictureUrl
            fullName
          }
          role
        }
      }
    }
  }
`;