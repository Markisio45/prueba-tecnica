import {
  type SubscriberConfig, type SubscriberArgs
} from "@medusajs/framework"

// subscriber function
export default async function customChangedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  console.log("[SUBSCRIBER] A product's custom data was changed")
  const productId = data.id

  const customModuleService = container.resolve("custom")

  const custom = await customModuleService.retrieveCustom(productId)

  console.log(`[SUBSCRIBER]The custom ${custom.id} was modified!`)
}

// subscriber config
export const config: SubscriberConfig = {
  event: "product.custom_changed",
}