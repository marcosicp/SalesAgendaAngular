import { Component, OnInit } from '@angular/core';
import { FormGroupDirective, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
// MODELOS
import { Usuarios } from '../../shared/models/usuarios.model';
import { MovimientosCaja } from '../../shared/models/movimientos-caja.model';
// SERVICIOS
import { AuthService } from '../../core/services/auth.service';
// HELPERS
import RegExpHelper from '../../shared/helpers/regex.helper';


@Component({
  selector: 'app-dialog-abrir-caja',
  templateUrl: './dialog-abrir-caja.component.html',
  styleUrls: ['./dialog-abrir-caja.component.scss'],
  providers: [FormGroupDirective]
})
export class DialogAbrirCajaComponent implements OnInit {
  aperturaCaja: MovimientosCaja = new MovimientosCaja();
  usuario: Usuarios;
  abrirCajaForm: FormGroup;
  errorString = (prop: string) => {
    const errorMsj = prop === 'monto' ?
      ' sólo con números y hasta 2 decimales' : ', es obligatorio';
    return `Por favor complete el campo ${prop.toLocaleUpperCase()}${errorMsj}`;
  }

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<DialogAbrirCajaComponent>
  ) {
    this.authService.getUser.subscribe((data: any) => {
      this.usuario = JSON.parse(data);
    });
  }

  ngOnInit() {
    this.abrirCajaForm = new FormGroup(
      {
        monto: new FormControl(this.aperturaCaja.monto, [Validators.required, Validators.pattern(RegExpHelper.numberDecimals)]),
        descripcion: new FormControl(this.aperturaCaja.descripcion, [Validators.required])
      }
    );
  }

  guardar() {
    const otrosDatos = {
      usuario: this.usuario,
      tipo: 'APERTURA'
    };

    this.aperturaCaja = {...this.abrirCajaForm.value, ...otrosDatos};

    this.dialogRef.close(this.aperturaCaja);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
