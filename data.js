//Constructor for Student
//classes   (Class[][])  all the classes for the student by semester
//semester  (int)        current semester (0 is transfer credit, 1 is 1st semester, 2 is 2nd, etc)
//coops     (Integer[])  array of semester indeces indicating co-op periods
function Student(classes, semester, coops, free) {
	this.classes = classes;
	this.semester = semester;
	this.coops = coops;
	this.reqs = getCSRequirements();
	this.free = free;
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

//Constructor for Requirement
//name     (String)    requirement name (ex: "CS Overview Requirements")
//desc     (String)    class description (ex: "Take _ of the following courses")
//courses  (Class[])   courses that fall under this requirement
function Requirement(name, desc, courses) {
	this.name = name;
	this.desc = desc;
	this.courses = courses;
}

//Find the id number for the student's upcoming semester if it exists
//Returns an Integer
function getUpcomingSem() {
	for (var i = student.semester + 1; i < student.classes.length; i++) {
		if (student.classes[i].length > 0) {
			return i;
		}
	}
	return null;
}

//Makes a sample schedule for testing
//Returns a Class[][]
function getStartingSchedule() {
	return [
    [],
    [searchClass("CS/IS Overview 1"),
     searchClass("Fundamentals of Computer Science I"),
     searchClass("Lab for CS 2500"),
     searchClass("Discrete Structures"),
     searchClass("Recitation for CS 1800"),
     searchClass("First-Year Writing"),
     searchClass("Introduction to Jazz")],
    [searchClass("Fundamentals of Computer Science II"),
     searchClass("Lab for CS 2510"),
     searchClass("Games and Society"),
     searchClass("Recitation for GAME 1110"),
     searchClass("Logic and Computation"),
     searchClass("Lab for CS 2800"),
     searchClass("Technology and Human Values")], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
  ];
}

//Changes the semester a class is in. This will just add the class if it is called with a class that doesn't exist in the semesterFrom semester
//c            (Class)  the class
//semesterFrom (int)    the semester the class is in
//semesterTo   (int)	  the semester to move the class to
function moveClass(c, semesterFrom, semesterTo) {
	addClass(c, semesterTo);
	removeClass(c, semesterFrom);
}

//Adds a class to the schedule. Also stores the change in localStorage
//c         (Class)  The class to add
//semester  (int)    The semester to add it to
function addClass(c, semester) {
	var stud = load();
	//console.log(stud);
	var classArray = stud.classes;
	while (semester + 1 > classArray.length) {
		classArray[classArray.length] = [];
	}

	classArray[semester].push(c);
	var ret = new Student(classArray, stud.semester, stud.coops, stud.free);

	store(ret);
}

//Removes a class from the schedule. Also stores the change in localStorage
//c         (Class)  The class to remove
//semester  (int)    The semester to remove it from
function removeClass(c, semester) {
	var stud = load();
	var classArray = stud.classes;

	if (semester > classArray.length) {
		return;
	}

	var index = -1;

	for (var i = 0; i < classArray[semester].length; i++) {
		if (classArray[semester][i].name == c.name) {
			index = i;
		}
	}

	if (index > -1) {
		classArray[semester].splice(index, 1);
	}

	// console.log(classArray);
	var ret = new Student(classArray, stud.semester, stud.coops, stud.free);
	store(ret);
}



//Stores the student in localStorage
//stud (Student) the student to store
function store(stud) {
	localStorage.setItem("user", JSON.stringify(stud));
}

//Retrieves the student from localStorage
//Returns a Student
function load() {
	var stud = JSON.parse(localStorage.getItem("user"));
	if (stud === null) {
		var classes = getStartingSchedule();
		stud = new Student(classes, 2, [6, 7, 10, 11, 14, 15], false);
	}
	//console.log(stud);
	return stud;
}

//Get number of credits scheduled to be taken in a given semester
//sem (int) identifies which semester (0-19)
//Returns an Integer
function semCredits(sem) {
	var classes = student.classes[sem];
	return totalCredits(classes);
}

//Check if a class name is in the schedule
//name   (String)   name of class checked
//Returns a Boolean
function hasClass(name) {
	for (var i = 0; i < student.classes.length; i++) {
		for (var j = 0; j < student.classes[i].length; j++) {
			if (student.classes[i][j].name == name) {
				return true;
			}
		}
	}
	return false;
}

//Retrieve the fulfillment a class fall under
//c   (Class)   class to search fulfillment for
//Returns a String
function getFulfillment(c) {
	for (var i = 0; i < student.reqs.length; i++) {
		for (var j = 0; j < student.reqs[i].courses.length; j++) {
			if (student.reqs[i].courses[j].name == c.name) {
				return student.reqs[i].name;
			}
		}
	}
	return null;
}

//Draw's an expandable list item <li> element for a class with all
//   of that class's information
//c     (Class)    class to be drawn
//show  (Boolean)  should an "Add" button be drawn?
function drawFullClass(c, show) {
	var course = document.createElement('li'),
		title = document.createElement('div'),
		credits = document.createElement('span'),
		creds_title = document.createElement('h4'),
		creds = document.createElement('p'),
		desc_title = document.createElement('h4'),
		desc = document.createElement('p'),
		prereq_title = document.createElement('h4'),
		prereq = document.createElement('div'),
		coreq_title = document.createElement('h4'),
		coreq = document.createElement('div'),
		fulfill_title = document.createElement('h4'),
		fulfill = document.createElement('p'),
		add = document.createElement('button'),
		body = document.createElement('div');
	$(course).attr("id", c.name);
	$(title).attr("title", c.name);
	$(title).html($(title).attr("title"));
	$(credits).html("(" + c.credits + ")");
	$(credits).attr("title", c.credits + " credit hours");
	$(creds_title).html("Credit Hours");
	$(creds).html(c.credits + ".000");
	$(desc_title).html("Course Description");
	$(desc).html(c.description);
	$(prereq_title).html("Prerequisites");
	$(coreq_title).html("Co-requisites");
	$(fulfill_title).html("Requirements Fulfilled");
	for (var k = 0; k < c.prerequisites.length; k++) {
		var temp = document.createElement("p");
		$(temp).html(c.prerequisites[k]);
		$(prereq).append(temp);
	}
	if (c.prerequisites.length == 0) {
		$(prereq).html("<p>None</p>");
	}
	for (var k = 0; k < c.corequisites.length; k++) {
		var temp = document.createElement("p");
		$(temp).html(c.corequisites[k]);
		$(coreq).append(temp);
	}
	if (c.corequisites.length == 0) {
		$(coreq).html("<p>None</p>");
	}
	$(fulfill).html(getFulfillment(c));

	$(add).css("display", show ? "block" : "none");
	$(add).html("Add");
	$(add).attr("disabled", hasClass(c.name));
	$(add).attr("title", hasClass(c.name) ? "Already in schedule" : undefined);

	return $(course).append([title, credits, $(body).append(
    [creds_title, creds, desc_title, desc, prereq_title, prereq, coreq_title, coreq, fulfill_title, fulfill, add])]);
}

//Return the class corresponding to the given name
//name   (String)   name to be searched
//Returns a Class
function searchClass(name) {
	for (var i = 0; i < getCSRequirements().length; i++) {
		for (var j = 0; j < getCSRequirements()[i].courses.length; j++) {
			if (getCSRequirements()[i].courses[j].name == name) {
				return getCSRequirements()[i].courses[j];
			}
		}
	}
}

//Retrive total credits in a list of Classes
//array   (Class[])   list of classes to be counted
//Returns an Integer
function totalCredits(array) {
	var result = 0;
	for (var i = 0; i < array.length; i++) {
		result += array[i].credits;
	}
	return result;
}

//Generates the requirements for a CS student's audit
//Returns a Requirement[]
function getCSRequirements() {
	return [
		new Requirement("CS Overview Requirements", null,
				[new Class(null, "CS/IS Overview 1", 1, [], [],
					"Introduces students to the College of Computer and Information Science (CCIS) and begins their preparation for careers in the computing and information fields. Offers students an opportunity to learn how to thrive at Northeastern and within CCIS by developing academic, professional, and interpersonal skills. Covers the variety of careers available in the high-technology professions. Students work in groups to create and deliver presentations on careers in the field."),
               new Class(null, "CS/IS Overview 2: Co-op Preparation", 1, [], [],
					"Continues the preparation of students for careers in the computing and information fields by discussing co-op and co-op processes. Offers students an opportunity to prepare a professional résumé; practice proper interviewing techniques; explore current job opportunities; learn how to engage in the job and referral process; and to understand co-op policies, procedures, and expectations. Discusses professional behavior and ethical issues in the workplace."),
               new Class(null, "Discrete Structures", 4, ["Recitation for CS 1800"], [],
					"Introduces the mathematical structures and methods that form the foundation of computer science. Studies structures such as sets, tuples, sequences, lists, trees, and graphs. Discusses functions, relations, ordering, and equivalence relations. Examines inductive and recursive definitions of structures and functions. Discusses principles of proof such as truth tables, inductive proof, and basic logic. Also covers the counting techniques and arguments needed to estimate the size of sets, the growth of functions, and the space-time complexity of algorithms."),
               new Class(null, "Recitation for CS 1800", 1, ["Discrete Structures"], [],
					"Provides students with additional opportunities to ask questions and to see sample problems solved in detail."),
               new Class(null, "Fundamentals of Computer Science I", 4, ["Lab for CS2500"], [],
					"Introduces the fundamental ideas of computing and the principles of programming. Discusses a systematic approach to word problems, including analytic reading, synthesis, goal setting, planning, plan execution, and testing. Presents several models of computing, starting from nothing more than expression evaluation in the spirit of high school algebra. No prior programming experience is assumed; therefore, suitable for freshman students, majors and nonmajors alike who wish to explore the intellectual ideas in the discipline."),
               new Class(null, "Lab for CS 2500", 1, ["Fundamentals of Computer Science I"], [],
					"Accompanies CS 2500. Covers topics from the course through various experiments."),
               new Class(null, "Fundamentals of Computer Science II", 4, ["Lab for CS2510"], ["Fundamentals of Computer Science I"],
					"Continues CS 2500. Examines object-oriented programming and associated algorithms using more complex data structures as the focus. Discusses nested structures and nonlinear structures including hash tables, trees, and graphs. Emphasizes abstraction, encapsulation, inheritance, polymorphism, recursion, and object-oriented design patterns. Applies these ideas to sample applications that illustrate the breadth of computer science."),
               new Class(null, "Lab for CS 2510", 1, ["Fundamentals of Computer Science II"], [],
					"Accompanies CS 2510. Covers topics from the course through various experiments"),
               new Class(null, "Logic and Computation", 4, ["Lab for CS 2800"], ["Discrete Structures"],
					"Introduces formal logic and its connections to computer and information science. Offers an opportunity to learn to translate statements about the behavior of computer programs into logical claims and to gain the ability to prove such assertions both by hand and using automated tools. Considers approaches to proving termination, correctness, and safety for programs. Discusses notations used in logic, propositional and first order logic, logical inference, mathematical induction, and structural induction. Introduces the use of logic for modeling the range of artifacts and phenomena that arise in computer and information science."),
               new Class(null, "Lab for CS 2800", 1, ["Logic and Computation"], [],
					"Accompanies CS 2510. Covers topics from the course through various experiments."),
     ]
		),
		new Requirement("CS Requirements", null,
				[new Class(null, "Object-Oriented Design", 4, [], ["Fundamentals of Computer Science II"],
					"Presents a comparative approach to object-oriented programming and design. Discusses the concepts of object, class, meta-class, message, method, inheritance, and genericity. Reviews forms of polymorphism in object-oriented languages."),
                new Class(null, "Computer Systems", 4, [], ["Fundamentals of Computer Science II"],
					"Introduces the basic design of computing systems, computer operating systems, and assembly language using a RISC architecture. Describes caches and virtual memory. Covers the interface between assembly language and high-level languages, including call frames and pointers. Covers the use of system calls and systems programming to show the interaction with the operating system. Covers the basic structures of an operating system, including application interfaces, processes, threads, synchronization, interprocess communication, deadlock, memory management, file systems, and input/output control."),
                new Class(null, "Networks and Distributed Systems", 4, [], [],
					"Introduces the basic concepts underlying computer operating systems and computer networks and provides hands-on experience with their implementation. Covers the basic structure of an operating system: application interfaces, processes, threads, synchronization, interprocess communication, processor allocation, deadlocks, memory management, file systems, and input/output control."),
                new Class(null, "Theory of Computation", 4, [], ["Fundamentals of Computer Science II"],
					"Introduces the theory behind computers and computing aimed at answering the question, “What are the capabilities and limitations of computers?” Covers automata theory, computability, and complexity. The automata theory portion includes finite automata, regular expressions, nondeterminism, nonregular languages, context-free languages, pushdown automata, and noncontext-free languages."),
                new Class(null, "Programminng Languages", 4, [], ["Object-Oriented Design", "Theory of Computation"],
					"Introduces a systematic approach to understanding the behavior of programming languages. Covers interpreters; static and dynamic scope; environments; binding and assignment; functions and recursion; parameter-passing and method dispatch; objects, classes, inheritance, and polymorphism; type rules and type checking; and concurrency."),
                new Class(null, "Software Development", 4, [], ["Object-Oriented Design", "First-Year Writing"],
					"Considers software development as a systematic process involving specification, design, documentation, implementation, testing, and maintenance. Examines software process models; methods for software specification; modularity, abstraction, and software reuse; and issues of software quality. Students, possibly working in groups, design, document, implement, test, and modify software projects."),
                new Class(null, "Algorithms and Data", 4, [], ["Fundamentals of Computer Science II"],
					"Introduces the basic principles and techniques for the design, analysis, and implementation of efficient algorithms and data representations. Discusses asymptotic analysis and formal methods for establishing the correctness of algorithms. Considers divide-and-conquer algorithms, graph traversal algorithms, and optimization techniques."),
      ]
		),
		new Requirement("CS Senior Seminar", "Choose one of the following courses:",
				[new Class(null, "Senior Seminar", 1, [], ["Senior Standing"],
					"Requires students to give a twenty- to thirty-minute formal presentation on a topic of their choice in computer science. Prepares students for this talk by discussing methods of oral presentation, how to present technical material, how to choose what topics to present, overall organization of a talk, and use of presentation software and other visual aids."),
                 new Class(null, "The Eloquent Presenter", 1, [], [],
					"Designed to help students to enhance the effectiveness with which they present themselves in front of an audience. Uses the application of theatre training exercises and practical tools to offer students an opportunity to improve the quality of their spoken voice, the clarity with which they articulate their ideas, and their ability to command the attention of audiences in diverse interpersonal and professional interactions."),
      ]
		),
		new Requirement("English Requirements", null,
				[new Class(null, "First-Year Writing", 4, [], [],
					"Designed for students to study and practice writing in a workshop setting. Students read a range of texts in order to describe and evaluate the choices writers make and apply that knowledge to their own writing and explore how writing functions in a range of academic, professional, and public contexts. Offers students an opportunity to learn how to conduct research using primary and secondary sources; how to write for various purposes and audiences in multiple genres and media; and how to give and receive feedback, to revise their work, and to reflect on their growth as writers."),
                 new Class(null, "Advanced Writing in a Technical Field", 4, [], ["First-Year Writing", "Junior or Senior standing"],
					"Offers writing instruction for students in the College of Engineering and the College of Computer and Information Science. Students practice and reflect on writing in professional, public, and academic genres—such as technical reports, progress reports, proposals, instructions, presentations, and technical reviews—relevant to technical professions and individual student goals. In a workshop setting, offers students an opportunity to evaluate a wide variety of sources and develop expertise in audience analysis, critical research, peer review, and revision."),
      ]
		),
		new Requirement("Mathematics Requirements", null,
				[new Class(null, "Calculus 1 for Science and Engineering", 4, [], [],
					"Covers definition, calculation, and major uses of the derivative, as well as an introduction to integration. Topics include limits; the derivative as a limit; rules for differentiation; and formulas for the derivatives of algebraic, trigonometric, and exponential/logarithmic functions. Also discusses applications of derivatives to motion, density, optimization, linear approximations, and related rates. Topics on integration include the definition of the integral as a limit of sums, antidifferentiation, the fundamental theorem of calculus, and integration by substitution."),
                 new Class(null, "Calculus 2 for Science and Engineering", 4, [], ["Calculus 1 for Science and Engineering"],
					"Covers further techniques and applications of integration, infinite series, and introduction to vectors. Topics include integration by parts; numerical integration; improper integrals; separable differential equations; and areas, volumes, and work as integrals. Also discusses convergence of sequences and series of numbers, power series representations and approximations, 3D coordinates, parameterizations, vectors and dot products, tangent and normal vectors, velocity, and acceleration in space."),
                 new Class(null, "Linear Algebra", 4, [], ["Calculus 2 for Science and Engineering"],
					"Uses the Gauss-Jordan elimination algorithm to analyze and find bases for subspaces such as the image and kernel of a linear transformation. Covers the geometry of linear transformations: orthogonality, the Gram-Schmidt process, rotation matrices, and least squares fit. Examines diagonalization and similarity, and the spectral theorem and the singular value decomposition. Is primarily for math and science majors; applications are drawn from many technical fields."),
                 new Class(null, "Probability and Statistics", 4, [], ["Calculus 2 for Science and Engineering"],
					"Focuses on probability theory. Topics include sample space; conditional probability and independence; discrete and continuous probability distributions for one and for several random variables; expectation; variance; special distributions including binomial, Poisson, and normal distributions; law of large numbers; and central limit theorem. Also introduces basic statistical theory including estimation of parameters, confidence intervals, and hypothesis testing."),
        ]
		),
		new Requirement("Computing and Social Issues", null,
				[new Class(null, "Technology and Human Values", 4, [], [],
					"Studies philosophy of technology, as well as ethics and modern technology. Considers the relationship between technology and humanity, the social dimensions of technology, and ethical issues raised by emerging technologies. Discusses emerging technologies such as biotechnology, information technology, nanotechnology, and virtual reality."),
        ]
		),
		new Requirement("CS Electives", "Take a total of _ courses",
				[new Class(null, "Programming in C++", 4, [], ["Fundamentals of Computer Science II"],
					"Introduces the basic principles and techniques for the design, analysis, and implementation of efficient algorithms and data representations. Discusses asymptotic analysis and formal methods for establishing the correctness of algorithms. Considers divide-and-conquer algorithms, graph traversal algorithms, and optimization techniques."),
                 new Class(null, "Web Development", 4, [], ["Object-Oriented Design"],
					"Discusses Web development for sites that are dynamic, data driven, and interactive. Focuses on the software development issues of integrating multiple languages, assorted data technologies, and Web interaction. Considers ASP.NET, C#, HTTP, HTML, CSS, XML, XSLT, JavaScript, AJAX, RSS/Atom, SQL, and Web services. Requires each student to deploy individually designed Web experiments that illustrate the Web technologies and at least one major integrative Web site project."),
        ]
		),
		new Requirement("General Electives", "Complete a total of _ courses:",
				[new Class(null, "Games and Society", 4, ["Recitation for GAME 1110"], [],
					"Provides an historical and cultural perspective on games and other forms of interactive entertainment. Examines the present state and future directions of paper, card, and board games; physical games and sports; and video games. Introduces students to current issues, experiments, and directions in the field of game design. Through weekly lectures and small-group labs, students have an opportunity to develop a critical basis for analyzing game play."),
                 new Class(null, "Recitation for GAME 1110", 1, [], ["Games and Society"],
					"Provides small-group discussion format to cover material in GAME 1110."),
                 new Class(null, "Interactive Media and Society", 4, [], [],
					"Offers a critical historical survey of interactive media from analog to digital techniques and from physical to virtual spaces. Examines the social, ethical, and cultural impact of interactive media. Concludes with a study of current issues and directions in interactive media. Through weekly lectures, research projects, and critical analyses, offers students an opportunity to consider current and historical aspects of interactive media and design."),
                 new Class(null, "Europe: Empires, Revolutions, Wars, and Their Aftermath", 4, [], [],
					"Examines major themes in the history of Europe from 1500 to the present, emphasizing the conceptual tools historians use to think about European history, and drawing on historical documents, literature, and film. Examines the emergence of states and nations as theoretical constructs and political realities; men’s and women’s experience of social conflict-rebellions, revolutions, and wars-and the complex relationships between Europeans and non-Europeans. Attention is given to how race, class, and gender shaped the way people made and understood their history."),
                 new Class(null, "Introduction to Jazz", 4, [], ["Object-Oriented Design", "Theory of Computation"],
					"Examines the evolution of the creative improvisational musical styles commonly called jazz, from its African-American roots to its status as one of America’s classical musics and an internationally valued art form. Explores the contributions of African and European musical traditions and African-American spirituals, work songs, and blues. Examines major contributors and stylistic development and change through selected audio and audio-visual presentations. Also considers the sociocultural dynamics that have affected musical evolution and acceptance."),
        ]
		),
  ];
}
