import { Product } from './../interfaces/product';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  //snapshotChanges - retorna tudo
  //valueChanges - não retorna o id do documento
  private productsCollection: AngularFirestoreCollection<Product>;

  constructor(private angularFirestore: AngularFirestore) { 
    this.productsCollection = this.angularFirestore.collection<Product>('Products');
  }

  getProducts(){
    return this.productsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          
          return {id, ...data}
        })
      })
    )
  }

  addProducts(product: Product){
    return this.productsCollection.add(product);
  }

  getProduct(id:string){
    return this.productsCollection.doc<Product>(id).valueChanges();
  }
  updateProduct(id:string, product: Product){
    //this.productsCollection.doc<Product>(id).set({price: '299'}); // atualiza atributo
    return this.productsCollection.doc<Product>(id).update(product);
  }

  deleteProduct(id: string){
    return this.productsCollection.doc<Product>(id).delete();
  }
}
