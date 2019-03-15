import { GroupsManager } from 'managers/groupsManager';
import { inject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { ErrorParser } from 'services/errorParser';
import { ToastsHandler } from 'services/toastsHandler';


@inject(GroupsManager, DialogService, ErrorParser, ToastsHandler)
export class PublicDocuments {
  constructor(groupsManager, dialogService, errorParser, toastsHandler) {

    this.errors = [];

    this._groupsManager = groupsManager;
    this._dialogService = dialogService;
    this._toastsHandler = toastsHandler;
    this._errorParser = errorParser;
  }


}
