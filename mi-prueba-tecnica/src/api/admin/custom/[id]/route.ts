import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CustomModuleService from "../../../../modules/custom/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const customService: CustomModuleService = req.scope.resolve("custom")

  const updated = await customService.updateCustom(id, req.body)

  res.json({ custom: updated })
}