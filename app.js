// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://sadlhusazftpfbtulnyg.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_pOyPAO1e5UhHV1oHXqV7kA_U6go4DzV";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ==========================================
// VARIABLES
// ==========================================

let medicamentos = [];


// ==========================================
// ELEMENTOS HTML
// ==========================================

const vistaConsulta =
    document.getElementById("vistaConsulta");

const vistaAdmin =
    document.getElementById("vistaAdmin");

const btnLogin =
    document.getElementById("btnLogin");

const btnAdmin =
    document.getElementById("btnAdmin");

const btnLogout =
    document.getElementById("btnLogout");

const btnVolver =
    document.getElementById("btnVolver");

const btnCancelar =
    document.getElementById("btnCancelar");

const form =
    document.getElementById("formMedicamento");

const buscar =
    document.getElementById("buscador");

const listaMedicamentos =
    document.getElementById("listaMedicamentos");

const tablaMedicamentos =
    document.getElementById("tablaMedicamentos");

const sinResultados =
    document.getElementById("sinResultados");

const contador =
    document.getElementById("contador");

const tituloFormulario =
    document.getElementById("tituloFormulario");


// ==========================================
// ELEMENTOS LOGIN
// ==========================================

const modalLogin =
    document.getElementById("modalLogin");

const btnCerrarLogin =
    document.getElementById("btnCerrarLogin");

const formLogin =
    document.getElementById("formLogin");

const mensajeLogin =
    document.getElementById("mensajeLogin");


// ==========================================
// ELEMENTOS MODAL MEDICAMENTO
// ==========================================

const modalMedicamento =
    document.getElementById(
        "modalMedicamento"
    );

const btnCerrarMedicamento =
    document.getElementById(
        "btnCerrarMedicamento"
    );

const btnCerrarMedicamentoFooter =
    document.getElementById(
        "btnCerrarMedicamentoFooter"
    );

const modalMedicamentoHeader =
    document.getElementById(
        "modalMedicamentoHeader"
    );

const modalMedicamentoBody =
    document.getElementById(
        "modalMedicamentoBody"
    );


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    await cargarMedicamentos();

    renderizarConsulta();

    renderizarTabla();

    await verificarSesion();

}


// ==========================================
// VERIFICAR SESIÓN
// ==========================================

async function verificarSesion() {

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    actualizarInterfazSesion(
        session
    );

}


// ==========================================
// ACTUALIZAR INTERFAZ
// ==========================================

function actualizarInterfazSesion(
    session
) {

    if (session) {

        btnLogin.classList.add(
            "hidden"
        );

        btnAdmin.classList.remove(
            "hidden"
        );

        btnLogout.classList.remove(
            "hidden"
        );

    } else {

        btnLogin.classList.remove(
            "hidden"
        );

        btnAdmin.classList.add(
            "hidden"
        );

        btnLogout.classList.add(
            "hidden"
        );

        vistaAdmin.classList.add(
            "hidden"
        );

        vistaConsulta.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// ESCUCHAR CAMBIOS DE SESIÓN
// ==========================================

supabaseClient.auth.onAuthStateChange(
    (
        event,
        session
    ) => {

        actualizarInterfazSesion(
            session
        );

    }
);


// ==========================================
// LOGIN - ABRIR
// ==========================================

btnLogin.addEventListener(
    "click",
    () => {

        modalLogin.classList.remove(
            "hidden"
        );

        setTimeout(
            () => {

                document
                    .getElementById(
                        "loginEmail"
                    )
                    .focus();

            },
            100
        );

    }
);


// ==========================================
// LOGIN - CERRAR
// ==========================================

btnCerrarLogin.addEventListener(
    "click",
    cerrarModalLogin
);


function cerrarModalLogin() {

    modalLogin.classList.add(
        "hidden"
    );

    formLogin.reset();

    mensajeLogin.textContent = "";

}


// ==========================================
// LOGIN
// ==========================================

formLogin.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            document
                .getElementById(
                    "loginEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "loginPassword"
                )
                .value;


        mensajeLogin.textContent =
            "⏳ Iniciando sesión...";


        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });


        if (error) {

            console.error(
                "ERROR LOGIN:",
                error
            );

            mensajeLogin.textContent =
                "❌ " +
                error.message;

            return;

        }


        modalLogin.classList.add(
            "hidden"
        );

        formLogin.reset();

        mensajeLogin.textContent = "";


        actualizarInterfazSesion(
            data.session
        );


        alert(
            "✅ Sesión iniciada correctamente."
        );

    }
);


// ==========================================
// CERRAR SESIÓN
// ==========================================

btnLogout.addEventListener(
    "click",
    async () => {

        const confirmar =
            confirm(
                "¿Deseas cerrar la sesión?"
            );


        if (!confirmar) {

            return;

        }


        const {
            error
        } =
            await supabaseClient.auth
                .signOut();


        if (error) {

            console.error(error);

            alert(
                "❌ No se pudo cerrar la sesión."
            );

            return;

        }


        actualizarInterfazSesion(
            null
        );


        alert(
            "👋 Sesión cerrada."
        );

    }
);


// ==========================================
// CARGAR MEDICAMENTOS
// ==========================================

async function cargarMedicamentos() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "medicamentos"
            )

            .select("*")

            .order(
                "nombre"
            );


    if (error) {

        console.error(
            "Error cargando medicamentos:",
            error
        );

        alert(
            "❌ No se pudieron cargar los medicamentos."
        );

        medicamentos = [];

        return;

    }


    medicamentos =
        data || [];

}


// ==========================================
// ESCAPAR HTML
// ==========================================

function escaparHTML(valor) {

    return String(
        valor ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ==========================================
// RENDERIZAR RESULTADOS
// ==========================================

function renderizarConsulta() {

    const texto =
        buscar.value
            .trim()
            .toLowerCase();


    const filtroClasificacion =
        document
            .getElementById(
                "filtroClasificacion"
            )
            .value;


    const resultados =
        medicamentos.filter(
            medicamento => {

                const contenido = [

                    medicamento.nombre,

                    medicamento.principio_activo,

                    medicamento.presentacion,

                    medicamento.concentracion,

                    medicamento.grupo_farmacologico,

                    medicamento.laboratorio

                ]

                    .join(" ")

                    .toLowerCase();


                const coincideTexto =
                    contenido.includes(
                        texto
                    );


                const coincideClasificacion =
                    !filtroClasificacion ||

                    medicamento.clasificacion ===
                    filtroClasificacion;


                return (
                    coincideTexto &&
                    coincideClasificacion
                );

            }
        );


    listaMedicamentos.innerHTML =
        "";


    if (
        resultados.length === 0
    ) {

        sinResultados.classList.remove(
            "hidden"
        );

        return;

    }


    sinResultados.classList.add(
        "hidden"
    );


    resultados.forEach(
        medicamento => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "resultado-medicamento";


            tarjeta.innerHTML = `

                <div class="resultado-icono">
                    💊
                </div>

                <h3>
                    ${escaparHTML(
                        medicamento.nombre
                    )}
                </h3>

                <p class="resultado-principio">
                    ${escaparHTML(
                        medicamento.principio_activo ||
                        "Principio activo no registrado"
                    )}
                </p>

                <div class="resultado-info">

                    ${
                        medicamento.clasificacion
                            ? `
                                <span class="resultado-etiqueta">
                                    ${escaparHTML(
                                        medicamento.clasificacion
                                    )}
                                </span>
                            `
                            : ""
                    }

                    ${
                        medicamento.concentracion
                            ? `
                                <span class="resultado-etiqueta">
                                    ${escaparHTML(
                                        medicamento.concentracion
                                    )}
                                </span>
                            `
                            : ""
                    }

                    ${
                        medicamento.forma_farmaceutica
                            ? `
                                <span class="resultado-etiqueta">
                                    ${escaparHTML(
                                        medicamento.forma_farmaceutica
                                    )}
                                </span>
                            `
                            : ""
                    }

                </div>

                <div class="resultado-ver">
                    Ver información →
                </div>

            `;


            tarjeta.addEventListener(
                "click",
                () => {

                    abrirModalMedicamento(
                        medicamento.id
                    );

                }
            );


            listaMedicamentos.appendChild(
                tarjeta
            );

        }
    );

}


// ==========================================
// ABRIR MODAL MEDICAMENTO
// ==========================================

function abrirModalMedicamento(
    id
) {

    const medicamento =
        medicamentos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!medicamento) {

        return;

    }


    modalMedicamentoHeader.innerHTML = `

        <div>

            <h2 class="modal-titulo">

                💊 ${escaparHTML(
                    medicamento.nombre
                )}

            </h2>

            <p class="modal-principio">

                ${escaparHTML(
                    medicamento.principio_activo ||
                    "Principio activo no registrado"
                )}

            </p>

        </div>


        <div class="modal-clasificacion">

            ${escaparHTML(
                medicamento.clasificacion ||
                "Sin clasificación"
            )}

        </div>

    `;


    modalMedicamentoBody.innerHTML = `


        <!-- ==========================
             IDENTIFICACIÓN
        =========================== -->

        <section class="modal-seccion">

            <h3 class="modal-seccion-titulo">
                📋 Identificación
            </h3>


            <div class="modal-datos">

                ${modalDato(
                    "Grupo farmacológico",
                    medicamento.grupo_farmacologico
                )}

                ${modalDato(
                    "Presentación",
                    medicamento.presentacion
                )}

                ${modalDato(
                    "Concentración",
                    medicamento.concentracion
                )}

                ${modalDato(
                    "Forma farmacéutica",
                    medicamento.forma_farmaceutica
                )}

                ${modalDato(
                    "Laboratorio",
                    medicamento.laboratorio
                )}

                ${modalDato(
                    "Vía de administración",
                    medicamento.via
                )}

            </div>

        </section>



        <!-- ==========================
             DOSIS
        =========================== -->

        <section class="modal-seccion">

            <h3 class="modal-seccion-titulo">
                💊 Información de dosis
            </h3>


            ${
                medicamento.dosis
                    ? `
                        <div class="dosis-card">

                            <h4>
                                💊 Dosis habitual
                            </h4>

                            <p>
                                ${escaparHTML(
                                    medicamento.dosis
                                )}
                            </p>

                        </div>
                    `
                    : ""
            }


            ${
                medicamento.dosis_pediatrica
                    ? `
                        <div class="dosis-card">

                            <h4>
                                👶 Dosis pediátrica
                            </h4>

                            <p>
                                ${escaparHTML(
                                    medicamento.dosis_pediatrica
                                )}
                            </p>

                        </div>
                    `
                    : ""
            }


            ${
                medicamento.dosis_insuficiencia_renal
                    ? `
                        <div class="dosis-card renal">

                            <h4>
                                🫘 Dosis en insuficiencia renal
                            </h4>

                            <p>
                                ${escaparHTML(
                                    medicamento.dosis_insuficiencia_renal
                                )}
                            </p>

                        </div>
                    `
                    : ""
            }


            ${
                !medicamento.dosis &&
                !medicamento.dosis_pediatrica &&
                !medicamento.dosis_insuficiencia_renal
                    ? `
                        <div class="modal-texto">

                            <p>
                                No hay información de dosis registrada.
                            </p>

                        </div>
                    `
                    : ""
            }

        </section>



        <!-- ==========================
             MECANISMO
        =========================== -->

        ${modalTexto(
            "🧬 Mecanismo de acción",
            medicamento.mecanismo_accion
        )}



        <!-- ==========================
             INDICACIONES
        =========================== -->

        ${modalTexto(
            "Indicaciones",
            medicamento.indicaciones
        )}



        <!-- ==========================
             CONTRAINDICACIONES
        =========================== -->

        ${modalTexto(
            "Contraindicaciones",
            medicamento.contraindicaciones
        )}



        <!-- ==========================
             PRECAUCIONES
        =========================== -->

        ${modalTexto(
            "Precauciones",
            medicamento.precauciones
        )}



        <!-- ==========================
             INTERACCIONES
        =========================== -->

        ${modalTexto(
            "Interacciones",
            medicamento.interacciones
        )}



        <!-- ==========================
             EFECTOS ADVERSOS
        =========================== -->

        ${modalTexto(
            "Efectos adversos",
            medicamento.efectos_adversos
        )}



        <!-- ==========================
             OBSERVACIONES
        =========================== -->

        ${modalTexto(
            "Observaciones",
            medicamento.observaciones
        )}



        <!-- ==========================
             FUENTE
        =========================== -->

        <section class="modal-seccion">

            <h3 class="modal-seccion-titulo">
                📚 Información adicional
            </h3>


            <div class="modal-datos">

                ${modalDato(
                    "Fuente bibliográfica",
                    medicamento.fuente
                )}

                ${modalDato(
                    "Fecha de actualización",
                    medicamento.fecha_actualizacion
                )}

            </div>

        </section>

    `;


    modalMedicamento.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


// ==========================================
// DATOS DEL MODAL
// ==========================================

function modalDato(
    titulo,
    valor
) {

    if (
        !valor ||
        String(valor).trim() === ""
    ) {

        return "";

    }


    return `

        <div class="modal-dato">

            <span class="modal-dato-titulo">

                ${escaparHTML(
                    titulo
                )}

            </span>

            <span class="modal-dato-valor">

                ${escaparHTML(
                    valor
                )}

            </span>

        </div>

    `;

}


// ==========================================
// TEXTO DEL MODAL
// ==========================================

function modalTexto(
    titulo,
    valor
) {

    if (
        !valor ||
        String(valor).trim() === ""
    ) {

        return "";

    }


    return `

        <section class="modal-seccion">

            <div class="modal-texto">

                <h4>
                    ${escaparHTML(
                        titulo
                    )}
                </h4>

                <p>
                    ${escaparHTML(
                        valor
                    )}
                </p>

            </div>

        </section>

    `;

}


// ==========================================
// CERRAR MODAL MEDICAMENTO
// ==========================================

function cerrarModalMedicamento() {

    modalMedicamento.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

}


btnCerrarMedicamento.addEventListener(
    "click",
    cerrarModalMedicamento
);


btnCerrarMedicamentoFooter.addEventListener(
    "click",
    cerrarModalMedicamento
);


// ==========================================
// CERRAR MODAL HACIENDO CLIC FUERA
// ==========================================

modalMedicamento.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalMedicamento
        ) {

            cerrarModalMedicamento();

        }

    }
);


// ==========================================
// CERRAR MODAL CON ESC
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            if (
                !modalMedicamento.classList.contains(
                    "hidden"
                )
            ) {

                cerrarModalMedicamento();

            }


            if (
                !modalLogin.classList.contains(
                    "hidden"
                )
            ) {

                cerrarModalLogin();

            }

        }

    }
);


// ==========================================
// RENDERIZAR TABLA
// ==========================================

function renderizarTabla() {

    contador.textContent =

        `${medicamentos.length} medicamento${
            medicamentos.length === 1
                ? ""
                : "s"
        }`;


    tablaMedicamentos.innerHTML =

        medicamentos.map(
            medicamento => `

                <tr>

                    <td>

                        <strong>

                            ${escaparHTML(
                                medicamento.nombre
                            )}

                        </strong>

                    </td>


                    <td>

                        ${escaparHTML(
                            medicamento.principio_activo
                        )}

                    </td>


                    <td>

                        ${escaparHTML(
                            medicamento.presentacion
                        )}

                    </td>


                    <td>

                        ${escaparHTML(
                            medicamento.concentracion
                        )}

                    </td>


                    <td>

                        <div class="acciones-tabla">

                            <button
                                class="btn btn-edit"
                                onclick="
                                    editarMedicamento(
                                        '${medicamento.id}'
                                    )
                                "
                            >
                                ✏️ Editar
                            </button>


                            <button
                                class="btn btn-danger"
                                onclick="
                                    eliminarMedicamento(
                                        '${medicamento.id}'
                                    )
                                "
                            >
                                🗑️ Eliminar
                            </button>

                        </div>

                    </td>

                </tr>

            `
        ).join("");

}


// ==========================================
// ABRIR ADMINISTRACIÓN
// ==========================================

function abrirAdministracion() {

    vistaConsulta.classList.add(
        "hidden"
    );

    vistaAdmin.classList.remove(
        "hidden"
    );


    renderizarTabla();

    limpiarFormulario();

}


// ==========================================
// VOLVER
// ==========================================

function volverConsulta() {

    vistaAdmin.classList.add(
        "hidden"
    );

    vistaConsulta.classList.remove(
        "hidden"
    );


    renderizarConsulta();

}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiarFormulario() {

    form.reset();


    document.getElementById(
        "medicamentoId"
    ).value = "";


    tituloFormulario.textContent =
        "➕ Agregar medicamento";

}


// ==========================================
// OBTENER DATOS FORMULARIO
// ==========================================

function obtenerDatosFormulario() {

    return {

        nombre:
            document
                .getElementById(
                    "nombre"
                )
                .value
                .trim(),


        principio_activo:
            document
                .getElementById(
                    "principioActivo"
                )
                .value
                .trim(),


        clasificacion:
            document
                .getElementById(
                    "clasificacion"
                )
                .value,


        grupo_farmacologico:
            document
                .getElementById(
                    "grupoFarmacologico"
                )
                .value
                .trim(),


        presentacion:
            document
                .getElementById(
                    "presentacion"
                )
                .value
                .trim(),


        concentracion:
            document
                .getElementById(
                    "concentracion"
                )
                .value
                .trim(),


        mecanismo_accion:
            document
                .getElementById(
                    "mecanismoAccion"
                )
                .value
                .trim(),


        forma_farmaceutica:
            document
                .getElementById(
                    "formaFarmaceutica"
                )
                .value
                .trim(),


        laboratorio:
            document
                .getElementById(
                    "laboratorio"
                )
                .value
                .trim(),


        via:
            document
                .getElementById(
                    "via"
                )
                .value
                .trim(),


        dosis:
            document
                .getElementById(
                    "dosis"
                )
                .value
                .trim(),


        // ==================================
        // NUEVAS DOSIS
        // ==================================

        dosis_pediatrica:
            document
                .getElementById(
                    "dosisPediatrica"
                )
                .value
                .trim(),


        dosis_insuficiencia_renal:
            document
                .getElementById(
                    "dosisInsuficienciaRenal"
                )
                .value
                .trim(),


        indicaciones:
            document
                .getElementById(
                    "indicaciones"
                )
                .value
                .trim(),


        contraindicaciones:
            document
                .getElementById(
                    "contraindicaciones"
                )
                .value
                .trim(),


        precauciones:
            document
                .getElementById(
                    "precauciones"
                )
                .value
                .trim(),


        interacciones:
            document
                .getElementById(
                    "interacciones"
                )
                .value
                .trim(),


        efectos_adversos:
            document
                .getElementById(
                    "efectosAdversos"
                )
                .value
                .trim(),


        observaciones:
            document
                .getElementById(
                    "observaciones"
                )
                .value
                .trim(),


        fuente:
            document
                .getElementById(
                    "fuente"
                )
                .value
                .trim(),


        fecha_actualizacion:
            document
                .getElementById(
                    "fechaActualizacion"
                )
                .value ||
            null

    };

}


// ==========================================
// GUARDAR / ACTUALIZAR
// ==========================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const id =
            document
                .getElementById(
                    "medicamentoId"
                )
                .value;


        const datos =
            obtenerDatosFormulario();


        // ==================================
        // ACTUALIZAR
        // ==================================

        if (id) {

            const {
                error
            } =
                await supabaseClient

                    .from(
                        "medicamentos"
                    )

                    .update(
                        datos
                    )

                    .eq(
                        "id",
                        id
                    );


            if (error) {

                console.error(
                    "Error actualizando:",
                    error
                );

                alert(
                    "❌ Error actualizando medicamento."
                );

                return;

            }


            alert(
                "✅ Medicamento actualizado."
            );

        }


        // ==================================
        // NUEVO
        // ==================================

        else {

            const {
                error
            } =
                await supabaseClient

                    .from(
                        "medicamentos"
                    )

                    .insert([
                        datos
                    ]);


            if (error) {

                console.error(
                    "Error agregando:",
                    error
                );

                alert(
                    "❌ Error agregando medicamento."
                );

                return;

            }


            alert(
                "✅ Medicamento agregado."
            );

        }


        await cargarMedicamentos();

        renderizarConsulta();

        renderizarTabla();

        limpiarFormulario();

    }
);


// ==========================================
// EDITAR MEDICAMENTO
// ==========================================

function editarMedicamento(
    id
) {

    const medicamento =
        medicamentos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!medicamento) {

        alert(
            "❌ No se encontró el medicamento."
        );

        return;

    }


    document.getElementById(
        "medicamentoId"
    ).value =
        medicamento.id;


    document.getElementById(
        "nombre"
    ).value =
        medicamento.nombre || "";


    document.getElementById(
        "principioActivo"
    ).value =
        medicamento.principio_activo || "";


    document.getElementById(
        "clasificacion"
    ).value =
        medicamento.clasificacion || "";


    document.getElementById(
        "grupoFarmacologico"
    ).value =
        medicamento.grupo_farmacologico || "";


    document.getElementById(
        "presentacion"
    ).value =
        medicamento.presentacion || "";


    document.getElementById(
        "concentracion"
    ).value =
        medicamento.concentracion || "";


    document.getElementById(
        "mecanismoAccion"
    ).value =
        medicamento.mecanismo_accion || "";


    document.getElementById(
        "formaFarmaceutica"
    ).value =
        medicamento.forma_farmaceutica || "";


    document.getElementById(
        "laboratorio"
    ).value =
        medicamento.laboratorio || "";


    document.getElementById(
        "via"
    ).value =
        medicamento.via || "";


    document.getElementById(
        "dosis"
    ).value =
        medicamento.dosis || "";


    // ==================================
    // NUEVAS DOSIS
    // ==================================

    document.getElementById(
        "dosisPediatrica"
    ).value =
        medicamento.dosis_pediatrica || "";


    document.getElementById(
        "dosisInsuficienciaRenal"
    ).value =
        medicamento.dosis_insuficiencia_renal || "";


    document.getElementById(
        "indicaciones"
    ).value =
        medicamento.indicaciones || "";


    document.getElementById(
        "contraindicaciones"
    ).value =
        medicamento.contraindicaciones || "";


    document.getElementById(
        "precauciones"
    ).value =
        medicamento.precauciones || "";


    document.getElementById(
        "interacciones"
    ).value =
        medicamento.interacciones || "";


    document.getElementById(
        "efectosAdversos"
    ).value =
        medicamento.efectos_adversos || "";


    document.getElementById(
        "observaciones"
    ).value =
        medicamento.observaciones || "";


    document.getElementById(
        "fuente"
    ).value =
        medicamento.fuente || "";


    document.getElementById(
        "fechaActualizacion"
    ).value =
        medicamento.fecha_actualizacion || "";


    tituloFormulario.textContent =
        "✏️ Editar medicamento";


    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });

}


// ==========================================
// ELIMINAR
// ==========================================

async function eliminarMedicamento(
    id
) {

    const medicamento =
        medicamentos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!medicamento) {

        return;

    }


    const confirmar =
        confirm(
            `¿Seguro que deseas eliminar "${medicamento.nombre}"?`
        );


    if (!confirmar) {

        return;

    }


    const {
        error
    } =
        await supabaseClient

            .from(
                "medicamentos"
            )

            .delete()

            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "Error eliminando:",
            error
        );

        alert(
            "❌ No se pudo eliminar el medicamento."
        );

        return;

    }


    alert(
        "✅ Medicamento eliminado."
    );


    await cargarMedicamentos();

    renderizarTabla();

    renderizarConsulta();

}


// ==========================================
// BOTONES
// ==========================================

btnAdmin.addEventListener(
    "click",
    abrirAdministracion
);


btnVolver.addEventListener(
    "click",
    volverConsulta
);


btnCancelar.addEventListener(
    "click",
    limpiarFormulario
);


// ==========================================
// BUSCADOR
// ==========================================

buscar.addEventListener(
    "input",
    renderizarConsulta
);


// ==========================================
// FILTRO CLASIFICACIÓN
// ==========================================

document
    .getElementById(
        "filtroClasificacion"
    )
    .addEventListener(
        "change",
        renderizarConsulta
);


// ==========================================
// FUNCIONES GLOBALES
// ==========================================

window.editarMedicamento =
    editarMedicamento;

window.eliminarMedicamento =
    eliminarMedicamento;
