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
  issues: Array<JSON>
  repo: JSON
}

export interface Member {
  user: Profile
  role: WorkspaceRole
}

export interface Notification {
  id: number
  receiver: number
  type: NotificationType
  description: string
  read: boolean
  meta: JSON
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
  // comments: Array<Comment>
  // subtasks: Array<SubTask>
  users: Array<Profile>
  issue: JSON
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