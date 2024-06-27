import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJourneysComponent } from './my-journeys.component';

describe('MyJourneysComponent', () => {
  let component: MyJourneysComponent;
  let fixture: ComponentFixture<MyJourneysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyJourneysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyJourneysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
