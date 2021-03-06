import { Pipe, PipeTransform } from '@angular/core';
// ESTA ES UAN FUNCION QUE OBTIENE EL VALOR DE LA PROPIEDAD (TAMBIEN LLAMADO COLUMNA) Y DEVUELVE DICHO VALOR PARA SER MODIFICADO POR UN PIPE O VUELVE COMO UN GUION EN CASO DE SER UN VALOR NO VALIDO
// ELEMENT - HACE REFERENCIA AL OBJETO QUE INGRESA A LA FUNCION
// COLUMNS - HACE REFERENCIA AL CONJUNTO DE COLUMNAS QUE VIENEN DESDE EL ARCHIVO DE CONFIGURACION "TABLE.CONFIG.TS"
// CELLVALUE - HACE REFERENCIA A LA PROPIEDAD DEL OBJETO "ELEMENT" QUE NECESITA DEVOLVER AL USUARIO. PRIMERO SE CONSULTA SI LA PROPIEDAD "CELLVALUE" HACE REFERENCIA A UNA PROPIEDAD DENTRO DE OTRA PROPIEDAD (COMO LA FECHA DENTRO DE UN PEDIDO QUE A SU VEZ HA SIDO ADJUNTO A UN OBJETO DE VENTA = VENTA.PEDIDO.FECHAPEDIDO) O A UNA PROPIEDAD NORMAL
// ACTO SEGUIDO, SE OBTIENE EL VALOR FINAL DEL OBJETO "ELEMENT" USANDO LA PROPIEDAD OBTENIDA EN LA CONSTANTE "FINDVALUEINOBJECT"

@Pipe({
  name: 'columnValue'
})
export class ColumnValuePipe implements PipeTransform {
  transform(element: any, columns: any, cellValue: any): string {
    const findValueInObject = columns[cellValue].split('.');
    const value = findValueInObject.length === 1 ?
      element[findValueInObject] :
      element[findValueInObject[0]][findValueInObject[1]];

    return value ? value : '-';
  }
}
