import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import CustomModuleService from "../../../modules/custom/service"
import { CUSTOM_MODULE } from "../../../modules/custom"

type CreateCustomStepInput = {
  is_custom?: boolean;
  custom_notes?: string;
}

export const createCustomStep = createStep(
  "create-custom",
  async (data: CreateCustomStepInput, { container }) => {
    console.log("CreateCustomStep input data:", data)
    if (!data.is_custom) {
      return
    }

    const customModuleService: CustomModuleService = container.resolve(
      CUSTOM_MODULE
    )

    const custom = await customModuleService.createCustoms(data)
    console.log("Custom created:", custom)

    return new StepResponse(custom, custom) // Fails here
  },
  async (custom, { container }) => {
    const customModuleService: CustomModuleService = container.resolve(
      CUSTOM_MODULE
    )

    if (!custom) {
      return
    }

    await customModuleService.deleteCustoms(custom.id)
  }
)