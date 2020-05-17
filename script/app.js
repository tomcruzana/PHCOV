//DOM elements
const tableRow = document.querySelector("tbody");
const countryName = document.querySelector(".country-name");
const cases = document.querySelector(".total-cases");
const deaths = document.querySelector(".total-deaths");
const recovered = document.querySelector(".total-recovered");
const lastUpdate = document.querySelector(".last-update");
const refresh = document.querySelector(".referesh-btn");
const countryImage = document.querySelector(".card-img-top");
const dropDown = document.querySelector(".dropdown-menu");

//statistical variables
const chartAxes = {
     xDays : [],
     yDataConfirmed : [],
     yDataRecovered : [],
     yDataDeaths : []
}

//JSON object country codes
const PH = 132;
const USA = 177;

const getCountryCases = async () => {
    await fetch("https://api.covid19api.com/dayone/country/philippines")
        .then(response => response.json()) //get and convert the json data
        .then(data => getStatistics(data)) 
        .catch(err => console.log(err))  
};

const getStatistics = (data) => {
    for(let i = 0; i < data.length; i++){
        
        tableRow.innerHTML += `
        <tr>
            <th scope="row">Day ${i + 1}</th>
            <td class="text-warning">${data[i].Confirmed}</td>
            <td class="text-danger">${data[i].Deaths}</td>
            <td class="text-success">${data[i].Recovered}</td>
        </tr>`;

        chartAxes.yDataConfirmed[i] = data[i].Confirmed;
        chartAxes.yDataDeaths[i] = data[i].Deaths;
        chartAxes.yDataRecovered[i] = data[i].Recovered;
        chartAxes.xDays[i] = `Day ${i + 1}`;
    }
};

const getSummaryOfCases = async (country) => { //fetches summary of cases
    await fetch('https://api.covid19api.com/summary')
        .then(response => response.json())
        .then(data => { 
                countryName.innerHTML = `<b>Bansa:</b> Pilipinas`;
                cases.innerHTML = `<b>Kabuuang Kaso:</b> ${data.Countries[country].TotalConfirmed}`;
                deaths.innerHTML = `<b>Kabuuang Namamatay:</b> ${data.Countries[country].TotalDeaths}`;
                recovered.innerHTML = `<b>Kabuuang Nakarekober:</b> ${data.Countries[country].TotalRecovered}`;
                lastUpdate.innerHTML = `<b>Huling pag-update:</b> ${data.Countries[country].Date}`;
                console.log(data);
        })
        .catch(err => console.log(err))
};

const getImage = async (url) => { //get image
    await fetch(url)
        .then(response => countryImage.src = URL.createObjectURL(response.blob()))
        .catch(err => console.log(err))
}; 

//Event Listeners
window.addEventListener('load', (e) => { //load initial data
    getSummaryOfCases(PH);
    drawChart();
});

refresh.addEventListener('click', (e) => { //refresh data
    getSummaryOfCases(PH);
});

dropDown.addEventListener("click", (e) => { //show available countries
    if (e.target.tagName === "BUTTON" && e.target.textContent === "PH") {
        getImage("https://i.ibb.co/8KvrNhV/ph.png");
        getSummaryOfCases(PH);
    }

    else if (e.target.tagName === "BUTTON" && e.target.textContent === "USA") {
        getImage("https://i.ibb.co/hZFzCtp/usa.png");
        getSummaryOfCases(USA);
    }
});

//Chart JS
const drawChart = async () => {
    await getCountryCases();
    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartAxes.xDays, //number of days are manifested here.! THis shit wont work. study the documentation
            datasets: [{
                label: 'Mga kumpirmadaong Kaso',
                data: chartAxes.yDataConfirmed, //confirmed cases
                backgroundColor: 'rgba(253, 126, 20, 1)',
                borderColor: 'rgba(253, 126, 20, 1)',
                borderWidth: 0,
                fill: false
            }, {
                label: 'Mga kumpirmadong Namatay',
                data: chartAxes.yDataDeaths,
                backgroundColor: 'rgba(220, 53, 69, 1)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 0,
                fill: false
            }, {
                label: 'Mga kumpirmadong Nakarekober',
                data: chartAxes.yDataRecovered,
                backgroundColor: 'rgba(40, 167, 69, 1)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 0,
                fill: false
            }]
        },
    });
};
