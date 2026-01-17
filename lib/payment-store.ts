import { getSupabaseClient } from "./supabase"

export interface PaymentRecord {
  id: string
  name: string
  amount: string
  branch: string
  screenshot: string
  timestamp: string
}

export async function getPayments(): Promise<PaymentRecord[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching payments:", error)
    return []
  }

  return data.map((row: any) => ({
    id: row.id,
    name: row.name,
    amount: row.amount,
    branch: row.branch,
    screenshot: row.screenshot_url,
    timestamp: row.created_at,
  }))
}

export async function addPayment(payment: Omit<PaymentRecord, "id" | "timestamp">): Promise<PaymentRecord | null> {
  const supabase = getSupabaseClient()

  console.log("[v0] Adding payment to Supabase...")
  console.log("[v0] Screenshot size:", Math.round((payment.screenshot?.length || 0) / 1024), "KB")

  const { data, error } = await supabase
    .from("payments")
    .insert({
      name: payment.name,
      amount: payment.amount,
      branch: payment.branch,
      screenshot_url: payment.screenshot,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Supabase insert error:", error.message, error.details, error.hint)
    throw new Error(error.message || "Database error")
  }

  console.log("[v0] Payment added successfully:", data.id)

  return {
    id: data.id,
    name: data.name,
    amount: data.amount,
    branch: data.branch,
    screenshot: data.screenshot_url,
    timestamp: data.created_at,
  }
}
