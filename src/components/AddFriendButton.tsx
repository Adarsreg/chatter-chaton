'use client'
import { FC, useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@component/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
interface AddFriendButtonProps {

}
type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({ }) => {
  const {
    register, handleSubmit, setError, formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })
  const [success, setSuccess] = useState<boolean>(false)
  const addFriend = async (email: string) => {
    try {
      const validateEmail = addFriendValidator.parse({ email })
      await axios.post('/api/friends/add', {
        email: validateEmail,
      })
      setSuccess(true)
    }
    catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message })
        return
      }
      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data })
        return
      }
      setError('email', {
        message: 'Something went wrong, please try again later.'
      })
    }
  }
  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'>
        Add friend by email?
      </label>

      <div className='mt-2 flex gap-4'>
        <input
          {...register('email')}
          type='text' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm-leading-6'
          placeholder='you@example.com'
        />
        <Button>Add</Button>
      </div>
      <p className='mt-2 text-sm text-red-600'>{errors.email?.message}  </p>
      {success ? (
        <p className='mt-2 text-sm text-green-600'>Friend request sent  </p>
      ) : null
      }
    </form>
  )
}

export default AddFriendButton