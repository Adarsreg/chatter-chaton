"use client";
import React from 'react'
import Button from '@component/components/ui/Button'
import { FC } from 'react'
import { authOptions } from '@component/lib/validations/auth'
import { getServerSession } from 'next-auth'



const page = async ({ }) => {
    const session = await getServerSession(authOptions)
    return <pre>{JSON.stringify(session)}</pre>
}

export default page