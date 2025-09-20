import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import {
  createCustomFromProductWorkflow,
  CreateCustomFromProductWorkflowInput,
} from "../create-custom-from-product"

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    const workflow = createCustomFromProductWorkflow(container)

    console.log("Products created hook triggered")

    for (const product of products) {
      console.log("Processing product: ", product)
      console.log("Additional data:", additional_data)
      await workflow.run({
        input: {
          product,
          additional_data,
        } as CreateCustomFromProductWorkflowInput,
      })
    }

    console.log("Workflow execution completed")
  }
)