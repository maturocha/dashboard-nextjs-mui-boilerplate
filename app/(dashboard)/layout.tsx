import type React from "react"
import DashboardLayout from "@/components/layout/master/dashboard"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}