import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'test-comp', 
  templateUrl: './test-comp.component.html',
  styleUrls: ['./test-comp.component.css'] 
})
export class TestComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    // Initialization logic goes here, if needed
  }
}