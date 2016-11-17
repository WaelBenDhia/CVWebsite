var thingsAboutMe = [
	"Software engineering student",
	"Frontend engineer",
	"Backend engineer",
	"Android developer",
	"Technology enthusiast",
	"Creative and ambitious"
	];
var app = angular.module('cvModule',['ngRoute', 'duScroll']);
app.controller('controller', function($scope, $anchorScroll, $location, $interval, $document){
	$scope.langToggler = "toggle-right";
	$scope.selectedHome = $location.hash() == "Home" || $location.hash() == "" ? "navbar-selected" : "";
	$scope.selectedAbout = $location.hash() == "About"  ? "navbar-selected" : "";
	$scope.selectedSkills = $location.hash() == "Skills" ? "navbar-selected" : "";
	$scope.selectedEducation = $location.hash() == "Education" ? "navbar-selected" : "";
	$scope.selectedProjects = $location.hash() == "Projects" ? "navbar-selected" : "";
	$scope.selectedContact = $location.hash() == "Contact" ? "navbar-selected" : "";
	$scope.thingsAboutMe = thingsAboutMe[0];
	$scope.scrollPosition = 0;

	var scrollOffset = angular.element(document.getElementById('navbar')).height();
	var scrollSpeed = 2;
	var langEN = true;

	$scope.toggleLanguage = function(){
		console.log("TOGGLING");
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
		$scope.selectedContact = ind == 4 ? "navbar-selected" : "";
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
			case 4:
				target = "Contact";
				break;
		}
		var targetEl = angular.element(document.getElementById(target));
		var scrollTime = Math.abs(targetEl.offset().top  - $scope.scrollPosition)/scrollSpeed;
		$document.scrollToElement(targetEl, scrollOffset, scrollTime);
		$location.hash(target);
	}

})
.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
        	scope.scrollPosition = $window.scrollY;
        	if(document.querySelector('#Home').getBoundingClientRect().bottom >= 50)
        		scope.updateNavbar(-1);
        	else if(document.querySelector('#About').getBoundingClientRect().bottom >= 50)
        		scope.updateNavbar(0);
        	else if(document.querySelector('#Skills').getBoundingClientRect().bottom >= 50)
        		scope.updateNavbar(1);
        	else if(document.querySelector('#Education').getBoundingClientRect().bottom >= 50)
        		scope.updateNavbar(2);
        	else if(document.querySelector('#Projects').getBoundingClientRect().bottom >= 50)
        		scope.updateNavbar(3);
        	else
        		scope.updateNavbar(4);
            scope.$apply();
        });
    };
});