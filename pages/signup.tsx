import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

type SignupFormInputs = {
  name: string
  email: string
  password: string
}

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>()
  const router = useRouter()

  const onSubmit = async ({ name, email, password }: SignupFormInputs) => {
    const result = await signIn('email', {
      name,
      email,
      password,
      callbackUrl: `${window.location.origin}/`,
    })
    console.log(result)
    if (result.error) {
      alert(result.error)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded shadow-md"
      >
        <h1 className="text-xl font-semibold mb-6">Sign Up</h1>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border border-gray-400 p-2 w-full rounded"
            {...register('name', { required: true })}
          />
          {errors.name && <span className="text-red-500">This field is required</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border border-gray-400 p-2 w-full rounded"
            {...register('email', { required: true })}
          />
          {errors.email && <span className="text-red-500">This field is required</span>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="border border-gray-400 p-2 w-full rounded"
            {...register('password', { required: true })}
          />
          {errors.password && <span className="text-red-500">This field is required</span>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}