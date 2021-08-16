import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSettingsPageComponent } from './menu-settings-page.component';

describe('MenuSettingsPageComponent', () => {
  let component: MenuSettingsPageComponent;
  let fixture: ComponentFixture<MenuSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuSettingsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
