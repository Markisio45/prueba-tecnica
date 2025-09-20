"use client";

type ProductCustomProps = {
  custom: {
    is_custom: boolean
    custom_notes?: string
    [key: string]: any
  } | null
}

export default function ProductCustom({ custom }: ProductCustomProps) {
  if (!custom?.is_custom) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-md p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Custom Product Details</h2>
      <p>{custom.custom_notes || "N/A"}</p>
    </div>
  )
}