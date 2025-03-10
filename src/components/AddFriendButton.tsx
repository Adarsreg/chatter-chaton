'use client'
import { FC, useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@component/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const addFriend = async (email: string) => {
    setIsLoading(true)
    try {
      const validateEmail = addFriendValidator.parse({ email })
      await axios.post('/api/friends/add', {
        email: validateEmail,
      })
      setSuccess(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message })
        return
      }
      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data })
        return
      }
      setError('email', {
        message: 'Something went wrong, please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Add friend by email
      </label>
      <div className="mt-2 flex gap-4">
        <input
          {...register('email')}
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm  focus:ring-indigo-500 sm:text-sm"
          placeholder="you@example.com"
        />
        <Button isloading={isLoading} type="submit">
          Add
        </Button>
      </div>
      <p className="mt-2 text-sm text-red-600">{errors.email?.message}</p>
      {success && (
        <p className="mt-2 text-sm text-green-600">Friend request sent</p>
      )}
    </form>
  )
}

export default AddFriendButton