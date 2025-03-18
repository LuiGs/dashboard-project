"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DiscountCodeType } from "@prisma/client"
import { addDiscountCode, updateDiscountCode } from "@/actions/discountcodes"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface DiscountCodeFormInputs {
  id?: string
  code: string
  discountAmount: number
  discountType: DiscountCodeType
  limit?: number
  expiresAt?: string
  allProducts: boolean
  productIds?: string[]
}

export function DiscountCodeForm({
  discountCode,
  products = [],
  onClose,
}: {
  discountCode?: Partial<DiscountCodeFormInputs>
  products: { title: string; id: string }[]
  onClose: () => void
}) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DiscountCodeFormInputs>({
    defaultValues: {
      ...discountCode,
      allProducts: discountCode?.allProducts ?? true,
      expiresAt: discountCode?.expiresAt ? new Date(discountCode.expiresAt).toISOString().slice(0, 16) : undefined,
    },
  })
  const [allProducts, setAllProducts] = useState(discountCode?.allProducts ?? true)
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())

  const onSubmit: SubmitHandler<DiscountCodeFormInputs> = async (data) => {
    if (discountCode?.id) {
      await updateDiscountCode(discountCode.id, data)
    } else {
      await addDiscountCode(data)
    }
    onClose()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="code">Código</Label>
        <Input
          type="text"
          id="code"
          {...register("code", { required: "El código es obligatorio" })}
        />
        {errors.code && <div className="text-destructive">{errors.code.message}</div>}
      </div>
      <div className="space-y-2 gap-8 flex items-baseline">
        <div className="space-y-2">
          <Label htmlFor="discountType">Tipo de Descuento</Label>
          <RadioGroup
            id="discountType"
            {...register("discountType", { required: "El tipo de descuento es obligatorio" })}
            defaultValue={DiscountCodeType.PERCENTAGE}
          >
            <div className="flex gap-2 items-center">
              <RadioGroupItem
                id="percentage"
                value={DiscountCodeType.PERCENTAGE}
              />
              <Label htmlFor="percentage">Porcentaje</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem id="fixed" value={DiscountCodeType.FIXED} />
              <Label htmlFor="fixed">Fijo</Label>
            </div>
          </RadioGroup>
          {errors.discountType && (
            <div className="text-destructive">{errors.discountType.message}</div>
          )}
        </div>
        <div className="space-y-2 flex-grow">
          <Label htmlFor="discountAmount">Monto del Descuento</Label>
          <Input
            type="number"
            id="discountAmount"
            {...register("discountAmount", {
              required: "El monto del descuento es obligatorio",
              min: { value: 1, message: "El monto debe ser mayor a 0" },
            })}
          />
          {errors.discountAmount && (
            <div className="text-destructive">{errors.discountAmount.message}</div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="limit">Límite</Label>
        <Input
          type="number"
          id="limit"
          {...register("limit", {
            min: { value: 1, message: "El límite debe ser mayor a 0" },
          })}
        />
        <div className="text-muted-foreground">
          Dejar en blanco para usos infinitos
        </div>
        {errors.limit && <div className="text-destructive">{errors.limit.message}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expiración</Label>
        <Input
          type="datetime-local"
          id="expiresAt"
          {...register("expiresAt")}
          className="w-max"
          min={today.toJSON().split(":").slice(0, -1).join(":")}
        />
        <div className="text-muted-foreground">
          Dejar en blanco para sin expiración
        </div>
        {errors.expiresAt && (
          <div className="text-destructive">{errors.expiresAt.message}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label>Productos Permitidos</Label>
        {errors.allProducts && (
          <div className="text-destructive">{errors.allProducts.message}</div>
        )}
        {errors.productIds && (
          <div className="text-destructive">{errors.productIds.message}</div>
        )}
        <div className="flex gap-2 items-center">
          <Checkbox
            id="allProducts"
            {...register("allProducts")}
            checked={allProducts}
            onCheckedChange={e => setAllProducts(e === true)}
          />
          <Label htmlFor="allProducts">Todos los Productos</Label>
        </div>
        {!allProducts && products.map(product => (
          <div key={product.id} className="flex gap-2 items-center">
            <Checkbox
              id={product.id}
              {...register("productIds")}
              value={product.id}
            />
            <Label htmlFor={product.id}>{product.title}</Label>
          </div>
        ))}
      </div>
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  )
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Guardando..." : "Guardar"}
    </Button>
  )
}