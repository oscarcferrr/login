import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userToken: string;
  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apikey = 'AIzaSyCi-CmHq3gy2pRsQVwA1Y4adLI56OS2Jks';
  // Crear nuevos usuarios
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]

  // Login
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]
  constructor( private http: HttpClient) {  
      this.leerToken();
   }
  
    logout() {
      
    }
    login( usuario: UsuarioModel){
      const authData = {
        ...usuario,
        returnSecureToken: true

      };
      return this.http.post(
        `${this.url}/verifyPassword?key=${this.apikey}`,
         authData
      ).pipe(
        map( resp => {
          // console.log('Entro en el mapa del RXJS');
           this.guardarToken( resp['idToken'] );
           console.log(resp);
           return resp;
        })
   );
    }

    nuevoUsuario( usuario: UsuarioModel){
      const authData = {
        email: usuario.email,
        password: usuario.password,
        returnSecureToken: true

      };
      return this.http.post(
        `${this.url}/signupNewUser?key=${this.apikey}`,
         authData
      ).pipe(
           map( resp => {
            // console.log('Entro en el mapa del RXJS');
              this.guardarToken( resp['idToken'] );
              return resp;
           })
      );
    }

    private guardarToken(idToken: string ) {
        this.userToken = idToken;
        localStorage.setItem('token', idToken);
    }

    leerToken() {
       if ( localStorage.getItem('token')){
           this.userToken = localStorage.getItem('token');
       } else {
          this.userToken = '';
       }
       return this.userToken;
    }
}
