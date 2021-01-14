import { ToastController, LoadingController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import { AuthService } from './../../services/auth.service';
import { ProductService } from './../../services/product.service';
import { Product } from './../../interfaces/product';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public products: Product[] = [];
  public productSubscription: Subscription;
  public loading: any;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    public toastController: ToastController,
    public loadingController: LoadingController,

  ) {
    /*
      this.productService.getProducts().subscribe retorna um subscrition, quando está criando listner
      ou observable.
      Quando ocorrer o destroy da pagina, o angular retira a pagina da tela ** porém
      os listners ficam em background rodando e deve ser retirado pois pode ocorrer problemas
      de mémoria no app
    */
  }

  ngOnInit() {
    this.productSubscription = this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
      }
    );
  }

  /**
   * Deve-se adotar o hábito de destroir todos listners que estiver em uso.
   * Todo promise e observable ocorre isso
   */
  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }

  async deleteProduct(id: string) {
    try {
      await this.productService.deleteProduct(id);
    } catch (error) {
      this.presentToast("Erro ao tentar excluir!");

    }

  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error.message);
    }
    finally {

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
