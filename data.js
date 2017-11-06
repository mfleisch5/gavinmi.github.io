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
	var sem1 = {fundies1}; 
	var sched = {sem1};
	var john = new Student(sched, 2); 
	localStorage.setItem("user", JSON.stringify(john)); 
	console.log("test: " + localStorage.getItem("user")); 
}

//Stores the student in localStorage
//stud (Student) the student to store
function store(stud) { 
	localStorage.setItem("user", JSON.stringify(stud)); 
}

function load() {
	
}



