import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFilePageComponent } from './download-file-page.component';

describe('DownloadFilePageComponent', () => {
  let component: DownloadFilePageComponent;
  let fixture: ComponentFixture<DownloadFilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFilePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
