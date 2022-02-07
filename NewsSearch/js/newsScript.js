/* SELECTORES */
/* let news = document.getElementById("news"); */
let countries = document.getElementById("countries");
let search = document.getElementById("search");
let query = document.getElementById("query");
let articles = document.getElementById("articles");
let lang=document.getElementById("lang")
let langsearch=document.getElementById("langsearch")
let qsearch=document.getElementById("qsearch")
let contError=document.getElementById("contError")
let textError=document.getElementById("textError")

/*Getting a list of languages with their code using calendarific API*/
 const getLang=()=>{
  fetch("https://calendarific.com/api/v2/languages?api_key=c6c57e5fdda1aafd83ada5c4d57e0c0994714d5a")
  .then((response) => response.json())
  .then((responseJSON) => {
    //console.log(responseJSON);
    fillLangSelect(responseJSON)
  }); 
  } 

  /*Filling the language select I created before in the html with the information I got before 
  with calendarific API*/
 const fillLangSelect = (responseJSON) => {
    for (la of responseJSON.response.languages) {
      /*I make an if so only the options available appear in the select*/
      if(la.code=="ar"||la.code=="de"||la.code=="en"||la.code=="fr"||la.code=="hi"||la.code=="it"||la.code=="ja"||la.code=="no"||la.code=="pt"||la.code=="ru"||la.code=="sv"||la.code=="ta"||la.code=="uk"){
      let option = document.createElement("option");
      option.innerHTML = la.name;
      option.value = la.code;
    
      lang.append(option);
      }
      
    }
    }; 

/*Making the petition to travelbriefing API REST so I can get a country list*/
const getCountries = () => {
  fetch(
    "https://travelbriefing.org/countries.json"
  )
    .then((response) => response.json())
    .then((responseJSON) => {
      //console.log(responseJSON)
      fillSelect(responseJSON);
    });
};

/*Filling the select I created on the html with the list of countries I already got before*/
const fillSelect = (responseJSON) => {
  for (pais of responseJSON) {
    let option = document.createElement("option");
    option.innerHTML = pais.name;
    option.value = pais.name;

    countries.append(option);
  }
};

/*Getting the news of the country the user selected using Gnews api*/
const getNewsbyCountry = (value) => {
  fetch("https://gnews.io/api/v4/search?token=6177714dc38454a9e5c276c04e3aa103&q="+value +"&country=" +value +"&lang=es")
    .then((response) => response.json())
    .then((json) => {
     //console.log(json);
      mostrar(json);
    });
};



/*With this request I can get news with a key word (whichever word you want)included in the news
For example: you can search news related to cities, football...*/
const getNewsByQuery = (query) => {
  
  fetch("https://gnews.io/api/v4/search?q="+query +"&token=6177714dc38454a9e5c276c04e3aa103&lang=es")
    .then((response) => response.json())
    .then((json) => {
      //console.log(json);
      mostrar(json)
    });
 
};

const getNewsByLang=(query, lang)=>{
fetch("https://gnews.io/api/v4/search?q="+query +"&token=6177714dc38454a9e5c276c04e3aa103&lang="+lang)
.then((response) => response.json())
    .then((json) => {
      //console.log(json);
      mostrar(json)
    });
}

/*Function with which I show the articles in the HTML*/
 const mostrar = (json) => {
  //console.log(json.articles.length);
  articles.innerHTML=""
  query.value=""
  contError.style.display="none"
  
  /*I create a for of loop to get each article and I create DOM elements to show the parts of the articles I am interested in*/
  /*Sometimes there are no articles for some searchs, so I make an if asking for the length of the array*/
  if (json.articles.length != 0) {
    
    for (art of json.articles) {
      /*I get the image of the articles*/
      let generalCont=document.createElement("div")
      generalCont.className="generalCont"

      let contImg=document.createElement("div")
      let img = document.createElement("img");
      img.src = art.image;
      img.className="artImg"
      contImg.append(img)

      let contArt=document.createElement("div")
      contArt.className="contArt"
      /*title of the articles*/
      let title = document.createElement("h3");
      title.innerHTML = art.title;
      title.className="titleArt"

      /*a little description of the articles*/
      let description = document.createElement("p");
      description.innerHTML = art.description;
      description.className="descArt"

      /*source*/
      let source=document.createElement("p");
      source.innerHTML="Fuente: "+art.source.name;


      /*appending to the container of the articles*/
      contArt.append(title)
      contArt.append(description)
      contArt.append(source)

      generalCont.append(contImg)
      generalCont.append(contArt)

      articles.append(generalCont);
      
    }
  } else {
    
    /* alert("No hay artículos relacionados con el tema"); */
    contError.style.display="block"
    textError.innerHTML="No hay artículos relacionados con el tema que estás buscando"
    
  }
  

};

/*Each time the page loads,we fill the selects*/ 
document.addEventListener("DOMContentLoaded",()=>{
  getCountries()
  getLang()
  contError.style.display="none"
} );

/*When we click the button "countrysearch" we make a call to the api with the value of the select of the countries*/
countrysearch.addEventListener("click", ()=>{
  //console.log(countries.value)
  //console.log(lang.value)
  getNewsbyCountry(countries.value)
})

/*When we click the search button, we make a call to the api with the text input value I called query*/
search.addEventListener("click", ()=>{
  //console.log(countries.value)
  //console.log(lang.value)  
   if(query.validity.valueMissing){
    contError.style.display="block"
    textError.innerHTML="Tienes que introducir un tema para realizar la búsqueda"
  } else{
  getNewsByQuery(query.value)
}
})

/*When we click the button langsearch, we make a call to the api searching news by countries and language*/
langsearch.addEventListener("click", ()=>{
  getNewsByLang(countries.value, lang.value)
})

/*When we click the button qsearch, we make a call to the api searching news by the query we get with the input text value and language*/
qsearch.addEventListener("click", ()=>{
  getNewsByLang(query.value, lang.value)
})