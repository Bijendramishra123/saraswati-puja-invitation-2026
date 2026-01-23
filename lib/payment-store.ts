// lib/payment-store.ts
import { getSupabaseClient } from "./supabase"

export interface PaymentRecord {
  id: string
  name: string
  amount: number        // ✅ FIX: amount ONLY number
  branch: string
  screenshot: string
  timestamp: string
}

/* ================= OPTIMIZED CACHE ================= */
let cachedPayments: PaymentRecord[] = []
let cacheTimestamp: number = 0
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes cache

/* ================= GET ================= */
export async function getPayments(): Promise<PaymentRecord[]> {
  const now = Date.now()

  // ✅ return cache if valid
  if (cachedPayments.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    console.log("📦 Returning cached payments")
    return cachedPayments
  }

  const supabase = getSupabaseClient()

  try {
    console.time("SupabaseQuery")

    const { data, error } = await supabase
      .from("payments")
      .select("id, name, amount, branch, screenshot_url, created_at")
      .order("created_at", { ascending: false })
      .limit(1000)

    console.timeEnd("SupabaseQuery")

    if (error) {
      console.error("Database error:", error.message)
      return cachedPayments.length > 0 ? cachedPayments : []
    }

    // 🔥 FIX #1: amount ko yahin NUMBER me convert kiya
    const payments: PaymentRecord[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name || "",
      amount: Number(row.amount) || 0,   // ✅ FIX: string → number
      branch: row.branch || "",
      screenshot: row.screenshot_url || "",
      timestamp: row.created_at || new Date().toISOString(),
    }))

    cachedPayments = payments
    cacheTimestamp = now

    console.log(`✅ Loaded ${payments.length} payments`)
    return payments
  } catch (error) {
    console.error("Unexpected error:", error)
    return cachedPayments.length > 0 ? cachedPayments : []
  }
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
      amount: payment.amount,   // ✅ already number
      branch: payment.branch,
      screenshot_url: payment.screenshot,
    })
    .select("id, name, amount, branch, screenshot_url, created_at")
    .single()

  if (error || !data) {
    console.error("Add payment error:", error)
    throw new Error("Add payment failed: " + (error?.message || "Unknown error"))
  }

  // 🔥 FIX #2: yahan bhi amount NUMBER hi rakha
  const newPayment: PaymentRecord = {
    id: data.id,
    name: data.name,
    amount: Number(data.amount) || 0,   // ✅ FIX
    branch: data.branch,
    screenshot: data.screenshot_url || "",
    timestamp: data.created_at,
  }

  // ✅ update cache instantly
  cachedPayments = [newPayment, ...cachedPayments]
  cacheTimestamp = Date.now()

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
  if (updates.amount !== undefined) updateData.amount = updates.amount // ✅ already number
  if (updates.branch !== undefined) updateData.branch = updates.branch
  if (updates.screenshot !== undefined)
    updateData.screenshot_url = updates.screenshot

  const { error } = await supabase
    .from("payments")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("Update error:", error)
    throw new Error("Update failed: " + error.message)
  }

  // 🔥 FIX #3: cache update type-safe
  cachedPayments = cachedPayments.map(p =>
    p.id === id ? { ...p, ...updates } as PaymentRecord : p
  )
  cacheTimestamp = Date.now()

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
    throw new Error("Delete failed: " + error.message)
  }

  cachedPayments = cachedPayments.filter(p => p.id !== id)
  cacheTimestamp = Date.now()

  return true
}

/* ================= CLEAR CACHE ================= */
export function clearCache(): void {
  cachedPayments = []
  cacheTimestamp = 0
  console.log("🗑️ Payment cache cleared")
}
