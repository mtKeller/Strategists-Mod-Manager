import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModManagerComponent } from './mod-manager.component';

describe('ModManagerComponent', () => {
  let component: ModManagerComponent;
  let fixture: ComponentFixture<ModManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
