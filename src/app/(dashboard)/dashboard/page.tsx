"use client";
import React from 'react'
import Button from '@component/components/ui/Button'
import { FC } from 'react'
import { authOptions } from '@component/lib/auth'
import { getServerSession } from 'next-auth'



const page = async ({ }) => {

    return <h1>Chat text</h1>
}

export default page