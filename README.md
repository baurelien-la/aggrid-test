# Poc Aggrid - Updating ColGroupDef childrens hide property returns undefined error on compute

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Branch description

Each branch works around the same issue : Starting from 28.2.1, when updating [colDef], agGrid returns an error if the new colDef is of type ColGroupDef[] and children's hide properties have been changed at once for groups that were not previously visible.

- **Main branch** shows the error as is, with 20 columns to show on three groups.
- **withOneChildren** shows the error with colGroupDef containing only 1 children in each groups at a time.
- **withoutGroups** shows there is no error when trying the same thing than main but without groups defined.
- **versionDowngrade** shows there was no errors when doing main things on ag-grid@28.2.0.
