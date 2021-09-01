import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Icono } from '../icono';

@Injectable({
  providedIn: 'root'
})
export class IconoService {
  iconos: Observable<Icono[]>;
  private filePath : any;
  private iconosColletion : AngularFirestoreCollection<Icono>;

  constructor(
    private afs : AngularFirestore,
    private storage : AngularFireStorage) {
    this.iconosColletion = afs.collection<Icono>('iconos');
    this.getIconos();
   }

  /*
    Borrar icono recibiendo el id
  */
  onDeleteFlower(idIcono : string): Promise<void>{
    return new Promise (async (resolve, reject) => {
      try {
        const result = await this.iconosColletion.doc(idIcono).delete();
        resolve(result);
      } catch (err) {
        reject(err.messsage);
      }
    });
  }

  /*
    Guardar o editar un icono
  */
  onSaveFlower(icono : Icono, idIcono : string): Promise<void>{
    return new Promise(async(resolve, reject) => {
      try{
        const id = idIcono || this.afs.createId();
        const data = { id, ...icono};
        const result = this.iconosColletion.doc(id).set(data)
        resolve(result);
      }catch(err){
        reject(err.messsage);
      }
    });
  }

  /*
    Obtener iconos
  */
  //Mapeamos los objetos a iconos
  private getIconos(): void {
    this.iconos = this.iconosColletion.snapshotChanges().pipe(
      map(actions => actions.map (a => a.payload.doc.data() as Icono))
    );
  }
}
