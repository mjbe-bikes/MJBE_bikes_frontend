function FooterBodega() {
    const userName = typeof window !== "undefined"
        ? localStorage.getItem("mjbe_user_login") || "Empleado"
        : "Empleado";

    return (
        <div className="card footer">
            <div className="card-body">
                <figure>
                    <blockquote className="blockquote">
                        <p>Cargo</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        Nombre Empleado <cite title="Source Title">{userName}</cite>
                    </figcaption>
                </figure>
            </div>
        </div>
    );
}

export default FooterBodega