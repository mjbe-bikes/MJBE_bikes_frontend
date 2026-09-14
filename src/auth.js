// Estado de sesión compartido y reactivo (localStorage + suscriptores)

const listeners = new Set()

// Claves que forman la sesión
const CLAVES_SESION = [
  "mjbe_auth",
  "mjbe_user_id",
  "mjbe_user_login",
  "mjbe_user_email",
  "mjbe_rol_id",
  "mjbe_role",
  "mjbe_user",
]

// Al arrancar la app (recarga completa de la página) NO se restaura la sesión
// anterior: siempre se empieza en el login. Este módulo se evalúa una sola vez
// por carga de página; las ediciones con HMR de componentes no lo re-ejecutan.
CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave))

let snapshot = readSnapshot()

function readSnapshot() {
  return {
    isLoggedIn: localStorage.getItem("mjbe_auth") === "true",
    rolId: Number(localStorage.getItem("mjbe_rol_id") || 0),
  }
}

// Recalcula el snapshot y, si CAMBIÓ, avisa a los suscriptores.
function notify() {
  const next = readSnapshot()
  // useSyncExternalStore exige devolver la MISMA referencia si nada cambió,
  // si no, entra en bucle de renders.
  if (next.isLoggedIn === snapshot.isLoggedIn && next.rolId === snapshot.rolId) {
    return
  }
  snapshot = next
  listeners.forEach((listener) => listener())   // -> App.jsx se re-renderiza
}

// Devuelve el objeto de estado actual (App.jsx lo pasa a useSyncExternalStore)
export function getAuthSnapshot() {
  return snapshot
}

// Registra un listener y devuelve la función para des-suscribirse
export function subscribeAuth(listener) {
  listeners.add(listener)
  // "storage" salta cuando OTRA pestaña cambia localStorage -> sincroniza pestañas
  window.addEventListener("storage", notify)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", notify)
  }
}

// Guarda la sesión tras un login correcto. `user` viene de Login.jsx.
export function saveSession(user) {
  localStorage.setItem("mjbe_auth", "true")
  localStorage.setItem("mjbe_user_id", String(user.id))
  localStorage.setItem("mjbe_user_login", user.login)
  localStorage.setItem("mjbe_user_email", user.email)
  localStorage.setItem("mjbe_rol_id", String(user.rolId))
  notify()
}

export function clearSession() {
  CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave))
  notify()
}
