import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { onGetDataAccess } from 'src/app/store/actions/roles.action';
import { RootState } from 'src/app/store/entities/state.entity';
import DataAccess from '../../../../../../at-common/model/DataAccess';
import Role from '../../../../../../at-common/model/Role';
import { DATA_ACCESS } from '../../data/setting';
import { DestroySubsribeService } from '../../service/destroySubscribe.service';

@Component({
  selector: 'at-data-access',
  templateUrl: './at-data-access.component.html',
  styleUrls: ['./at-data-access.component.scss'],
  providers: [DestroySubsribeService]
})
export class AtDataAccessComponent implements OnInit {

  dataAccess: DataAccess[] = [];
  mapDataAccess = new Map();
  dataAccessGroup: string[] = [];
  @Input() dataAccessSelected: string[] = [];
  @Output() selectedDataAccess = new EventEmitter<DataAccess>();
  @Input() isDisable: boolean = false;

  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
  ) {
    this.dataAccess.sort( (f,s) => (f.group.length - s.group.length));
  }

  ngOnInit(): void {
    this.onLoadDataAccess();
  }

  onLoadDataAccess = ():void => {
    this.mapDataAccess = new Map();
    this.dataAccessGroup = [];
    let dataAccess: DataAccess[] = [];
    this.store.dispatch(onGetDataAccess());
    this.store.select(state => state.role.dataAccess)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe( result => {
      this.mapDataAccess = new Map();
      this.dataAccessGroup = [];
      let dataAccess: DataAccess[] = [];
      if ( !result ) { return }

      for (let item of result) {
        
        if ( this.mapDataAccess.has(item.group)) {

          dataAccess = this.mapDataAccess.get(item.group);

        } else {

          if ( !this.dataAccessGroup.includes(item.group)) {

            this.dataAccessGroup.push(item.group);

          } 
          dataAccess = new Array<DataAccess>();
        }
        dataAccess.push(item);
        this.mapDataAccess.set(item.group, dataAccess);
      }
    })
  }

  handleCheckboxChange = (event):void => {
    this.selectedDataAccess.emit(event)
  }

  checked = (value) => {
    return this.dataAccessSelected?.some(val => val === value);
  }
}
