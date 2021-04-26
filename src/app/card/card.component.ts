import { Component, OnInit,EventEmitter,Output, Input ,ElementRef,ViewChild} from '@angular/core';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
 
})
export class CardComponent implements OnInit {
 @Input() cardContent;
 @Input() set isCenterCard(value) {
  this.centerId = value;
 }
 @Output() nextPrev = new EventEmitter<number>();
 @ViewChild('canvas', { static: true }) 
canvas: ElementRef<HTMLCanvasElement>;
@ViewChild('canvasCenter', { static: true }) 
canvasCenter: ElementRef<HTMLCanvasElement>;
ctx: CanvasRenderingContext2D;
ctxCenter: CanvasRenderingContext2D;
requestId;
interval;
centerId;
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
   
if(this.canvas){
  this.ctx = this.canvas.nativeElement.getContext('2d');
}
if(this.canvasCenter){
  this.ctxCenter = this.canvasCenter.nativeElement.getContext('2d');
}




setInterval(() => {
  
if(this.ctx){
  this.ctx.lineWidth = 1.5;
  this.ctx.strokeStyle= '#d3d3d3';
  this.ctx.beginPath();
  this.ctx.moveTo(0, 0);
  this.ctx.lineTo(300, 150);
  this.ctx.stroke();
  this.ctx.moveTo(0,0);
  this.ctx.lineTo(0, 0);
  this.ctx.moveTo(300,0);
  this.ctx.lineTo(0, 150);
  this.ctx.stroke();
}
  
if(this.ctxCenter){
  this.ctxCenter.lineWidth = 1.5;
  this.ctxCenter.strokeStyle= '#d3d3d3';
  this.ctxCenter.beginPath();
  this.ctxCenter.moveTo(0, 0);
  this.ctxCenter.lineTo(300, 150);
  this.ctxCenter.stroke();
  this.ctxCenter.moveTo(0,0);
  this.ctxCenter.lineTo(0, 0);
  this.ctxCenter.moveTo(300,0);
  this.ctxCenter.lineTo(0, 150);
  this.ctxCenter.stroke();
  
}


  // this.ctx.beginPath();
  // this.ctx.moveTo(170,15);
  // this.ctx.lineTo(190, 130);
  // this.ctx.stroke();
  
}, 200);
  }
  nextOrPrev(event) {
   this.nextPrev.emit(event.offsetX);
  }
}
