// lib/payment-store.ts
import { getSupabaseClient } from "./supabase"

export interface PaymentRecord {
  id: string
  name: string
  amount: string
  branch: string
  screenshot: string
  timestamp: string
}

/* ================= CACHE ================= */
// 🔥 NEVER null – always array
let cachedPayments: PaymentRecord[] = []

/* ================= GET ================= */
export async function getPayments(): Promise<PaymentRecord[]> {
  // 🔥 instant return if already loaded
  if (cachedPayments.length > 0) {
    return cachedPayments
  }

  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("payments")
    .select("id, name, amount, branch, screenshot_url, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    return []
  }

  cachedPayments = (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    amount: row.amount,
    branch: row.branch,
    screenshot: row.screenshot_url,
    timestamp: row.created_at,
  }))

  return cachedPayments
}

/* ================= ADD ================= */
export async function addPayment(
  payment: Omit<PaymentRecord, "id" | "timestamp">
): Promise<PaymentRecord> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("payments")
    .insert({
      name: payment.name,
      amount: payment.amount,
      branch: payment.branch,
      screenshot_url: payment.screenshot,
    })
    .select("id, name, amount, branch, screenshot_url, created_at")
    .single()

  if (error || !data) {
    console.error(error)
    throw new Error("Add payment failed")
  }

  const newPayment: PaymentRecord = {
    id: data.id,
    name: data.name,
    amount: data.amount,
    branch: data.branch,
    screenshot: data.screenshot_url,
    timestamp: data.created_at,
  }

  // 🔥 update cache instantly
  cachedPayments = [newPayment, ...cachedPayments]

  return newPayment
}

/* ================= UPDATE ================= */
export async function updatePayment(
  id: string,
  updates: Partial<Omit<PaymentRecord, "id" | "timestamp">>
): Promise<boolean> {
  const supabase = getSupabaseClient()

  const updateData: any = {}
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.amount !== undefined) updateData.amount = updates.amount
  if (updates.branch !== undefined) updateData.branch = updates.branch
  if (updates.screenshot !== undefined)
    updateData.screenshot_url = updates.screenshot

  const { error } = await supabase
    .from("payments")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("Update error:", error)
    throw new Error("Update failed")
  }

  // 🔥 update cache
  cachedPayments = cachedPayments.map(p =>
    p.id === id ? { ...p, ...updates } as PaymentRecord : p
  )

  return true
}

/* ================= DELETE ================= */
export async function deletePayment(id: string): Promise<boolean> {
  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Delete error:", error)
    throw new Error("Delete failed")
  }

  // 🔥 update cache
  cachedPayments = cachedPayments.filter(p => p.id !== id)

  return true
}
