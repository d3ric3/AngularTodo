// var TrackingApp = angular.module('TrackingApp', ['ngRoute', 'ngResource']);

// TrackingApp.config(function($routeProvider) {
// 	$routeProvider.
// 		when('/', { controller: 'ListController', templateUrl: '/templates/todo.html' }).
// 		otherwise({ redirectTo: '/' });
// });

// TrackingApp.factory('TrackingFactory', function($resource) {
// 	return $resource('/api/:id/todo', { id: '@id' }, { update: { method: 'PUT' } });
// });	

// var ListController = function($scope, $location, TrackingFactory) {

// 	$scope.init = function() {
// 		TrackingFactory.query({ 
// 			search_string: $scope.query,
// 			sort_field: $scope.sort_field, 
// 			is_desc: $scope.is_desc,
// 			limit: $scope.limit,
// 			offset: $scope.offset
// 		}, function(data) {
// 			$scope.more = data.length === $scope.limit;
// 			$scope.todos = $scope.todos.concat(data);
// 			$scope.rows = $scope.todos.length; $scope.todos;
// 		});
// 	}

// 	$scope.search_for_more = function() {
// 		TrackingFactory.query({ 
// 			search_string: $scope.query,
// 			sort_field: $scope.sort_field, 
// 			is_desc: $scope.is_desc,
// 			limit: $scope.limit,
// 			offset: $scope.offset
// 		}, function(data) {
// 			$scope.more = data.length === $scope.limit;

// 			if(!$scope.more) $scope.offset -= $scope.limit; // undo offset when $scope.more === false
				
// 			$scope.todos = $scope.todos.concat(data);
// 			$scope.rows = $scope.todos.length;
// 		});
// 	}

// 	$scope.search_for_sort = function(rows) {
// 		TrackingFactory.query({ 
// 			search_string: $scope.query,
// 			sort_field: $scope.sort_field, 
// 			is_desc: $scope.is_desc,
// 			limit: rows
// 		}, function(data) {
// 			$scope.todos = data;
// 			$scope.rows = $scope.todos.length;
// 		});
// 	}

// 	$scope.sort = function(col) {
// 		if($scope.sort_field === col) {
// 			$scope.is_desc = !$scope.is_desc;
// 		} else {
// 			$scope.sort_field = col;
// 			$scope.is_desc = false;
// 		}
// 		$scope.search_for_sort($scope.rows);
// 	}

// 	$scope.show_more = function() {
// 		$scope.offset += $scope.initial_limit; // increase offset
// 		$scope.search_for_more(true);
// 	}

// 	$scope.has_more = function() {
// 		return $scope.more;
// 	}

// 	$scope.reset = function() {
// 		//$scope.search(false);
// 	}

// 	// default order settings
// 	$scope.sort_field = 'priority';
// 	$scope.is_desc = false;
// 	$scope.limit = 1;
// 	$scope.offset = 0;
// 	$scope.limit;
// 	$scope.rows = 0;
// 	$scope.initial_limit = $scope.limit;

// 	$scope.todos = [];
// 	$scope.more = true;

// 	// default/initial load
// 	$scope.init();
// }


// ********* Listing App Section *********
var ListingApp = angular.module('ListingApp', ['ngRoute', 'ngResource']);

ListingApp.config(function($routeProvider) {
	$routeProvider.
		when('/',  { controller: 'ListingController', templateUrl: '/templates/listing.html' }).
		when('/new', { controller: 'NewListingController', templateUrl: '/templates/new_listing.html' }).
		when('/archive', { controller: 'ArchiveListingController', templateUrl: '/templates/archive.html' }).
		otherwise({ redirectTo: '/' });
});

ListingApp.factory('ListingFactory', function($resource) {
	return $resource('/api/:id/listing', { id: '@id'}, { update: { method: 'PUT' } });
});

var ListingController = function($scope, $location, ListingFactory) {

	$scope.sort_field = 'updated_at';
	$scope.is_desc = false;
	$scope.listings = [];

	$scope.init = function() {
		$scope.search();
	}

	$scope.search = function() {
		ListingFactory.query({
			sort_field: $scope.sort_field,
			is_desc: $scope.is_desc,
			status: 'active'
		}, function(data) {
			$scope.listings = data;
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
		ListingFactory.update({ id: this.listing._id, updated_at: new Date(2000, 1, 1) },
			function(data) {
				$scope.search();
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
}

var NewListingController = function($scope, $location, ListingFactory) {

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
}

var ArchiveListingController = function($scope, $location, ListingFactory) {

	$scope.sort_field = 'updated_at';
	$scope.is_desc = false;
	$scope.listings = [];

	$scope.init = function() {
		$scope.search();
	}

	$scope.search = function() {
		ListingFactory.query({
			sort_field: $scope.sort_field,
			is_desc: $scope.is_desc,
			status: 'archived'
		}, function(data) {
			$scope.listings = data;
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
}
