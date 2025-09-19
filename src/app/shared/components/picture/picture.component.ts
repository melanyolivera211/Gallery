import { Component, OnInit, Input } from '@angular/core';

import { Picture } from '@gallery/entity/picture.entity';

import { Router } from '@angular/router';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss'],
  standalone: false,
})
export class PictureComponent implements OnInit {
  @Input() public picture!: Picture;

  public constructor(private router: Router) {}

  public ngOnInit(): void {}

  public navigateToPicture(): void {
    if (this.picture && this.picture.id)
      this.router.navigate(['/picture', this.picture.id]);
  }
}
