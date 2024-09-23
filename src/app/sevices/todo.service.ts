import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TodoService {


  private baseUrl = environment.baseUrl;
  private url = this.baseUrl + 'api/todos';

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  index():Observable<Todo[]>{
    return this.http.get<Todo[]>(this.url).pipe(
      catchError(
        (err: any) => {
          console.log(err);
          return throwError(
            () => { return new Error("TodoService.index(): error retrieving todos:"  + err); }
          );
        }
      )
    );

  }

  show(todoId: number) : Observable<Todo> {
    return this.http.get<Todo>(`${this.url}/${todoId}`).pipe(
      catchError(
        (err: any) => {
          console.log(err);
          return throwError(
            () => { return new Error("TodoService.show(): error retrieving todo with an id of " + todoId + ": "  + err); }
          );
        }
      )
    );
  }

  create(newTodo:Todo) : Observable<Todo>{
    return this.http.post<Todo>(this.url,newTodo).pipe(
      catchError(
        (err: any) => {
          console.log(err);
          return throwError(
            () => { return new Error("TodoService.create(): error creating todo:"  + err); }
          );
        }
      )
    );
  }

  update(updateTodo:Todo) : Observable<Todo> {
    //business logic
    if(updateTodo.completed) {
       updateTodo.completeDate = this.datePipe.transform(Date.now(), 'shortDate');
    } else {
      updateTodo.completeDate = "";
    }


    return this.http.put<Todo>(this.url + '/' + updateTodo.id ,updateTodo).pipe(
      catchError(
        (err: any) => {
          console.log(err);
          return throwError(
            () => { return new Error("TodoService.update(): error updating todo:"  + err); }
          );
        }
      )
    );
  }



  destroy(id: number) {
    return this.http.delete<Todo>(this.url + '/' + id).pipe(
      catchError(
        (err: any) => {
          console.log(err);
          return throwError(
            () => { return new Error("TodoService.delete(): error deleting todo:"  + err); }
          );
        }
      )
    );
  }
}
