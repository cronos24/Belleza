import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';

interface Producto {
  id: number;
  name: string;
  imageUrl: string;
  unitValue: number;
}

interface ProductoVenta {
  id: number;
  name: string;
  amount: number;
  unitValue: number;
}

interface Venta {
  cliente: {
    cedula: string;
    direccion: string;
  };
  productosCliente: ProductoVenta[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AppComponent {
  title = 'Cosmeticos Belleza';
  cedula: string = '';
  direccion: string = '';
  productos: Producto[] = [
    { id:1, name: 'Producto 1', imageUrl:'https://ionicframework.com/docs/img/demos/card-media.png', unitValue: 3000},
    { id:2, name: 'Producto 2', imageUrl:'https://ionicframework.com/docs/img/demos/card-media.png', unitValue: 1000 },
    { id:3, name: 'Producto 3', imageUrl:'https://ionicframework.com/docs/img/demos/card-media.png', unitValue: 2000},
  ];
  ventas: Venta = {
    cliente:{
      cedula: '',
      direccion: '',
    },
    productosCliente:[]
  };
  total: number = 0;

  constructor(private cdRef:ChangeDetectorRef, private messageService: MessageService, private confirmationService: ConfirmationService) {}
  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  calcularTotal() {
    let total = 0;
    for (const producto of this.ventas.productosCliente) {
      total += producto.amount*producto.unitValue;
    }
    this.total = total;

    return this.total;
  }

  guardarPedido() {

    if (this.ventas.cliente.cedula == null || this.ventas.cliente.direccion == null || this.ventas.cliente.cedula == '' || this.ventas.cliente.direccion == '') {
      this.messageService.add({ severity: 'error', summary: 'Error!', detail: 'La información del cliente esta incompleta.', life: 3000 });
    }else{
      this.messageService.add({ severity: 'success', summary: 'Ok!', detail: 'Venta registrada correctamente.', life: 3000 }); 
       this.reset();
    }    
  }

  reset(){
    this.ventas = {
      cliente:{
        cedula:'',
        direccion:''
      },
      productosCliente:[]
    }  
  }

  addProd(producto: any) {
  
    var index = this.ventas.productosCliente.findIndex(x => x.id==producto.id); 
    
    if (index == -1) {
      let data = {
        id: producto.id,
        name: producto.name,
        amount: 1,
        unitValue: producto.unitValue
      }
      this.ventas.productosCliente.push(data);
    }else{
      this.ventas.productosCliente[index].amount++;
    }    
  }

  deleteProduct(producto: Producto) {
    this.confirmationService.confirm({
        message: 'Esta seguro de borrar el producto: ' + producto.name + '?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.ventas.productosCliente = this.ventas.productosCliente.filter((val) => val.id !== producto.id);
          this.messageService.add({ severity: 'success', summary: 'Ok!', detail: 'Producto eliminado.', life: 3000 });
        }
    });
}
  
}
