import { Component, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges } from '@angular/core';
import { IClickCoordinate, IChartOptions } from './iChart';

export abstract class AChart {

  @Input() width: number;
  @Input() height: number;
  @Input() values: number[];
  @Input() labels: string[];
  @Input() colors: string[];
  @Input() options?: IChartOptions;

  @Output() onClick = new EventEmitter<number>();

  @ViewChild('chartCanvas') chartCanvas: ElementRef;
  @ViewChild('tipCanvas') tipCanvas: ElementRef;

  protected chartContext: CanvasRenderingContext2D;
  private tipContext: CanvasRenderingContext2D;

  private initialized = false;
  private previousMouseoverSelection = -1;

  // Methods to be overriden
  protected abstract initData();
  protected abstract drawChart(progression: number, selectedValueIdx?: number);
  protected abstract getValueIdx(x: number, y: number): number;

  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized) {
      if (!this.checkData()) {
        throw new Error('Data missing or not set properly');
      }
      this.initData();
      this.render();
    }
  }

  ngOnInit() {
    this.chartContext = (<HTMLCanvasElement>this.chartCanvas.nativeElement).getContext('2d');
    this.tipContext = (<HTMLCanvasElement>this.tipCanvas.nativeElement).getContext('2d');

    if (!this.checkData()) {
      throw new Error('Data missing or not set properly');
    }

    this.initData();
    this.initialized = true;
  }

  // Rezise canvas and render chart
  ngAfterViewInit() {
    this.chartCanvas.nativeElement.width = this.width;
    this.chartCanvas.nativeElement.height = this.height;

    this.render();
  }

  click(event: MouseEvent) {
    //event.stopPropagation();
    this.onClick.emit(this.getCoordinates(event).valueIdx);
  }

  onMouseLeave(event: MouseEvent) {
    this.drawChart(100);
    this.hideTooltip();
    this.previousMouseoverSelection = -1;
  }

  onMouseMove(event: MouseEvent) {

    const { clientX, clientY, valueIdx } = this.getCoordinates(event);
    const tooltip = this.tipCanvas.nativeElement;

    // Draws chart if selection changed
    if (this.previousMouseoverSelection !== valueIdx) {
      this.clearChart();
      this.drawChart(100, valueIdx);
    }

    // Draws tooltip
    if (valueIdx > -1) {

      let offsetX = 0;
      if (clientX - tooltip.width / 2 > 0) {

        if (clientX + tooltip.width / 2 >= window.innerWidth) {
          offsetX = clientX - tooltip.width;
        }
        else {
          offsetX = tooltip.width / 2;
        }
      }
      else {
        offsetX = clientX;
      }

      this.showTooltip(clientX - offsetX, clientY - 40, valueIdx);
    }
    else {
      this.hideTooltip();
    }

    // Saves selection
    this.previousMouseoverSelection = valueIdx;
  }

  private checkData(): boolean {
    if (this.values && this.labels && this.colors) {
      if (this.values.length === this.labels.length && this.values.length === this.colors.length) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  private render() {

    const anim = this.options ? this.options.animation : true;

    if (anim) {

      let p = 0;
      let interval = setInterval(() => {

        if (p <= 100) {
          this.clearChart();
          this.drawChart(p);
          p += 5;
        }
        else {
          clearInterval(interval);
        }
      }, 60);

    }
    else {
      this.clearChart();
      this.drawChart(100);
    }
  }

  protected getCoordinates(event: MouseEvent): IClickCoordinate {

    const rect = this.chartCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {
      clientX: event.clientX,
      clientY: event.clientY,
      x: x,
      y: y,
      valueIdx: this.getValueIdx(x, y)
    };
  }

  protected getInfo(dataIdx: number): string {
    return dataIdx > -1 ? `${this.labels[dataIdx]} : ${this.values[dataIdx]}` : 'Out of chart';
  }

  private showTooltip(x: number, y: number, dataIdx: number) {

    const tooltip = this.tipCanvas.nativeElement;
    const text = this.getInfo(dataIdx);
    const font = 'bold 12px sans-serif';

    // Sets position
    tooltip.style.left = x.toString() + "px";
    tooltip.style.top = y.toString() + "px";

    // Draws tooltip
    if (this.previousMouseoverSelection !== dataIdx) {

      // Resize tooltip
      this.tipContext.font = font;
      const textWidth = this.tipContext.measureText(text).width;
      tooltip.width = textWidth + 35;

      // Clear tip
      this.tipContext.clearRect(0, 0, tooltip.width, tooltip.height);
      tooltip.style.display = 'block';

      // Draw color box
      this.tipContext.rect(10, 7, 10, 10);
      this.tipContext.fillStyle = this.colors[dataIdx % this.colors.length];
      this.tipContext.fill();

      // Write text
      this.tipContext.textAlign = "center";
      this.tipContext.fillStyle = "white";
      this.tipContext.font = font;
      this.tipContext.fillText(text, tooltip.width / 2 + 10, 16);
    }
  }

  private hideTooltip() {
    const tooltip = this.tipCanvas.nativeElement;
    tooltip.style.display = 'none';
  }

  private clearChart() {
    const canvas = this.chartCanvas.nativeElement;
    this.chartContext.clearRect(0, 0, canvas.width, canvas.height);
  }

  protected sum(array: number[]): number {
    let sum = 0;
    array.forEach(value => sum += value);
    return sum;
  }

  protected max(array: number[]): number {
    let max = 0;
    array.forEach(value => max = value > max ? value : max);
    return max;
  }
}
