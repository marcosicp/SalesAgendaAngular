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
  selector: 'app-dialog-ingreso-caja',
  templateUrl: './dialog-ingreso-caja.component.html',
  styleUrls: ['./dialog-ingreso-caja.component.scss'],
  providers: [FormGroupDirective]
})
export class DialogIngresoCajaComponent implements OnInit {
  depositoCaja: MovimientosCaja = new MovimientosCaja();
  usuario: Usuarios;
  depositoForm: FormGroup;
  errorString = (prop: string) => {
    const errorMsj = prop === 'monto' ?
      ' sólo con números y hasta 2 decimales' : ', es obligatorio';
    return `Por favor complete el campo ${prop.toLocaleUpperCase()}${errorMsj}`;
  }
  // TODO: campo de cuanto tendria que tener hipoteticamente apertura + depositos - retiros
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<DialogIngresoCajaComponent>
  ) {
    this.authService.getUser.subscribe((data: any) => {
      this.usuario = JSON.parse(data);
    });
  }

  ngOnInit() {
    this.depositoForm = new FormGroup(
      {
        monto: new FormControl(this.depositoCaja.monto, [Validators.required, Validators.pattern(RegExpHelper.numberDecimals)]),
        descripcion: new FormControl(this.depositoCaja.descripcion, [Validators.required])
      }
    );
  }

  guardar() {
    const otrosDatos = {
      usuario: this.usuario,
      tipo: 'DEPOSITO'
    };

    this.depositoCaja = {...this.depositoForm.value, ...otrosDatos};

    this.dialogRef.close(this.depositoCaja);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
