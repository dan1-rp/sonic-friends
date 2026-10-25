/* Uso de IA para la mejora de claridad y estilo */

const CLAVE = 'sonic_personajes';

const ejemplos = [
  { id: '1', nombre: 'Sonic', rol: 'Velocidad', origen: 'Green Hill Zone', imagen: 'imagenes/sonic.png', descripcion: 'Un erizo azul aventurero que corre a una velocidad increíble y siempre ayuda a sus amigos.', fechaCreacion: '2026-10-14T12:00:00Z' },
  { id: '2', nombre: 'Tails', rol: 'Vuelo', origen: 'West Side Island', imagen: 'imagenes/tails.png', descripcion: 'Un pequeño zorro de dos colas, muy inteligente y experto en construir máquinas.', fechaCreacion: '2026-10-14T12:00:00Z' },
  { id: '3', nombre: 'Knuckles', rol: 'Fuerza', origen: 'Angel Island', imagen: 'imagenes/knuckles.png', descripcion: 'El guardián de la Master Emerald. Es fuerte, valiente y puede planear por el aire.', fechaCreacion: '2026-10-14T12:00:00Z' },
  { id: '4', nombre: 'Amy Rose', rol: 'Apoyo', origen: 'Little Planet', imagen: 'imagenes/amy.png', descripcion: 'Una eriza optimista y decidida que siempre está lista para defender a sus amigos con su martillo.', fechaCreacion: '2026-10-14T12:00:00Z' },
  { id: '5', nombre: 'Shadow', rol: 'Rival', origen: 'Space Colony ARK', imagen: 'imagenes/shadow.png', descripcion: 'Un erizo misterioso y poderoso que utiliza el poder del Chaos Control.', fechaCreacion: '2026-10-14T12:00:00Z' },
  { id: '6', nombre: 'Silver', rol: 'Poder', origen: 'Futuro', imagen: 'imagenes/silver.png', descripcion: 'Un erizo del futuro que mueve objetos con sus poderes de telequinesis.', fechaCreacion: '2026-10-14T12:00:00Z' }
];

const $ = (id) => document.getElementById(id);
let personajes = cargarPersonajes();
let idActual = null;
let idEditando = null;

function mostrarAviso(mensaje, tipo = 'is-success') {
  $('aviso').className = `notification aviso ${tipo} is-light`;
  $('aviso').textContent = mensaje;
  $('aviso').hidden = false;
}

function cargarPersonajes() {
  try {
    const guardados = localStorage.getItem(CLAVE);
    if (guardados === null) {
      localStorage.setItem(CLAVE, JSON.stringify(ejemplos));
      return [...ejemplos];
    }
    const datos = JSON.parse(guardados);
    if (!Array.isArray(datos)) throw new Error('Formato inválido');
    return datos.filter(p => p && p.id && typeof p.nombre === 'string' && typeof p.rol === 'string');
  } catch (error) {
    mostrarAviso('No se pudieron leer los datos guardados. Puedes empezar una colección nueva.', 'is-warning');
    return [];
  }
}

function guardarPersonajes(nuevos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(nuevos));
    personajes = nuevos;
    return true;
  } catch (error) {
    mostrarAviso('No hay espacio suficiente o el almacenamiento está bloqueado.', 'is-danger');
    return false;
  }
}

function normalizar(texto) {
  return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function coincide(personaje, busqueda) {
  return normalizar(personaje.nombre).includes(busqueda) || normalizar(personaje.rol).includes(busqueda);
}

function buscarPersonajes(texto) {
  const busqueda = normalizar(texto.trim());
  const resultados = [];
  let i = 0;

  while (resultados.length === 0 && i < personajes.length) {
    if (coincide(personajes[i], busqueda)) resultados.push(personajes[i]);
    i++;
  }
  for (; i < personajes.length; i++) {
    if (coincide(personajes[i], busqueda)) resultados.push(personajes[i]);
  }
  return resultados;
}

function crearFoto(personaje, clase) {
  const contenedor = document.createElement('div');
  contenedor.className = clase;
  const inicial = document.createElement('span');
  inicial.className = 'inicial';
  inicial.textContent = personaje.nombre.slice(0, 2).toUpperCase();
  contenedor.appendChild(inicial);

  if (personaje.imagen) {
    const foto = document.createElement('img');
    foto.src = personaje.imagen;
    foto.alt = personaje.nombre;
    foto.loading = 'lazy';
    foto.addEventListener('load', () => inicial.hidden = true);
    foto.addEventListener('error', () => foto.remove());
    contenedor.appendChild(foto);
  }
  return contenedor;
}

function crearTarjeta(personaje) {
  const columna = document.createElement('div');
  columna.className = 'column is-12-mobile is-6-tablet is-4-desktop';
  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta-personaje';
  const cuerpo = document.createElement('div');
  cuerpo.className = 'cuerpo-tarjeta';
  const rol = document.createElement('span');
  rol.className = 'tag etiqueta-rol';
  rol.textContent = personaje.rol;
  const nombre = document.createElement('h3');
  nombre.className = 'nombre-personaje';
  nombre.textContent = personaje.nombre;
  const boton = document.createElement('button');
  boton.className = 'button boton-ver';
  boton.type = 'button';
  boton.textContent = 'VER PERFIL →';
  boton.addEventListener('click', () => mostrarDetalle(personaje.id));
  cuerpo.append(rol, nombre, boton);
  tarjeta.append(crearFoto(personaje, 'foto-personaje'), cuerpo);
  columna.appendChild(tarjeta);
  return columna;
}

function renderizarGrid() {
  const busqueda = $('buscar').value;
  const resultados = buscarPersonajes(busqueda);
  const grid = $('gridPersonajes');
  grid.replaceChildren();
  resultados.forEach(personaje => grid.appendChild(crearTarjeta(personaje)));
  $('contador').textContent = `${resultados.length} personaje(s) encontrado(s)`;

  const vacio = resultados.length === 0;
  $('sinResultados').hidden = !vacio;
  $('btnEstadoVacio').textContent = busqueda.trim() ? 'LIMPIAR BÚSQUEDA' : 'AGREGAR PERSONAJE';
  $('tituloVacio').textContent = busqueda.trim() ? '¡SIN RESULTADOS!' : '¡TU COLECCIÓN ESTÁ VACÍA!';
  $('textoVacio').textContent = busqueda.trim()
    ? 'Intenta buscar con otro nombre o rol.'
    : 'Agrega a tu primer personaje para empezar.';
}

function cambiarVista(vista) {
  $('vistaColeccion').hidden = vista !== 'coleccion';
  $('vistaDetalle').hidden = vista !== 'detalle';
  $('vistaFormulario').hidden = vista !== 'formulario';
  window.scrollTo(0, 0);
}

function mostrarDetalle(id) {
  const personaje = personajes.find(p => p.id === id);
  if (!personaje) return;
  idActual = id;
  $('detalleImagen').replaceChildren(crearFoto(personaje, 'foto-detalle'));
  $('detalleNombre').textContent = personaje.nombre;
  $('detalleRol').textContent = personaje.rol;
  $('detalleOrigen').textContent = personaje.origen || 'Desconocido';
  $('detalleDescripcion').textContent = personaje.descripcion || 'Sin descripción.';
  $('detalleFecha').textContent = personaje.fechaCreacion
    ? new Date(personaje.fechaCreacion).toLocaleDateString('es-MX') : 'Sin fecha';
  cambiarVista('detalle');
}

function abrirFormulario(id = null) {
  idEditando = id;
  $('formPersonaje').reset();
  document.querySelectorAll('.help.is-danger').forEach(p => p.textContent = '');
  document.querySelectorAll('.input.is-danger').forEach(c => c.classList.remove('is-danger'));
  $('tituloFormulario').textContent = id ? 'EDITAR PERSONAJE' : 'NUEVO PERSONAJE';
  if (id) {
    const p = personajes.find(personaje => personaje.id === id);
    if (!p) return;
    $('nombre').value = p.nombre;
    $('rol').value = p.rol;
    $('origen').value = p.origen || '';
    $('imagen').value = p.imagen || '';
    $('descripcion').value = p.descripcion || '';
  }
  cambiarVista('formulario');
}

function validar(datos) {
  let valido = true;
  ['nombre', 'rol', 'imagen'].forEach(campo => {
    $(campo).classList.remove('is-danger');
    $(`error${campo[0].toUpperCase() + campo.slice(1)}`).textContent = '';
  });
  function error(campo, mensaje) {
    $(campo).classList.add('is-danger');
    $(`error${campo[0].toUpperCase() + campo.slice(1)}`).textContent = mensaje;
    valido = false;
  }
  if (!datos.nombre) error('nombre', 'Escribe el nombre del personaje.');
  if (!datos.rol) error('rol', 'Selecciona un rol.');
  if (datos.nombre && personajes.some(p => normalizar(p.nombre) === normalizar(datos.nombre) && p.id !== idEditando)) {
    error('nombre', 'Ya tienes un personaje con este nombre.');
  }
  if (datos.imagen && !/^imagenes\/[\w./-]+\.(png|jpe?g)$/i.test(datos.imagen)) {
    error('imagen', 'Usa una ruta como imagenes/personaje.png o .jpg');
  }
  return valido;
}

function guardarFormulario(evento) {
  evento.preventDefault();
  const datos = {
    nombre: $('nombre').value.trim(),
    rol: $('rol').value,
    origen: $('origen').value.trim(),
    imagen: $('imagen').value.trim(),
    descripcion: $('descripcion').value.trim()
  };
  if (!validar(datos)) return;

  let nuevos;
  let idGuardado;
  if (idEditando) {
    idGuardado = idEditando;
    nuevos = personajes.map(p => p.id === idEditando ? { ...p, ...datos } : p);
  } else {
    idGuardado = String(Date.now());
    nuevos = [...personajes, { id: idGuardado, ...datos, fechaCreacion: new Date().toISOString() }];
  }
  if (!guardarPersonajes(nuevos)) return;
  renderizarGrid();
  mostrarDetalle(idGuardado);
  mostrarAviso(idEditando ? '¡Personaje actualizado correctamente!' : '¡Personaje agregado a tu colección!');
}

function eliminarPersonaje() {
  const p = personajes.find(personaje => personaje.id === idActual);
  if (!p || !confirm(`¿Seguro que quieres eliminar a ${p.nombre}?`)) return;
  if (!guardarPersonajes(personajes.filter(personaje => personaje.id !== idActual))) return;
  idActual = null;
  renderizarGrid();
  cambiarVista('coleccion');
  mostrarAviso('Personaje eliminado correctamente.');
}

$('btnAgregar').addEventListener('click', () => abrirFormulario());
$('buscar').addEventListener('input', renderizarGrid);
$('volverDetalle').addEventListener('click', () => cambiarVista('coleccion'));
$('volverFormulario').addEventListener('click', () => cambiarVista(idEditando ? 'detalle' : 'coleccion'));
$('btnCancelar').addEventListener('click', () => cambiarVista(idEditando ? 'detalle' : 'coleccion'));
$('btnEditar').addEventListener('click', () => abrirFormulario(idActual));
$('btnEliminar').addEventListener('click', eliminarPersonaje);
$('formPersonaje').addEventListener('submit', guardarFormulario);
$('btnEstadoVacio').addEventListener('click', () => {
  if ($('buscar').value.trim()) {
    $('buscar').value = '';
    renderizarGrid();
  } else abrirFormulario();
});
$('irInicio').addEventListener('click', () => cambiarVista('coleccion'));

document.addEventListener('click', evento => {
  const texto = evento.target.closest('h1, h2, h3, p, span, label');
  if (!texto) return;
  texto.classList.remove('camaron_saltando');
  void texto.offsetWidth;
  texto.classList.add('camaron_saltando');
  texto.addEventListener('animationend', () => texto.classList.remove('camaron_saltando'), { once: true });
});

renderizarGrid();
