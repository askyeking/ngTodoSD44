import { IncompletePipe } from './../../pipes/incomplete.pipe';
import { TodoService } from './../../sevices/todo.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IncompletePipe],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  title = "ngTodo";

  todos: Todo[] = [];

  newTodo: Todo = new Todo();
  editTodo: Todo | null = null;
  selected: Todo | null = null;

  showComplete: boolean = false;

  constructor(
    private todoService: TodoService,
    private incompletePipe: IncompletePipe,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){}

  ngOnInit() : void {
    this.loadTodos();
    this.activatedRoute.paramMap.subscribe(
      {
        next: (params) => {
          let todoIdStr = params.get("todoId");
          if(todoIdStr) { //make sure parameter was present
            let todoId = parseInt(todoIdStr);
            if(isNaN(todoId)){ //make sure parameter was a valid number
              this.router.navigateByUrl('notFound');
            } else {
              this.findTodoById(todoId);
            }
          }
        }
      }
    );
  }

  findTodoById(todoId: number) : void {
    this.todoService.show(todoId).subscribe({
      next: (todo) => {
        this.selected = todo;
      },
      error: (err) => {
        this.router.navigateByUrl('notFound');
        console.error(err);
        console.error("error in subscribe for finding todo by id");
      }
    });
  }

  loadTodos() : void {
    this.todoService.index().subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (err) => {
        console.error(err);
        console.error("error in subscribe");
      }
    });
  }

  getBackgroundColor() : string{
    let todoCount = this.getTodoCount();

    return todoCount > 10 ? 'bg-danger' : todoCount > 5 ? 'bg-warning' : 'bg-success';
  }

  getTodoCount() : number {
    return this.incompletePipe.transform(this.todos, false).length;
  }

  displayTodo(todo: Todo) : void {
    this.selected = todo;
  }

  displayTable() : void {
    this.selected = null;
  }

  addTodo(newTodo: Todo) : void {
    this.todoService.create(newTodo).subscribe({
      next: (newTodo) => {
        this.loadTodos();
        this.newTodo = new Todo();
      },
      error: (err) => {
        console.error(err);
        console.error("error in subscribe");
      }
    });

  }




  setEditTodo() : void {
    this.editTodo = Object.assign({}, this.selected);

  }



  updateTodo(editTodo: Todo) : void {
   this.todoService.update(editTodo).subscribe({
    next: (todo) => {
      this.loadTodos();
      this.selected = null;
    },
    error: (err) => {
      console.error(err);
      console.error("error in subscribe");
    }
   });
  }

  deleteTodo(id: number) : void{
    this.todoService.destroy(id).subscribe({
      next: (todo) => {
        this.loadTodos();
      },
      error: (err) => {
        console.error(err);
        console.error("error in subscribe");
      }
    });

  }
}
