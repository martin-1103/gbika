"use client"

import { TestimonialEditForm } from "@/components/forms"

// Admin Testimonial Edit page: Edit testimonial interface
export default function AdminTestimonialEditPage({
  params
}: {
  params: { id: string }
}) {
  return <TestimonialEditForm testimonialId={params.id} />
}