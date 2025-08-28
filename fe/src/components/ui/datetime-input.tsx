"use client"

import { Input } from "@/components/ui/input"

interface DateTimeInputProps {
  id?: string
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  min?: string
  className?: string
}

export function DateTimeInput({ 
  id, 
  value = "", 
  onChange, 
  disabled, 
  min, 
  className 
}: DateTimeInputProps) {
  return (
    <Input
      id={id}
      type="datetime-local"
      value={value ? new Date(value).toISOString().slice(0, 16) : ""}
      onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
      disabled={disabled}
      min={min ? new Date(min).toISOString().slice(0, 16) : ""}
      step="60"
      className={className}
    />
  )
}