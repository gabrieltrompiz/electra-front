declare namespace electra {
  interface State {
    userReducer: {
      user: Profile
      loggedIn: boolean
      workspaces: Array<Workspace>
      selectedWorkspace: Workspace
      selectedSprint: Sprint
      isAdmin: boolean
    }
    settingsReducer: {
      show: {
        profile: Profile
        profileView: boolean
        createWorkspace: boolean
        createSprint: boolean
        createTask: boolean
        taskType: TaskStatus
        task: Task
        taskView: boolean
        createSubtask: boolean
        completeSprint: boolean
        inviteUsers: boolean
      }
    }
  }

  interface Profile {
    id: number
    username: string
    fullName: string
    email: string
    gitHubToken?: string
    gitHubUser?: GitHubUser
    password?: string
    pictureUrl: string
    workspaces: Array<Workspace>
    notifications: Array<Notification>
  }

  interface Workspace {
    id: number
    name: string
    description?: string
    members: Array<Member>
    sprint: Sprint
    backlog: Array<Sprint>
    repo: Repository
  }

  interface Member {
    user: Profile
    role: WorkspaceRole
  }

  interface Notification {
    id: number
    sender: Profile
    type: NotificationType
    date: Date
    read: boolean
    target: Sprint | Workspace | Task
  }

  interface Sprint {
    id: number
    title: string
    startDate: Date
    finishDate: Date
    endDate: Date
    sprintStatus: SprintStatus
    tasks: Array<Task>
  }

  interface Task {
    id: number
    name: string
    estimatedHours: number
    loggedHours: number
    status: TaskStatus
    description: string
    comments: Array<TaskComment>
    subtasks: Array<SubTask>
    user: Profile
    issue: Issue
  }

  interface TaskComment {
    id: number
    user: Profile
    description: string
  }

  interface SubTask {
    id: number
    description: string
    status: boolean
  }

  interface GitHubUser {
    login: string
    email: string
    avatarUrl: string
    name: string
    followers?: {
      totalCount: number
    }
    following?: {
      totalCount: number
    }
  }

  interface Issue {
    id: string
    url: string
    author: {
      avatarUrl: string
      login: string
      url: string
    },
    state: IssueState
    title: string
  }

  interface Repository {
    id: number
    issues?: {
      nodes: Issue[]
    }
    name: string
    url: string
  }

  enum IssueState { 
    OPEN,
    CLOSED
  }

  enum WorkspaceRole {
    ADMIN,
    MEMBER
  }

  enum NotificationType {
    INFORMATION,
    INVITATION
  }

  enum SprintStatus {
    COMPLETED,
    IN_PROGRESS
  }

  enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
  }
}

declare module 'electra' {
  export = electra;
}