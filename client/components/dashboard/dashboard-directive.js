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
 * @fileoverview DashboarDirective encapsulates HTML, style and behavior
 *     for displaying a dashboard.
 * @author joemu@google.com (Joe Allan Muharsky)
 */

goog.provide('p3rf.perfkit.explorer.components.dashboard.DashboardDirective');

goog.require('p3rf.perfkit.explorer.components.dashboard.DashboardService');
goog.require('p3rf.perfkit.explorer.models.ChartType');


goog.scope(function() {
const explorer = p3rf.perfkit.explorer;
const ChartType = explorer.models.ChartType;
const DashboardService = explorer.components.dashboard.DashboardService;


/**
 * See module docstring for more information about purpose and usage.
 *
 * @return {Object} Directive definition object.
 * @ngInject
 */
explorer.components.dashboard.DashboardDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      'ngModel': '='
    },
    templateUrl: '/static/components/dashboard/dashboard-directive.html',
    controller: [
        '$scope', 'explorerService', 'dashboardService', 'containerService', 'sidebarTabService',
        'widgetFactoryService',
        function($scope, explorerService, dashboardService, containerService, sidebarTabService,
            widgetFactoryService) {
      /** @export */
      $scope.containerSvc = containerService;

      /** @export */
      $scope.dashboardSvc = dashboardService;

      /** @export */
      $scope.explorerSvc = explorerService;

      /** @export */
      $scope.widgetFactorySvc = widgetFactoryService;

      /** @export */
      $scope.clickRefreshWidget = function(event, widget) {
        dashboardService.refreshWidget(widget);
        event.stopPropagation();
      }

      /** @export */
      $scope.clickContainer = function(event, container) {
        dashboardService.selectWidget(null, container);
        event.stopPropagation();

        sidebarTabService.resolveSelectedTabForContainer();
      }

      /** @export */
      $scope.clickWidget = function(event, widget, container) {
        dashboardService.selectWidget(widget, container);
        event.stopPropagation();

        sidebarTabService.resolveSelectedTabForWidget();
      }
      
      /**
       * Returns true if the widget should scroll its overflow, otherwise stretch.
       * @param {!WidgetConfig} widget
       * @param {!ContainerConfig} container
       */
      $scope.isWidgetScrollable = function(widget, container) {
        // TODO: Replace with data-driven constraints for visualizations that support scrolling.
        if (container.model.container.scroll_overflow === true) {
          if (widget.model.type === widgetFactoryService.widgetTypes.TEXT) {
            return true;
          }
          
          if (widget.model.type === widgetFactoryService.widgetTypes.CHART) {
            switch (widget.model.chart.chartType) {
              case ChartType.TABLE:
                return true;
            }
          }
          
          return false;
        }
      }
    }]
  };
};

});  // goog.scope
