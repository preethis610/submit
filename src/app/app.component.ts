import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  nextPrevOffset;
  items = [
   
    { id: 1, title: 'Mobile internet', thumbnail: '../../assets/images/images_thumb.png', pic: '../../assets/images/images.png' },
    { id: 2, title: 'Home internet', thumbnail: '../../assets/images/images_thumb.png', pic: '../../assets/images/images.png' },
    { id: 3, title: 'Get a device', thumbnail: '../../assets/images/images_thumb.png', pic: '../../assets/images/images.png' },
    { id: 4, title: 'Add a phone-line', thumbnail: '../../assets/images/images_thumb.png', pic: '../../assets/images/images.png' },
    { id: 5, title: 'Upgrade', thumbnail: '../../assets/images/images_thumb.png', pic: '../../assets/images/images.png' },
    { id: 6, title: 'Upgrade', thumbnail: '../../assets/images/images_thumb.png', pic: '../../assets/images/images.png' },
    { id: 7, title: 'Mobile internet', thumbnail: '../../assets/images/images_thumb.png', pic: '../../assets/images/images.png' },

  ];

  centerCard;
  ngOnInit() {

  }
  centerCardUpdate(event) {
    this.centerCard = event;
  }
  nextOrPrev(event){
    this.nextPrevOffset = event;
  }
  animationEnds(event){
    let first =this.items.findIndex(obj => obj.id === event[0]);
    let last = this.items.findIndex(obj => obj.id === event[this.items.length-3]);
    this.items[this.items.length-2].title=this.items[last].title;
    this.items[this.items.length-1].title=this.items[first].title;
   
   
  }
 
}
