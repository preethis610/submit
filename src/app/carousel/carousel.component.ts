import {
  Component, OnInit, AfterViewInit, HostListener, HostBinding, Output, EventEmitter,
  ContentChildren,
  ElementRef,
  Input,Inject,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { CarouselItemDirective } from '../carousel-item.directive';
import { CarouselItemElementDirective } from '../carousel-item-element.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style, group, query } from "@angular/animations";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],

})
export class CarouselComponent implements AfterViewInit, OnInit {
  ngOnInit() {
     this.centerCardId = this.totalVisibleCount !== 0 ? Math.round(this.totalVisibleCount / 2) : 0;
    this.centerIdString = '#t' + this.centerCardId;
    this.centerScaleIdString = '#s' + this.centerCardId;
    this.changeCenterCard.emit(this.centerCardId);
  }
  innerWidth;
  @Input() set np(value) {
    this.nextOrPrev(value);
   }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
   sessionStorage.setItem('centerId',this.centerCardId);
   this._document.defaultView.location.reload();
    }
  initCenter = 3;
  nextPrevIdString: any;
  centerIdString;
  centerScaleIdString;
  nextPrevScaleIdString;
  @Output() changeCenterCard = new EventEmitter<number>();
  @Output() animationEnds = new EventEmitter<any>();
  @ContentChildren(CarouselItemDirective) items: QueryList<
    CarouselItemDirective>;
  @ViewChildren(CarouselItemElementDirective, { read: ElementRef })
  private itemsElements: QueryList<ElementRef>;
  @ViewChild("carousel") private carousel: ElementRef;
  totalVisibleCount = 5;
  actualLengthOfItems;
  private player: AnimationPlayer;
  private itemWidth: number;
  centerCardId;
  nextPrevId = null;
  initPlayer;
  tempCardAnimPlayer;
  lastAction = null;
  itemIdArray = [1, 2, 3, 4, 5, 6, 7];
  offsetArray = [];
  sixthCardToLeftEndOffset;
  seventhCardToRightEndOffset;
  initOffsetArray = [];
  centerCardAddOnWidth;
  timing ='.4s ease-in-out';
  constructor(private builder: AnimationBuilder,
    @Inject(DOCUMENT) private _document: Document) { }

  ngAfterViewInit() {
    // here 2 represents left card and right card that are not in view
    this.actualLengthOfItems = this.items ? this.items.length - 2 : 0;
      this.innerWidth = window.innerWidth;
   
    this.growCenterCard();
  }

  growCenterCard() {
    const centerCardAnim: AnimationFactory = this.growCenterCardAnim();
    this.initPlayer = centerCardAnim.create(this.carousel.nativeElement);
    this.initPlayer.play();
    this.initPlayer.onDone(() => {
      let offsetArray = this.itemsElements ? this.itemsElements.toArray() : [];
      if (offsetArray) {
        offsetArray.forEach((item, key) => {
          let index = this.itemIdArray.findIndex(obj => obj === key+1);
          this.offsetArray.push({ 'id': this.itemIdArray[key], 'offsetLeft': item.nativeElement.offsetLeft, 'offsetWidth': item.nativeElement.offsetWidth });
      
        })
        this.itemWidth = Math.min.apply(Math, this.offsetArray.map( obj=> obj.offsetWidth));
        this.centerCardAddOnWidth = this.offsetArray && this.offsetArray.length > 0 ? Math.max.apply(Math, this.offsetArray.map( obj=> obj.offsetWidth))-Math.min.apply(Math, this.offsetArray.map( obj=> obj.offsetWidth)) : 0;
           }
      this.sixthCardToLeftEndOffset = this.findOffsetToBeMoved(6, -1);
      this.seventhCardToRightEndOffset = this.findOffsetToBeMoved(7, 5);
      const tempCardAnim: AnimationFactory = this.tempCardAnim();
      this.tempCardAnimPlayer = tempCardAnim.create(this.carousel.nativeElement);
      this.tempCardAnimPlayer.play();
      if(sessionStorage.hasOwnProperty('centerId')){
        let centerId = +sessionStorage.getItem('centerId');
        sessionStorage.removeItem('centerId');
        if (this.initCenter > centerId) {
          for (let i = 0; i < (this.initCenter - centerId); i++) {
                                if(i!== 0){
              setTimeout(()=>{  
                this.timing = '0s';                         //<<<---using ()=> syntax
                this.prev();
           }, 100);
            }else{
              this.timing = '0s';
              this.prev();
            }
                     }
        } else if (centerId > this.initCenter) {
          for (let i = 0; i < (centerId - this.initCenter); i++) {
            if(i!== 0){
              setTimeout(()=>{ 
                this.timing = '0s';                         
                this.next();
           }, 100);
            }else{
              this.timing = '0s';
              this.next();
            }
                 }
        }
        }
    })
  }
  tempCardAnim() {
    return this.builder.build([
      group([
        // Move the copy of last card in the view (6th card) to the left end by -1299px and opacity 0
        query('#t6', animate('0s', style({
          transform: 'translateX(' + this.sixthCardToLeftEndOffset + 'px)', opacity: 0
        }),
        )),
        query('#t7', animate('0s', style({
          transform: 'translateX(' + this.seventhCardToRightEndOffset + 'px)', opacity: 0
        }),
        )),
        //copy of first card in the view (7th card) should have opacity 0
        query('#t7', animate('0s', style({ opacity: 0 }),
        )),
      ])
    ]);
  }
  growCenterCardAnim() {
    return this.builder.build([
      group([
        // apply scale animation in 0 sec for center card
        query('#s3', animate('0s ease-in-out', style({
          transform: 'scale(1.25)',
          width: '201px',
          maxWidth: '201px',
          transformOrigin: 'left',
        }))),
      ])
    ]);
  }

  nextOrPrev(event) {
    if (event > 0) {
      this.prev(1);
    } else {
      this.next(1);
    }
  }
  changeIds(from) {
    if (this.items && from === 1 && (this.centerCardId + from < this.actualLengthOfItems)) {
      this.centerCardId = this.centerCardId + from;
      this.nextPrevId = this.centerCardId + from;
    } else if (this.items && from === 1 && ((this.centerCardId + from) === this.actualLengthOfItems)) {
      this.centerCardId = this.centerCardId + from;
      this.nextPrevId = 1;
    } else if (this.items && from === -1 && this.centerCardId + from > 1) {
      this.centerCardId = this.centerCardId + from;
      this.nextPrevId = this.centerCardId + from;
    } else if (this.items && from === -1 && this.centerCardId + from === 1) {
      this.centerCardId = this.centerCardId + from;
      this.nextPrevId = this.actualLengthOfItems;
    } else if (this.items && from === -1 && (this.centerCardId + from) <= 0) {
      this.centerCardId = this.actualLengthOfItems;
      this.nextPrevId = this.centerCardId + from;
    } else if (this.items) {
      this.centerCardId = from === 1 ? 1 : this.actualLengthOfItems;
      this.nextPrevId = this.centerCardId + from;
    }
    this.centerIdString = '#t' + this.centerCardId;
    this.centerScaleIdString = '#s' + this.centerCardId;
    this.nextPrevIdString = '#t' + this.nextPrevId;
    this.nextPrevScaleIdString = '#s' + this.nextPrevId;
    this.changeCenterCard.emit(this.centerCardId);
    this.lastAction = from;
    }

   next(event?) {
    if(event){
      this.timing= '.4s ease-in-out';
    }
    if (!this.nextPrevId || (this.lastAction !== 1 && this.items && this.centerCardId < this.actualLengthOfItems)) {
      this.nextPrevId = this.centerCardId + 1;
      this.nextPrevIdString = '#t' + this.nextPrevId;
      this.nextPrevScaleIdString = '#s' + this.nextPrevId;
    } else if (this.lastAction !== 1 && this.items && this.centerCardId === this.actualLengthOfItems) {
      this.nextPrevId = 1;
      this.nextPrevIdString = '#t' + this.nextPrevId;
      this.nextPrevScaleIdString = '#s' + this.nextPrevId;
    }

    this.transitionCarousel(1);
    this.changeIds(1);
  }
  transitionCarousel(from) {
      const myAnimation: AnimationFactory = this.buildAnimation( from);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    this.player.onDone(() => {
      if (from === -1) {
        let moveId = this.itemIdArray[this.actualLengthOfItems - 1];
        this.itemIdArray.splice(this.actualLengthOfItems - 1, 1);
        this.itemIdArray = [moveId].concat(this.itemIdArray);
      } else {
        let moveId = this.itemIdArray[0];
        this.itemIdArray.splice(0, 1);
            this.itemIdArray.splice(this.actualLengthOfItems - 1, 0, moveId);
      }
      this.animationEnds.emit(this.itemIdArray);
       })

  }

  findOffsetToBeMoved(id, newPosIndex) {
   
    let currentPosIndex = this.offsetArray.findIndex(obj => obj.id === id);
    let value;
    if (this.offsetArray && this.offsetArray.length > 0 && newPosIndex === -1) {
      return (this.offsetArray[0].offsetLeft - this.offsetArray[currentPosIndex].offsetLeft) - this.itemWidth;
    }

    if (this.offsetArray && this.offsetArray.length > 0 && currentPosIndex !== -1)
      value = this.offsetArray[newPosIndex].offsetLeft - this.offsetArray[currentPosIndex].offsetLeft;
    return value;
  }
  private buildAnimation( from) {
    let firstCard;
    let secondCard;
    let thirdCard;
    let fourthCard;
    let fifthCard;
    let firstCardOffset;
    let secondCardOffset;
    let thirdCardOffset;
    let fourthCardOffset;
    let fifthCardOffset;
    let rightSeventhCard;
    let rightSeventhCardOffset;
    let firstCardInViewToLastOffset;
    let firstCardInViewToLast;
    let leftSixthCard;
    let leftSixthCardOffset;
    let lastCardInViewToFirstOffset;
    let lastCardInViewToFirst;
    let rightSeventhCardFromLast;
    let rightSeventhCardFromLastOffset;
    if (from === -1) {
         this.itemIdArray.forEach((ele, key) => {
        // 1 to 2
        if (key === 0) {
          firstCard = ele;
          firstCardOffset = this.findOffsetToBeMoved(ele, 1);
          if (this.itemIdArray[1] > 3 && ele > 3) {
            firstCardOffset = firstCardOffset + this.centerCardAddOnWidth;
          }
        }
        // 2 to 3
        if (key === 1) {
          secondCard = ele;
          secondCardOffset = this.findOffsetToBeMoved(ele, 2);
          if (this.itemIdArray[1] > 3 && ele > 3) {
            secondCardOffset = secondCardOffset + this.centerCardAddOnWidth;
          }
        }
        //3 to 4
        if (key === 2) {
          thirdCard = ele;
          thirdCardOffset = this.findOffsetToBeMoved(ele, 3);
          if (this.itemIdArray[1] < 3 && ele <= 3) {
            thirdCardOffset = thirdCardOffset - this.centerCardAddOnWidth;
          }
        }
        //4 to 5
        if (key === 3) {
          fourthCard = ele;
          fourthCardOffset = this.findOffsetToBeMoved(ele, 4);
          if (this.itemIdArray[1] < 3 && ele <= 3) {
            fourthCardOffset = fourthCardOffset - this.centerCardAddOnWidth;
          }
        }

        // 5 to 6 (right out)
        if (key === 4) {
          fifthCard = ele;
          fifthCardOffset = this.findOffsetToBeMoved(ele, 5);
          lastCardInViewToFirst = ele;
          lastCardInViewToFirstOffset = this.findOffsetToBeMoved(ele, 0);
        }
        // 6 to 1 (prev operation of last element in view)
        if (key === 5) {
          leftSixthCard = ele;
          leftSixthCardOffset = this.findOffsetToBeMoved(ele, 0);
        }
        if (key === 6) {

        }
      })
          return this.builder.build([
        // change 2nd card with new width and height without animation in case of prev
        // nextOrPrevCard height change
        query(this.nextPrevIdString, animate('0s', style({
          maxHeight: '60vh', marginBottom: '7px',
          height: '60vh',
          marginTop: '-25%',
          width: '19.9vw',
          maxWidth: '19.9vw',
          fontWeight: 'bold',
          fontSize: '26px',
          borderBottom: '5px solid #ffc300',
          transformOrigin: 'left',
        }))),
        // Reduce the scaling of center card in case of prev/next
        // centerCard remove scaling
        query(this.centerScaleIdString, animate('0s', style({
          transform: 'scale(1)',
          width: '100%',
          maxWidth: '100%'
        }))),
        // Reduce the height and width of center card in case of prev/next
        //centerCard remove height change
        query(this.centerIdString, animate('0s', style({
          margin: '7px',
          maxHeight: '36vh', borderBottom: 'none', height: '36vh', width: '14.58vw',
          maxWidth: '14.58vw', fontSize: '20px', backgroundColor: '#fff', fontWeight: 'normal',

        }))),
        group([
          // 1 to 2
          // move 1st card to right(second in view) by width 201+14 in case of prev
          query('#t' + firstCard, animate(this.timing, style({

            transform: 'translateX(' + firstCardOffset + 'px)'
          }))),
          // 2 to 3
          // move 2nd card to center with animation in case of prev
          //nextorPrevCard move
          query(this.nextPrevIdString, animate(this.timing, style({
            transform: 'translateX(' + secondCardOffset + 'px)',
          }))),
          // Move center card to right (4th in view) by width 201+14 in case of prev
          // 3 to 4
          query(this.centerIdString, animate(this.timing, style({
            transform: 'translateX(' + thirdCardOffset + 'px)'
          }))),

          // 4to 5
          // move 4th card to right(last in view) by width 201+14 in case of prev

          query('#t' + fourthCard, animate(this.timing, style({
            transform: 'translateX(' + fourthCardOffset + 'px)'
          }))),
          // 5to 6
          // move 5th card to right(outside of view) by width 201+14 in case of prev
        
          query('#t' + fifthCard, [

            animate(this.timing, style({
              opacity: 1,
              transform: 'translateX(' + fifthCardOffset + 'px)'
            }))
          ]),
          // move t6 to 1st card position in case of prev
          query('#t' + leftSixthCard, animate(this.timing, style({
            maxHeight: '36vh', margin: '7px', borderBottom: 'none', opacity: 1,
            maxWidth: '14.58vw', fontSize: '20px', backgroundColor: '#fff', fontWeight: 'normal',
            transform: 'translateX(' + leftSixthCardOffset + 'px)'
          }))),

          // apply 2nd inner card scaling in case of prev
            //nextOrPrevCard scaling add
          query(this.nextPrevScaleIdString, animate(this.timing, style({
            transform: 'scale(1.25)',
            width: '201px',
            maxWidth: '201px',
            transformOrigin: 'left',
          }))),
        ]),
        // group ends
        // Move t6 to left out card position without animation in case of prev
        query('#t6', animate('0s', style({
          transform: 'translateX(' + this.sixthCardToLeftEndOffset + 'px)'
        }))),
        // Move last card(5th in view) to 1st position without animation in case of prev
        query('#t' + lastCardInViewToFirst, animate('0s', style({
          transform: 'translateX(' + lastCardInViewToFirstOffset + 'px)',
        }))),
      ]);
    } else {

      this.itemIdArray.forEach((ele, key) => {
        // 1 to left
        // 1 to last
        if (key === 0) {
          firstCard = ele;
          firstCardOffset = this.findOffsetToBeMoved(ele, -1);
          firstCardInViewToLast = ele;
          firstCardInViewToLastOffset = this.findOffsetToBeMoved(ele, 4);
          if (this.itemIdArray[3] < 3 && ele <= 3) {
            firstCardInViewToLastOffset = firstCardInViewToLastOffset - this.centerCardAddOnWidth;
          }
        }
        // 2 to 1
        if (key === 1) {
          secondCard = ele;
          secondCardOffset = this.findOffsetToBeMoved(ele, 0);
        }
        //3 to 2
        if (key === 2) {
          thirdCard = ele;
          thirdCardOffset = this.findOffsetToBeMoved(ele, 1);
          if (this.itemIdArray[3] > this.initCenter && ele > this.initCenter) {
            thirdCardOffset = thirdCardOffset + this.centerCardAddOnWidth;
          }
        }
        //4 to 3
        if (key === 3) {
          fourthCard = ele;
          fourthCardOffset = this.findOffsetToBeMoved(ele, 2);
          if (this.itemIdArray[3] > this.initCenter && ele > this.initCenter) {
            fourthCardOffset = fourthCardOffset + this.centerCardAddOnWidth;
          }
        }
        // 5 to 4
        // 5 t0 7 (moving 7th card from 5 to actual 7 after anim with 0 sec)
        if (key === 4) {
          fifthCard = ele;
          fifthCardOffset = this.findOffsetToBeMoved(ele, 3);
          if (this.itemIdArray[3] < this.initCenter && ele <= this.initCenter) {
            fifthCardOffset = fifthCardOffset - this.centerCardAddOnWidth;
          }
          rightSeventhCardFromLast = ele;
          rightSeventhCardFromLastOffset = this.findOffsetToBeMoved(ele, 5);
        }
        // 7 to 5 (next operation of first element in view)
        if (key === 6) {
          rightSeventhCard = ele;
          rightSeventhCardOffset = this.findOffsetToBeMoved(ele, 4);
          if (this.itemIdArray[3] < this.initCenter && ele <= this.initCenter) {
            rightSeventhCardOffset = rightSeventhCardOffset - this.centerCardAddOnWidth;
          }
        }
      })
            return this.builder.build([
        //change 4th card with new width and height without animation in case of next
        // nextOrPrevCard height change
        query(this.nextPrevIdString, animate('0s', style({
          maxHeight: '60vh', marginBottom: '7px',
          height: '60vh',
          marginTop: '-25%',
          width: '19.9vw',
          maxWidth: '19.9vw',
          fontWeight: 'bold',
          fontSize: '26px',
          borderBottom: '5px solid #ffc300',
          transformOrigin: 'left',
        }))),
        // Reduce the scaling of center card in case of prev/next
        // centerCard remove scaling
        query(this.centerScaleIdString, animate('0s', style({
          transform: 'scale(1)',
          width: '100%',
          maxWidth: '100%'
        }))),
        // Reduce the height and width of center card in case of prev/next
        //centerCard remove height change
        query(this.centerIdString, animate('0s', style({
          margin: '7px',
          maxHeight: '36vh', borderBottom: 'none', height: '36vh', width: '14.58vw',
          maxWidth: '14.58vw', fontSize: '20px', backgroundColor: '#fff', fontWeight: 'normal',
        }))),
        group([
                   // move 1st card to left(out of view) by width 201+14 in case of next
          // 1 to left 
          query('#t' + firstCard, animate(this.timing, style({
            transform: 'translateX(' + firstCardOffset + 'px)'
          }))),
          // Move center card to left (2nd in view) by width 201+14 in case of next 
          // 3 to 2
          query(this.centerIdString, animate(this.timing, style({
            transform: 'translateX(' + thirdCardOffset + 'px)'
          }))),
          // move 4th card to center with animation in case of next
          //nextorPrevCard move - 4 to 3
          query(this.nextPrevIdString, animate(this.timing, style({
            transform: 'translateX(' + fourthCardOffset + 'px)',
          }))),

          // move 5th card to left(4th in view) by width 201+14 in case of next
          // 5 to 4
          query('#t' + fifthCard, [
            animate(this.timing, style({
              opacity: 1,
              transform: 'translateX(' + fifthCardOffset + 'px)'
            })),
          ]),
          // move 2 to 1  in case of next
          // 2 to 1
          query('#t' + secondCard, [
            animate(this.timing, style({
              opacity: 1,
              transform: 'translateX(' + secondCardOffset + 'px)'
            }))
          ]),
          // move t7 to last card position in case of next
          query('#t7', animate(this.timing, style({
            maxHeight: '36vh', margin: '7px', borderBottom: 'none', opacity: 1,
            maxWidth: '14.58vw', fontSize: '20px', backgroundColor: '#fff', fontWeight: 'normal',
            transform: 'translateX(' + rightSeventhCardOffset + 'px)'
          }))),
          // apply 4th inner card scaling in case of next
          //nextOrPrevCard scaling add
          query(this.nextPrevScaleIdString, animate(this.timing, style({
            transform: 'scale(1.25)',
            width: '201px',
            maxWidth: '201px',
            transformOrigin: 'left',
          }))),
        ]),
        // group ends
        // Move t7 to right out card position without animation in case of next
        query('#t7', animate('0s', style({
          transform: 'translateX(' + this.seventhCardToRightEndOffset + 'px)',
        }))),
        // Move first card to last position without animation in case of next
        // 1 to 5
        query('#t' + firstCardInViewToLast, animate('0s', style({
          transform: 'translateX(' + firstCardInViewToLastOffset + 'px)',
        }))),
      ]);
    }
  }
  prev(event?)  {
    if(event){
      this.timing= '.4s ease-in-out';
    }
    if (!this.nextPrevId || (this.lastAction !== -1 && this.items && this.centerCardId > 1)) {
      this.nextPrevId = this.centerCardId - 1;
      this.nextPrevIdString = '#t' + this.nextPrevId;
      this.nextPrevScaleIdString = '#s' + this.nextPrevId;
    } else if (this.lastAction !== -1 && this.items && this.centerCardId === 1) {
      this.nextPrevId = this.actualLengthOfItems;
      this.nextPrevIdString = '#t' + this.nextPrevId;
      this.nextPrevScaleIdString = '#s' + this.nextPrevId;
    }
    this.transitionCarousel(-1);
    this.changeIds(-1);

  }
}
