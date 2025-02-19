"use client"

import { useForm } from "react-hook-form"
import type { Product, Size, Category } from "@/interfaces/product.interface"
import clsx from "clsx"
import { createUpdateProduct, deleteProductImage } from "@/actions"
import { ProductImage as ProductImageComponent } from "@/components"

interface Props {
  product: Partial<Product & { ProductImage?: { url: string }[] }>
  categories: Category[]
  onClose: () => void
}

const sizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

interface FormInputs extends Omit<Product, "images"> {
  images?: FileList
}

export const ProductForm = ({ product, categories, onClose }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags,
      sizes: product.sizes ?? [],
      images: undefined,
    },
  })

  watch("sizes")

  const onSizeChanged = (size: Size) => {
    const sizes = new Set(getValues("sizes"))
    sizes.has(size) ? sizes.delete(size) : sizes.add(size)
    setValue("sizes", Array.from(sizes) as Size[])
  }

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    const { images, ...productToSave } = data

    if (product.id) {
      formData.append("id", product.id)
    }

    formData.append("title", productToSave.title)
    formData.append("slug", productToSave.slug)
    formData.append("description", productToSave.description)
    formData.append("price", productToSave.price.toString())
    formData.append("inStock", productToSave.inStock.toString())
    formData.append("sizes", productToSave.sizes.join(","))
    formData.append("tags", productToSave.tags.join(","))
    formData.append("gender", productToSave.gender)

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i])
      }
    }

    const { ok, product: updatedProduct } = await createUpdateProduct(formData)

    if (!ok) {
      alert("Producto no se pudo actualizar")
      return
    }

    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register("title", { required: true })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register("slug", { required: true })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Precio</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register("tags", { required: true })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Género</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register("gender", { required: true })}>
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => onSizeChanged(size)}
                className={clsx("p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center", {
                  "bg-blue-500 text-white": getValues("sizes").includes(size),
                })}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col mb-2">
          <span>Fotos</span>
          <input
            type="file"
            {...register("images")}
            multiple
            className="p-2 border rounded-md bg-gray-200"
            accept="image/png, image/jpeg, image/avif"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {product.images?.map((image, index) => (
            <div key={index}>
              <ProductImageComponent
                alt={product.title ?? ""}
                src={image}
                width={300}
                height={300}
                className="rounded-t shadow-md"
              />
              <button
                type="button"
                onClick={() => deleteProductImage(Number(product.id), image)}
                className="btn-danger w-full rounded-b-xl"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <button type="submit" className="btn-primary ">
          Guardar
        </button>
        <button type="button" className="btn-primary " onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

