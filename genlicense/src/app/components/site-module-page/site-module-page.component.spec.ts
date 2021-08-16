import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteModulePageComponent } from './site-module-page.component';

describe('SiteModulePageComponent', () => {
  let component: SiteModulePageComponent;
  let fixture: ComponentFixture<SiteModulePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteModulePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteModulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
