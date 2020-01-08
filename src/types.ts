export interface State {
  userReducer: {
    user: Profile
    loggedIn: boolean
    workspaces: Array<Workspace>
    selectedWorkspace: Workspace
  }
  settingsReducer: {
    shownProfile: Profile
    showProfileView: boolean
    showCreateWorkspace: boolean
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
}

export interface Member {
  user: Profile
  role: WorkspaceRole
}

export interface Notification {
  id: number
  receiver: number
  type: NotificationType,
  description: string
  read: boolean
  meta: JSON
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

enum NotificationType {
  INFORMATION,
  INVITATION
}