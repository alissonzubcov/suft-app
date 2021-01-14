import { AuthService } from './../../services/auth.service';
import { User } from './../../interfaces/user';

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;
  wavesPosition: number = 0;
  wavesDifference: number = 50;
  userLogin: User = {};
  userRegister: User = {};
  loading: any;


  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    public authService: AuthService
  ) {

  }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    if (event.detail.value === "login") {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference
    }
    else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference
    }
  }

  async login() {
    await this.presentLoading();
    // this.route.navigate('/home');
    try {
     const user =  await this.authService.login(this.userLogin);
     console.log(user.user.uid);
    } catch (error) {
      this.presentToast(error.message);
      console.error(error);
    }
    finally {
      this.loading.dismiss();
    }

  }
  async register() {
    await this.presentLoading();
    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      let message: string = '';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = "E-mail já utilizado!";
        case "auth/invalid-email":
          message = "E-mail inválido!";
      }
      this.presentToast(message);
      console.error(error);
    }
    finally {
      this.loading.dismiss();
    }

  }


  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
