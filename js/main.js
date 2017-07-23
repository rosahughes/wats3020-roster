/* JS for WATS 3020 Roster Project */

// A base class called `Person` that takes the parameters `name`
// and `email` and makes those available as attributes. The `constructor()`
// method breaks the username from before the `@` symbol in the
// `email` value and uses that to store on a `this.username` property.
class Person{
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.username = email.split('@')[0];
  }
}

// Another class that extends the `Person` class, called `Student`.
// The `Student` class adds a line to the `constructor()` method that sets
// the property `this.attendance` to an empty Array (`[ ]`). The `attendance`
// property is used to record and track attendance.
class Student extends Person {
  constructor(name, email){
    super(name, email);
    this.attendance = [];
  }
}

// Another method on the `Student` class called `calculateAttendance`,
// that gives a percentage of how many days the student was present and 
// returns a string like `90%`. Attendance is recorded into an Array using 
// either a `0` for "absent" or a `1` for "present", allowing attendance percentage 
// to be calculated as the average of all the items in the `attendance` Array.
calculateAttendance(){
    if (this.attendance.length > 0) {
      let counter = 0;
      for (let mark of this.attendance){
        counter = counter + mark;
    }
      let attendancePercentage = counter / this.attendance.length * 100;
      return `${attendancePercentage}%`;
  } else {
    return "0%";
  }
}

// Another class that extends the `Person` class called `Teacher`.
// `Teacher` class adds a property called `this.honorific` (supplied
// when an instance of `Teacher` is created).
class Teacher extends Person {
  constructor (name, email, honorific){
    super (name, email);
    this.honorific = honorific;
  }
}

// The `Course` class to run the whole roster.
class Course {
    constructor(courseCode, courseTitle, courseDescription){
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

    // A method called `addStudent()` that prompts the user for information required 
    // to create a new `Student` object (`name`, `email`) and does so, then adds the 
    // student to the `this.students` Array. Updates the roster display. 
addStudent(){
  let name = prompt('Add student full name');
  let email = prompt('Add student email address');
  let newStudent = new Student(name, email);
  this.students.push(newStudent);
  updateRoster(this);
}

    // A method called `setTeacher()` that prompts the user for the information required 
    // to create a `Teacher` object (`name`, `email`, and `honorific`) and does so, then 
    // sets the `this.teacher` property equal to the new `Teacher` object. Udpate roster again.
setTeacher(){
  let name = prompt('Add teacher full name');
  let email = prompt('Add teacher email address');
  let honorific = prompt('Add teacher formal title (e.g. Prof., Dr., Mr., Ms.)');
  this.teacher = new Teacher(name, email, honorific);
  updateRoster(this);
}

    // A method to mark a student's attendance called `markAttendance()`.
    // This method should accept a parameter called `username` containing the
    // `username` that will match the `username` property on the `Student` object.
    // Default behavior is student present `(1)`, alternate is absent `(0)`.
  
markAttendance(username, status='present'){
  let student = this.findStudent(username);
  if  (status === 'present'){
    student.attendance.push(1);
  } else {
    student.attendance.push(0);
  } 
  updateRoster(this);
}
  
    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username){
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function(student, index){
            return student.username == username;
        });
        return foundStudent;
    }
}

/////////////////////////////////////////
// Prompt user for information to create the Course. 
//
// Prompt the user for the `courseCode` (the number/code of the course, like "WATS 3000").
let courseCode = prompt('Enter the course code (e.g. WATS 3020):');
// Prompt the user for the `courseTitle` (the name of the course, like "Introduction to JavaScript").
let courseTitle = prompt('Enter the course name (e.g. "Introduction to JavaScript):');
// Prompt the user for the  `courseDescription` (the descriptive summary of the course).
let courseDescription = prompt('Enter the course description:');
// Create a new `Course` object instance called `myCourse` using the three data points just collected from the user.
let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher){
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e){
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e){
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course){
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher){
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students){
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons(){
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}

