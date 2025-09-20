import { MedusaService } from "@medusajs/framework/utils"
import Custom from "./models/custom"


class CustomModuleService extends MedusaService({
  Custom,
}) {

  async updateCustom(id: string, data: any) {
    return this.updateCustoms([
      {
        id,
        ...data,
      },
    ])
  }
}

export default CustomModuleService