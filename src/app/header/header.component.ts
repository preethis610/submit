import { Component,ViewChild,ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  show;
  constructor() { }

  ngOnInit(): void {
    // this.ctx = this.canvas.nativeElement.getContext('2d');
  
  }
  showHide(){
    this.show= !this.show;
  }
}

