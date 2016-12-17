var app = angular.module('cvModule',['ngAnimate', 'ngRoute', 'duScroll', 'ngSanitize']);
var thingsAboutMe = [];
var toyNames = ["Snake"];
var toyCounter = 0;
var headerHeight = 50;
var selectedIndex;

app.controller('controller', function($scope, $anchorScroll, $location, $interval, $document, $http){
	headerHeight = document.querySelector('header').getBoundingClientRect().height;
	$scope.dataLoading = true;
	$scope.scrolledPastTop = true;
	
	$scope.clicks = 0;
	$scope.color1Clicks = 0;
	$scope.color2Clicks = 0;
	$scope.color3Clicks = 0;
	$scope.color4Clicks = 0;

	$scope.clickCount = function(color){
		$scope.clicks++;
		switch(color){
			case 1:
				$scope.color1Clicks++;
			break;
			case 2:
				$scope.color2Clicks++;
			break;
			case 3:
				$scope.color3Clicks++;
			break;
			case 4:
				$scope.color4Clicks++;
			break;
		}
	}

	$scope.hideChievo = function(){
		$scope.clicks = 0;
	}

	$http.get('Data/stuff.json').success(function(response){
		thingsAboutMe = response.ThingsAboutMeEN;
		$scope.education = response.EducationEN;
		$scope.projects = response.ProjectsEN;
		$scope.aboutMe = response.AboutMeEN;
	}).finally( function(){
		$scope.dataLoading = false;
	});
	
	$scope.toyName = toyNames[toyCounter];
	$scope.langToggler = "toggle-right";

	switch($location.hash()){
		case "About":
			selectedIndex = 0;
		break;
		case "Skills":
			selectedIndex = 1;
		break;
		case "Education":
			selectedIndex = 2;
		break;
		case "Projects":
			selectedIndex = 3;
		break;
		default:
			selectedIndex = -1;
			$scope.scrolledPastTop = false;
		break;
	}
	
	$scope.scrollPosition = 0;
	$scope.thingsAboutMe = "Engineer";
	$scope.thingsAboutMeShow = false;

	$scope.changeGame = function(){
		toyCounter = (toyCounter+1)%toyNames.length;
		changeGame(toyCounter);
		$scope.toyName = toyNames[toyCounter];
	}

	var scrollOffset = angular.element(document.getElementById('navbar')).height();
	var scrollSpeed = 4;
	var langEN = true;

	$scope.toggleLanguage = function(){
		if(langEN)
			$scope.langToggler = "toggle-right";
		else
			$scope.langToggler = "toggle-left";
		langEN = !langEN;
	}
	
	var counter = 1;
	var state = 0;
	var interval = 1000;
	$interval(function(){
		switch(state){
			case 0:
				interval = 3000;
				state++;
				break;
			case 1:
				interval = 500;
				$scope.thingsAboutMeShow = false;
				$scope.arrowActive = "active";
				state++;
				break;
			case 2:
				interval = 500;
				$scope.thingsAboutMeShow = true;
				$scope.arrowActive = "";
				counter = (counter+1)%thingsAboutMe.length;
				$scope.thingsAboutMe=thingsAboutMe[counter];
				state = 0;
				break;
		}
	},interval);
	
	$scope.updateNavbar = function(ind){
		if(typeof ind != "undefined" ){
			selectedIndex = ind;
		}
		$scope.selectedHome = selectedIndex == -1 ? "navbar-selected" : "";
		$scope.selectedAbout = selectedIndex == 0 ? "navbar-selected" : "";
		$scope.selectedSkills = selectedIndex == 1 ? "navbar-selected" : "";
		$scope.selectedEducation = selectedIndex == 2 ? "navbar-selected" : "";
		$scope.selectedProjects = selectedIndex == 3 ? "navbar-selected" : "";
	}

	$scope.updateSelectedSection = function(ind){
		var target;
		if(typeof ind != "undefined" ){
			selectedIndex = ind;
		}
		switch(selectedIndex){
			case -1:
				target = "Home";
				break;
			case 0:
				target = "About";
				break;
			case 1:
				target = "Skills";
				break;
			case 2:
				target = "Education";
				break;
			case 3:
				target = "Projects";
				break;
		}
		var targetEl = angular.element(document.getElementById(target));
		var scrollTime = Math.abs(targetEl.offset().top  - $scope.scrollPosition)/scrollSpeed;
		$document.scrollToElement(targetEl, scrollOffset, scrollTime);
		$location.hash(target);
		$anchorScroll.yOffset = scrollOffset;
	}

	$scope.updateSelectedSection();

})
.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
        	scope.scrollPosition = $window.scrollY;
        	var index;
        	if(document.querySelector('#Home').getBoundingClientRect().bottom > headerHeight)
        		index = -1;
        	else if(document.querySelector('#About').getBoundingClientRect().bottom >= headerHeight)
        		index = 0;
        	else if(document.querySelector('#Skills').getBoundingClientRect().bottom >= headerHeight)
        		index = 1;
        	else if(document.querySelector('#Education').getBoundingClientRect().bottom >= headerHeight)
        		index = 2;
        	else if(document.querySelector('#Projects').getBoundingClientRect().bottom >= headerHeight)
        		index = 3;
        	else
        		index = 4;
        	scope.scrolledPastTop = scope.scrollPosition >= headerHeight;
        	if(index != selectedIndex){
        		selectedIndex = index;
        		scope.updateNavbar();
        	}
        	scope.$apply();
        });
    };
})
.run(['$anchorScroll', function($anchorScroll) {
	$anchorScroll.yOffset = headerHeight;
}]);