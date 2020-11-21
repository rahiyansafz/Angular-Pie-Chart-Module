import { Component, Input, Output, ViewChild, ElementRef, OnInit, AfterViewInit, OnChanges, EventEmitter } from '@angular/core';
import { IChart } from './base/iChart';
import { AChart } from './base/aChart';

@Component({
  selector: 'pie-chart',
  templateUrl: './base/chart.component.html',
  styleUrls: ['./base/chart.component.css']
})
export class PieChartComponent extends AChart implements IChart, OnInit, AfterViewInit, OnChanges {

  private data: IParts[];
  private pie: IPie;

  protected initData() {
    this.data = this.getData();
    this.pie = {
      x0: this.width / 2,
      y0: this.height / 2,
      radius: Math.min(this.width, this.height) / 2 * .9
    };
  }

  protected drawChart(p: number, pidx?: number) {

    const ctx = this.chartContext;
    const pie = this.pie;

    this.data.forEach((part, idx) => {

      // Set style
      ctx.fillStyle = this.colors[idx];

      ctx.beginPath();
      ctx.moveTo(pie.x0, pie.y0);

      if (typeof pidx === 'number') {
        if (pidx === idx) {
          ctx.arc(pie.x0, pie.y0, pie.radius * 1.05, part.startAngle * (p / 100), part.endAngle * (p / 100));
        }
        else {
          ctx.arc(pie.x0, pie.y0, pie.radius, part.startAngle * (p / 100), part.endAngle * (p / 100));
        }
      }
      else {
        ctx.arc(pie.x0, pie.y0, pie.radius, part.startAngle * (p / 100), part.endAngle * (p / 100));
      }

      ctx.fill();
      ctx.closePath();
    });
  }


  private getData(): IParts[] {

    let data: IParts[] = [];
    let startAngle = 0;
    const sum = this.sum(this.values);

    this.values.forEach((value, idx) => {
      let endAngle = startAngle + value / sum * 2 * Math.PI;

      data.push({
        value: value,
        label: this.labels[idx],
        startAngle: startAngle,
        endAngle: endAngle
      });

      startAngle = endAngle;
    });

    return data;
  }


  protected getValueIdx(x: number, y: number): number {

    const pie = this.pie;

    const radius = Math.sqrt((x - pie.x0) * (x - pie.x0) + (y - pie.y0) * (y - pie.y0));
    const angle = Math.atan2((y - pie.y0), (x - pie.x0)) + (y < pie.y0 ? 2 * Math.PI : 0);

    let dataIdx = -1;

    if (radius <= pie.radius) {
      this.data.forEach((part, idx) => {
        if (angle >= part.startAngle && angle < part.endAngle) {
          dataIdx = idx;
        }
      });
    }

    return dataIdx;
  }

}

interface IPie {
  x0: number;
  y0: number;
  radius: number;
}

interface IParts {
  value: number;
  label: string;
  startAngle: number;
  endAngle: number;
}

