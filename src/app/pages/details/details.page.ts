import { ProductService } from './../../services/product.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Product } from './../../interfaces/product';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  public product: Product = {};
  public loading: any;
  public productId: string;
  public productSubscription: Subscription;

  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    public authService: AuthService,
    public activatedRoute: ActivatedRoute,
    public productService: ProductService,
    private navController: NavController
  ) {
    this.productId = this.activatedRoute.snapshot.params['id'];

    if (this.productId) {
      this.loadProduct();
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.productSubscription){
      this.productSubscription.unsubscribe();
    }
  }

  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  async saveProduct() {
    await this.presentLoading();

    this.product.userId = (await this.authService.getAuth().currentUser).uid;

    if (this.productId) {
      try {
        await this.productService.updateProduct(this.productId, this.product);
        await this.loading.dismiss();

        this.navController.navigateBack('/home');
      } catch (error) {
        this.presentToast("Erro ao tentar atualizar!");

      }

    } else {
      this.product.createdAt = new Date().getTime();

      try {
        await this.productService.addProducts(this.product);
        await this.loading.dismiss();

        this.navController.navigateBack('/home');
      } catch (error) {
        this.presentToast("Erro ao tentar salvar!");

      }
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
