import { NgModule } from '@angular/core';
import { PieChartComponent } from './pieChart.component';
import { HBarChartComponent } from './hbarChart.component';
import { VBarChartComponent } from './vbarChart.component';

@NgModule({
  imports:      [  ],
  declarations: [ PieChartComponent, HBarChartComponent, VBarChartComponent ],
  exports: [ PieChartComponent, HBarChartComponent, VBarChartComponent ],
  bootstrap:    [  ]
})
export class ChristuxChartModule { }
