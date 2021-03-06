import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Observable } from '@firebase/util';
import { MovieDatabaseModel } from '../../../shared/model/movie-database.model';
import { MovieModel } from '../../../movies/shared/movie.model';
@Injectable()
export class DatabaseService {
  uid = '';

  constructor(private afAuth: AngularFireAuth, private dbf: AngularFirestore) {
    this.afAuth.authState.subscribe(auth => {
      auth ? this.uid = auth.uid : this.uid = null;
    });
  }

  /* CATEGORIES*/
  addCategories(name: string, callback: any) {
    const category = {
      userId: this.uid,
      name: name
    }

    return this.dbf.doc(`Categories/${this.uid}_${name}`)
    .set(category)
    .then(success => callback())
    .catch(err => callback(err));
  }
  getAllCategoriesUser() {
    return this.dbf.collection('Categories', ref => ref
      .where('userId', '==', this.uid)
    ).valueChanges()
  }
  deleteCategories(category: string, callback: any) {
    return this.dbf.doc(`Categories/${this.uid}_${category}`)
      .delete()
      .then(success => callback())
      .catch(err => callback(err))
  }
  /* MOVIES TO CATEGORY */
  addMovieCategory(movie: any, category: string, callback: any) {
    const movieDetails = {
          userId: this.uid,
          movieId: movie.id,
          date: new Date(),
          original_title: movie.original_title,
          overview: movie.overview,
          popularity: movie.popularity,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          category: category,
          status: movie.status || null,
          watched: false
        }

    return this.dbf.doc(`Categories/${this.uid}_${category}`).collection('movies').doc(`${this.uid}_${movie.id}`)
      .set(movieDetails, {merge: true})
      .then(success => callback())
      .catch(err => callback(err));
  }
  getMovieCategory(category: string) {
    return this.dbf.collection('Categories').doc(`${this.uid}_${category}`).collection('movies', ref => ref
      .where('userId', '==', this.uid)).valueChanges()
  }
  deleteMovieCategory(category: string, id: number, callback: any) {
    return this.dbf.doc(`Categories/${this.uid}_${category}`).collection('movies').doc(`${this.uid}_${id}`)
      .delete()
      .then(success => callback())
      .catch(err => callback(err))
  }
  /* CATEGORIES DEFAULT */
  addMovieCategoriesDefault(movie: any, category: string, callback: any) {
    const movieDetails = {
      userId: this.uid,
      movieId: movie.id,
      date: new Date(),
      original_title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      category: category,
      status: movie.status || null,
      watched: false
    }

    return this.dbf.doc(`${category}/${this.uid}_${movie.id}`)
      .set(movieDetails)
      .then(success => callback())
      .catch(err => callback(err));
  }
  getMoviesCategoriesDefault(category: string) {
    return this.dbf.collection(`${category}`, ref => ref
      .where('userId', '==', this.uid)
      .orderBy('date', 'desc')
    ).valueChanges()
  }
  updateMovieCategoriesDefault(movieId: number, watched: boolean, callback: any) {
    this.dbf.doc(`MovieLater/${this.uid}_${movieId}`)
    .update({
      'watched': watched
    })
    .then(success => callback())
    .catch(err => callback(err));
  }
  deleteMoviesCategoriesDefault(category: string, id: number, callback: any) {
    return this.dbf.doc(`${category}/${this.uid}_${id}`)
      .delete()
      .then(success => callback())
      .catch(err => callback(err))
  }

  deleteDatafromUser() {
  // waiting feature from firebase
  }

}
