 
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa6';
import { IRegisterForm } from '@/pages/auth/register/types/type';

interface IBasicInformationStepProps {
  onNext: (data: Omit<IRegisterForm, 'useOwnWallet' | 'publicKey'>) => void;
  initialData?: Partial<IRegisterForm>;
}

function BasicInformationStep({ onNext, initialData }: IBasicInformationStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Omit<IRegisterForm, 'useOwnWallet' | 'publicKey'>>({
    defaultValues: initialData
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch('password');

  const onValid = (data: Omit<IRegisterForm, 'useOwnWallet' | 'publicKey'>) => {
    onNext(data);
  };

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSubmit(onValid)();
  };

  return (
    <div className="space-y-5">
      {/* Step Indicator */}
      <div className="mb-6 flex justify-center">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            1
          </div>
          <div className="mx-2 h-1 w-16 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-sm font-bold text-gray-500 dark:text-gray-400">
            2
          </div>
          <div className="mx-2 h-1 w-16 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-sm font-bold text-gray-500 dark:text-gray-400">
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {/* Name Input */}
        <div>
          <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Full Name</label>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Your full name"
              {...register('name', { required: 'Name is required' })}
              onKeyDown={onEnterKeyPress}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pr-4 pl-10 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {errors?.name && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Email Address</label>
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              onKeyDown={onEnterKeyPress}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pr-4 pl-10 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {errors?.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Password</label>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              onKeyDown={onEnterKeyPress}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pr-10 pl-10 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute top-2.5 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors?.password && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Confirm Password</label>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match',
              })}
              onKeyDown={onEnterKeyPress}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pr-10 pl-10 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute top-2.5 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors?.confirmPassword && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        {/* Links */}
        <div className="flex justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>Already have an account? </span>
          <a href="/login" className="ml-1 text-green-600 dark:text-blue-400 hover:underline">
            Sign in
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 py-2 font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </form>
    </div>
  );
}

export default BasicInformationStep;