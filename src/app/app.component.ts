import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ExchangeService } from './servicos/exchanges.service'
import { MatSort, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { fromEvent } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
    constructor(private excS: ExchangeService){}

    @ViewChild(MatSort) sort!: MatSort
    @ViewChild('filter',  {static: true}) filter!: ElementRef

    colunasDump: string[] = ['moeda', 'exc', 'high', 'low', 'ocorrencias', 'percentual']
    colunasPump: string[] = ['moeda', 'exc', 'high', 'low', 'ocorrencias', 'percentual']
    colsDumpMexc: string[] = ['moeda', 'exc', 'high', 'low', 'ocorrencias', 'percentual']
    
    dataSource: any 
    dataSourceDump: any
    dsDumpsMexc: any

    ngOnInit()
    {
        this.gerarTabelaHTML()
      // setInterval(() => location.reload() , 900 * 1000)
        this.loadData()

        this.excS.dumpsMexc()
    }

    public loadData() 
    {
        fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => 
        {
          if (!this.dataSource) 
          {
             return
          }
          this.dataSource.filter = this.filter.nativeElement.value
        })
    }
     //monta o ARRAY de fonte de dados para gerar a tabela que será renderizada
     async gerarTabelaHTML()
     {          
         //arrary geral contendo todas as interesecções de todas as exchanges
         let pumps = [],
             dumps = [],
             dumpsMexc = await this.excS.dumpsMexc(),

             binance = await this.excS.pumpsBinance(),
             binDumps = await this.excS.dumpsBinance()
            
         pumps.push( ...binance )
         dumps.push(...binDumps)

 
         this.dataSource = new MatTableDataSource(pumps)
         this.dataSourceDump = new MatTableDataSource(dumps)
         this.dsDumpsMexc = new MatTableDataSource(dumpsMexc)
         this.dataSource.sort = this.sort

        //  this.total_ativos = pumps.length
     }
}
