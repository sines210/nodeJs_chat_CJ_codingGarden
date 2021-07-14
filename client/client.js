var form = document.querySelector('form');
var loadingElement = document.querySelector('.loading');
var mewsElement = document.querySelector('.mews');
var API_URL = (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') ? 'http://localhost:5000/mews' : 'https://meower-api.now.sh/mews';
// var API_URL = 'http://localhost:5000/mews' ;



function dateFunction(param) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var fullDate = `Le ${day}/${month}/${year} à ${hours}:${minutes}`
    return fullDate;
}


loadingElement.style.display='none';


function listAllMews() {
    mewsElement.innerHTML="";
    fetch(API_URL) 
    .then(response=>response.json())
    .then(mews=>{
        mews.reverse();
        mews.forEach(mew => {

            var div = document.createElement('div');

            var header = document.createElement('h3');
            header.textContent = mew.name;

            var contents = document.createElement('p');
            contents.textContent = mew.content;

            var date = document.createElement('small');
            date.textContent = dateFunction(mew.created);

            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date);

            mewsElement.appendChild(div);

            mewsElement.insertAdjacentHTML('beforeend', `<button class="button-primary btn-delete" type="button">Delete mew </button>` )


      
            
        });
    })
}


form.addEventListener('submit', (event)=>{
    event.preventDefault();

    var formData = new FormData(form);
    var name  = formData.get('name');
    var content  = formData.get('content');

    var mew = {
        name,
        content
    }; 


    form.style.display='none';
    loadingElement.style.display='';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew), //take the object mew and turn it to json
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(createdMew => {
        form.reset();  
        form.style.display="";
        listAllMews();
        loadingElement.style.display="none";
    })
 

})

// function deleteMews() {

// }

