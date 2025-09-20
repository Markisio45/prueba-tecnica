import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { ProductDTO } from "@medusajs/framework/types"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { CUSTOM_MODULE } from "../../modules/custom"
import { createCustomStep } from "./steps/create-custom"

export type CreateCustomFromProductWorkflowInput = {
  product: ProductDTO
  additional_data?: {
    is_custom?: boolean,
    custom_notes?: string,
  }
}

export const createCustomFromProductWorkflow = createWorkflow(
  "create-custom-from-product",
  (input: CreateCustomFromProductWorkflowInput) => {

    console.log("Workflow input:", input)

    const isCustom = transform(
      {
        input,
      },
      (data) => data.input.additional_data?.is_custom || false
    )

    const customNotes = transform(
      {
        input,
      },
      (data) => data.input.additional_data?.custom_notes || ""
    )

    const custom = createCustomStep({
      is_custom: isCustom,
      custom_notes: customNotes,
    })

    when(({ custom }), ({ custom }) => custom !== undefined)
      .then(() => {
        createRemoteLinkStep([{
          [Modules.PRODUCT]: {
            product_id: input.product.id,
          },
          [CUSTOM_MODULE]: {
            custom_id: custom.id,
          },
        }])
      })

    return new WorkflowResponse({
      custom,
    })
  }
)