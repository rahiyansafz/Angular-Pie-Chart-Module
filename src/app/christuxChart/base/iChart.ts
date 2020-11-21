import { EventEmitter } from '@angular/core';

export interface IChart {
  width: number;
  height: number;
  values: number[];
  labels: string[];
  colors: string[];
  onClick: EventEmitter<number>;
}

export interface IClickCoordinate {
  clientX: number;
  clientY: number;
  x: number;
  y: number;
  valueIdx: number;
}

export interface IChartOptions {
  animation: boolean;
}
