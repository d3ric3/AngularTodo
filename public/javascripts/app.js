// ********* Listing App Section *********
var ListingApp = angular.module('ListingApp', ['ngRoute', 'ngResource', 'ngCookies']);

ListingApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/listings',  { controller: 'ListingController', templateUrl: '/templates/listings.html' }).
		when('/new', { controller: 'NewListingController', templateUrl: '/templates/new_listing.html' }).
		when('/archives', { controller: 'ArchiveListingController', templateUrl: '/templates/archives.html' }).
		when('/login', { controller: 'LoginController', templateUrl: '/templates/login.html' }).
		otherwise({ redirectTo: '/login' });
}]);

ListingApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

ListingApp.factory('ListingFactory', ['$resource', function($resource) {
	return $resource('/api/:id/listing', { id: '@id'}, { update: { method: 'PUT' } });
}]);

ListingApp.factory('AuthInterceptor', ['$rootScope', '$q', '$cookieStore', function ($rootScope, $q, $cookieStore) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token') !== '') {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }
      return config;
    },
    responseError: function (rejection) {
      if (rejection.status === 401) {
        // handle the case where the user is not authenticated
      }
      return $q.reject(rejection);
    }
  };
}]);

ListingApp.controller('PresentationController', ['$scope', function($scope) {
	$scope.$on('SHOW_LOADING', function() {
		$scope.loading = true;
	});
	$scope.$on('STOP_LOADING', function() {
		$scope.loading = false;
	});
}]);

ListingApp.controller('ListingController', ['$scope', '$location', 'ListingFactory', function($scope, $location, ListingFactory) {

	$scope.sort_field = 'updated_at';
	$scope.is_desc = false;
	$scope.listings = [];

	$scope.init = function() {
		$scope.search(true);
	}

	$scope.search = function(is_loading) {
		// default is_loading to false
		is_loading = typeof is_loading !== 'undefined' ? is_loading : false;

		if(is_loading)
			$scope.$emit('SHOW_LOADING');

		ListingFactory.query({
			sort_field: $scope.sort_field,
			is_desc: $scope.is_desc,
			status: 'active'
		}, function(data) {
			$scope.$emit('STOP_LOADING');
			$scope.listings = data;			
		}, function(err) {
			$scope.$emit('STOP_LOADING');
			$scope.error = JSON.stringify(err);
		});
	}

	$scope.sort = function(field) {
		if($scope.sort_field === field) {
			$scope.is_desc = !$scope.is_desc;
		} else {
			$scope.sort_field = field;
			$scope.is_desc = false;
		}
		$scope.search();
	}

	$scope.archive = function() {
		var index = $scope.listings.indexOf(this.listing);

		ListingFactory.update({
			id: this.listing._id,
			status: 'archived'
		}, function() {
			$scope.listings.splice(index, 1);
		}, function(err) {
			$scope.error = JSON.stringify(err);
		});
	}

	$scope.update = function() {
		ListingFactory.update({ id: this.listing._id, posted_at: new Date() },
			function(data) {
				$scope.search();
			}, function(err) {
				$scope.error = JSON.stringify(err);
			});
	}

	$scope.is_green = function(date) {
		date = new Date(date);
		var lapsed = (new Date()).getTime() - date.getTime();
		var one_day = 6 * 60 * 60 * 1000;
		if (lapsed <= one_day) return true;
		else return false;
	}

	$scope.is_yellow = function(date) {
		date = new Date(date);
		var lapsed = (new Date()).getTime() - date.getTime();
		var six_hours = 6 * 60 * 60 * 1000;
		var one_week = 7 * 24 * 60 * 60 * 1000;
		if (lapsed > six_hours && lapsed <= one_week) return true;
		else return false;
	}

	$scope.is_red = function(date) {
		date = new Date(date);
		var lapsed = (new Date()).getTime() - date.getTime();
		var one_week = 7 * 24 * 60 * 60 * 1000;
		if (lapsed > one_week) return true;
		else return false;
	}

	$scope.init();
}]);

ListingApp.controller('NewListingController', ['$scope', '$location', 'ListingFactory', function($scope, $location, ListingFactory) {

		$scope.init = function() {
			$scope.categories = ['sale', 'rent'];
			$scope.error = null;
			$scope.success = null;
			$scope.text = '';
			$scope.category = '';
			$scope.price = '';
		}

		$scope.create = function(form) {
			ListingFactory.save({
				text: $scope.text,
				category: $scope.category,
				price: $scope.price
			}, function(data) {
				$scope.success = JSON.stringify(data);
				$scope.init();
			}, function(err) {
				$scope.error = JSON.stringify(err);
			});
		}

		$scope.init();
}]);

ListingApp.controller('ArchiveListingController', ['$scope', '$location', 'ListingFactory', function($scope, $location, ListingFactory) {

	$scope.sort_field = 'updated_at';
	$scope.is_desc = false;
	$scope.listings = [];

	$scope.init = function() {
		$scope.search();
	}

	$scope.search = function() {
		$scope.$emit('SHOW_LOADING');

		ListingFactory.query({
			sort_field: $scope.sort_field,
			is_desc: $scope.is_desc,
			status: 'archived'
		}, function(data) {
			$scope.$emit('STOP_LOADING');
			$scope.listings = data;
		}, function(err) {
			$scope.$emit('STOP_LOADING');
			$scope.error = JSON.stringify(err);
		});
	}

	$scope.sort = function(field) {
		if($scope.sort_field === field) {
			$scope.is_desc = !$scope.is_desc;
		} else {
			$scope.sort_field = field;
			$scope.is_desc = false;
		}
		$scope.search();
	}

	$scope.select_all = function() {
		$scope.listings.forEach(function(item) {
			if(!$scope.check_all) item.selected = true;
			else item.selected = false;
		});
	}

	$scope.remove = function(){
		var index = this.listings.indexOf(this.listing);

		ListingFactory.delete({ id: this.listing._id }, 
			function() {	
			$scope.listings.splice(index, 1);
		}, function(err) {
			$scope.error = JSON.stringify(err);
		});
	}

	$scope.restore = function() {
		var index = $scope.listings.indexOf(this.listing);

		ListingFactory.update({
			id: this.listing._id,
			status: 'active'
		}, function() {
			$scope.listings.splice(index, 1);
		}, function(err) {
			$scope.error = JSON.stringify(err);
		});
	}

	$scope.is_green = function(date) {
		date = new Date(date);
		var lapsed = (new Date()).getTime() - date.getTime();
		var one_day = 24 * 60 * 60 * 1000;
		if (lapsed <= one_day) return true;
		else return false;
	}

	$scope.is_yellow = function(date) {
		date = new Date(date);
		var lapsed = (new Date()).getTime() - date.getTime();
		var one_day = 24 * 60 * 60 * 1000;
		var one_week = 7 * 24 * 60 * 60 * 1000;
		if (lapsed > one_day && lapsed <= one_week) return true;
		else return false;
	}

	$scope.is_red = function(date) {
		date = new Date(date);
		var lapsed = (new Date()).getTime() - date.getTime();
		var one_week = 7 * 24 * 60 * 60 * 1000;
		if (lapsed > one_week) return true;
		else return false;
	}

	$scope.init();
}]);

ListingApp.controller('LoginController', ['$scope', '$http', '$window', '$cookieStore', function($scope, $http, $window, $cookieStore) {

	$scope.login = function () {
		$http
		.post('/login', { email: $scope.email, password: $scope.password })
		.success(function (data, status, headers, config) {
    		//$window.sessionStorage.token = data.token;
    		$cookieStore.put('token', data.token);
    		$window.location = '/#/listings';
		})
		.error(function (data, status, headers, config) {
			//delete $window.sessionStorage.token;
			$cookieStore.remove('token');
			$scope.error = JSON.stringify(data);
		});
	}

}]);