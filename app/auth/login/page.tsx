import type { Metadata } from "next"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In | Hotel DC Company",
  description: "Sign in to your Hotel DC Company account to manage reservations and preferences.",
}

export default function LoginPage() {
  return <LoginForm />
}
