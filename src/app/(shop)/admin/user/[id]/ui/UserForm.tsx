"use client";

import clsx from 'clsx';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { login, registerUser, updateUser } from '@/actions'; // Importa ambas funciones
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Iconos de ojo


type UserFormInputs = {
  id?: string; // Opcional para saber si estamos actualizando
  name: string;
  email: string;
  role: "admin" | "user";
  password: string;
  confirmPassword: string; // Campo para repetir la contraseña
}

interface Props {
  user: Partial<UserFormInputs>; // Puede ser un usuario vacío si es creación
}

export const UserForm = ({ user }: Props) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar visibilidad de la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para controlar visibilidad de la confirmación
  const { register, handleSubmit, watch, formState: { errors } } = useForm<UserFormInputs>({
    defaultValues: {
      ...user,
      password: '',
      confirmPassword: '',
    },
  });
  const [editPassword, setEditPassword] = useState(false); // Controla el checkbox para habilitar los campos de contraseña


  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    setErrorMessage('');

    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    let response;

    // Si el usuario ya tiene un ID, significa que es una actualización
    if (user.id) {
      response = await updateUser(user.id, data.name, data.email, data.role, data.password);
    } else {
      response = await registerUser(data.name, data.email, data.password);
    }

    if (!response.ok) {
      // Si algo sale mal, mostrar el mensaje de error
      setErrorMessage(response.message || 'No se pudo guardar el usuario');
      return;
    }

    // Si todo sale bien, redirigir a la lista de usuarios
    window.location.replace(`/admin/users`);
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
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />
      {errors.email && <span className="text-red-500">El correo es obligatorio y debe ser válido</span>}

      <label htmlFor="role">Rol</label>
      <select
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        {...register('role', { required: true })}
      >
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2"
          checked={editPassword}
          onChange={() => setEditPassword(!editPassword)} // Alternar la habilitación de los campos de contraseña
        />
        Editar contraseña
      </label>

      <label htmlFor="password">Contraseña</label>
      <div className="relative">
        <input
          className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5 w-full", {
            'border-red-500': errors.password
          })}
          type={showPassword ? "text" : "password"}
          disabled={!editPassword} // Deshabilitar si no se está editando la contraseña
          {...register('password', {
            required: editPassword ? 'La contraseña es obligatoria' : false, // Solo obligatorio si se habilitó la edición
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              message: 'La contraseña debe tener al menos una letra y un número',
            },
          })}
        />
        <button
          type="button"
          className="absolute right-3 top-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors.password && <span className="text-red-500">{errors.password.message}</span>}

      <label htmlFor="confirmPassword">Repetir Contraseña</label>
      <div className="relative">
        <input
          className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5 w-full", {
            'border-red-500': errors.confirmPassword
          })}
          type={showConfirmPassword ? "text" : "password"}
          disabled={!editPassword} // Deshabilitar si no se está editando la contraseña
          {...register('confirmPassword', {
            required: editPassword ? 'Debe repetir la contraseña' : false, // Solo obligatorio si se habilitó la edición
            validate: editPassword ? (value) => value === password || 'Las contraseñas no coinciden' : undefined,
          })}
        />
        <button
          type="button"
          className="absolute right-3 top-3"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}


      <span className="text-red-500">{errorMessage}</span>

      <button type="submit" className="btn-primary">Guardar</button>

      {/* Enlace para regresar a la lista de usuarios */}
      <Link href="/admin/users" className="text-center mt-4">Regresar a la lista de usuarios</Link>
    </form>
  );
};
