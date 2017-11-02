//Constructor for Student
//classes   (HashMap<Int,Class[]>)  all the classes for the student by semester
//semsester (int)                   current semester (0 is transfer credit, 1 is 1st semester, 2 is 2nd, etc)
function Schedule(classes, semester) {
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
