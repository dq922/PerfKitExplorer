/**
 * @copyright Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview Controller for the explorer page as a whole.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.explorer.ExplorerCtrl');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardDataService');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardModel');
goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.components.explorer.ExplorerService');
goog.require('p3rf.perfkit.explorer.components.explorer.sidebar.SidebarTabService');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const DashboardModel = explorer.components.dashboard.DashboardModel;
const DashboardDataService = explorer.components.dashboard.DashboardDataService;
const DashboardService = explorer.components.dashboard.DashboardService;
const ExplorerService = explorer.components.explorer.ExplorerService;
const SidebarTabService = explorer.components.explorer.sidebar.SidebarTabService;


/**
 * Root controller for the Explorer page.
 *
 * @param {!angular.Scope} $scope
 * @param {!angular.Location} $location
 * @param {DashboardDataService} dashboardDataService
 * @param {DashboardService} dashboardService
 * @param {ExplorerService} explorerService
 * @param {SidebarTabService} sidebarTabService
 * @constructor
 * @ngInject
 */
explorer.components.explorer.ExplorerCtrl = function(
    $scope, $location,
    dashboardDataService, dashboardService, explorerService,
    sidebarTabService) {
  /**
   * @type {angular.Location}
   * @private
   */
  this.location_ = $location;

  /**
   * @type {DashboardDataService}
   * @private
   */
  this.dashboardDataService_ = dashboardDataService;

  /**
   * @type {SidebarTabService}
   * @export
   */
  this.sidebarTabService = sidebarTabService;

  /**
   * @type {DashboardService}
   * @export
   */
  this.dashboard = dashboardService;

  /**
   * @type {ExplorerService}
   * @export
   */
  this.explorer = explorerService;

  /**
   * Error messages raised by this controller.
   *
   * @type {Array.<string>}
   * @export
   */
  this.errors = [];

  $scope.$watch(
      angular.bind(this, function() {
        if (!goog.isDefAndNotNull(this.dashboard.current)) {
          return null;
        } else {
          return this.dashboard.current.model.owner;
        }
      }),
      angular.bind(this, function(owner) {
        if (!this.explorer.model.readOnly == null) {
          this.explorer.model.readOnly = (
              this.dashboard.current.model.id &&
              owner.email != CURRENT_USER_EMAIL &&
              !CURRENT_USER_ADMIN);
        }
      }));

  $scope.$watch(
      angular.bind(this, function() {
        return this.explorer.model.readOnly;
      }),
      angular.bind(this, function(readOnly) {
        if (readOnly) {
          this.location_.search('readOnly', true);
        } else {
          this.location_.search('readOnly', null);
        }
      }));

  this.initExplorer();
};
const ExplorerCtrl = explorer.components.explorer.ExplorerCtrl;


/**
 * Handles KeyDown events on the page.  Specific behavior is noted below.
 *
 * ESC: If an element has focus, de-focus it.
 *     Otherwise, if a widget is selected, de-select it.
 *     Otherwise, if a container is selected, de-select it.
 *     Otherwise, if a tab is selected, de-select it.
 *
 * @param event
 * @export
 */
ExplorerCtrl.prototype.checkKeyDown = function(event) {
  if (event.keyCode === this.explorer.KEY_ESCAPE) {
    if (document.activeElement === null ||
         document.activeElement === document.body) {
      if (this.dashboard.selectedWidget) {
        this.dashboard.selectWidget(null, this.dashboard.selectedContainer);
      } else if (this.dashboard.selectedContainer) {
        this.dashboard.selectWidget(null, null);
      } else if (this.sidebarTabService.selectedTab) {
        this.sidebarTabService.selectedTab = null;
      }
    } else {
      document.activeElement.blur();
    }
  }
};


/**
 * Initializes the explorer.
 */
ExplorerCtrl.prototype.initExplorer = function() {
  this.explorer.listDashboards();
};


});  // goog.scope
