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
    workspaces: Workspace[]
    notifications: Notification[]
  }

  interface Workspace {
    id: number
    name: string
    description?: string
    members: Member[]
    sprint: Sprint
    backlog: Sprint[]
    repo: Repository
    chats: Chat[]
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
    tasks: Task[]
  }

  interface Task {
    id: number
    name: string
    estimatedHours: number
    loggedHours: number
    status: TaskStatus
    description: string
    comments: TaskComment[]
    subtasks: SubTask[]
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

  interface Chat {
    id: number
    type: ChatType
    name: string
    description: string
    users: Profile[]
    messages: Message[]
  }

  interface Message {
    id: number
    user: Profile
    type: MessageType
    content: string
    date: Date
  }

  enum ChatType {
    CHANNEL,
    DIRECT
  }

  enum MessageType {
    TEXT,
    FILE,
    INFO
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
    INVITED_TO_WORKSPACE,
    KICKED_FROM_WORKSPACE,
    CHANGED_WORKSPACE_ROLE,
    WORKSPACE_DELETED,
    CREATED_SPRINT,
    SPRINT_TO_BACKLOG,
    ASSIGNED_TASK,
    CHANGED_TASK_STATUS,
    CREATED_TASK_COMMENT,
    CREATED_TASK_SUBTASK
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