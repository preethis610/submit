import {
  Component, OnInit, AfterViewInit, HostBinding, Output, EventEmitter,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,

  ViewChildren
} from '@angular/core';
import { CarouselItemDirective } from '../carousel-item.directive';
import { CarouselItemElementDirective } from '../carousel-item-element.directive';
import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
  style, group,
  trigger, state, transition, query, stagger
} from "@angular/animations";
import { rendererTypeName } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],

})
export class CarouselComponent implements AfterViewInit, OnInit {
  ngOnInit() {
    this.centerCardId = this.totalVisibleCount !== 0 ? Math.round(this.totalVisibleCount / 2) : 0;
    this.centerIdString = '#t' + this.centerCardId;
    this.changeCenterCard.emit(this.centerCardId);
  }
  isDisabled = false;
  isOpen = false;
  nextPrevIdString: any;
  centerIdString;
  @Output() changeCenterCard = new EventEmitter<number>();
  @ContentChildren(CarouselItemDirective) items: QueryList<
    CarouselItemDirective>;
  @ViewChildren(CarouselItemElementDirective, { read: ElementRef })
  private itemsElements: QueryList<ElementRef>;
  @ViewChild("carousel") private carousel: ElementRef;
  totalVisibleCount = 5;
  private player: AnimationPlayer;
  private itemWidth: number;
  private currentSlide = 0;
  centerCardId;
  nextPrevId = null;
  initPlayer;
  lastAction = null;

  constructor(private builder: AnimationBuilder) { }

  ngAfterViewInit() {
    this.growCenterCard();
    this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
  }

  growCenterCard() {
    const centerCardAnim: AnimationFactory = this.growCenterCardAnim();
    this.initPlayer = centerCardAnim.create(this.carousel.nativeElement);
    this.initPlayer.play();
  }

  growCenterCardAnim() {
    return this.builder.build([
      query(this.centerIdString, [
        style({
          maxHeight: '60vh',
          height: '60vh',
          marginTop: '-25%',
          width: '20vw',
          maxWidth: '20vw',
          fontWeight: 'bold',
          fontSize: '18px'

        })
      ]),

    ]);
  }

  nextOrPrev(event) {
    // let dragElementIndex = event.target.id ? event.target.id : event.target.parentElement ? event.target.parentElement.id : null;
    // let arrayEle = this.itemsElements.toArray();
    // let ele = arrayEle.filter((element, index) => element.nativeElement.innerText.split(/\n/).shift() === dragElementIndex);
    // console.log(arrayEle.filter((element, index) => element.nativeElement.innerText.split(/\n/).shift() === dragElementIndex));
    // console.log(ele[0].nativeElement.offsetLeft + ele[0].nativeElement.offsetWidth);

    if (event.offsetX > 0) {
      this.prev(event);
    } else {
      this.next(event);
    }
  }
  changeIds(from) {
    //  this.nextPrevId = 0;
    if (this.items && from === 1 && (this.centerCardId + from < this.items.length)) {
      this.centerCardId = this.centerCardId + from;
      this.nextPrevId = this.centerCardId + from;
    } else if (this.items && from === 1 && ((this.centerCardId + from) === this.items.length)) {
      this.centerCardId = this.centerCardId + from;
      this.nextPrevId = 1;
    } else if (this.items && from === -1 && this.centerCardId + from > 1) {
      this.centerCardId = this.centerCardId + from;
      this.nextPrevId = this.centerCardId + from;
    } else if (this.items && from === -1 && this.centerCardId + from === 1) {
      this.centerCardId = this.centerCardId + from;
      this.nextPrevId = this.items.length;
    } else if (this.items && from === -1 && (this.centerCardId + from) <= 0) {
      this.centerCardId = this.items.length;
      this.nextPrevId = this.centerCardId + from;
    } else if (this.items) {
      this.centerCardId = from === 1 ? 1 : this.items.length;
      this.nextPrevId = this.centerCardId + from;

    }
    this.centerIdString = '#t' + this.centerCardId;
    this.nextPrevIdString = '#t' + this.nextPrevId;
    this.changeCenterCard.emit(this.centerCardId);
    this.lastAction = from;

  }

  next(event) {
    if (!this.nextPrevId || (this.lastAction !== 1 && this.items && this.centerCardId < this.items.length)) {
      this.nextPrevId = this.centerCardId + 1;
      this.nextPrevIdString = '#t' + this.nextPrevId;
    } else if (this.lastAction !== 1 && this.items && this.centerCardId === this.items.length) {
      this.nextPrevId = 1;
      this.nextPrevIdString = '#t' + this.nextPrevId;
    }
    if ((this.items.length !== this.totalVisibleCount && this.currentSlide + 1 <= this.items.length - this.totalVisibleCount) ||
      (this.items.length === this.totalVisibleCount && this.currentSlide + 1 <= this.items.length)) {
      let arr = this.items.toArray();
      let first = arr.shift();
      arr = arr.concat([first]);
      this.items.reset(arr);
      this.currentSlide--;
      this.transitionCarousel(0, 1);
    }
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    this.transitionCarousel(null, 1);
    this.changeIds(1);
  }
  transitionCarousel(time: any, from) {

    let offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset, time, from);

    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }
  private buildAnimation(offset, time: any, from) {

    offset = offset + (this.currentSlide * 26);
    if (from === 1) {
      if (offset < 0) {
        offset = offset * -1;
      }

    } else {
      if (offset > 0) {
        offset = offset * -1;
      }

    }

    return this.builder.build([
      group([query(this.centerIdString, animate('2s ease', style({
        maxHeight: '36vh', margin: '7px',
        maxWidth: '14.58vw', fontSize: '14px', backgroundColor: '#fff', fontWeight: 'normal'
      }))),
      query(this.nextPrevIdString, animate('2s ease', style({
        maxHeight: '60vh', marginBottom: '7px',
        height: '60vh',
        marginTop: '-25%',
        width: '20vw',
        maxWidth: '20vw',
        fontWeight: 'bold',
        fontSize: '18px',
      }))),
      animate(time == null ? '1000ms ease' : 0,
        style({ transform: `translateX(${offset}px)` }))
      ]),
    ]);



  }
  prev(event) {
    if (!this.nextPrevId || (this.lastAction !== -1 && this.items && this.centerCardId > 1)) {
      this.nextPrevId = this.centerCardId - 1;
      this.nextPrevIdString = '#t' + this.nextPrevId;
    } else if (this.lastAction !== -1 && this.items && this.centerCardId === 1) {
      this.nextPrevId = this.items.length;
      this.nextPrevIdString = '#t' + this.nextPrevId;
    }

    if (this.currentSlide == 0) {
      let arr = this.items.toArray();
      let last = arr.pop();
      arr = [last].concat(arr);
      this.items.reset(arr);
      this.currentSlide++;
      this.transitionCarousel(0, -1);
    }

    this.currentSlide =
      (this.currentSlide - 1 + this.items.length) % this.items.length;
    this.transitionCarousel(null, -1);
    this.changeIds(-1);

  }
}