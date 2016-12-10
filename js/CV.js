var thingsAboutMe = [];
var toyNames = ["Snake"];
var toyCounter = 0;
var headerHeight = 50;
var app = angular.module('cvModule',['ngRoute', 'duScroll', 'ngSanitize']);
app.controller('controller', function($scope, $anchorScroll, $location, $interval, $document, $http){
	headerHeight = document.querySelector('header').getBoundingClientRect().height;
	$http.get('Data/stuff.json').success(function(response){
		thingsAboutMe = response.ThingsAboutMeEN;
		$scope.education = response.EducationEN;
		$scope.projects = response.ProjectsEN;
		$scope.aboutMe = response.AboutMeEN;
	});
	$scope.toyName = toyNames[toyCounter];
	$scope.langToggler = "toggle-right";
	$scope.selectedHome = $location.hash() == "Home" || $location.hash() == "" ? "navbar-selected" : "";
	$scope.selectedAbout = $location.hash() == "About"  ? "navbar-selected" : "";
	$scope.selectedSkills = $location.hash() == "Skills" ? "navbar-selected" : "";
	$scope.selectedEducation = $location.hash() == "Education" ? "navbar-selected" : "";
	$scope.selectedProjects = $location.hash() == "Projects" ? "navbar-selected" : "";
	$scope.scrollPosition = 0;
	$scope.thingsAboutMe = "Engineer";
	$scope.thingsOpacity = "transparent";

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
				$scope.thingsOpacity = "transparent";
				state++;
				break;
			case 2:
				interval = 500;
				$scope.thingsOpacity = "opaque";
				counter = (counter+1)%thingsAboutMe.length;
				$scope.thingsAboutMe=thingsAboutMe[counter];
				state = 0;
				break;
		}
	},interval);
	
	$scope.updateNavbar = function(ind){
		$scope.selectedHome = ind == -1 ? "navbar-selected" : "";
		$scope.selectedAbout = ind == 0 ? "navbar-selected" : "";
		$scope.selectedSkills = ind == 1 ? "navbar-selected" : "";
		$scope.selectedEducation = ind == 2 ? "navbar-selected" : "";
		$scope.selectedProjects = ind == 3 ? "navbar-selected" : "";
	}

	$scope.updateSelectedSection = function(ind){
		var target;
		switch(ind){
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

})
.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
        	scope.scrollPosition = $window.scrollY;
        	if(document.querySelector('#Home').getBoundingClientRect().bottom > headerHeight)
        		scope.updateNavbar(-1);
        	else if(document.querySelector('#About').getBoundingClientRect().bottom >= headerHeight)
        		scope.updateNavbar(0);
        	else if(document.querySelector('#Skills').getBoundingClientRect().bottom >= headerHeight)
        		scope.updateNavbar(1);
        	else if(document.querySelector('#Education').getBoundingClientRect().bottom >= headerHeight)
        		scope.updateNavbar(2);
        	else if(document.querySelector('#Projects').getBoundingClientRect().bottom >= headerHeight)
        		scope.updateNavbar(3);
        	else
        		scope.updateNavbar(4);
        	//toggleGame(document.querySelector('#canvas').getBoundingClientRect().top > $window.innerHeight);
            scope.$apply();
        });
    };
})
.run(['$anchorScroll', function($anchorScroll) {
	$anchorScroll.yOffset = headerHeight;
}]);