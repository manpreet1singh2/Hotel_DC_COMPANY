import type { Metadata } from "next"
import RegisterForm from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account | Hotel DC Company",
  description: "Register for a Hotel DC Company account to book rooms and manage your reservations.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
