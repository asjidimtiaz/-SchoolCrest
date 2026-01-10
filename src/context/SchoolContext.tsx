'use client'

import { createContext, useContext } from 'react'


export const SchoolContext = createContext<any>(null)

export function SchoolProvider({
    children,
    value
}: {
    children: React.ReactNode
    value: any
}) {
    return (
        <SchoolContext.Provider value={value}>
            {children}
        </SchoolContext.Provider>
    )
}

export function useSchool() {
    return useContext(SchoolContext)
}
