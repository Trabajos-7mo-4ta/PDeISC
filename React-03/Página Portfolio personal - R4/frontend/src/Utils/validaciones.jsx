export function validarTexto(valor, campo = "Campo", maxLength = 200) {
  if (!valor.trim()) {
    return `${campo} no puede estar vacío.`;
  }
  if (/^\d+$/.test(valor)) {
    return `${campo} no puede contener solo números.`;
  }
  if (!/^[a-zA-Z0-9\s,.\-()áéíóúÁÉÍÓÚñÑ]+$/.test(valor)) {
    return `${campo} contiene caracteres no permitidos.`;
  }

  return null; 
}
