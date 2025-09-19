import { Component, OnInit } from '@angular/core';
import { Gallery as GalleryService } from '@gallery/gallery';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  public constructor(private galleryService: GalleryService) {}

  public async ngOnInit(): Promise<void> {
    //console.log(await this.galleryService.list());
  }
}
