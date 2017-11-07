//There's a chance that everything about this is awful I'm not super experienced with JS

//Constructor for Student
//classes   (Class[][])  all the classes for the student by semester
//semsester (int)      current semester (0 is transfer credit, 1 is 1st semester, 2 is 2nd, etc)
function Student(classes, semester) {
    this.classes = classes;
    this.semester = semester;
}

//Constructor for Class
//id      (String)   class ID (ex: "CS2500")
//name    (String)   class name (ex: "Fundamanetals of Computer Science 1")
//credits (int)      credits for class
//coreq   (Class[])  corequisites for class (can there be more than one? not sure. if not don't need array)
//prereq  (Clqass[])  prerequisites for class
//desc    (String)   class description
function Class(id, name, credits, coreq, prereq, desc) {
    this.id = id;
    this.name = name;
    this.credits = credits;
    this.corequisites = coreq;
    this.prerequisites = prereq;
    this.description = desc;
}

function test() {
    localStorage.removeItem("user");
    var fundies1 = new Class("CS2500", "Fundies", 4, null, null, "a good one");
    var fundies2 = new Class("CS2510", "Fundies 2", 4, null, null, "a bad one");
    var transfer = [];
    var sem1 = [fundies1, fundies2];
    var sem2 = [fundies2];
    var sched = [transfer, sem1, sem2];
    var john = new Student(sched, 2);
    store(john);
    console.log(load());
    addClass("OOD", 7); 
    console.log(load());
    removeClass("OOD", 7); 
    console.log(load());
}

//Stores the student in localStorage
//stud (Student) the student to store
function store(stud) {
    localStorage.setItem("user", JSON.stringify(stud));
}

function load() {
    var j = JSON.parse(localStorage.getItem("user"));
    if (j == null) {
	var classes = [[]];
	var stud = new Student(classes, 1); 
	store(stud); 
	return stud; 
    }	
    var sem = j.semester;

    var classArray = parseSemesterArray(JSON.stringify(j.classes));
    return new Student(classArray, sem);
}

function addClass(className, semester) {
	var stud = load(); 
	var classArray = stud.classes; 		
	while (semester + 1 > classArray.length) {
		classArray[classArray.length] = []; 
	}

	classArray[semester].push(new Class(null, className, 4, null, null, null));
	
	var ret = new Student(classArray, stud.semester);
	
	store(ret); 
}

function removeClass(className, semester) {
	var stud = load(); 
	var classArray = stud.classes; 	
	
	if (semester > classArray.length) {
		return; 
	}
	
	var index = -1;
	
	for (var i = 0; i < classArray[semester].length; i++) {
		var cur = classArray[semester][i];
		if (cur.name == className) { 
			index = i;
		}
	}	

	if (index > -1) {
		classArray[semester].splice(index, 1);
	}	

	console.log(classArray);
	var ret = new Student(classArray, stud.semester); 
	store(ret);
}

function moveClass(className, semesterFrom, semesterTo) {
	removeClass(className, semesterFrom);
	addClass(className, semesterTo); 
}


function parseSemesterArray(sems) {
    var ret = [];
    var cur = sems;
    //console.log("Schedule:" + sems);
    cur = cur.substring(cur.indexOf("[") + 1);	
    while(1) {
	cur = cur.substring(cur.indexOf("["));
	//console.log(cur);
	if (cur.indexOf("[]") == 0) {
		cur = cur.substring(2); 
		var mt = [];
		ret.push(mt);
	}
	else {
       	 	sem = cur.substring(1, cur.indexOf("}]") + 1);
       	 	ret.push(parseSemester(sem));
		cur = cur.substring(cur.indexOf("}]"));
	}

	if (cur.indexOf(",") == -1) {
	    break;
	}
    }
    return ret;
}


function parseSemester(sem) {
    var ret = [];
    var cur = sem;
    //console.log("Semester:  " + sem);
    while(1) {
	c = cur.substring(0, cur.indexOf("}") + 1);
	ret.push(parseClass(c));
	cur = cur.substring(cur.indexOf("}") + 2);
	if (cur.indexOf("{") == -1) {
	    break;
	}
    }
    return ret;
}


function parseClass(c) {
    //console.log("Class:  " + c);
    var j = JSON.parse(c);
    return new Class(j.id, j.name, j.credits, j.corequisites, j.prerequisites, j.description);
}
test();



