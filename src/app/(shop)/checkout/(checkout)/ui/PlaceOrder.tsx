"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { getAllDiscount, placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';

export const PlaceOrder = () => {

  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

  const [discountCode, setDiscountCode] = useState(""); // Código ingresado
  const [discountPercentage, setDiscountPercentage] = useState(0); // % de descuento
  const [discountError, setDiscountError] = useState(""); // Error al aplicar código
  const [discountCodeId, setDiscountCodeId] = useState(""); // ID del código de descuento


  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
  
    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));
  
    //! Server Action
    const resp = await placeOrder(productsToOrder, address, discountCodeId);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }
  
    //* Todo salió bien!
    clearCart();
    router.replace('/orders/' + resp.order?.id);
  };

  const handleApplyDiscount = async () => {
    setDiscountError("");
  
    // Obtener los descuentos desde la base de datos
    const response = await getAllDiscount();
  
    if (!response.ok) {
      setDiscountError("Error al obtener los descuentos");
      return;
    }
  
    const discountList = response.users; // Lista de códigos de descuento
  
    // Buscar si el código ingresado existe
    const discountFound = discountList.find(
      (discount) => discount.code === discountCode
    );
  
    if (discountFound) {
      setDiscountPercentage(discountFound.discountAmount); // Guardar % de descuento
      setDiscountCodeId(discountFound.id); // Guardar ID del código de descuento
    } else {
      setDiscountError("Código de descuento no válido");
    }
  };

  // Calcular descuento basado en el subtotal
  const discountAmount = (discountPercentage / 100) * subTotal;

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">

        {/* Código de descuento */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-6">
          <input
            placeholder="Ingresar código"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md w-full"
            onClick={handleApplyDiscount}
          >
            Aplicar Descuento
          </button>
        </div>
        {discountError && <p className="text-red-500 mt-2">{discountError}</p>}
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span>Descuento ({discountPercentage}%)</span>
        <span className="text-right">
          {discountPercentage > 0 ? `-${currencyFormat(discountAmount)}` : "No aplicado"}
        </span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total - discountAmount)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{" "}
            <a href="#" className="underline">
              términos y condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              política de privacidad
            </a>
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>

        <button
          onClick={onPlaceOrder}
          className={clsx({
            'btn-primary': !isPlacingOrder,
            'btn-disabled': isPlacingOrder
          })}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
