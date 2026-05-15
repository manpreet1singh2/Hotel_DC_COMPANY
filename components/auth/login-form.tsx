"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Building, UserCheck, User, Mail } from "lucide-react"
import { authUtils } from "@/lib/utils/authUtils"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetMessage, setResetMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const user = await authUtils.login(email, password)
      if (user) {
        await new Promise((r) => setTimeout(r, 200))
        window.location.href = authUtils.getDashboardRoute(user)
      } else {
        setError("Incorrect credentials. Please check your email and password.")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetMessage("")
    setError("")
    if (!resetEmail) { setError("Please enter your email address"); return }
    if (!/\S+@\S+\.\S+/.test(resetEmail)) { setError("Please enter a valid email address"); return }
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to send reset link")
      setResetMessage("If an account exists, a reset link has been sent to your email.")
      setResetEmail("")
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (em: string) => {
    setEmail(em)
    setPassword(em.includes("hoteldc.com") ? "7777" : "1234")
  }

  const roleAccounts = [
    { role: "Administrator", email: "carlos.ramirez@hoteldc.com", icon: Shield, color: "text-red-600", desc: "Full system access" },
    { role: "Reception", email: "laura.martinez@hoteldc.com", icon: Building, color: "text-blue-600", desc: "Manage reservations & check-in" },
    { role: "Housekeeping", email: "sofia.moreno@hoteldc.com", icon: UserCheck, color: "text-green-600", desc: "Services & maintenance" },
    { role: "Guest Example", email: "juanperez@mail.com", icon: User, color: "text-purple-600", desc: "Frequent hotel guest" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">Hotel DC Company — Guest & Staff Portal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>{showForgotPassword ? "Reset Password" : "Account Login"}</CardTitle>
              <CardDescription>
                {showForgotPassword ? "Enter your email to receive a reset link" : "Enter your credentials to access the system"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showForgotPassword ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Signing in...</> : "Sign In"}
                  </Button>
                  <div className="text-center">
                    <Button type="button" variant="link" className="text-sm" onClick={() => setShowForgotPassword(true)}>Forgot your password?</Button>
                  </div>
                  <div className="text-center border-t pt-4">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <Link href="/auth/register" className="text-primary hover:underline font-medium">Register here</Link>
                    </p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="text-center mb-4">
                    <Mail className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Enter your email and we'll send a reset link.</p>
                  </div>
                  <div>
                    <Label htmlFor="resetEmail">Email Address</Label>
                    <Input id="resetEmail" type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="your@email.com" className="mt-1" />
                  </div>
                  {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                  {resetMessage && <Alert className="bg-green-50 border-green-200"><AlertDescription className="text-green-800">{resetMessage}</AlertDescription></Alert>}
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowForgotPassword(false); setError(""); setResetMessage("") }}>Cancel</Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </div>
                  <div className="text-center">
                    <Button type="button" variant="link" className="text-sm" onClick={() => setShowForgotPassword(false)}>Back to login</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>Select a demo account to auto-fill credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roleAccounts.map((acc) => {
                  const Icon = acc.icon
                  return (
                    <Button key={acc.email} variant="outline" className="w-full justify-start h-auto p-4 hover:bg-gray-50" onClick={() => quickLogin(acc.email)}>
                      <div className="flex items-center gap-3 w-full">
                        <Icon className={`h-5 w-5 ${acc.color}`} />
                        <div className="text-left flex-1">
                          <div className="font-medium text-gray-900 text-sm">{acc.role}</div>
                          <div className="text-xs text-gray-500">{acc.email}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{acc.desc}</div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
              <div className="mt-5 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-center">
                <p className="text-xs text-yellow-800">
                  <strong>Demo passwords:</strong> Staff accounts use <code className="bg-yellow-100 px-1 rounded">7777</code>, Guest accounts use <code className="bg-yellow-100 px-1 rounded">1234</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
