import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrasilapiService } from '../brasilapi.service';
import { Estado, Municipio } from '../brasilapi.models';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-cadastro',
  imports: [ 
    FlexLayoutModule, MatCardModule, 
    FormsModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  providers : [ provideNgxMask() ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];


  constructor(
    private service: ClienteService,
    private brasilApiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router
  ){

  }

  salvar(){
    if(!this.atualizando){
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem('Salvo com sucesso!');
    }
    else{
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta']);
      this.mostrarMensagem('Atualizado com sucesso!');
    }
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((query: any) => {
      const params = query['params'];
      const id = params['id']
      if(id) {
        let existeCliente = this.service.buscarClientePorId(id);
        if(existeCliente){
          this.atualizando = true;
          this.cliente = existeCliente;
          const event = { value: this.cliente.uf }
          if(this.cliente.uf) this.carregarMunicipios(event as MatSelectChange);
        }
      }
    })
    this.carregarEstados();
  }

  mostrarMensagem(mensagem: string){
    this.snack.open(mensagem, "Ok");
  }

  carregarEstados(){

    this.brasilApiService.listarEstados().subscribe({
      next: listaEstados => this.estados = listaEstados,
      error: erro => console.log("ocorreu um erro: ", erro)
    })
  }

  carregarMunicipios(evento: MatSelectChange){
    const estadoSelecionado = evento.value;
    this.brasilApiService.listarMunicipios(estadoSelecionado).subscribe({
      next: listaMunicipios => this.municipios = listaMunicipios,
      error: erro => console.log('Ocorreu um erro: ', erro)
    })
  }

}
