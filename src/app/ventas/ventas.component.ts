import { Component, OnInit} from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router';
// MODELOS
import { Venta } from '../shared/models/venta.model';
import { ProductoPedido } from '../shared/models/producto-venta.model';
// SERVICIOS
import { DataService } from '../core/services/data.service';
// DIALOGOS
import { DialogVerItemsPedidoComponent } from '../dialogs/dialog-ver-items-venta/dialog-ver-items-venta.component';
// CONFIGURACIONES
import { URL_VENTAS } from '../shared/configs/urls.config';
import { TABLA_VENTAS } from '../shared/configs/table.config';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  ventas: Venta[];
  total: number;
  productosVenta: ProductoPedido[] = [];

  tableTitle = TABLA_VENTAS.title;
  dataSource = new MatTableDataSource<Venta>();
  headerTitles = Object.keys(TABLA_VENTAS.cells);
  tableHeaders = TABLA_VENTAS.headers;
  columnCells = TABLA_VENTAS.cells;
  formatTableCells = TABLA_VENTAS.format;
  isLoading: boolean;

  constructor(
    private router: Router,
    private comerciosService: DataService,
    public dialog: MatDialog
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.comerciosService.getAsync(URL_VENTAS.GET_ALL, this.productosVenta).subscribe(
      data => {
        this.dataSource.data = data;
        this.columnCells.opciones = [{
          buttonIcon: 'search',
          buttonLabel: 'Ver items',
          buttonEvent: (venta) => this.verItems(venta.pedido)
        },
        {
          buttonLabel: 'Pactar entrega',
          buttonEvent: (venta) => this.pactarEntrega(venta)
        }];
        this.isLoading = false;
      }
    );
  }

  pactarEntrega(venta: Venta) {
    const navigationExtras: NavigationExtras = {
        queryParams: { pedido: JSON.stringify(venta)}
    };
    this.router.navigate(['agenda'], navigationExtras);
  }

  verItems(pedido: any) {
    const dialogRef = this.dialog.open(
      DialogVerItemsPedidoComponent,
      {
        width: '900px',
        data: { pedido }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // masterToggle() {
  //   this.isAllSelected()
  //     ? this.selection.clear()
  //     : this.dataSource.data.forEach(row => this.selection.select(row));
  // }

}
