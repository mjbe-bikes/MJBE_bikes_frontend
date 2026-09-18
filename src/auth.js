// ==========================================================
// ESTADO DE SESIÓN COMPARTIDO Y REACTIVO
// ==========================================================
// Este archivo controla:
// - Si el usuario está autenticado.
// - Qué rol tiene.
// - La actualización reactiva de App.jsx.
// - El cierre de sesión.
//
// IMPORTANTE:
// La sesión NO se borra durante una navegación interna de React.
// Solo se limpia cuando realmente se carga nuevamente la aplicación.
// ==========================================================

const listeners = new Set()

// ==========================================================
// CLAVES DE LA SESIÓN
// ==========================================================

const CLAVES_SESION = [
  "mjbe_auth",
  "mjbe_user_id",
  "mjbe_user_login",
  "mjbe_user_email",
  "mjbe_rol_id",
  "mjbe_role",
  "mjbe_user",
]

// ==========================================================
// LEER EL ESTADO ACTUAL
// ==========================================================

function readSnapshot() {
  return {
    isLoggedIn: localStorage.getItem("mjbe_auth") === "true",

    rolId: Number(
      localStorage.getItem("mjbe_rol_id") || 0
    ),
  }
}

// ==========================================================
// SNAPSHOT INICIAL
// ==========================================================
//
// IMPORTANTE:
// Ya NO borramos localStorage aquí.
//
// Hacer:
// CLAVES_SESION.forEach(...removeItem)
//
// directamente al cargar este módulo puede provocar que la
// sesión desaparezca inesperadamente durante el desarrollo
// con Vite/HMR.
//
// La sesión solamente se elimina mediante clearSession().
// ==========================================================

let snapshot = readSnapshot()

// ==========================================================
// NOTIFICAR CAMBIOS
// ==========================================================
//
// useSyncExternalStore necesita que el snapshot conserve la
// misma referencia cuando no hubo ningún cambio.
// ==========================================================

function notify() {
  const next = readSnapshot()

  if (
    next.isLoggedIn === snapshot.isLoggedIn &&
    next.rolId === snapshot.rolId
  ) {
    return
  }

  snapshot = next

  listeners.forEach((listener) => {
    listener()
  })
}

// ==========================================================
// OBTENER SNAPSHOT
// ==========================================================

export function getAuthSnapshot() {
  return snapshot
}

// ==========================================================
// SUSCRIBIR APP.JSX A LOS CAMBIOS
// ==========================================================

export function subscribeAuth(listener) {
  listeners.add(listener)

  // Escucha cambios realizados desde otra pestaña.
  const handleStorage = () => {
    notify()
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}

// ==========================================================
// GUARDAR SESIÓN
// ==========================================================

export function saveSession(user) {
  // Guardamos explícitamente todos los datos importantes.

  localStorage.setItem("mjbe_auth", "true")

  localStorage.setItem(
    "mjbe_user_id",
    String(user.id)
  )

  localStorage.setItem(
    "mjbe_user_login",
    String(user.login ?? "")
  )

  localStorage.setItem(
    "mjbe_user_email",
    String(user.email ?? "")
  )

  localStorage.setItem(
    "mjbe_rol_id",
    String(user.rolId)
  )

  // También guardamos el rol como texto si posteriormente
  // algún componente necesita utilizarlo.
  localStorage.setItem(
    "mjbe_role",
    String(user.rolId)
  )

  // Actualizamos inmediatamente el estado de React.
  notify()
}

// ==========================================================
// CERRAR SESIÓN
// ==========================================================

export function clearSession() {
  CLAVES_SESION.forEach((clave) => {
    localStorage.removeItem(clave)
  })

  // Actualizamos App.jsx inmediatamente.
  notify()
}

