//There's a chance that everything about this is awful I'm not super experienced with JS

//Constructor for Student
//classes   (Class[][])  all the classes for the student by semester
//semester (int)      current semester (0 is transfer credit, 1 is 1st semester, 2 is 2nd, etc)
function Student(classes, semester) {
    this.classes = classes;
    this.semester = semester;
}

//Constructor for Class
//id      (String)   class ID (ex: "CS2500")
//name    (String)   class name (ex: "Fundamanetals of Computer Science 1")
//credits (int)      credits for class
//coreq   (Class[])  corequisites for class (can there be more than one? not sure. if not don't need array)
//prereq  (Class[])  prerequisites for class
//desc    (String)   class description
function Class(id, name, credits, coreq, prereq, desc) {
    this.id = id;
    this.name = name;
    this.credits = credits;
    this.corequisites = coreq;
    this.prerequisites = prereq;
    this.description = desc;
}

//Makes a sample schedule for testing
function getStartingSchedule() {
  return [
    [],
    [
     new Class(null, "Fundamentals of Computer Science I", 4, null, null, null),
     new Class(null, "Lab for Fundamentals of Computer Science I", 1, null, null, null),
     new Class(null, "Discrete Structures", 4, null, null, null),
     new Class(null, "Recitation for Discrete Structures", 1, null, null, null),
     new Class(null, "First-Year Writing", 4, null, null, null),
     new Class(null, "Introduction to Psychology", 4, null, null, null),
     new Class(null, "CS/IS Overview 1", 1, null, null, null),
   ],
   [
     new Class(null, "Fundamentals of Computer Science II", 4, null, null, null),
     new Class(null, "Lab for Fundamentals of Computer Science II", 1, null, null, null),
     new Class(null, "Games and Society", 4, null, null, null),
     new Class(null, "Logic and Computation", 4, null, null, null),
     new Class(null, "Technology and Human Values", 4, null, null, null),
   ],[],[],[],
  ];
}


//Right now Class adding is represented as just a String for the class name- this is ok for now since they just need to see it on the schedule

//Changes the semester a class is in. This will just add the class if it is called with a class that doesn't exist in the semesterFrom semester
//className    (String) the name of the class
//semesterFrom (int)    the semester the class is in
//semesterTo   (int)	  the semester to move the class to
function moveClass(className, semesterFrom, semesterTo) {
	  addClass(className, semesterTo);
    removeClass(className, semesterFrom);
}

//Adds a class to the schedule. Also stores the change in localStorage
//className (String) The class to add
//semester  (int)    The semester to add it to
function addClass(className, semester) {
	var stud = load();
	//console.log(stud);
	var classArray = stud.classes;
	while (semester + 1 > classArray.length) {
		classArray[classArray.length] = [];
	}

	classArray[semester].push(new Class(null, className, 4, null, null, null));
	var ret = new Student(classArray, stud.semester);

	store(ret);
}

//Removes a class from the schedule. Also stores the change in localStorage
//className (String) The class to remove
//semester  (int)    The semester to remove it from
function removeClass(className, semester) {
	var stud = load();
	var classArray = stud.classes;

	if (semester > classArray.length) { return; }

	var index = -1;

	for (var i = 0; i < classArray[semester].length; i++) {
		var cur = classArray[semester][i];
		if (cur.name === className.substring(0, selectedClass.indexOf("("))) {
			index = i;
		}
	}

	if (index > -1) {
		classArray[semester].splice(index, 1);
	}

	// console.log(classArray);
	var ret = new Student(classArray, stud.semester);
	store(ret);
}



//Stores the student in localStorage
//stud (Student) the student to store
function store(stud) {
    // console.log("storing");
    // console.log(stud);
    localStorage.setItem("user", JSON.stringify(stud));
}

//Retrieves the student from localStorage
//Returns a Student
function load() {
    var j = JSON.parse(localStorage.getItem("user"));
    if (j === null) {
  		var classes = getStartingSchedule();
  		var stud = new Student(classes, 1);
  		return stud;
    }
    var sem = j.semester;

    var classArray = parseSemesterArray(JSON.stringify(j.classes));
    var stud = new Student(classArray, sem);
    //console.log(stud);
    return stud;
}

//The following 3 functions are weird things to parse a JSON object turned into a String back into a Student

//Parses a full schedule
//sems (String) a schedule in JSON format in a String
function parseSemesterArray(sems) {
    var ret = [];
    var cur = sems;
    //console.log("Schedule:" + sems);
    cur = cur.substring(cur.indexOf("[") + 1);
    while(1) {
	cur = cur.substring(cur.indexOf("["));
	//console.log(cur);
	if (cur.indexOf("[]") === 0) {
		cur = cur.substring(2);
		var mt = [];
		ret.push(mt);
	}
	else {
       	 	sem = cur.substring(1, cur.indexOf("}]") + 1);
       	 	ret.push(parseSemester(sem));
		cur = cur.substring(cur.indexOf("}]"));
	}

	if (cur.indexOf(",") === -1) {
	    break;
	}
    }
    return ret;
}

//Parses a single semester
//sem (String) a semester in JSON format in a String
function parseSemester(sem) {
    var ret = [];
    var cur = sem;
    //console.log("Semester:  " + sem);
    while(1) {
	c = cur.substring(0, cur.indexOf("}") + 1);
	ret.push(parseClass(c));
	cur = cur.substring(cur.indexOf("}") + 2);
	if (cur.indexOf("{") === -1) {
	    break;
	}
    }
    return ret;
}

//Parses a single class
//c (String) a class in JSON format in a String
function parseClass(c) {
    // console.log("Class:  " + c);
    var j = JSON.parse(c);
    return new Class(j.id, j.name, j.credits, j.corequisites, j.prerequisites, j.description);
}



//misc. function used for testing
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
    // console.log(load());
    addClass("OOD", 7);
    // console.log(load());
    moveClass("OOD", 7, 2);
    // console.log(load());
}
