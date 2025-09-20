# Prueba Técnica Full-Stack - Medusa + Next.js

Este repositorio contiene la solución a una prueba técnica realizada como parte de un proceso de selección laboral de MyUrbanScoot.

## Descripción

El objetivo de este proyecto es demostrar habilidades técnicas y buenas prácticas de desarrollo según los requerimientos especificados en la oferta laboral.

## Tarea 1: Extensión del Modelo de Producto

En esta tarea se ha extendido el Modelo de Producto base que incluye Medusa.
Para ello se ha creado el fichero `mi-prueba-tecnica/src/modules/custom/models/custom.ts` el cual va a contener las propiedades que añadimos al modelo.

1. Creamos el Modulo Custom
2. Creamos el Modelo Custom

```ts
import { model } from "@medusajs/framework/utils"

const Custom = model.define("custom", {
  id: model.id().primaryKey(),
  is_custom: model.boolean(),
  custom_notes: model.text(),
})

export default Custom;
```

3. Generamos el link
4. Generamos y corremos la migración
```bash
npx medusa db:generate custom
npx medusa db:migrate
```

Esto nos crea en la base de datos la tabla `product_product_custom_custom`

5. Creamos el **middleware**. En el vamos a poder modificar los datos que esperamos recibir en cada ruta. En este caso se añade:
```ts
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
```
6. Creamos el workflow y los pasos
7. Creamos el index del workflow
8. Usamos el hook de `product-created` para realizar la inserción del elemento custom y linkearlo.
9. Realizamos las pruebas desde **Postman**. Generamos una llamada POST donde le pasemos `additional_data` con los campos que creamos. Y luego realizamos una llamada GET para obtener el producto recien creado y ver si nos devuelve el contenido de la tabla `custom` con la relación.

**Llamada POST:**
![Llamada POST](images/tarea1-POST.png)
**Llamada GET:**
![Llamada GET-1](images/tarea1-GET1.png)
![Llamada GET-2](images/tarea1-GET2.png)

## Tarea 2: Widget en Medusa Admin

En esta tarea añadiremos un widget al panel de administrador de Medusa para controlar los campos creados en la tarea anterior.

Actualmente el panel se muestra de esta forma:

![Panel Admin Inicial](images/tarea2-inicio.png)

Para empezar a crear nuestro widget será necesario crear el fichero `mi-prueba-tecnica/src/admin/widgets/custom-widget.tsx`.

En el export default de esta página será donde se situara el elemento React de nuestro widget. En las opciones, indicaremos la zona. En este caso al ser un widget para los detalles del producto lo situaremos en `product.details.before`. Además lo dibujaremos en la parte superior de la página para tenerlo más a la vista.

![Panel Admin Widget Generado](images/tarea2-widget_generado.png)

Ya tenemos el widget en el panel, ahora hay que hacer que realice las funciones que queremos.
Para ello, los widgets reciben un objeto por props de `data`, primero es necesario ver el contenido de este objeto.

En nuestro widget realizamos el siguiente `console.log()`:
```tsx
const ProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  console.log("Product data in widget:", data)
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Widget Generado</Heading>
      </div>
    </Container>
  )
}
```
Pero como se puede observar, los datos custom no llegan en esta `data`:
![Panel Admin Widget Data Log](images/tarea2-data_log.png)

Para ello necesitamos primero crear el sdk, con él podemos lanzar solicitudes al servidor de Medusa.
Creamos el fichero `mi-prueba-tecnica/src/admin/lib/sdk.ts` con el siguiente contenido:

```ts
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})
```

Finalmente, realizamos la solicitud en nuestro widget:

```ts
const { data: queryResult } = useQuery({
  queryFn: () => sdk.admin.product.retrieve(data.id, {
    fields: "+custom.*",
  }),
  queryKey: [["product", data.id]],
})
```

Ahora si, si mostramos el resultado de la query por consola, podemos observar como si que se obtiene el campo `custom` relacionado.

![Panel Admin Widget Custom Log](images/tarea2-widget_custom.png)

Añadimos al widget un botón para guardar la información, y realizamos la llamada correspondiente.

```ts
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
```

y para ello se ha creado la API route:

```ts
// mi-prueba-tecnica/src/api/admin/custom/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import CustomModuleService from "../../../../modules/custom/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const customService: CustomModuleService = req.scope.resolve("custom")

  const updated = await customService.updateCustom(id, req.body)

  res.json({ custom: updated })
}
```

y se ha añadido la función en el service:

```ts
// mi-prueba-tecnica/src/modules/custom/service.ts
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
```