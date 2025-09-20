import { MedusaService } from "@medusajs/framework/utils"
import { AbstractEventBusModuleService } from "@medusajs/framework/utils"
import { Message } from "@medusajs/types"
import Custom from "./models/custom"

class CustomModuleService extends MedusaService({
  Custom,
}) {
  private eventBusService_: AbstractEventBusModuleService
  protected groupedEventsMap_: Map<string, Message[]>

  constructor({ event_bus }) {
    // @ts-ignore
    super(...arguments)

    this.groupedEventsMap_ = new Map()
    this.eventBusService_ = event_bus
  }

  async emit<T>(data: Message<T> | Message<T>[], options: Record<string, unknown>): Promise<void> {
    const events = Array.isArray(data) ? data : [data]

    for (const event of events) {
      console.log(`[Service Custom]Received the event ${event.name} with data ${event.data}`)

      if (event.metadata?.eventGroupId) {
        const groupedEvents = this.groupedEventsMap_.get(
          event.metadata.eventGroupId
        ) || []

        groupedEvents.push(event)

        this.groupedEventsMap_.set(event.metadata.eventGroupId, groupedEvents)
        continue
      }


      await this.eventBusService_.emit(event, options)
    }
  }


  async updateCustom(id: string, data: any) {
    const customs = this.updateCustoms([
      {
        id,
        ...data,
      },
    ])

    this.emit({ name: "product.custom_changed", data: { id } }, { customs })

  }
}

export default CustomModuleService