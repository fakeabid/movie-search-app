const h1 = document.getElementById("h1");
const searchForm = document.querySelector("form");
const movieInput = document.getElementById("movie-input");
const outputBody = document.getElementById("output-body");
const outputHeader = document.querySelector(".output-header");
const outputGrid = document.querySelector(".output-grid");

h1.classList.remove("invisible");
setTimeout(() => {
    h1.classList.add("show");
}, 50)

searchForm.classList.remove("invisible");
setTimeout(() => {
    searchForm.classList.add("show");
}, 50)

// my api key for omdb api
const apiKey = "b6a3074c";

// page number for pagination
let currentPage = 1;
let currentSearch = "";
const prevPage = document.querySelector(".prev");
const nextPage = document.querySelector(".next");
const page = document.querySelector(".page");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.querySelector("body").classList.add("functional"); // making overflow visible in body
    console.log(movieInput.value);
    outputGrid.innerHTML = "";

    currentPage = 1;
    currentSearch = movieInput.value

    getMovies(currentSearch, currentPage);

    movieInput.value = "";
});

h1.addEventListener("click", () => {
    window.location.reload();
});


prevPage.addEventListener("click", () => {
    currentPage -= 1;

    outputGrid.innerHTML = "";
    getMovies(currentSearch, currentPage);
});

nextPage.addEventListener("click", () => {
    currentPage += 1;

    outputGrid.innerHTML = "";
    getMovies(currentSearch, currentPage);
});

async function getMovies(currentSearch, currentPage) {
    const url = `https://www.omdbapi.com/?&apikey=${apiKey}&s=${currentSearch}&page=${currentPage}`;
    // const url = `https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}`; ?i means choose by imdb

    try {
        outputBody.classList.remove("show");
        outputHeader.classList.remove("show");
        outputGrid.classList.remove("show");
        prevPage.classList.remove("show");
        nextPage.classList.remove("show");
        page.classList.remove("show");

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        setTimeout (() => {
            outputBody.classList.add("show");
            outputHeader.classList.add("show");
        }, 200);

        if (result.Response === 'False'){
            outputHeader.innerHTML = `<span class="invalid">No results for "${currentSearch}". Try a different keyword?</span>`;
            setTimeout(() => document.querySelector(".invalid").classList.add("show"), 50);
            return;
        }

        outputHeader.innerHTML = `<span class="valid">Showing results for "${currentSearch}":</span>`;

        outputGrid.classList.add("show");
        
        result.Search.forEach((movie) => {
            outputGrid.innerHTML += `
                <div class="output-grid-card">
                    <img src="${movie.Poster}" alt="poster of ${movie.Title}"/>
                    <h5>${movie.Title} (${movie.Year})</h5>
                </div>
            `;
        })

        setTimeout (() => {
            prevPage.classList.add("show");
            nextPage.classList.add("show");
            page.classList.add("show");
        }, 200);

        if (currentPage === 1) {
            prevPage.disabled = true;
        }
        else {
            prevPage.disabled = false;
        }

        if (currentPage === Math.ceil(result.totalResults / 10)) {
            nextPage.disabled = true;
        }
        else {
            nextPage.disabled = false;
        }

        page.innerHTML = `Page ${currentPage} of ${Math.ceil(result.totalResults / 10)}`;

    } catch (error) {
        console.error(error.message);
    }
}