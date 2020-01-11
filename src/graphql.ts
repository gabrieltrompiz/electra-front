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
      gitHubUser {
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
      workspaces {
        id
        name
        description
        repo {
          url
        }
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
        sprint {
          id
          title
          startDate
          finishDate
          status
          tasks {
            id
            name
            description
            estimatedHours
            loggedHours
            status
            subtasks {
              id
              description
              status
            }
            users {
              id
              username
              email
              pictureUrl
              fullName
            }
            issue {
              url
            }
          }
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
      gitHubUser {
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
      workspaces {
        id
        name
        description
        repo {
          url
        }
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

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const GET_PROFILE = gql`
  {
    profile {
      id
      username
      fullName
      email
      gitHubToken
      pictureUrl
      gitHubUser {
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
      workspaces {
        id
        name
        description
        repo {
          url
        }
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
        sprint {
          id
          title
          startDate
          finishDate
          status
          tasks {
            id
            name
            description
            estimatedHours
            loggedHours
            status
            subtasks {
              id
              description
              status
            }
            users {
              id
              username
              email
              pictureUrl
              fullName
            }
            issue {
              url
            }
          }
        }
      }     
    }
  }
`;

export const SEARCH = gql`
  query Search($search: String!) {
    users(search: $search) {
      id
      email
      username
      fullName
      pictureUrl
    }
  }
`;

export const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($workspace: WorkspaceInput!) {
    createWorkspace(workspace: $workspace) {
      id
      name
      description
      repo {
        url
      }
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
`;

export const CREATE_SPRINT =  gql`
  mutation CreateSprint($sprint: SprintInput!) {
    createSprint(sprint: $sprint) {
      id
      title
      startDate
      finishDate
      status
      tasks {
        id
        name
        description
        estimatedHours
        loggedHours
        status
        subtasks {
          id
          description
          status
        }
        users {
          id
          username
          email
          pictureUrl
          fullName
        }
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($task: TaskInput!) {
    createTask(task: $task) {
      id
      name
      status
      description
      estimatedHours
      loggedHours
      subtasks {
        id
        description
        status
      }
      users {
        id
        username
        email
        pictureUrl
        fullName
      }
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation EditProfile($user: EditProfileInput!) {
    editProfile(profile: $user) {
      id
      username
      fullName
      email
      gitHubToken
      pictureUrl
      gitHubUser {
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
      workspaces {
        id
        name
        description
        repo {
          url
        }
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
        sprint {
          id
          title
          startDate
          finishDate
          status
          tasks {
            id
            name
            description
            estimatedHours
            loggedHours
            status
            subtasks {
              id
              description
              status
            }
            users {
              id
              username
              email
              pictureUrl
              fullName
            }
            issue {
              url
            }
          }
        }
      } 
    }
  }
`;