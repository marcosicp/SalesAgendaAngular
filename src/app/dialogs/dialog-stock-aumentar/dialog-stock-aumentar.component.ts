import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
// SERVICIOS
import { DataService } from '../../core/services/data.service';
// MODELOS
import { Productos } from '../../shared/models/producto.model';
// DIALOGOS
import { DialogOperacionOkComponent } from '../dialog-operacion-ok/dialog-operacion-ok.component';
import { DialogSinConexionComponent } from '../dialog-sin-conexion/dialog-sin-conexion.component';
// URLS DE CONFIGURACION
import { URL_PRODUCTOS } from '../../shared/configs/urls.config';

@Component({
  selector: 'app-dialog-stock-aumentar',
  templateUrl: './dialog-stock-aumentar.component.html',
  styleUrls: ['./dialog-stock-aumentar.component.scss']
})
export class DialogStockAumentarComponent {
  producto: Productos;
  nuevaCantidad = 0;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    public dialogRef: MatDialogRef<DialogOperacionOkComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Productos
  ) {
    this.producto = data;
  }

  guardar() {
    this.dataService.updateAsync(
      URL_PRODUCTOS.RENEW_STOCK,
      this.producto,
      []
    ).subscribe(
      result => {
        const DialogResult = result ?
          DialogOperacionOkComponent :
          DialogSinConexionComponent;
        const response = result ?
          result[0] : false;

        const _dialogRef = this.dialog.open(
          DialogResult,
          { width: '600px' }
        );

        _dialogRef.afterOpened().subscribe(
          () => {
            this.dialogRef.close(response);
          }
        );
      }
    );
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
