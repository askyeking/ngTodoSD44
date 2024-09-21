import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../models/todo';

@Pipe({
  name: 'incomplete',
  standalone: true
})
export class IncompletePipe implements PipeTransform {

  transform(todos: Todo[], showAll: boolean): Todo[] {
    let results : Todo[] = [];
    if(showAll) {
      return todos;
    }

    for(let todo of todos) {
      if(!todo.completed) {
        results.push(todo);
      }
    }

    return results;
  }

}
