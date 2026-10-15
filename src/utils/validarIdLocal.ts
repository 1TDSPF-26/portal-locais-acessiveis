

export function validarIdLocal(valor: string | undefined): number | null {
  if (valor === undefined || !/^[1-9]\d*$/.test(valor)) {
    return null
  }

  const id = Number(valor)

  return Number.isSafeInteger(id) ? id : null
}
