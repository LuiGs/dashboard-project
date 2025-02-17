"use client"

import type { User } from "@/interfaces/user.interface"
import clsx from "clsx"
import { type SubmitHandler, useForm } from "react-hook-form"
import { updateUser, registerUser } from "@/actions"
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

type UserFormInputs = Omit<User, "id" | "emailVerified"> & {
  confirmPassword: string
  role: "user" | "admin"
}

interface Props {
  user: Partial<User>
  onClose: () => void
}

export const UserForm = ({ user, onClose }: Props) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormInputs>({
    defaultValues: {
      ...user,
      role: user.role as "user" | "admin" | undefined,
      password: "",
      confirmPassword: "",
    },
  })
  const [editPassword, setEditPassword] = useState(!user.id)

  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    setErrorMessage("")

    if (editPassword && data.password !== data.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden")
      return
    }

    let response

    if (user.id) {
      response = await updateUser(user.id, data.name, data.email, data.role, editPassword ? data.password : undefined)
    } else {
      response = await registerUser(data.name, data.email, data.password)
    }

    if (!response.ok) {
      setErrorMessage(response.message || "No se pudo guardar el usuario")
      return
    }

    onClose()
  }

  const password = watch("password")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="name">Nombre completo</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          "border-red-500": errors.name,
        })}
        type="text"
        autoFocus
        {...register("name", {
          required: "El nombre es obligatorio",
          pattern: {
            value: /^[A-Za-z\s]+$/,
            message: "El nombre solo puede contener letras",
          },
        })}
      />
      {errors.name && <span className="text-red-500">{errors.name.message}</span>}

      <label htmlFor="email">Correo electrónico</label>
      <input
        className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
          "border-red-500": errors.email,
        })}
        type="email"
        {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
      />
      {errors.email && <span className="text-red-500">El correo es obligatorio y debe ser válido</span>}

      <label htmlFor="role">Rol</label>
      <select className="px-5 py-2 border bg-gray-200 rounded mb-5" {...register("role", { required: true })}>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>

      {user.id && (
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={editPassword}
            onChange={() => setEditPassword(!editPassword)}
          />
          Editar contraseña
        </label>
      )}

      <label htmlFor="password">Contraseña</label>
      <div className="relative">
        <input
          className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5 w-full", {
            "border-red-500": errors.password,
          })}
          type={showPassword ? "text" : "password"}
          disabled={!!user.id && !editPassword}
          {...register("password", {
            required: !user.id || editPassword ? "La contraseña es obligatoria" : false,
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
            pattern: {
              value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              message: "La contraseña debe tener al menos una letra y un número",
            },
          })}
        />
        <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {errors.password && <span className="text-red-500">{errors.password.message}</span>}

      <label htmlFor="confirmPassword">Repetir Contraseña</label>
      <div className="relative">
        <input
          className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5 w-full", {
            "border-red-500": errors.confirmPassword,
          })}
          type={showConfirmPassword ? "text" : "password"}
          disabled={!!user.id && !editPassword}
          {...register("confirmPassword", {
            required: !user.id || editPassword ? "Debe repetir la contraseña" : false,
            validate:
              !user.id || editPassword ? (value) => value === password || "Las contraseñas no coinciden" : undefined,
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

      <div className="flex justify-between mt-5">
        <button type="submit" className="btn-primary">
          Guardar
        </button>
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  )
}

