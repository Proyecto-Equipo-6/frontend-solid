function normalizarSkuTexto(texto = '') {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
}

export function generarSku(nombre, categoriaNombre, productos) {
  const prefijoCategoria = normalizarSkuTexto(categoriaNombre).slice(0, 3)
  const prefijoNombre = normalizarSkuTexto(nombre).slice(0, 4)
  if (!prefijoCategoria || !prefijoNombre) return ''

  const lista = productos || []
  let numero = lista.length + 1
  let sku = `${prefijoCategoria}-${prefijoNombre}-${numero}`
  while (lista.some((producto) => producto.sku === sku)) {
    numero += 1
    sku = `${prefijoCategoria}-${prefijoNombre}-${numero}`
  }
  return sku
}