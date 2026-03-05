import { Component } from '@angular/core';
import { Viewer360Component } from './viewer360/viewer360.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Viewer360Component],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
