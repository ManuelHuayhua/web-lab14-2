import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-reporte-peliculas',
  templateUrl: './reporte-peliculas.component.html',
  styleUrls: ['./reporte-peliculas.component.css']
})
export class ReportePeliculasComponent implements OnInit {
  peliculas: any[] = [];
  generoFiltro: string = '';
  anioFiltro: number = 0;


  filtrarPeliculas() {
    this.peliculas = this.peliculas.filter(pelicula => {
      // Aplica las condiciones de filtrado según los valores seleccionados en los filtros
      const cumpleGenero = this.generoFiltro === '' || pelicula.genero === this.generoFiltro;
      const cumpleAnio = this.anioFiltro === 0 || pelicula.lanzamiento === this.anioFiltro;
      return cumpleGenero && cumpleAnio;
    });
    
    this.generarPDF();
  
  }
  
  constructor(private http: HttpClient) {
    (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
    this.http.get<any[]>('./assets/peliculas.json').subscribe(data => {
      this.peliculas = data;
    });
  }
  exportarExcel() {
    const data = [
      ['Título', 'Género', 'Año de lanzamiento'],
      ...this.peliculas.map(pelicula => [pelicula.titulo, pelicula.genero, pelicula.lanzamiento.toString()])
    ];
  
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Informe');
  
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.guardarArchivo(excelBuffer, 'informe.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
  
  private guardarArchivo(buffer: any, nombreArchivo: string, tipoArchivo: string) {
    const data: Blob = new Blob([buffer], { type: tipoArchivo });
    saveAs(data, nombreArchivo);
  }
  
  generarPDF() {
    const contenido = [
      { text: 'Informe de Películas', style: 'header' },
      { text: '\n\n' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: [
            ['Título', 'Género', 'Año de lanzamiento'],
            ...this.peliculas.map(pelicula => [pelicula.titulo, pelicula.genero, pelicula.lanzamiento.toString()])
          ]
        }
      }
    ];
  
    const estilos = {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#FF0000'
        
        
      },
      tableHeader: {
        bold: true,
        fillColor: '#dddddd',
        fontSize: 12,
        alignment: 'center',
        color: '#FF0000'
      },
      tableRow: {
        fontSize: 10,
        alignment: 'center',
        color: '#FF0000'
      }
    };
  
    const documentDefinition = {
      content: contenido,
      styles: estilos as any
    };
    
  
    pdfMake.createPdf(documentDefinition).getBlob((blob: Blob) => {
      saveAs(blob, 'informe.pdf');
    });
    
  }
}