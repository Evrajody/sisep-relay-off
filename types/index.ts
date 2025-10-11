
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

export interface Project {
  id: string
  title: string
  description: string
  type: {
    id: string
    name: string
    description?: string
  }
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED'
  createdBy: string
  createdAt: string
  updatedAt: string
  coverImage?: {
    url: string
    alt?: string
  }
  startDate: string
  endDate: string
  objective: {
    goal: string
  }
  expectedResults: {
    result: string
  }
  totalBudget: number
  location: {
    region: string
    city: string
    coordinates: [number, number]
  }
  indicators: Array<{
    id: string
    indicatorName: string
    baselineValue: string
    targetValue: string
    latestValue: string
    unit: string
  }>
  partners: Array<{
    id: string
    name: string
    type: string
    role: string
  }>
  finances: Array<{
    id: string
    fundingSource: string
    amountCommitedCfa: string
    amountDisbursedCfa: string
    currency: string
  }>
  files?: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
  }>
  activities?: Array<{
    id: string
    title: string
    description: string
    startDate: string
    endDate: string
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
  }>
  team?: Array<{
    id: string
    name: string
    role: string
    email: string
    phone?: string
  }>
}

export interface Convention {
  id: string
  title: string
  description: string
  functionalGroup: string
  adoptionDate: string
  effectiveDate: string
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED'
  isPublished: boolean
  type?: string
  category?: string
  ratificationDate?: string
  signatories?: number
  articles?: Array<{
    id: string
    number: string
    title: string
    content: string
  }>
  objectives?: Array<string>
  documents?: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
  }>
  implementations?: Array<{
    id: string
    year: string
    title: string
    description: string
  }>
  relatedConventions?: Array<{
    id: string
    title: string
    category: string
    status: string
  }>
  coverImage?: {
    url: string
    alt?: string
  }
  createdAt: string
  updatedAt: string
}
