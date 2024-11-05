"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import type { Address, Country } from '@/interfaces';
import { useAddressStore } from '@/store';
import { deleteUserAddress, setUserAddress } from '@/actions';

type FormInputs = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
}

interface Props {
  countries: Country[];
  userStoredAddress?: Partial<Address>;
}

export const AddressForm = ({ countries, userStoredAddress = {} }: Props) => {
  const router = useRouter();
  
  // Enable real-time validation with `mode: 'onChange'`
  const { handleSubmit, register, formState: { errors, isValid }, reset } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      ...(userStoredAddress as any),
      rememberAddress: false,
    }
  });

  const { data: session } = useSession({
    required: true,
  });

  const setAddress = useAddressStore(state => state.setAddress);
  const address = useAddressStore(state => state.address);

  useEffect(() => {
    if (address.firstName) {
      reset(address);
    }
  }, [address, reset]);

  const onSubmit = async (data: FormInputs) => {
    const { rememberAddress, ...restAddress } = data;

    setAddress(restAddress);

    if (rememberAddress) {
      await setUserAddress(restAddress, session!.user.id);
    } else {
      await deleteUserAddress(session!.user.id);
    }

    router.push('/checkout');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
      <div className="flex flex-col mb-2">
        <span>Nombres</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register('firstName', {
            required: "El nombre es obligatorio",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Solo se permiten letras y espacios en el nombre",
            },
          })}
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register('lastName', {
            required: "El apellido es obligatorio",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Solo se permiten letras y espacios en el apellido",
            },
          })}
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register('address', {
            required: "La dirección es obligatoria",
          })}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección 2 (opcional)</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register('address2')}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Código postal</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register('postalCode', {
            required: "El código postal es obligatorio",
          })}
        />
        {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
      </div>

      <div className="flex flex-col mb-2">
        <span>Ciudad</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register('city', {
            required: "La ciudad es obligatoria",
          })}
        />
        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
      </div>

      <div className="flex flex-col mb-2">
        <span>País</span>
        <select
          className="p-2 border rounded-md bg-gray-200"
          {...register('country', {
            required: "El país es obligatorio",
          })}
        >
          <option value="">[ Seleccione ]</option>
          {countries.map(country => (
            <option key={country.id} value={country.id}>{country.name}</option>
          ))}
        </select>
        {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
      </div>

      <div className="flex flex-col mb-2">
        <span>Teléfono</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register('phone', {
            required: "El teléfono es obligatorio",
            pattern: {
              value: /^[\d+]+$/,
              message: "Solo se permiten números y el símbolo '+' en el teléfono",
            },
          })}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      <button
        disabled={!isValid}
        type="submit"
        className={clsx({
          'btn-primary': isValid,
          'btn-disabled': !isValid,
        })}
      >
        Siguiente
      </button>
    </form>
  );
};
