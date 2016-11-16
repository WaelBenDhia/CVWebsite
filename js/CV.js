var thingsAboutMe = [
	"Software engineering student",
	"Frontend engineer",
	"Backend engineer",
	"Android developer",
	"Technology enthusiast",
	"Creative and ambitious"
	];
var app = angular.module('cvModule',['ngRoute']);
app.controller('controller', function($scope, $anchorScroll, $location, $interval){
	$scope.langToggler = "toggle-right";
	$scope.selectedHome = $location.path() == "/"  ? "navbar-selected" : "";
	$scope.selectedAbout = $location.path() == "/About"  ? "navbar-selected" : "";
	$scope.selectedSkills = $location.path() == "/Skills" ? "navbar-selected" : "";
	$scope.selectedEducation = $location.path() == "/Education" ? "navbar-selected" : "";
	$scope.selectedContact = $location.path() == "/Contact" ? "navbar-selected" : "";
	$scope.thingsAboutMe = thingsAboutMe[0];
	
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


	//0 is displaying, 1 is fading out, 2 is fading in
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
	
	$scope.updateSelectedSectionLazy = function(ind){
		$scope.selectedHome = ind == -1 ? "navbar-selected" : "";
		$scope.selectedAbout = ind == 0 ? "navbar-selected" : "";
		$scope.selectedSkills = ind == 1 ? "navbar-selected" : "";
		$scope.selectedEducation = ind == 2 ? "navbar-selected" : "";
		$scope.selectedContact = ind == 3 ? "navbar-selected" : "";
	}

	$scope.updateSelectedSection = function(ind){
		$scope.updateSelectedSectionLazy(ind);
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
				target = "Contact";
				break;
		}

		$location.hash(target);
		$anchorScroll.yOffset = 48;
		$anchorScroll();
	}

})
.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
        	if(document.querySelector('#Home').getBoundingClientRect().bottom >= 50)
        		scope.updateSelectedSectionLazy(-1);
        	else if(document.querySelector('#About').getBoundingClientRect().bottom >= 50)
        		scope.updateSelectedSectionLazy(0);
        	else if(document.querySelector('#Skills').getBoundingClientRect().bottom >= 50)
        		scope.updateSelectedSectionLazy(1);
        	else if(document.querySelector('#Education').getBoundingClientRect().bottom >= 50)
        		scope.updateSelectedSectionLazy(2);
        	else
        		scope.updateSelectedSectionLazy(3);
            scope.$apply();
        });
    };
});