"use client";

import clsx from 'clsx';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Iconos de ojo

import { login, registerUser } from '@/actions';

type FormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string; // Campo para repetir la contraseña
}

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar visibilidad de la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para controlar visibilidad de la confirmación
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage('');

    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    const { name, email, password } = data;

    // Server action
    const resp = await registerUser(name, email, password);

    if (!resp.ok) {
      setErrorMessage(resp.message);
      return;
    }

    await login(email.toLowerCase(), password);
    window.location.replace('/');
  };

  // Obtenemos el valor actual de la contraseña para verificarla
  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

      <label htmlFor="name">Nombre completo</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          'border-red-500': errors.name
        })}
        type="text"
        autoFocus
        {...register('name', {
          required: 'El nombre es obligatorio',
          pattern: {
            value: /^[A-Za-z\s]+$/, // Solo permite letras y espacios
            message: 'El nombre solo puede contener letras',
          }
        })}
      />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}

      <label htmlFor="email">Correo electrónico</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          'border-red-500': errors.email
        })}
        type="email"
        {...register('email', {
          required: 'El correo es obligatorio',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'El correo debe ser válido',
          }
        })}
      />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <label htmlFor="password">Contraseña</label>
      <div className="relative">
        <input
          className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5 w-full", {
            'border-red-500': errors.password
          })}
          type={showPassword ? "text" : "password"} // Cambiar el tipo de input según el estado
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, // Al menos una letra y un número
              message: 'La contraseña debe tener al menos una letra y un número',
            },
          })}
        />
        <button
          type="button"
          className="absolute right-3 top-3"
          onClick={() => setShowPassword(!showPassword)} // Alternar la visibilidad
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icono de ojo */}
        </button>
      </div>
      {errors.password && <span className="text-red-500">{errors.password.message}</span>}

      <label htmlFor="confirmPassword">Repetir Contraseña</label>
      <div className="relative">
        <input
          className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5 w-full", {
            'border-red-500': errors.confirmPassword
          })}
          type={showConfirmPassword ? "text" : "password"} // Cambiar el tipo de input según el estado
          {...register('confirmPassword', {
            required: 'Debe repetir la contraseña',
            validate: (value) => value === password || 'Las contraseñas no coinciden',
          })}
        />
        <button
          type="button"
          className="absolute right-3 top-3"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Alternar la visibilidad
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Icono de ojo */}
        </button>
      </div>
      {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}

      <span className="text-red-500">{errorMessage}</span>

      <button className="btn-primary">Crear cuenta</button>

      {/* divisor línea */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};
