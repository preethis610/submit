import {
  Component, OnInit, AfterViewInit, HostListener, HostBinding, Output, EventEmitter,
  ContentChildren,
  ElementRef,
  Input, Inject,
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
  styleUrls: ['./carousel.component.scss'],

})
export class CarouselComponent implements AfterViewInit, OnInit {
  ngOnInit() {
    this.centerCardId = this.totalVisibleCount !== 0 ? Math.round(this.totalVisibleCount / 2) : 0;
    this.centerIdString = '#t' + this.centerCardId;
    this.centerScaleIdString = '#s' + this.centerCardId;
    this.changeCenterCard.emit(this.centerCardId);
  }
  // on drag card
  @Input() set np(value) {
    this.nextOrPrev(value);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.initialTranslation(true);
  }

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
  lastAction = null;
  itemIdArray = [1, 2, 3, 4, 5, 6, 7];
  prevCenterCard = [];
  timing = '.4s ease-in-out';
  itemsWidth;
  moveOffset;
  addOnOffset;
  tWidth;
  moveOffsetValues = [];
  constructor(private builder: AnimationBuilder,
    @Inject(DOCUMENT) private _document: Document) { }

  ngAfterViewInit() {
    // here 2 represents left card and right card that are not in view
    this.actualLengthOfItems = this.items ? this.items.length - 2 : 0;
    setTimeout(() => {
      this.initialTranslation();
    }, 20);

  }


  initialTranslation(resize?) {
    this.itemsWidth = this.carousel.nativeElement.getBoundingClientRect().width;;
    this.tWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
    let tWidthForSixCards = this.tWidth * 6;
    let remainingItemsWidth = this.itemsWidth - tWidthForSixCards;
    let eachCardSpacingForSix = remainingItemsWidth / 6;
    this.moveOffset = this.tWidth + eachCardSpacingForSix;
    this.addOnOffset = ((this.itemsWidth - (this.moveOffset * 4)) / 4) + this.moveOffset;
    const cardAnim: AnimationFactory = this.translateCards(resize);
    this.player = cardAnim.create(this.carousel.nativeElement);
    this.player.play();

  }
  translateCards(resize?) {
    this.moveOffsetValues = [];
    let six = -this.moveOffset;
    let one = 0;
    let two = this.moveOffset;
    let x = this.addOnOffset - this.moveOffset - 12;
    let three = this.moveOffset + this.addOnOffset;
    let four = this.moveOffset + (2 * this.addOnOffset);
    let five = 2 * this.moveOffset + 2 * this.addOnOffset;
    let seven = 3 * this.moveOffset + 2 * this.addOnOffset;
    this.moveOffsetValues.push(one, two, three, four, five, six, seven);

    if (resize) {
      if (this.lastAction === null) {
        console.log('a');
        three = three;
      } else if (this.lastAction === 1) {
        let index = this.prevCenterCard.findIndex(obj => obj === this.centerCardId);
        if (index === -1) {
          three = three;
        } else {
          three = three - x;
        }
      } else {
        console.log('c');
        three = three - x;
      }

    }

    console.log('this.itemIdArray', this.itemIdArray);
    console.log(this.moveOffsetValues);
    return this.builder.build([
      group([
        query('#t6', animate('0s ease-in-out', style({
          transform: 'translateX(' + six + 'px)',
          opacity: 0
        }))),
        query('#t' + this.itemIdArray[1], animate('.4s ease-in-out', style({
          transform: 'translateX(' + two + 'px)',
          }))),
        query('#t' + this.itemIdArray[2], animate('.4s ease-in-out', style({
          transform: 'translateX(' + three + 'px)',
          }))),
        query('#t' + this.itemIdArray[3], animate('.4s ease-in-out', style({
          transform: 'translateX(' + four + 'px)',
          }))),
        query('#t' + this.itemIdArray[4], animate('.4s ease-in-out', style({
          transform: 'translateX(' + five + 'px)',
          }))),
        query('#t7', animate('.4s ease-in-out', style({
          transform: 'translateX(' + seven + 'px)',
          opacity: 0
        }))),
        query('#s' + this.itemIdArray[2], animate('.4s ease-in-out', style({
          transform: 'scale(2)',
        }))),

      ])
    ]);
  }
  nextOrPrev(event) {
    if (event > 0) {
      this.prev();
    } else {
      this.next();
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

  next() {
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

    const myAnimation: AnimationFactory = this.buildAnimation(from);
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

  private buildAnimation(from) {
    let firstCard;
    let secondCard;
    let thirdCard;
    let fourthCard;
    let fifthCard;
    let firstCardOffset;
    let secondCardOffset;
    let thirdCardOffset;
    let thirdCardPreOffset;
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

    let leftSixthCardBackOffset;
    let seventhCardToRightEndOffset;
    if (from === -1) {
      this.itemIdArray.forEach((ele, key) => {
        // 1 to 2
        if (key === 0) {
          firstCard = ele;
          firstCardOffset = this.moveOffsetValues[key + 1];

        }
        // 2 to 3
        if (key === 1) {
          let x = this.addOnOffset - this.moveOffset - 12;
          secondCardOffset = this.moveOffsetValues[key + 1] - x;

        }
        //3 to 4 (3 to 4 and 4 to 5)
        if (key === 2) {
          thirdCard = ele;

          thirdCardOffset = this.moveOffsetValues[key + 1];

        }
        //4 to 5 ( 5 to 6)
        if (key === 3) {
          fourthCard = ele;
          fourthCardOffset = this.moveOffsetValues[key + 1];

        }

        // 5 to 6 (right out) (6 to 7)

        if (key === 4) {
          fifthCard = ele;
          fifthCardOffset = this.moveOffsetValues[key + 2];
          lastCardInViewToFirst = ele;
          lastCardInViewToFirstOffset = 0;
          console.log('lastCardInViewToFirstOffset', lastCardInViewToFirstOffset);
        }
        // 6 to 1 (prev operation of last element in view) ( 7 to 1)
        if (key === 5) {
          leftSixthCard = ele;
          leftSixthCardOffset = this.moveOffsetValues[0];
          leftSixthCardBackOffset = this.moveOffsetValues[key];
        }

      })

      return this.builder.build([
        // Reduce the scaling of center card 
        query(this.centerScaleIdString, animate('0s', style({
          transform: 'scale(1)',
        }))),

        group([
          // 1 to 2
          query('#t' + firstCard, animate(this.timing, style({
            transform: 'translateX(' + firstCardOffset + 'px)'
          }))),
          // 2 to 3
          query(this.nextPrevIdString, animate(this.timing, style({
            transform: 'translateX(' + secondCardOffset + 'px)',
          }))),

          // 3 to 4
          query(this.centerIdString, animate(this.timing, style({
            transform: 'translateX(' + thirdCardOffset + 'px)'
          }))),

          // 4to 5
          query('#t' + fourthCard, animate(this.timing, style({
            transform: 'translateX(' + fourthCardOffset + 'px)'
          }))),
          // 5to 6
          query('#t' + fifthCard, [

            animate(this.timing, style({
              opacity: 1,
              transform: 'translateX(' + fifthCardOffset + 'px)'
            }))
          ]),
          // move t6 to 1st card position 
          query('#t' + leftSixthCard, animate(this.timing, style({
            opacity: 1,
            transform: 'translateX(' + leftSixthCardOffset + 'px)'
          }))),

          // apply 2nd inner card scaling 
          query(this.nextPrevScaleIdString, animate(this.timing, style({
            transform: 'scale(2)',
            transformOrigin: 'left',
          }))),

        ]),
        // group ends
        // Move t6 to left out card position without animation 
        query('#t6', animate('0s', style({
          transform: 'translateX(' + leftSixthCardBackOffset + 'px)',

        }))),
        query('#t6', animate('0s', style({
          opacity: 0
        }))),
        // Move last card(5th in view) to 1st position without animation 
        query('#t' + lastCardInViewToFirst, animate('0s', style({
          transform: 'translateX(' + lastCardInViewToFirstOffset + 'px)',
        }))),
      ]);
    } else {

      this.itemIdArray.forEach((ele, key) => {
        // 1 to left
        // 1 to last (1 to 5th not 4)
        if (key === 0) {
          firstCard = ele;
          firstCardOffset = this.moveOffsetValues[5];
          firstCardInViewToLast = ele;
          firstCardInViewToLastOffset = this.moveOffsetValues[4];

        }
        // 2 to 1
        if (key === 1) {
          secondCard = ele;
          secondCardOffset = this.moveOffsetValues[key - 1];

        }
        //3 to 2 
        if (key === 2) {
          thirdCard = ele;

          thirdCardOffset = this.moveOffsetValues[key - 1];

        }
        //4 to 3 (5 to 4 and 4 to 3)
        if (key === 3) {
          fourthCard = ele;
          fourthCardOffset = this.moveOffsetValues[key - 1];
          let index = this.prevCenterCard.findIndex(obj => obj === ele);
          if (fourthCardOffset !== 0 && index === -1) {
            fourthCardOffset = this.moveOffsetValues[key - 1];
          } else if (fourthCardOffset === 0) {
            let x = this.addOnOffset - this.moveOffset - 12;
            fourthCardOffset = this.moveOffsetValues[key - 1] - x;
          } else if (fourthCardOffset !== 0 && index !== -1) {
            let x = this.addOnOffset - this.moveOffset - 12;
            fourthCardOffset = this.moveOffsetValues[key - 1] - x;
          }
        }
        // 5 to 4
        if (key === 4) {
          fifthCard = ele;
          fifthCardOffset = this.moveOffsetValues[key - 1];

        }
        // 7 to 5 
        if (key === 6) {
          rightSeventhCard = ele;
          rightSeventhCardOffset = this.moveOffsetValues[4];
          seventhCardToRightEndOffset = this.moveOffsetValues[6];

        }
      })

      return this.builder.build([

        // centerCard remove scaling
        query(this.centerScaleIdString, animate('0s', style({
          transform: 'scale(1)',
        }))),
        group([
          // 1 to left 
          query('#t' + firstCard, animate(this.timing, style({
            transform: 'translateX(' + firstCardOffset + 'px)'
                    }))),
          // 3 to 2
          query(this.centerIdString, animate(this.timing, style({
            transform: 'translateX(' + thirdCardOffset + 'px)'
          }))),
          // 4 to 3
          query(this.nextPrevIdString, animate(this.timing, style({
            transform: 'translateX(' + fourthCardOffset + 'px)',
          }))),
          // 5 to 4
          query('#t' + fifthCard, [
            animate(this.timing, style({
              opacity: 1,
              transform: 'translateX(' + fifthCardOffset + 'px)'
            })),
          ]),
          // 2 to 1
          query('#t' + secondCard, [
            animate(this.timing, style({
              opacity: 1,
              transform: 'translateX(' + secondCardOffset + 'px)'
            }))
          ]),
          // move t7 to last card position 
          query('#t7', animate(this.timing, style({
            opacity: 1,
            transform: 'translateX(' + rightSeventhCardOffset + 'px)'
          }))),
          // apply 4th inner card scaling 
          query(this.nextPrevScaleIdString, animate(this.timing, style({
            transform: 'scale(2)',
          }))),

        ]),
        // group ends
        // 1 to 5
        query('#t' + firstCardInViewToLast, animate('0s', style({
          transform: 'translateX(' + firstCardInViewToLastOffset + 'px)',
          opacity: 1
        }))),
        // Move t7 to right out card position without animation 
        query('#t7', animate('0s', style({
          transform: 'translateX(' + seventhCardToRightEndOffset + 'px)',
        }))),
        query('#t7', animate('0s', style({
          opacity: 0
        }))),


      ]);
    }
  }
  prev() {
    if (!this.nextPrevId || (this.lastAction !== -1 && this.items && this.centerCardId > 1)) {
      this.nextPrevId = this.centerCardId - 1;
      this.nextPrevIdString = '#t' + this.nextPrevId;
      this.nextPrevScaleIdString = '#s' + this.nextPrevId;
    } else if (this.lastAction !== -1 && this.items && this.centerCardId === 1) {
      this.nextPrevId = this.actualLengthOfItems;
      this.nextPrevIdString = '#t' + this.nextPrevId;
      this.nextPrevScaleIdString = '#s' + this.nextPrevId;
    }
    this.prevCenterCard.push(this.nextPrevId);
    this.transitionCarousel(-1);
    this.changeIds(-1);

  }
}