import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  
  values=[10, 40, 30, 20];
  labels=['Not Good', 'Good', 'Very Good', 'Excelent'];
  colors = ['#34a853', '#FBBC05', '#EA4335', '#4285F4'];

  onClick(idx: number) {
    const message = idx > -1 ? `${this.labels[idx]}: ${this.values[idx]}` : 'Out of pie';
    console.log(message);
  }

  update() {
    this.values=[10, 30, 20, 40];
  }
}
