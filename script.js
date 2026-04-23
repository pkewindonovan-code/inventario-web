let productos = JSON.parse(localStorage.getItem("productos")) || [
  {
    id: 1,
    nombre: "Arroz Extra",
    precio: 4.50,
    stock: 30,
    categoria: "Granos",
    fecha: "2026-04-10"
  }
];

function guardarLocal() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function fechaHoy() {
  const hoy = new Date();
  const y = hoy.getFullYear();
  const m = String(hoy.getMonth() + 1).padStart(2, "0");
  const d = String(hoy.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function ocultarTodo() {
  document.getElementById("vista-lista").classList.add("oculto");
  document.getElementById("vista-agregar").classList.add("oculto");
  document.getElementById("vista-editar").classList.add("oculto");
  document.getElementById("vista-reporte").classList.add("oculto");
}

function mostrarLista() {
  ocultarTodo();
  document.getElementById("vista-lista").classList.remove("oculto");
  cargarTabla();
}

function mostrarAgregar() {
  ocultarTodo();
  document.getElementById("vista-agregar").classList.remove("oculto");
}

function mostrarReporte() {
  ocultarTodo();
  document.getElementById("vista-reporte").classList.remove("oculto");
  cargarReporte(productos);
}

function cargarTabla() {
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";

  productos.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>S/. ${Number(p.precio).toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>${p.categoria}</td>
        <td>${p.fecha}</td>
        <td>
          <button onclick="editarProducto(${p.id})">Editar</button>
          <button onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

function guardarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);
  const categoria = document.getElementById("categoria").value;

  if (!nombre || !precio || !stock || !categoria) {
    alert("Complete todos los campos");
    return;
  }

  const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;

  productos.push({
    id: nuevoId,
    nombre,
    precio,
    stock,
    categoria,
    fecha: fechaHoy()
  });

  guardarLocal();

  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("categoria").value = "";

  mostrarLista();
}

function editarProducto(id) {
  const p = productos.find(item => item.id === id);
  if (!p) return;

  document.getElementById("edit-id").value = p.id;
  document.getElementById("edit-nombre").value = p.nombre;
  document.getElementById("edit-precio").value = p.precio;
  document.getElementById("edit-stock").value = p.stock;
  document.getElementById("edit-categoria").value = p.categoria;

  ocultarTodo();
  document.getElementById("vista-editar").classList.remove("oculto");
}

function actualizarProducto() {
  const id = Number(document.getElementById("edit-id").value);
  const p = productos.find(item => item.id === id);
  if (!p) return;

  p.nombre = document.getElementById("edit-nombre").value.trim();
  p.precio = Number(document.getElementById("edit-precio").value);
  p.stock = Number(document.getElementById("edit-stock").value);
  p.categoria = document.getElementById("edit-categoria").value;

  guardarLocal();
  mostrarLista();
}

function eliminarProducto(id) {
  if (!confirm("¿Desea eliminar este producto?")) return;
  productos = productos.filter(p => p.id !== id);
  guardarLocal();
  cargarTabla();
}

function cargarReporte(lista) {
  const tbody = document.getElementById("tabla-reporte");
  tbody.innerHTML = "";

  lista.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>S/. ${Number(p.precio).toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>${p.categoria}</td>
        <td>${p.fecha}</td>
      </tr>
    `;
  });
}

function buscarReporte() {
  const desde = document.getElementById("desde").value;
  const hasta = document.getElementById("hasta").value;

  let filtrados = productos;

  if (desde) {
    filtrados = filtrados.filter(p => p.fecha >= desde);
  }

  if (hasta) {
    filtrados = filtrados.filter(p => p.fecha <= hasta);
  }

  cargarReporte(filtrados);
}

function exportarCSV() {
  let csv = "ID,Nombre,Precio,Stock,Categoria,Fecha\n";

  productos.forEach(p => {
    csv += `${p.id},${p.nombre},${p.precio},${p.stock},${p.categoria},${p.fecha}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte_productos.csv";
  a.click();
  URL.revokeObjectURL(url);
}

cargarTabla();
function cerrarSesion() {
  localStorage.removeItem("login");
  window.location.href = "login.html";
}