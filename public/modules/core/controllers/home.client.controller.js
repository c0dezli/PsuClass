'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$q', '$timeout', '$filter', 'DTOptionsBuilder', 'DTColumnBuilder',
    function($scope, Authentication, $http, $q, $timeout, $filter, DTOptionsBuilder, DTColumnBuilder) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.message = "No result.";
        $scope.gap = 5;
        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 100;
        $scope.pagedItems = [];
        $scope.currentPage = 0;
        $scope.sort = {
            sortingOrder: 'id',
            reverse: false
        };

        var searchMatch = function(haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        // init the filtered items
        $scope.search = function() {
            $scope.filteredItems = $filter('filter')($scope.items, function(item) {
                for (var attr in item) {
                    if (searchMatch(item[attr], $scope.query))
                        return true;
                }
                return false;
            });
            // take care of the sorting order
            if ($scope.sort.sortingOrder !== '') {
                $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sort.sortingOrder, $scope.sort.reverse);
            }
            $scope.currentPage = 0;
            // now group by pages
            $scope.groupToPages();
        };


        // calculate page in place
        $scope.groupToPages = function() {
            $scope.pagedItems = [];

            for (var i = 0; i < $scope.filteredItems.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
                }
            }
        };

        $scope.range = function(size, start, end) {
            var ret = [];

            if (size < end) {
                end = size;
                if (size > $scope.gap) {
                    start = size - $scope.gap;
                } else {
                    start = 0;
                }
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function() {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function() {
            if ($scope.currentPage < $scope.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function() {
            $scope.currentPage = this.n;
        };

        //  fetch data from server
        $scope.getData = function() {
            if(!$scope.send_data){
                $scope.message = "Invalid Search.";
            } else {
                $http.post('/search/', $scope.send_data)
                    .success(function(data, status) {
                        $scope.items = data;
                        if ($scope.items != []) {
                            // functions have been describe process the data for display
                            $scope.search();
                        } else {
                          $scope.message = "No result.";
                        }
                    })
                    .error(function(data, status) {
                        $scope.message = "Failed to get data from server, please contact author.";
                    });
            }
          }
        // // get course data
        // var getData = function($timeout, $q) {
        //     return function() {
        //         // simulated async function
        //         return $q(function(resolve) {
        //             $timeout(function() {
        //                 // $http.post('/search').success(function(response) {
        //                 //     // If successful show success message and clear form
        //                 //     $scope.success = true;
        //                 //     resolve(response);
        //                 // }).error(function(response) {
        //                 //     $scope.error = response.message;
        //                 // });
        //                 $http.post('/search/', $scope.send_data)
        //                     .success(function(response, status) {
        //                         console.log(response);
        //                         //  $scope.items = data;
        //                         if ($scope.items != []) {
        //                             console.log(response);
        //                             resolve(response);
        //                         } else {
        //                             $scope.message = "No result.";
        //                         }
        //                     })
        //                     .error(function(response, status) {
        //                         $scope.message = status + ": Failed to get data from server, please contact author.";
        //                     });
        //             }, 100);
        //         });
        //     };
        // };
        //
        //  //datatable settings
        // var vm = this;
        // vm.options = {
        //     'aoColumns': [{
        //         'mData': 'number',
        //         'sTitle': 'Course Number'
        //     }, {
        //       'mData': 'name',
        //       'sTitle': 'Course Name'
        //     }, {
        //       'mData': 'section',
        //       'sTitle': 'Course Section'
        //     }, {
        //       'mData': 'major',
        //       'sTitle': 'Course Major'
        //     }, {
        //       'mData': '',
        //       'sTitle': 'Course Name'
        //     }]
        // };
        //
        // $scope.dtOptions = DTOptionsBuilder.fromFnPromise(getData($timeout, $q))
        //     .withPaginationType('full_numbers');
        // //
        // // $scope.dtColumns = [
        // //     DTColumnBuilder.newColumn('number').withTitle('Course Number'),
        // //     DTColumnBuilder.newColumn('name').withTitle('Course Name'),
        // //     DTColumnBuilder.newColumn('section').withTitle('Course Section'),
        // //     DTColumnBuilder.newColumn('major').withTitle('Email'),
        // // ];
    }
]);
