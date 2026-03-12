'use client'

import RegisterForm from '@/components/auth/register-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-transparent backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[450px] border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-300">
              Join ViewTube and start sharing your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-4 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
