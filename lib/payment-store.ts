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
    console.error("Error fetching payments:", error)
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
    console.error("Supabase insert error:", error.message, error.details, error.hint)
    throw new Error(error.message || "Database error")
  }

  return {
    id: data.id,
    name: data.name,
    amount: data.amount,
    branch: data.branch,
    screenshot: data.screenshot_url,
    timestamp: data.created_at,
  }
}

export async function updatePayment(
  id: string,
  updates: Partial<Omit<PaymentRecord, "id" | "timestamp">>,
): Promise<boolean> {
  const supabase = getSupabaseClient()

  const updateData: any = {}
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.amount !== undefined) updateData.amount = updates.amount
  if (updates.branch !== undefined) updateData.branch = updates.branch
  if (updates.screenshot !== undefined) updateData.screenshot_url = updates.screenshot

  const { error } = await supabase.from("payments").update(updateData).eq("id", id)

  if (error) {
    console.error("Supabase update error:", error.message)
    throw new Error(error.message || "Update failed")
  }

  return true
}

export async function deletePayment(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("payments").delete().eq("id", id)

  if (error) {
    console.error("Supabase delete error:", error.message)
    throw new Error(error.message || "Delete failed")
  }

  return true
}
