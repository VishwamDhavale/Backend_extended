'use client'

import LoginForm from '@/components/auth/login-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-transparent backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-300">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-4 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}