import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileI } from '../file';
import { Icono } from '../icono';
import { IconoService } from '../services/icono.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  icono : Icono;
  iconoToSend : Icono;
  private image : any;
  private filePath : any;
  public url: string;

  messages = {
    minLength : "Ingresa el minimo de caracteres",
    required : "Este campo es requerido"
  }

  iconoForm : FormGroup;
  constructor( 
    private fb : FormBuilder, 
    private storage : AngularFireStorage,
    private iconoService: IconoService,
    private toastr: ToastrService) {

    // const navigation = this.router.getCurrentNavigation();
    // this.icono = navigation?.extras?.state?.value;
    this.initForm();
  }

  ngOnInit(): void {

    if(typeof this.icono === 'undefined'){
      //redirect
      // this.router.navigate(['new']);
    }else {
      this.iconoForm.patchValue(this.icono);
      this.url = this.icono.urlIcono;
    }
  }

  private initForm() : void {
    this.iconoForm = this.fb.group({
      titulo : ['', [Validators.required, Validators.minLength(5)] ],
      urlIcono : ['']
    });
  }

  isValidField (field : string) : string {
    const validatedField = this.iconoForm.get(field);
    return (!validatedField.valid && validatedField.touched)
    ? 'is-invalid' : validatedField.touched ? 'is-valid' : '';
  }

  async handleImage(event : any) {
    this.image = event.target.files[0];
    console.log('image', this.image);
    this.uploadImage(this.image);
  }


  onSave() : void {
    if(this.iconoForm.valid){
      this.iconoToSend = this.iconoForm.value;
      this.iconoToSend.urlIcono = this.url;
      const iconoId =  null;
      this.iconoService.onSaveFlower(this.iconoToSend, iconoId);
      this.iconoForm.reset();
      this.url = "";
      this.toastr.success('Se han guardado los cambios', 'Exito!');
      // this.onGoBack();
    }
  }

  // onGoBack() : void {
  //   this.router.navigate(['list']);
  // }

  
  async uploadImage(image : FileI) {
    this.filePath = `iconos/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    try {
      const task = this.storage.upload(this.filePath, image);
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(urlImage => {
              this.url = urlImage;
              console.log('URL service', urlImage);
            });
          })
        ).subscribe();
    } catch (error) {
      console.error(error);
    }
  }
}

