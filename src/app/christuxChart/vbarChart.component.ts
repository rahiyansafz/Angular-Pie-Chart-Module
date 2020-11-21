import { Component, Input, Output, ViewChild, ElementRef, OnInit, AfterViewInit, OnChanges, EventEmitter } from '@angular/core';
import { IChart } from './base/iChart';
import { HBarChartComponent, IParts } from './hbarChart.component';

@Component({
  selector: 'vbar-chart',
  templateUrl: './base/chart.component.html',
  styleUrls: ['./base/chart.component.css']
})
export class VBarChartComponent extends HBarChartComponent implements IChart, OnInit, AfterViewInit, OnChanges {

  protected getData() {
    const data: IParts[] = [];

    const width = this.width / (this.values.length * 4 - 1) * 0.9;
    const height = this.height * 0.9;
    const max = this.max(this.values);

    this.values.forEach((value, idx) => {

      data.push({
        value: value,
        label: this.labels[idx],
        x: width * (idx * 4 + 0.5),
        y: this.height * 0.05 + height * (1 - value / max),
        width: width * 3,
        height: value * height / max
      });
    });

    return data;
  }

  protected drawChart(p: number, pidx?: number) {

    const ctx = this.chartContext;

    this.data.forEach((part, idx) => {

      ctx.fillStyle = this.colors[idx];

      ctx.beginPath();

      if (typeof pidx === 'number') {
        if (pidx === idx) {

          const x = part.x - part.width * 0.025;
          const y = part.y - part.height * 0.05;

          ctx.rect(x, y + part.height * (1 - p / 100), part.width * 1.05, part.height * (p / 100) * 1.1);
        }
        else {
          ctx.rect(part.x, part.y + + part.height * (1 - p / 100), part.width, part.height * (p / 100));
        }
      }
      else {
        ctx.rect(part.x, part.y + part.height * (1 - p / 100), part.width, part.height * (p / 100));
      }

      ctx.fill();
      ctx.closePath();
    });
  }
}
