
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title(title: any) {
    throw new Error('Method not implemented.');
  }                                                       //we need to be able to call this function so we implement OnInit
  
  public employees: Employee[] | undefined;               //employees cuz it will hold all employees from the backend
  public editEmployee: Employee | undefined;
  public deleteEmployee: Employee | undefined;        

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
      this.getEmployees();                                //whenever this component is initialized it's gonna call getEmployees()
  }

public getEmployees(): void{  
  this.employeeService.getEmployees().subscribe((response: Employee[]) => {
    this.employees = response;
  },
  (error: HttpErrorResponse) => {
    alert(error.message);                                 //this will show an alert to the user
  }

);
}



    public onAddEmployee(addForm: NgForm): void{  //add an employee

        document.getElementById('add-employee-form')?.click();

        this.employeeService.addEmployee(addForm.value).subscribe(
          (response: Employee) => {
            console.log(response);
              this.getEmployees();
              addForm.reset();
          },

          (error: HttpErrorResponse) =>{
            alert(error.message);
            addForm.reset();
          }
        );
        
    }

    
    public onUpdateEmployee(employee: Employee): void{  //update an employee

      // document.getElementById('add-employee-form')?.click(); //No need for this, if the user dont want to edit anymore. They can just close it.

      this.employeeService.updateEmployee(employee).subscribe(
        (response: Employee) => {
          console.log(response);
            this.getEmployees();
          
        },

        (error: HttpErrorResponse) =>{
          alert(error.message);
        }
      );
      
  }



  public onDeleteEmployee(employeeId: number): void{  //delete an employee

    // document.getElementById('add-employee-form')?.click();

    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
          this.getEmployees();
      },

      (error: HttpErrorResponse) =>{
        alert(error.message);
      }
    );
    
}

    public searchEmployees(key: string): void{

      const results: Employee[] = [];
      for( const employee of this.employees! ){          // this is from "public employees: Employee[];" and we will loop through all of them
  
          if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1           // if it is -1 it means it is NOT present. so we use !== to see if it IS present
          || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
          || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){ 

                results.push(employee);
      }
    }   

        this.employees = results; // after the loop, this will present the new list

        if(results.length === 0 || !key){   // this nothing is matched names,emails etc this will call all employees and thus it will reset.
          this.getEmployees(); 
        }

  }

    public onOpenModal(mode: string, employee?: Employee): void{ // we looked to html of modal in  bootstrap 4, from looking there we create our own version programaticly

      const button = document.createElement('button');
      const container = document.getElementById('main-container');

      button.type = 'button';       // we change the type from submit wich is the default to button.
      button.style.display = 'none'; // we dont want to display the button wich is in the taskbar so we use this
      button.setAttribute('data-toggle', 'modal');


      if(mode === 'add'){           // wich button is clicked? what will be the attribute on the clicked button? to decide this we create an if statment
        button.setAttribute('data-target', '#addEmployeeModal');

      }else if( mode === 'edit'){

      button.setAttribute('data-target', '#updateEmployeeModal');

      this.editEmployee = employee; // now we can bind this to the form in app.component.html 

      


    }else if( mode === 'delete'){
    button.setAttribute('data-target', '#deleteEmployeeModal');
    
    this.deleteEmployee = employee;
  }

  container?.appendChild(button);
  button.click(); // u will be able to click


    }
}
