import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateFilePageComponent } from './generate-file-page.component';

describe('GenerateFilePageComponent', () => {
  let component: GenerateFilePageComponent;
  let fixture: ComponentFixture<GenerateFilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateFilePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateFilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
