function FooterLogin() {
  return (
    <footer className="footer bg-dark text-white py-4">
      <div className="container text-center">
        <p className="mb-1">MJBE Bikes © {new Date().getFullYear()}</p>
        <small>Acceso seguro con correo y contraseña.</small>
      </div>
    </footer>
  );
}

export default FooterLogin;
