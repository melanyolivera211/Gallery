import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: false,
})
export class ButtonComponent implements OnInit {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() color: string = 'primary';
  @Input() fill: 'clear' | 'outline' | 'solid' | 'default' = 'solid';
  @Input() expand: 'full' | 'block' | undefined;
  @Input() disabled: boolean = false;
  @Input() shape: 'round' | undefined;
  @Input() size: 'small' | 'default' | 'large' = 'default';
  @Input() customClass: string = '';

  @Output() onClick = new EventEmitter<Event>();

  public constructor() {}

  public ngOnInit(): void {}
}
