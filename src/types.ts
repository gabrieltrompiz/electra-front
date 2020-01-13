export interface State {
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
    }
  }
};

export interface Profile {
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

export interface Workspace {
  id: number
  name: string
  description?: string
  members: Array<Member>
  sprint: Sprint
  backlog: Array<Sprint>
  repo: Repository
}

export interface Member {
  user: Profile
  role: WorkspaceRole
}

export interface Notification {
  id: number
  receiver: number
  sender: number
  type: NotificationType
  description: string
  read: boolean
}

export interface Sprint {
  id: number
  title: string
  startDate: Date
  finishDate: Date
  status: SprintStatus
  tasks: Array<Task>
}

export interface Task {
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

export interface TaskComment {
  id: number
  user: Profile
  description: string
}

export interface SubTask {
  id: number
  description: string
  status: boolean
}

export interface GitHubUser {
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

export interface Issue {
  id: number
  url: string
  author: {
    avatarUrl: string
    login: string
    url: string
  },
  state: IssueState
  title: string
}

export interface Repository {
  issues: {
    nodes: Issue[]
  }
  name: string
  url: string
}

export enum IssueState { 
  OPEN,
  CLOSED
}

export enum WorkspaceRole {
  ADMIN,
  MEMBER
}

export enum NotificationType {
  INFORMATION,
  INVITATION
}

export enum SprintStatus {
  COMPLETED,
  IN_PROGRESS
}

export enum TaskStatus {
  TODO,
  IN_PROGRESS,
  DONE
}