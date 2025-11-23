
export interface SisebResponseType<T = any> {
  status?: string
  message?: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from?: number
    to?: number
  }
}

export interface TypeProject {
    id: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
    deletedAt: any
}

export type Project = {
    id: string
    title: string
    description: string
    typeId: string
    status: string
    createdBy: string
    createdAt: string
    updatedAt: string
    deletedAt: any
    coverImageId: any
    indicatorIds: any
    implementingPartners: any
    moduleClimat: any
    startDate: any
    endDate: any
    sectorId: any
    subsectorId: any
    objective: {
        goal: any
    }
    expectedResults: {
        result: any
    }
    lessonsLearned: {
        lesson: any
    }
    totalBudget: any
    infoLinks: {
        infoLinks_website: string
    }
    structure: {
        id: string
        code: string
        name: string
    }
    pointFocal: any
    budget: any
    location: {
        projectId: string
        location: any
        region: any
        city: any
        deletedAt: any
    }
    files: Array<any>
    finances: Array<any>
    verifications: Array<any>
    coverImage: any
    type: {
        id: string
        name: string
        description: string
        code: string
        createdAt: string
        updatedAt: string
        deletedAt: any
    }
    indicators: Array<any>
    partners: Array<any>
    targets: Array<any>
    actions: Array<any>
}


export type UserType = {
    expiresAt: string
    token: string
    createdAt: string
    updatedAt: string
    ipAddress: string
    userAgent: string
    userId: string
    id: string
    auth_provider: string
    access_token: string
    idToken: string
    additional_info: {
        accessTokenExpiresAt: string
        user: {
            username: string
            email: string
            fullName: string
        }
        persmissions: {
            CAN_LIST_OWN_PROJECT: boolean
            CAN_UPDATE_ALL_INDICATOR: boolean
            CAN_PUBLISH_PROJECT: boolean
            CAN_LIST_OWN_INDICATOR: boolean
            CAN_SUPER_VALIDATEUR: boolean
            CAN_ASK_FOR_UPDATE: boolean
            CAN_UPDATE_PROJECT: boolean
            CAN_LIST_ALL_PROJECT: boolean
            CAN_ASSIGN_PROJECT: boolean
            CAN_CREATE_PROJECT: boolean
            CAN_ADMIN: boolean
            CAN_UPDATE_ALL_PROJECT: boolean
            CAN_POINT_FOCAL: boolean
            CAN_UPDATE_OWN_PROJECT: boolean
            CAN_MODIFY_PROJECT: boolean
            CAN_VALIDATEUR: boolean
            CAN_SUBMIT_PROJECT_FOR_VALIDATION: boolean
            CAN_uma_protection: boolean
            CAN_REJECT_PROJECT: boolean
            CAN_UPDATE_OWN_INDICATOR: boolean
            CAN_VALIDATE_PROJECT: boolean
            CAN_UNPUBLISH_PROJECT: boolean
            CAN_CREATE_INDICATOR: boolean
            CAN_LIST_ALL_INDICATOR: boolean
            CAN_DELETE_PROJECT: boolean
            CAN_DELETE_INDICATOR: boolean
            CAN_SUBMIT_VALIDATION_PROJECT: boolean
            CAN_ASK_UPDATE_PROJECT: boolean
            CAN_LIST_PROJECT: boolean
            CAN_LINK_INDICATOR_TO_PROJECT: boolean
            CAN_DGEC: boolean
        }
        structures: Array<any>
        modules: Array<string>
    }
}

export type Convention = {
  id: string
  title: string
  functionalGroupId: FunctionalGroup['id']
  adoptionDate: string
  ratificationDate: string
  effectiveDate: string
  objectives: string
  principles: string
  globalObligations: string
  specificObligations: string
  createdAt: string
  updatedAt: string
}

export type FunctionalGroup = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}


