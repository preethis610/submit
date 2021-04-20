import { Component, OnInit, Input ,ElementRef,ViewChild} from '@angular/core';

import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style,
  trigger,state,transition
} from "@angular/animations";
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [
  
  ]
})
export class CardComponent implements OnInit {
 @Input() cardContent;
 @Input() isCenterCard;
 @ViewChild('canvas', { static: true }) 
canvas: ElementRef<HTMLCanvasElement>;
ctx: CanvasRenderingContext2D;
requestId;
interval;

isDisabled = false;
isOpen = false;
toggleAnimations() {
  this.isDisabled = !this.isDisabled;
}

toggle() {
  this.isOpen = !this.isOpen;
}
constructor() {}
 

  play() {
   
   

  }
  ngOnInit(): void {
   
//     let canvas = document.getElementById('canvas') as
//     HTMLCanvasElement;
// let ctx = canvas.getContext("2d");
// // ctx.beginPath();
// // //ctx.rect(20, 20, 10, 10);
// // ctx.lineTo(10, 12);
// //     ctx.lineTo(100, 25);
// // ctx.stroke();
// var rectangle = new Path2D();
// setTimeout(e =>  rectangle.rect(10, 10, 50, 50);

// var circle = new Path2D();
// circle.arc(100, 35, 25, 0, 2 * Math.PI);

// ctx.stroke(rectangle);
// ctx.fill(circle), 500);


this.ctx = this.canvas.nativeElement.getContext('2d');


setInterval(() => {
  // this.ctx.beginPath();
  // this.ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
  // this.ctx.moveTo(110, 75);
  // this.ctx.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
  // this.ctx.moveTo(65, 65);
  // this.ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
  // this.ctx.moveTo(95, 65);
  // this.ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
// this.ctx.strokeRect(0, 0, 60, 60);
  this.ctx.lineWidth = 0.07;
  this.ctx.strokeStyle= '#d3d3d3';
  this.ctx.beginPath();
  this.ctx.moveTo(0, 0);
  this.ctx.lineTo(100, 100);
  this.ctx.stroke();
  this.ctx.beginPath();
  this.ctx.moveTo(0,100);
  this.ctx.lineTo(100, 0);
  this.ctx.stroke();
  
}, 200);
  }
}
