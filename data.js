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

	// functions we want:
	// 1. Add a class to a Student's schedule (avoid duplicates and adding to finished semester)
	// 2. Remove a class from a Student's schedule
	// 3. Move a class from one semester to another (unless trying to move to already finished semester?)
	// 4. Draw the calendar from schedule? (not sure exactly how we want to do this)
	// there's definitely more

	function test() {
	    var fundies1 = new Class("CS2500", "Fundies", 4, null, null, "a good one");
	    var fundies2 = new Class("CS2510", "Fundies 2", 4, null, null, "a bad one");
	    var transfer = {};
	    var sem1 = {fundies1, fundies2};
	    var sem2 = {fundies2};
	    var sched = {transfer, sem1, sem2};
	    var john = new Student(sched, 2);
	    store(john);
	    console.log(load());
	}

	//Stores the student in localStorage
	//stud (Student) the student to store
	function store(stud) {
	    localStorage.setItem("user", JSON.stringify(stud));
	}

	function load() {
	    var j = JSON.parse(localStorage.getItem("user"));
	    var sem = j.semester;

	    var classArray = parseSemesterArray(JSON.stringify(j.classes));
	    return new Student(classArray, sem);
	}

	//data looks like {"sem1":{"fundies1":{"id":"CS2500","name":"Fundies","credits":4,"corequisites":null,"prerequisites":null,"description":"a good one"}},"sem2":{"fundies2":{"id":"CS2510","name":"Fundies 2","credits":4,"corequisites":null,"prerequisites":null,"description":"a bad one"}}}
	function parseSemesterArray(sems) {
	    var ret = [];
	    var cur = sems;
	    while(1) {
		cur = cur.substring(cur.indexOf(":") + 1);
		console.log(cur);
		if (cur.indexOf("{}") == 0) {
			cur = cur.substring(2); 
			var mt = [];
			ret.push(mt);
		}
		else {
	       	 	sem = cur.substring(0, cur.indexOf("}}") + 2);
	       	 	ret.push(parseSemester(sem));
			cur = cur.substring(cur.indexOf("}}"));
		}
		
		if (cur.indexOf(",") == -1) {
		    break;
		}
	    }
	    return ret;
	}

	//data looks like {"fundies1":{"id":"CS2500","name":"Fundies","credits":4,"corequisites":null,"prerequisites":null,"description":"a good one"}, "fundies2":{"id":"CS2510","name":"Fundies 2","credits":4,"corequisites":null,"prerequisites":null,"description":"a bad one"}}
	function parseSemester(sem) {
	    var ret = [];
	    var cur = sem;
	    //console.log("Semester:  " + sem);
	    while(1) {
		cur = cur.substring(cur.indexOf(":") + 1);
		c = cur.substring(0, cur.indexOf("}") + 1);
		ret.push(parseClass(c));
		cur = cur.substring(cur.indexOf("}"));
		if (cur.indexOf(",") == -1) {
		    break;
		}
	    }
	    return ret;
	}

	//data looks like {"id":"CS2500","name":"Fundies","credits":4,"corequisites":null,"prerequisites":null,"description":"a good one"}
	function parseClass(c) {
	    //console.log("Class:  " + c);
	    var j = JSON.parse(c);
	    return new Class(j.id, j.name, j.credits, j.corequisites, j.prerequisites, j.description);
	}
	test();



