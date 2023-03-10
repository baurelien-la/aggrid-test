import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, CellClickedEvent, ColGroupDef } from 'ag-grid-community';
import { GROUPDEF } from 'data/coldef';
import { DATA } from 'data/data';
import { BehaviorSubject, combineLatest, map, of, Observable, Subject, delay } from 'rxjs';

export interface View {
  name: string;
  visibleColumns: ColDef[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  defaultViews: View[] = [
    {
      name: 'first',
      visibleColumns: [
        {
          field: "cat1-col1",
        },
        {
          field: "cat1-col2",
        },
        {
          field: "cat1-col5",
        }
        ,
        {
          field: "cat2-col1",
        }
      ]
    },
    {
      name: 'second',
      visibleColumns: [
        {
          field: "cat1-col1",
        },
        {
          field: "cat1-col2",
        },
        {
          field: "cat1-col7",
        }
        ,
        {
          field: "cat3-col1",
        }
      ]
    }
  ];

  // Each Column Definition results in one Column.
  columnDefs$!: Observable<(ColGroupDef | ColDef)[]>;
  columnDefs: ColGroupDef[] = [];

  visibleColumns: Subject<ColDef[]> = new BehaviorSubject(this.defaultViews[0].visibleColumns);

  displayedColDefs$!: Observable<(ColGroupDef | ColDef)[]>;

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private http: HttpClient) {}

  defaultControl = new FormControl();


  ngOnInit(): void {

    this.columnDefs$ = of(GROUPDEF).pipe(delay(1000), map((response) => response));

    this.displayedColDefs$ = combineLatest([this.columnDefs$, this.visibleColumns]).pipe(
      map(([columns, defaultColumns]) => {

        const agGridColumn = this.agGrid.api.getColumnDefs();
        if (agGridColumn!.length) columns = agGridColumn!;

        columns.forEach(group => {
          (group as ColGroupDef).children.forEach((column: ColDef) => {
            column.hide = true;
          })
        })

        defaultColumns.forEach((colDef) => {
          columns.forEach(group => {
            (group as ColGroupDef).children.forEach((column: ColDef) => {
              if (column.field === colDef.field) {
                column.hide = false;
              }
            })
          })
        })

        console.log('Col Defs to display :')
        console.log(columns);
        return columns;
      })
    );
  }

  // Example load data from sever
  onGridReady(params: GridReadyEvent) {
    this.agGrid.api = params.api;

    this.rowData$ = of(DATA);
  }

  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
  }

  getField (column: ColDef)  {
    return column.field;
  }

  handleChange(event: MatSelectChange) {
    this.visibleColumns.next(event.value);
  }
}
