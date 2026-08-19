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
// ELEMENTOS LOGIN
// ==========================================

const btnLogin =
    document.getElementById("btnLogin");

const btnLogout =
    document.getElementById("btnLogout");

const modalLogin =
    document.getElementById("modalLogin");

const btnCerrarLogin =
    document.getElementById("btnCerrarLogin");

const formLogin =
    document.getElementById("formLogin");

const mensajeLogin =
    document.getElementById("mensajeLogin");


// ==========================================
// ELEMENTOS PRINCIPALES
// ==========================================

const vistaConsulta =
    document.getElementById("vistaConsulta");

const vistaAdmin =
    document.getElementById("vistaAdmin");

const btnAdmin =
    document.getElementById("btnAdmin");

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
// INICIAR APLICACIÓN
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
    } =
        await supabaseClient.auth.getSession();

    actualizarInterfazSesion(session);

}


// ==========================================
// ACTUALIZAR INTERFAZ DE SESIÓN
// ==========================================

function actualizarInterfazSesion(session) {

    if (session) {

        btnLogin.classList.add("hidden");

        btnAdmin.classList.remove("hidden");

        btnLogout.classList.remove("hidden");

    }

    else {

        btnLogin.classList.remove("hidden");

        btnAdmin.classList.add("hidden");

        btnLogout.classList.add("hidden");

        vistaAdmin.classList.add("hidden");

        vistaConsulta.classList.remove("hidden");

    }

}


// ==========================================
// ABRIR LOGIN
// ==========================================

btnLogin.addEventListener(
    "click",
    () => {

        modalLogin.classList.remove(
            "hidden"
        );

        document
            .getElementById("loginEmail")
            .focus();

    }
);


// ==========================================
// CERRAR LOGIN
// ==========================================

btnCerrarLogin.addEventListener(
    "click",
    () => {

        modalLogin.classList.add(
            "hidden"
        );

        formLogin.reset();

        mensajeLogin.textContent = "";

    }
);


// ==========================================
// LOGIN
// ==========================================

formLogin.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("loginPassword")
                .value;

        mensajeLogin.textContent =
            "⏳ Iniciando sesión...";

        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(
                "ERROR SUPABASE LOGIN:",
                error
            );

            mensajeLogin.textContent =
                "❌ " + error.message;

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

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(error);

            alert(
                "❌ No se pudo cerrar la sesión."
            );

            return;

        }


        actualizarInterfazSesion(null);

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

            .from("medicamentos")

            .select("*")

            .order("nombre");


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

    return String(valor ?? "")

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
// RENDERIZAR CONSULTA
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

                    medicamento.clasificacion

                ]
                    .join(" ")
                    .toLowerCase();


                const coincideTexto =
                    contenido.includes(texto);


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


    listaMedicamentos.innerHTML = "";


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


    // ======================================
    // CREAR TARJETAS RESUMIDAS
    // ======================================

    resultados.forEach(
        medicamento => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "tarjeta-medicamento tarjeta-consulta";


            tarjeta.innerHTML = `

                <div class="medicamento-header">

                    <div>

                        <h2>
                            💊
                            ${escaparHTML(
                                medicamento.nombre
                            )}
                        </h2>

                        <p class="principio-activo">

                            ${escaparHTML(
                                medicamento.principio_activo ||
                                "Principio activo no registrado"
                            )}

                        </p>

                    </div>


                    <div class="clasificacion-badge">

                        ${escaparHTML(
                            medicamento.clasificacion ||
                            "Sin clasificación"
                        )}

                    </div>

                </div>


                <div class="resumen-medicamento">

                    ${datoMedicamento(
                        "Presentación",
                        medicamento.presentacion
                    )}

                    ${datoMedicamento(
                        "Concentración",
                        medicamento.concentracion
                    )}

                    ${datoMedicamento(
                        "Vía",
                        medicamento.via
                    )}

                </div>


                <div class="boton-ver-medicamento">

                    👁️ Ver información completa

                </div>

            `;


            // ==================================
            // ABRIR MODAL
            // ==================================

            tarjeta.addEventListener(
                "click",
                () => {

                    abrirModalMedicamento(
                        medicamento
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
// ABRIR MODAL DEL MEDICAMENTO
// ==========================================

function abrirModalMedicamento(
    medicamento
) {

    const modal =
        document.getElementById(
            "modalMedicamento"
        );

    const contenido =
        document.getElementById(
            "contenidoMedicamento"
        );


    if (!modal || !contenido) {

        console.error(
            "No existe el modalMedicamento en index.html"
        );

        return;

    }


    contenido.innerHTML = `

        <div class="modal-medicamento-header">

            <div>

                <span class="modal-icono">
                    💊
                </span>

                <h2>
                    ${escaparHTML(
                        medicamento.nombre
                    )}
                </h2>

                <p>

                    ${escaparHTML(
                        medicamento.principio_activo ||
                        "Principio activo no registrado"
                    )}

                </p>

            </div>

            <span class="clasificacion-badge">

                ${escaparHTML(
                    medicamento.clasificacion ||
                    "Sin clasificación"
                )}

            </span>

        </div>


        <!-- ==========================
             IDENTIFICACIÓN
        =========================== -->

        <section class="modal-seccion">

            <h3>
                📋 Identificación
            </h3>

            <div class="datos-medicamento">

                ${datoMedicamento(
                    "Grupo farmacológico",
                    medicamento.grupo_farmacologico
                )}

                ${datoMedicamento(
                    "Presentación",
                    medicamento.presentacion
                )}

                ${datoMedicamento(
                    "Concentración",
                    medicamento.concentracion
                )}

                ${datoMedicamento(
                    "Forma farmacéutica",
                    medicamento.forma_farmaceutica
                )}

                ${datoMedicamento(
                    "Laboratorio",
                    medicamento.laboratorio
                )}

            </div>

        </section>


        <!-- ==========================
             USO
        =========================== -->

        <section class="modal-seccion">

            <h3>
                🩺 Uso
            </h3>

            <div class="datos-medicamento">

                ${datoMedicamento(
                    "Vía de administración",
                    medicamento.via
                )}

                ${datoMedicamento(
                    "Dosis general",
                    medicamento.dosis
                )}

            </div>


            ${textoMedicamento(
                "🧬 Mecanismo de acción",
                medicamento.mecanismo_accion
            )}

            ${textoMedicamento(
                "Indicaciones",
                medicamento.indicaciones
            )}

            ${textoMedicamento(
                "Contraindicaciones",
                medicamento.contraindicaciones
            )}

        </section>


        <!-- ==========================
             DOSIFICACIÓN ESPECIAL
        =========================== -->

        <section class="modal-seccion seccion-dosis-especial">

            <h3>
                👶 Dosificación pediátrica
            </h3>

            ${textoMedicamento(
                "Dosis en pacientes pediátricos",
                medicamento.dosis_pediatrica
            )}

        </section>


        <!-- ==========================
             FUNCIÓN RENAL
        =========================== -->

        <section class="modal-seccion seccion-renal">

            <h3>
                🩺 Ajuste en función renal
            </h3>

            ${textoMedicamento(
                "Dosis en insuficiencia renal",
                medicamento.dosis_renal
            )}

            ${textoMedicamento(
                "Consideraciones en pacientes con problemas renales",
                medicamento.consideraciones_renales
            )}

        </section>


        <!-- ==========================
             SEGURIDAD
        =========================== -->

        <section class="modal-seccion">

            <h3>
                ⚠️ Seguridad
            </h3>

            ${textoMedicamento(
                "Precauciones",
                medicamento.precauciones
            )}

            ${textoMedicamento(
                "Interacciones",
                medicamento.interacciones
            )}

            ${textoMedicamento(
                "Efectos adversos",
                medicamento.efectos_adversos
            )}

        </section>


        <!-- ==========================
             INFORMACIÓN ADICIONAL
        =========================== -->

        <section class="modal-seccion">

            <h3>
                📚 Información adicional
            </h3>

            ${textoMedicamento(
                "Observaciones",
                medicamento.observaciones
            )}

            ${textoMedicamento(
                "Fuente bibliográfica",
                medicamento.fuente
            )}

            ${datoMedicamento(
                "Fecha de actualización",
                medicamento.fecha_actualizacion
            )}

        </section>

    `;


    modal.classList.remove(
        "hidden"
    );

    document.body.classList.add(
        "modal-abierto"
    );

}


// ==========================================
// CERRAR MODAL MEDICAMENTO
// ==========================================

function cerrarModalMedicamento() {

    const modal =
        document.getElementById(
            "modalMedicamento"
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "hidden"
    );

    document.body.classList.remove(
        "modal-abierto"
    );

}


// ==========================================
// DATOS MEDICAMENTO
// ==========================================

function datoMedicamento(
    titulo,
    valor
) {

    if (
        !valor ||
        valor.toString().trim() === ""
    ) {

        return "";

    }


    return `

        <div class="dato-medicamento">

            <span class="dato-titulo">

                ${escaparHTML(
                    titulo
                )}

            </span>

            <span class="dato-valor">

                ${escaparHTML(
                    valor
                )}

            </span>

        </div>

    `;

}


// ==========================================
// TEXTOS MEDICAMENTO
// ==========================================

function textoMedicamento(
    titulo,
    valor
) {

    if (
        !valor ||
        valor.toString().trim() === ""
    ) {

        return "";

    }


    return `

        <div class="texto-medicamento">

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

    `;

}


// ==========================================
// TABLA ADMINISTRACIÓN
// ==========================================

function renderizarTabla() {

    contador.textContent =

        `${medicamentos.length}
        medicamento${
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
// VOLVER A CONSULTA
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
                .getElementById("nombre")
                .value
                .trim(),

        principio_activo:
            document
                .getElementById("principioActivo")
                .value
                .trim(),

        clasificacion:
            document
                .getElementById("clasificacion")
                .value,

        grupo_farmacologico:
            document
                .getElementById("grupoFarmacologico")
                .value
                .trim(),

        presentacion:
            document
                .getElementById("presentacion")
                .value
                .trim(),

        concentracion:
            document
                .getElementById("concentracion")
                .value
                .trim(),

        mecanismo_accion:
            document
                .getElementById("mecanismoAccion")
                .value
                .trim(),

        forma_farmaceutica:
            document
                .getElementById("formaFarmaceutica")
                .value
                .trim(),

        laboratorio:
            document
                .getElementById("laboratorio")
                .value
                .trim(),

        via:
            document
                .getElementById("via")
                .value
                .trim(),

        dosis:
            document
                .getElementById("dosis")
                .value
                .trim(),

        // ==================================
        // NUEVAS DOSIS
        // ==================================

        dosis_pediatrica:
            document
                .getElementById("dosisPediatrica")
                .value
                .trim(),

        dosis_renal:
            document
                .getElementById("dosisRenal")
                .value
                .trim(),

        consideraciones_renales:
            document
                .getElementById("consideracionesRenales")
                .value
                .trim(),

        // ==================================
        // RESTO
        // ==================================

        indicaciones:
            document
                .getElementById("indicaciones")
                .value
                .trim(),

        contraindicaciones:
            document
                .getElementById("contraindicaciones")
                .value
                .trim(),

        precauciones:
            document
                .getElementById("precauciones")
                .value
                .trim(),

        interacciones:
            document
                .getElementById("interacciones")
                .value
                .trim(),

        efectos_adversos:
            document
                .getElementById("efectosAdversos")
                .value
                .trim(),

        observaciones:
            document
                .getElementById("observaciones")
                .value
                .trim(),

        fuente:
            document
                .getElementById("fuente")
                .value
                .trim(),

        fecha_actualizacion:
            document
                .getElementById("fechaActualizacion")
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
                .getElementById("medicamentoId")
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

                    .from("medicamentos")

                    .update(datos)

                    .eq("id", id);


            if (error) {

                console.error(error);

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

                    .from("medicamentos")

                    .insert([
                        datos
                    ]);


            if (error) {

                console.error(error);

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

function editarMedicamento(id) {

    const medicamento =
        medicamentos.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!medicamento) {

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
    // NUEVOS CAMPOS
    // ==================================

    document.getElementById(
        "dosisPediatrica"
    ).value =
        medicamento.dosis_pediatrica || "";


    document.getElementById(
        "dosisRenal"
    ).value =
        medicamento.dosis_renal || "";


    document.getElementById(
        "consideracionesRenales"
    ).value =
        medicamento.consideraciones_renales || "";


    // ==================================
    // RESTO
    // ==================================

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

        behavior: "smooth"

    });

}


// ==========================================
// ELIMINAR MEDICAMENTO
// ==========================================

async function eliminarMedicamento(id) {

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

            .from("medicamentos")

            .delete()

            .eq("id", id);


    if (error) {

        console.error(error);

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
// CERRAR MODAL MEDICAMENTO
// ==========================================

const btnCerrarMedicamento =
    document.getElementById(
        "btnCerrarMedicamento"
    );


if (btnCerrarMedicamento) {

    btnCerrarMedicamento.addEventListener(
        "click",
        cerrarModalMedicamento
    );

}


// ==========================================
// CERRAR MODAL AL HACER CLIC FUERA
// ==========================================

const modalMedicamento =
    document.getElementById(
        "modalMedicamento"
    );


if (modalMedicamento) {

    modalMedicamento.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                modalMedicamento
            ) {

                cerrarModalMedicamento();

            }

        }
    );

}


// ==========================================
// TECLA ESC PARA CERRAR MODAL
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            cerrarModalMedicamento();

            if (
                modalLogin &&
                !modalLogin.classList.contains(
                    "hidden"
                )
            ) {

                modalLogin.classList.add(
                    "hidden"
                );

            }

        }

    }
);


// ==========================================
// FILTROS
// ==========================================

buscar.addEventListener(
    "input",
    renderizarConsulta
);


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

window.cerrarModalMedicamento =
    cerrarModalMedicamento;
