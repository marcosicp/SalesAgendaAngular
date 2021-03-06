import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// MODELOS
import { Clientes } from '../../shared/models/clientes.model';
// MOCKS
import Facturas from '../../shared/mocks/facturas.mock';
// REGEXP HELPER
import RegExpHelper from '../../shared/helpers/regex.helper';

@Component({
  selector: 'app-dialog-cliente-add-edit',
  templateUrl: './dialog-cliente-add-edit.component.html',
  styleUrls: ['./dialog-cliente-add-edit.component.scss'],
  providers: [FormGroupDirective]
})
export class DialogClienteAddEditComponent implements OnInit {
  dialogTitle: string;
  cliente: Clientes;
  result: Clientes[] = [];
  clientForm: FormGroup;
  facturas = Facturas;
  errorString = (prop: string) => {
    const errorText = `Por favor complete el campo ${prop.toLocaleUpperCase()}`;
    switch (prop) {
      case 'nombre':
        return `${errorText} sólo con letras`;
      case 'email':
        return `${errorText} con el email completo (@gmail.com, por ejemplo)`;
      case 'telefono':
        return `${errorText} con un mínimo de 10 números (sin puntos, letras ni otros caracteres)`;
      case 'cuil':
        return `${errorText} con un mínimo de 11 números (sin puntos, letras ni otros caracteres)`;
      default:
        return `${errorText}, es obligatorio`;
    }
  }

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data?: Clientes
  ) {
    this.cliente = data || new Clientes();
    this.dialogTitle = `${data ? 'Modificar' : 'Registrar'} cliente`;
  }

  ngOnInit() {
    this.clientForm = new FormGroup(
      {
        nombre: new FormControl(this.cliente.nombre, [Validators.required, Validators.pattern(RegExpHelper.lettersSpace)]),
        razonSocial: new FormControl(this.cliente.razonSocial, [Validators.required, Validators.pattern(RegExpHelper.lettersSpace)]),
        cuil: new FormControl(this.cliente.cuil, [Validators.required, Validators.pattern(RegExpHelper.numbers), Validators.minLength(11)]),
        telefono: new FormControl(this.cliente.telefono, [Validators.required, Validators.pattern(RegExpHelper.numbers), Validators.minLength(10)]),
        email: new FormControl(this.cliente.email, [Validators.required, Validators.email]),
        direccion: new FormControl(this.cliente.direccion, [Validators.required]),
        tipoFactura: new FormControl(this.cliente.tipoFactura, [Validators.required])
      }
    );
  }

  guardarCliente() {
    Object.keys(this.clientForm.value).forEach(
      prop => this.cliente[prop] = this.clientForm.value[prop]
    );
    this.dialogRef.close(this.cliente);
  }

  onNoClick() {
    this.dialogRef.close(false);
  }
}
