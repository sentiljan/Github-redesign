const APIURL = "https://api.github.com/users/";
const main = document.getElementById("main");
const search = document.getElementById("search");
const form =  document.getElementById("form");

getUser("sentiljan");

async function getUser(username){
    const resp = await fetch(APIURL + username);
    const respData = await resp.json();

    showUser(respData);
    getRepos(username);
    changeColor();
    console.log(respData);
}

function showUser(user){
const mainBody = `
    <div class="col-1">
        <img src="${user.avatar_url}" /> 
        <h4>${user.name}</h4>
        <p class="bio">- ${user.bio}</p>
        <a target="_blank" href="https://github.com/${user.login}"><button class="followBtn">Follow</button></a>
        <p class="company">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            ${user.company}
        </p>
        <a target="_blank" class="web" href="${user.blog}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${user.blog}
        </a>
    </div>
    <div class="col-2">
        <div class="overview">
            <ul>
                <li id="defaultOpen" class="tabTitle" onclick="changeTab(event, 'overview')">
                    Overview
                </li>
                <li class="tabTitle" onclick="changeTab(event, 'repositories')">
                    Repositories <span>${user.public_repos}</span>
                </li>
                <li class="tabTitle" onclick="changeTab(event, 'followers')">
                    Followers <span>${user.followers}</span>
                </li>
                <li class="tabTitle" onclick="changeTab(event, 'following')">
                Following <span>${user.following}</span>
            </li>
            </ul>
        </div>
        <div id="overview" class="tabContent">
            <div class="repos">
            <p>Pined<p>
            <div id="repos"> 
            </div>
            </div>
            <div class="activity">
            <p>Activity<p>
            <object id="contri" class="contribution" type="image/svg+xml" data="https://ghchart.rshah.org/17245B/${user.login}">
            </object>
            <object class="contribution" type="image/svg+xml" data="./githubchart-api-master/public/${user.login}">
            </div>
        </div>
        <div id="repositories" class="tabContent">
        
        </div>
        <div id="followers" class="tabContent">
        
        </div>
        <div id="following" class="tabContent">
        
        </div>
    </div>
    `;

    main.innerHTML = mainBody;

    document.getElementById("defaultOpen").click();
}

async function getRepos(username){
    const resp = await fetch(APIURL + username + "/repos");
    const respData = await resp.json();

    addReposToCard(respData);
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .forEach((repo) => {
            const repoEl = document.createElement("a");
            repoEl.classList.add("repo");

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });
}

function changeTab(evt, tabName) {
    var tabContent = document.getElementsByClassName("tabContent");
    var tabTitle = document.getElementsByClassName("tabTitle");
    var i;

    for ( i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    };

    for (i = 0; i < tabTitle.length; i++) {
        tabTitle[i].className = tabTitle[i].className.replace(" active", "");
    }


    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";


}    



function changeColor() {
    
    var svgEl = document.querySelector("#contri");
    
      
    svgEl.addEventListener("load", (e) => {
        e.preventDefault();
        var as = document.querySelectorAll("rect");
        as.forEach((e) => {
            e.style.fill= "#000"
        });
        console.log(as.length);

    });
    console.log(svgEl);

    return svgEl;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);

        search.value = "";
    }
});

getUser();
