import { defineMiddlewares } from "@medusajs/framework/http"
import { z } from "zod"

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/products",
      additionalDataValidator: {
        is_custom: z.boolean().optional(),
        custom_notes: z.string().optional(),
      },
    },
  ],
})