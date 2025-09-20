import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useState, useEffect } from "react"
// import { useMedusa } from "medusa-react"
import { Container, Heading, Checkbox, Label, Textarea, Button } from "@medusajs/ui"
import { ActionMenu } from "../components/action-menu"
import { Pencil } from "@medusajs/icons"
import { Toaster, toast } from "@medusajs/ui"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"
import {
  DetailWidgetProps,
  AdminProduct,
} from "@medusajs/framework/types"

type AdminProductCustom = AdminProduct & {
  custom?: {
    id: string
    is_custom: boolean,
    custom_notes: string,
  }
}

type WidgetPropsWithNotify = DetailWidgetProps<AdminProduct> & {
  notify: {
    success: (msg: string) => void
    error: (msg: string) => void
    info: (msg: string) => void
  }
}


const ProductWidget = ({ data, notify }: WidgetPropsWithNotify) => {
  console.log("Product data in widget:", data)
  console.log("notify in widget:", notify)

  const queryClient = useQueryClient()

  const [isCustom, setIsCustom] = useState(false)
  const [customNotes, setCustomNotes] = useState("")

  const { data: queryResult } = useQuery({
    queryFn: () => sdk.admin.product.retrieve(data.id, {
      fields: "+custom.*",
    }),
    queryKey: [["product", data.id]],
  })
  console.log("Query result:", queryResult)
  const customData = (queryResult?.product as AdminProductCustom)?.custom

  useEffect(() => {
    if (customData) {
      setIsCustom(customData.is_custom || false)
      setCustomNotes(customData.custom_notes || "")
    }
  }, [customData])

  console.log("customData:", customData)

  const { mutate: saveCustom } = useMutation({
    mutationFn: async () => {
      if (!customData?.id) return
      return sdk.client.fetch(`/admin/custom/${customData.id}`, {
        method: "POST",
        body: {
          is_custom: isCustom,
          custom_notes: customNotes,
        },
      })
    },
    onSuccess: () => {
      toast.success("Success!", {
        description: "Custom actualizado correctamente",
      })

      queryClient.invalidateQueries({ queryKey: [["product", data.id]] })
    },
    onError: () => {
      toast.error("Error!", {
        description: "Error al actualizar el custom",
      })
    },
  })


  return (
    <Container className="divide-y p-0">
      <Toaster position="top-right" />
      <div className="flex flex-row items-start justify-between px-6 py-4">
        <Heading level="h2">Widget Generado</Heading>
        <Button onClick={() => { saveCustom() }}>Save</Button>
        {/* <ActionMenu groups={[
          {
            actions: [
              {
                icon: <Pencil />,
                label: "Edit",
                onClick: () => {
                  alert("You clicked the edit action!")
                },
              },
            ],
          },
        ]} /> */}
      </div>
      <div className="flex items-center gap-5 px-6 py-4">
        <Label htmlFor="default">Is Custom?</Label>
        <Checkbox id="default" checked={isCustom} onClick={() => setIsCustom(!isCustom)} />
      </div>
      <div className="flex items-center gap-5 px-6 py-4">
        <Label htmlFor="default">Custom Notes</Label>
        <Textarea placeholder="Custom notes..." value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} />
      </div>
    </Container >
  )
}

export const config = defineWidgetConfig({
  zone: ["product.details.before"],
})

export default ProductWidget