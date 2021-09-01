import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { IconoService } from '../services/icono.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  icons = this.flowersService.iconos;
  page = 1;
  private filePath : any;

  constructor(
    private flowersService : IconoService,
    private toastr: ToastrService,
    private storage : AngularFireStorage) { }

  async delete(id : any) : Promise<void> {
    // this.filePath = `iconos/${url}`;
    //   const fileRef = this.storage.ref(this.filePath);
    try {
      await this.flowersService.onDeleteFlower(id);
      // fileRef.delete();
      this.toastr.error('Se ha eliminado el registro', 'Eliminado!');
    } catch (err) {
      console.log(err);
    }
  }
}
