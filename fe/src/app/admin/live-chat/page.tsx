"use client"

import { AdminLayout } from "@/components/layout"
import { LiveChatModeration } from "@/components/live"

// Admin Live Chat Moderation page: Real-time chat moderation interface
export default function AdminLiveChatPage() {
  return (
    <AdminLayout>
      <LiveChatModeration />
    </AdminLayout>
  )
}