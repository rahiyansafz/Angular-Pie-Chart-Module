import { Component, Input, Output, ViewChild, ElementRef, OnInit, AfterViewInit, OnChanges, EventEmitter } from '@angular/core';
import { IChart } from './base/iChart';
import { AChart } from './base/aChart';

@Component({
  selector: 'hbar-chart',
  templateUrl: './base/chart.component.html',
  styleUrls: ['./base/chart.component.css']
})
export class HBarChartComponent extends AChart implements IChart, OnInit, AfterViewInit, OnChanges {

  protected data: IParts[];

  protected initData() {
    this.data = this.getData();
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

          ctx.rect(x, y, part.width * (p / 100) * 1.05, part.height * 1.1);
        }
        else {
          ctx.rect(part.x, part.y, part.width * (p / 100), part.height);
        }
      }
      else {
        ctx.rect(part.x, part.y, part.width * (p / 100), part.height);
      }

      ctx.fill();
      ctx.closePath();
    });
  }


  protected getValueIdx(x: number, y: number): number {

    let dataIdx = -1;

    this.data.forEach((part, idx) => {

      if (x >= part.x && x <= part.x + part.width) {
        if (y >= part.y && y <= part.y + part.height) {
          dataIdx = idx;
        }
      }
    });

    return dataIdx;
  }

  protected getData() {
    const data: IParts[] = [];

    const width = this.width * 0.9;
    const height = this.height / (this.values.length * 4 - 1) * 0.9;
    const max = this.max(this.values);

    this.values.forEach((value, idx) => {

      data.push({
        value: value,
        label: this.labels[idx],
        x: this.width * 0.05,
        y: height * (idx * 4 + 0.5),
        width: value * width / max,
        height: height * 3
      });
    });

    return data;
  }
}

export interface IParts {
  value: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
