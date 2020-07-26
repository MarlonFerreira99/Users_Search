let globalUsers = [];
let globalUsersFiltered = [];

let countUsers = null;
let divUsersList = null;

let countMale = null;
let countFemale = null;
let sumAge = null;
let averageAge = null;

async function start() {

  // "Normal"
  // await fetchUsers();

  // "Promise sequencial com timeout"
  await promiseUsers();
  
  hideSpinner();

  configFilter();
 
}

function promiseUsers() {
  return new Promise(async (resolve, reject) => {
    const users = await fetchUsers();

    setTimeout(() => {
      resolve(users)
    }, 1200);
  });
}

async function fetchUsers() {
  const resource = await fetch ('http://localhost:3000/users');
  const json = await resource.json();

  globalUsers = json.map(({name, picture, dob, gender}) => {
    return {
      userName: name.first + ' ' + name.last,
      userPicture: picture.large,
      userAge: dob.age,
      userGender: gender
    }
  }); 
}

function hideSpinner() {
  const spinner = document.querySelector('#spinner');
  spinner.classList.add('hide');
}

function renderUsers() {
  divUsersList = document.querySelector('#usersList');

  divUsersList.innerHTML = `
    <div class="users"> 
      ${globalUsersFiltered.map(({userName, userPicture, userAge}) => {
        return `
          <div class="card-user">
            <div>
              <img class="avatar" src="${userPicture}" alt="${userName}">
            </div>
            <div>
              <span> ${userName}, ${userAge} anos</span>
            </div>
          </div>
        
        `; 
      }). join('')}
    </div> 

  `;
  
  countUsers = document.querySelector('#countUsers');
  countUsers.textContent = globalUsersFiltered.length;
  
  globalUsers.sort((a, b) => a.userName.localeCompare(b.userName));
  globalUsersFiltered = [...globalUsersFiltered];

}

function configFilter() {
  const inputFilter = document.querySelector('#inputFilter');
  const buttonFilter = document.querySelector('#buttonFilter');

  inputFilter.addEventListener('keyup', handleFilterKeyUp);
  buttonFilter.addEventListener('click', handleButtonClick);
}

function handleButtonClick () {
  const inputFilter = document.querySelector('#inputFilter');
  const filterValue = inputFilter.value.toLowerCase().trim();

  globalUsersFiltered = globalUsers.filter((item) => {
    return item.userName.toLowerCase().includes(filterValue);
  });

  if (inputFilter.value === "") {
    clearInput();
  }

  renderUsers();
  renderStatistics();
}

function handleFilterKeyUp({key}) {
  const inputFilter = document.querySelector('#inputFilter');

  if (inputFilter.value === "") {
    clearInput();
  }

  if (key !== 'Enter') {
    return;
  }
  handleButtonClick();
}

function clearInput() {
  divUsersList.innerHTML = "";
  countUsers.textContent = 0;
  countMale.textContent = 0;
  countFemale.textContent = 0;
  sumAge.textContent = 0;
  averageAge.textContent = 0;
}

function renderStatistics() {
  statisticsMale();
  statistcsFemale();
  statisticsSumAges();
  statisticsAverageAges();
}

// tentar implementar um "if" na "user =>"
function statisticsMale() {
  countMale = document.querySelector('#countMale');

  const usersMale = globalUsersFiltered.filter(user => {
    return user.userGender === 'male';
  });
  countMale.textContent = usersMale.length;

  console.log(usersMale);
}

function statistcsFemale() {
  countFemale = document.querySelector('#countFemale');

  const usersFemale = globalUsersFiltered.filter(user => {
    return user.userGender === 'female';
  });
  countFemale.textContent = usersFemale.length;
}

function statisticsSumAges() {
  sumAge = document.querySelector('#sumAge');

  const sum = globalUsersFiltered.reduce((acc, curr) => {
    return acc + curr.userAge;
  },0);
  sumAge.textContent = sum;
}

function statisticsAverageAges() {
  averageAge = document.querySelector('#averageAge');

  const average = globalUsersFiltered.reduce((acc, curr) => {
    return acc + curr.userAge;
  }, 0);
  averageAge.textContent = parseFloat((average / globalUsersFiltered.length).toFixed(2));
}


start();