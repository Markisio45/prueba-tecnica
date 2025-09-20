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