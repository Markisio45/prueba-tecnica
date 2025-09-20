import { model } from "@medusajs/framework/utils"

const Custom = model.define("custom", {
  id: model.id().primaryKey(),
  is_custom: model.boolean(),
  custom_notes: model.text(),
})

export default Custom;