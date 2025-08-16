
export interface SisebResponseType<T> {
    status?: string
    message?: string
    data: T[]
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
    title: string
    description: string
    typeId: string
    budget: {
        budget: number
        currency: string
    }
    location: {
        location: {
            type: string
            coordinates: Array<number>
        }
        region: string
        city: string
    }
    files: Array<{
        id: string
        code: string
    }>
    finances: Array<{
        reportingYear: string
        fundingSource: {
            donor: string
            program: string
        }
        instrumentType: string
        amountCommitedCfa: {
            total: number
        }
        amountDisbursedCfa: {
            total: number
        }
        currency: string
        exchangeRateUsed: string
    }>
    verifications: Array<{
        verificationLevel: string
        verificationDate: string
        verifier: {
            name: string
            organization: string
        }
        verificationReportReference: {
            url: string
        }
    }>
}

