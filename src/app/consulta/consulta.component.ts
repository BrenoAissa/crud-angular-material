import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cadastro/cliente';

@Component({
  selector: 'app-consulta',
  imports: [
    MatInputModule, MatCardModule,
    FlexLayoutModule, MatIconModule,
    FormsModule, MatTableModule, MatButtonModule,
    CommonModule
],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent implements OnInit{

  listarCliente: Cliente[] = [];
  colunasTabela: string[] = ["id", "nome", "dataNascimento", "cpf", "email"]
  nomeBusca: string = '';
  
  constructor(private service: ClienteService){
    
  }

  ngOnInit(): void { 
    this.listarCliente = this.service.buscarCliente('');

  }

  buscar(){
    this.listarCliente = this.service.buscarCliente(this.nomeBusca);
  }
}
