function FooterAdmi() {
  const userName =
    localStorage.getItem("mjbe_user_login") ||
    localStorage.getItem("mjbe_user") ||
    "Nombre Empleado"

  const roleLabels = {
    1: "Administrador",
    2: "Empleado",
    3: "Bodeguero",
    4: "Cliente"
  }

  const storedRole = localStorage.getItem("mjbe_role")
  const storedRoleId = localStorage.getItem("mjbe_rol_id")

  const role = storedRole ||
    (storedRoleId ? roleLabels[Number(storedRoleId)] || `Rol ${storedRoleId}` : "Cargo")

  return (
    <div className="card footer">
      <div className="card-body">
        <figure>
          <blockquote className="blockquote">
            <p>{role}</p>
          </blockquote>
          <figcaption className="blockquote-footer">
            {userName} <cite title="Source Title">MJBE Bikes</cite>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}
export default FooterAdmi