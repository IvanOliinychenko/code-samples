import { ApiClient } from 'services/apiClient';
import { inject } from 'aurelia-framework';

let groupsEndpoint = 'api/administrator/groups/';

@inject(ApiClient)
export class GroupsManager {
  constructor(apiClient) {
    this._apiClient = apiClient;
  }

  createGroup(groupName) {
    return this._apiClient.post({
      url: groupsEndpoint,
      data: {
        name: groupName
      }
    })
    .then(response => response.json());;
  }

  updateGroup(group) {
    return this._apiClient.put({
      url: groupsEndpoint + group.id,
      data: group
    })
    .then(response => response.json());;
  }

  getGroups(){
    return this._apiClient.get({
      url: groupsEndpoint
    })
      .then(response => response.json());
  }

  getGroup(groupId){
    return this._apiClient.get({
      url: groupsEndpoint + groupId
    })
      .then(response => response.json());
  }

  deleteGroup(groupId){
    return this._apiClient.delete({
      url: groupsEndpoint + groupId
    });
  }

  getUsers(groupId){
    return this._apiClient.get({
      url: groupsEndpoint + groupId + '/users/'
    })
      .then(response => response.json());
  }

  addUser(groupId, email, roleId){
    return this._apiClient.post({
      url: groupsEndpoint + groupId + '/users/',
      data: {
        email: email,
        roleId: roleId
      }
    });
  }

  removeUser(groupId, userId){
    return this._apiClient.delete({
      url: groupsEndpoint + groupId + '/users/' + userId
    });
  }

  updateUser(groupId, userId, roleId){
    return this._apiClient.put({
      url: groupsEndpoint + groupId + '/users/' + userId,
      data: {
        roleId: roleId
      }
    });
  }

}
