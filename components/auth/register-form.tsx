"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { authUtils } from "@/lib/utils/authUtils"

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Belgium","Bolivia","Brazil","Canada",
  "Chile","China","Colombia","Croatia","Cuba","Czech Republic","Denmark","Ecuador","Egypt","Finland",
  "France","Germany","Ghana","Greece","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel",
  "Italy","Jamaica","Japan","Jordan","Kenya","Kuwait","Lebanon","Malaysia","Mexico","Morocco",
  "Netherlands","New Zealand","Nigeria","Norway","Pakistan","Panama","Peru","Philippines","Poland",
  "Portugal","Romania","Russia","Saudi Arabia","Senegal","Singapore","South Africa","South Korea",
  "Spain","Sweden","Switzerland","Thailand","Turkey","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Uruguay","Venezuela","Vietnam","Zimbabwe"
].sort()

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", nationality: "", password: "", confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const router = useRouter()

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.firstName.trim() || !formData.lastName.trim()) return setError("Please enter your first and last name")
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return setError("Please enter a valid email address")
    if (!formData.phone.trim()) return setError("Please enter your phone number")
    if (!formData.nationality) return setError("Please select your nationality")
    if (formData.password.length < 6) return setError("Password must be at least 6 characters")
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match")
    if (!acceptedTerms) return setError("You must accept the Terms & Conditions to register")

    setIsLoading(true)
    try {
      await authUtils.register({
        nombre: formData.firstName,
        apellido: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        direccion: formData.address,
        nacionalidad: formData.nationality,
        password: formData.password,
      })
      setSuccess(true)
      setTimeout(() => router.push("/auth/login"), 2500)
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-600">Redirecting you to the login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">Sign in here</Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Fill in your details to create your Hotel DC guest account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handle} placeholder="John" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handle} placeholder="Smith" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handle} placeholder="john@example.com" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handle} placeholder="+1 (555) 000-0000" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handle} placeholder="123 Main St, City" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <select id="nationality" name="nationality" required value={formData.nationality} onChange={handle}
                  className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select your country...</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative mt-1">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handle} placeholder="Min. 6 characters" />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative mt-1">
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} required value={formData.confirmPassword} onChange={handle} placeholder="Repeat your password" />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300" />
                <Label htmlFor="terms" className="text-sm text-gray-600 font-normal cursor-pointer">
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                </Label>
              </div>

              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Creating account...</> : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
