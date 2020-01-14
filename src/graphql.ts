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
          id
          url
          name
          issues(first: 100, states: [OPEN]) {
            nodes {
              id
              url
              state
              title
              author {
                avatarUrl
                login
                url
              }
            }
          }
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
        backlog {
          id
          title
          startDate
          finishDate
          status
          tasks {
            estimatedHours
            loggedHours
          }
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
            comments {
              id
              user {
                id
                username
                email
                pictureUrl
                fullName
              }
              description
            }
            subtasks {
              id
              description
              status
            }
            user {
              id
              username
              email
              pictureUrl
              fullName
            }
            issue {
              id
              url
              state
              title
              author {
                avatarUrl
                login
                url
              }
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
          id
          url
          name
          issues(first: 100, states: [OPEN]) {
            nodes {
              id
              url
              state
              title
              author {
                avatarUrl
                login
                url
              }
            }
          }
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
          id
          url
          name
          issues(first: 100, states: [OPEN]) {
            nodes {
              id
              url
              state
              title
              author {
                avatarUrl
                login
                url
              }
            }
          }
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
        backlog {
          id
          title
          startDate
          finishDate
          status
          tasks {
            estimatedHours
            loggedHours
          }
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
            comments {
              id
              user {
                id
                username
                email
                pictureUrl
                fullName
              }
              description
            }
            subtasks {
              id
              description
              status
            }
            user {
              id
              username
              email
              pictureUrl
              fullName
            }
            issue {
              id
              url
              state
              title
              author {
                avatarUrl
                login
                url
              }
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
        id
        url
        name
        issues(first: 100, states: [OPEN]) {
          nodes {
            id
            url
            state
            title
            author {
              avatarUrl
              login
              url
            }
          }
        }
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
      # backlog {
      #   id
      #   tasks {
      #     estimatedHours
      #     loggedHours
      #   }
      # }
      tasks {
        id
        name
        description
        estimatedHours
        loggedHours
        status
        comments {
          id
          user {
            id
            username
            email
            pictureUrl
            fullName
          }
          description
        }
        subtasks {
          id
          description
          status
        }
        user {
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
      issue {
        id
        url
        state
        title
        author {
          avatarUrl
          login
          url
        }
      }
      comments {
        id
        user {
          id
          username
          email
          pictureUrl
          fullName
        }
        description
      }
      subtasks {
        id
        description
        status
      }
      user {
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
          id
          url
          issues(first: 100, states: [OPEN]) {
            nodes {
              id
              url
              state
              title
              author {
                avatarUrl
                login
                url
              }
            }
          }
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
        backlog {
          id
          title
          startDate
          finishDate
          status
          tasks {
            estimatedHours
            loggedHours
          }
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
            comments {
              id
              user {
                id
                username
                email
                pictureUrl
                fullName
              }
              description
            }
            subtasks {
              id
              description
              status
            }
            user {
              id
              username
              email
              pictureUrl
              fullName
            }
            issue {
              id
              url
              state
              title
              author {
                avatarUrl
                login
                url
              }
            }
          }
        }
      } 
    }
  }
`;

export const CHANGE_SUBTASK_STATUS = gql`
  mutation SetSubtaskStatus($status: Boolean!, $subTaskId: ID!) {
    setSubTaskStatus(status: $status, subTaskId: $subTaskId) {
      id
      status
      description
    }
  }
`;

export const CREATE_SUBTASK = gql`
  mutation CreateSubtask($subtask: SubTaskInput!) {
    createSubTask(subTask: $subtask) {
      id
      description
      status
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($comment: CommentInput!) {
    createComment(comment: $comment) {
      id
      description
      user { 
        id
        username
        fullName
        email
        pictureUrl
      }
    }
  }
`;

export const CHANGE_TASK_STATUS = gql`
  mutation ChangeStatus($status: TaskStatus!, $taskId: ID!) {
    updateTaskStatus(status: $status, taskId: $taskId)
  }
`;

export const CHANGE_TASK_USER = gql`
  mutation ChangeUser($input: UserTaskInput!) {
    changeUserTask(input: $input)
  }
`;

export const CHANGE_TASK_DESCRIPTION = gql`
  mutation ChangeDescription($taskId: ID!, $description: String!) {
    changeTaskDescription(taskId: $taskId, description: $description) {
      id
    }
  }
`;

export const UPDATE_TASK_HOURS = gql`
  mutation UpdateHours($taskId: ID!, $hours: Int!) {
    updateTaskHours(taskId: $taskId, hours: $hours)
  }
`;

export const COMPLETE_SPRINT = gql`
  mutation CompleteSprint($id: ID!) {
    sendSprintToBacklog(id: $id)
  }
`;

export const GET_USER_REPOS = gql`
  {
    viewer {
      repositories(first: 100, privacy: PUBLIC) {
        nodes {
          id
          url
          name
          owner {
            login
          }
        }
      }
    }  
  }
`;

export const CHANGE_TASK_ISSUE = gql`
  mutation ChangeIssue($taskId: ID!, $issueId: ID) {
    changeTaskIssue(taskId: $taskId, issueId: $issueId)
  }
`;