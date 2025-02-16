const nombreUsuario = prompt("Ingrese su nombre:");
if (nombreUsuario) {
    document.getElementById("welcome").textContent = `Bienvenido, ${nombreUsuario}`;
}
