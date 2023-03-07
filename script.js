const containerMovies = document.querySelector('.movies')
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
let paginacaoAtual = 1;
let ListaDeFilmes = [];
let teste = []
const paginacao = document.querySelector('.container span')
let verificacaoDePesquisa = false


async function filmesDaSemana(page) {
    const idMovies = []

    if (ListaDeFilmes.length === 0) {
        const response = await api.get('/discover/movie?language=pt-BR&include_adult=false');
        const TodosOsFilmesImportados = response.data.results;

        ListaDeFilmes.push(TodosOsFilmesImportados.slice(0, 6));
        ListaDeFilmes.push(TodosOsFilmesImportados.slice(6, 12));
        ListaDeFilmes.push(TodosOsFilmesImportados.slice(12, 18));
    }
    paginacaoAtual = page;

    const pgCom6Filmes = ListaDeFilmes[paginacaoAtual - 1];


    containerMovies.innerHTML = '';

    pgCom6Filmes.forEach(function (movie) {
        idMovies.push(movie.id);

        const divMovie = document.createElement('div')
        divMovie.classList.add('movie')
        containerMovies.appendChild(divMovie)

        const divMovieInfo = document.createElement('div')
        divMovieInfo.classList.add('movie__info')

        const title = document.createElement('span')
        title.classList.add('movie__title')
        const vote_average = document.createElement('span')
        vote_average.classList.add('movie__rating')

        divMovie.appendChild(divMovieInfo)
        divMovie.style.backgroundImage = `url(${movie.poster_path})`;
        divMovie.style.backgroundSize = 'cover'

        title.textContent = movie.original_title
        vote_average.textContent = movie.vote_average

        divMovieInfo.appendChild(title)
        divMovieInfo.appendChild(vote_average)

        divMovie.addEventListener('click', () => {
            abrirModal(movie.id)
        })
    });

    paginacao.style.fontSize = '22px'
    paginacao.textContent = `Página: ${paginacaoAtual} de ${ListaDeFilmes.length}`
}

filmesDaSemana(paginacaoAtual);

btnPrev.addEventListener('click', () => {
    if (paginacaoAtual > 1) {
        if (!verificacaoDePesquisa) {
            filmesDaSemana(paginacaoAtual - 1);
        } else {
            pesquisarFilme(paginacaoAtual - 1);

        }
    }
})
btnNext.addEventListener('click', () => {

    if (paginacaoAtual < 3) {
        if (!verificacaoDePesquisa) {
            filmesDaSemana(paginacaoAtual + 1);
        } else {
            pesquisarFilme(paginacaoAtual + 1);

        }
    }
})

const input = document.querySelector('.input');

input.addEventListener('keydown', (event) => {
    const h1Search = document.querySelector('.container h1')

    if (event.key === 'Enter') {
        h1Search.textContent = `Você pesquisou por "${input.value}"`
        event.preventDefault();
        paginacaoAtual = 1;
        teste = []
        pesquisarFilme(paginacaoAtual);
        input.value = ''
        verificacaoDePesquisa = true
    }
});

async function pesquisarFilme(page) {
    const idMovies = []
    const pesquisado = input.value.trim();

    const response = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${pesquisado}`);

    const TodosOsFilmesImportados = response.data.results;

    teste.push(TodosOsFilmesImportados.slice(0, 6));
    teste.push(TodosOsFilmesImportados.slice(6, 12));
    teste.push(TodosOsFilmesImportados.slice(12, 18));


    paginacaoAtual = page;

    let pgCom6Filmes = teste[paginacaoAtual - 1];


    containerMovies.innerHTML = '';

    pgCom6Filmes.forEach(function (movie) {
        idMovies.push(movie.id);

        const divMovie = document.createElement('div')
        divMovie.classList.add('movie')
        containerMovies.appendChild(divMovie)

        const divMovieInfo = document.createElement('div')
        divMovieInfo.classList.add('movie__info')

        const title = document.createElement('span')
        title.classList.add('movie__title')
        const vote_average = document.createElement('span')
        vote_average.classList.add('movie__rating')

        divMovie.appendChild(divMovieInfo)
        divMovie.style.backgroundImage = `url(${movie.poster_path})`;
        divMovie.style.backgroundSize = 'cover'

        title.textContent = movie.original_title
        vote_average.textContent = movie.vote_average

        divMovieInfo.appendChild(title)
        divMovieInfo.appendChild(vote_average)

        divMovie.addEventListener('click', () => {

            abrirModal(movie.id)
        })
    });

    paginacao.textContent = `Página: ${paginacaoAtual} de ${ListaDeFilmes.length}`
}


async function abrirModal(id) {
    const hidden = document.querySelector('.hidden');

    const response = await api.get(`/movie/${id}?language=pt-BR`);
    const dataModal = response.data;

    const title = document.querySelector('.modal__title')
    const vote_average = document.querySelector('.modal__average')
    const overview = document.querySelector('.modal__description')
    const modalImg = document.querySelector('.modal__img')
    const modalGenres = document.querySelector('.modal__genres')
    let genres

    genres = dataModal.genres

    modalGenres.innerHTML = ''

    genres.forEach(function (genre) {
        const spanGenre = document.createElement('span')
        spanGenre.classList.add('modal__genre')
        spanGenre.textContent = genre.name
        modalGenres.appendChild(spanGenre)
    })

    title.textContent = dataModal.original_title
    vote_average.textContent = dataModal.vote_average
    overview.textContent = dataModal.overview
    modalImg.src = dataModal.backdrop_path

    hidden.style.display = 'flex'

    const btnClose = document.querySelector('.modal__close')
    const modal = document.querySelector('.modal')

    btnClose.addEventListener('click', () => {
        hidden.style.display = 'none'
    })

    modal.addEventListener('click', function (event) {
        if (event.target.matches('.modal')) {
            hidden.style.display = 'none';
        }
    });
}


async function mostrarInfoFilmeDoDia() {
    const response = await api.get('/movie/436969?language=pt-BR');
    const responseVideo = await api.get('/movie/436969/videos?language=pt-BR');

    const filmeDoDia = response.data;
    const videoDoDia = responseVideo.data.results;

    const backdrop_path = document.querySelector('.highlight__video');
    backdrop_path.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${filmeDoDia.backdrop_path})`;
    backdrop_path.style.backgroundSize = 'cover';


    const title = document.querySelector('.highlight__title')
    const vote_average = document.querySelector('.highlight__rating')
    const release_date = document.querySelector('.highlight__launch')
    const overview = document.querySelector('.highlight__description')
    const linkVideo = document.querySelector('.highlight__video-link')

    title.textContent = filmeDoDia.original_title
    vote_average.textContent = filmeDoDia.vote_average
    release_date.textContent = filmeDoDia.release_date
    overview.textContent = filmeDoDia.overview
    linkVideo.href = `https://www.youtube.com/watch?v=${videoDoDia[1].key}`

    const genres = document.querySelector('.highlight__genres')
    const genresAr = filmeDoDia.genres
    const genresStr = JSON.stringify(genresAr)
    const genresPar = JSON.parse(genresStr)
    let genresResult = ''

    for (let i = 0; i <= genresPar.length - 1; i++) {
        if (i === genresPar.length - 1) {
            genresResult = genresResult + genresPar[i].name

        } else {
            genresResult = genresResult + genresPar[i].name + ', '
        }
    }
    genres.textContent = genresResult
}

mostrarInfoFilmeDoDia();


const luaBtn = document.querySelector('.btn-theme')
const logo = document.querySelector('#logo')
const body = document.querySelector('body')
const header = document.querySelector('header')
const moviesContainer = document.querySelector('.movies-container')
const highlight = document.querySelector('.highlight')
const h1 = document.querySelectorAll('h1')
const p = document.querySelectorAll('p')
const span = document.querySelectorAll('span')
const header__title = document.querySelector('.header__title')
const lupaPesquisar = document.querySelector('#lupa-pesquisar')
const aMenuNav = document.querySelectorAll('.header__container-left nav ul li a')

let darkModeOn;


luaBtn.addEventListener('click', () => {
    if (darkModeOn === true) {
        darkModeOn = false
        localStorage.setItem('darkMode', 'false');


        h1.forEach(element => {
            element.style.color = 'black'
        });
        p.forEach(element => {
            element.style.color = 'black'
        });
        span.forEach(element => {
            element.style.color = 'black'
        });
        aMenuNav.forEach(element => {
            element.style.color = 'black'
        });
        header__title.style.color = '#fe0178'
        body.style.backgroundColor = 'white'
        header.style.backgroundColor = 'white'
        moviesContainer.style.backgroundColor = 'var(--bg-secondary)'
        highlight.style.backgroundColor = 'var(--bg-secondary)'
        logo.src = "./assets/logo-dark.png"
        luaBtn.src = "./assets/light-mode.svg"
        btnNext.src = "./assets/arrow-right-dark.svg"
        btnPrev.src = "./assets/arrow-left-dark.svg"

        lupaPesquisar.src = "./assets/lupa-preta.png"
        input.style.color = 'black'
        input.style.borderColor = 'black'

    } else {
        darkModeOn = true
        localStorage.setItem('darkMode', 'true');


        h1.forEach(element => {
            element.style.color = 'white'
        });
        p.forEach(element => {
            element.style.color = 'white'
            if (element.classList.contains('modal__description')) {
                element.style.color = 'black'
            }
        });
        span.forEach(element => {
            element.style.color = 'white'
        });
        aMenuNav.forEach(element => {
            element.style.color = 'white'
        });
        body.style.backgroundColor = '#1B2028'
        header.style.backgroundColor = '#1B2028'
        moviesContainer.style.backgroundColor = '#2D3440'
        highlight.style.backgroundColor = '#2D3440'
        logo.src = "./assets/logo-dark.png"
        luaBtn.src = "./assets/dark-mode.svg"
        btnNext.src = "./assets/arrow-right-light.svg"
        btnPrev.src = "./assets/arrow-left-light.svg"

        input.style.color = 'white'
        input.style.borderColor = 'white'
        lupaPesquisar.src = "./assets/lupa-branca.png"
    }

})

function verificarTemaAtual() {
    let temaAtual = localStorage.getItem('darkMode');

    if (temaAtual === 'true') {
        luaBtn.click();

    } else {

    }
}
verificarTemaAtual()


input.addEventListener('focus', () => {
    input.style.borderColor = '#fe0178';
})
input.addEventListener('blur', () => {
    input.style.borderColor = 'var(--input-color)';
})

lupaPesquisar.addEventListener('click', () => {
    if (input.classList.contains('show')) {
        input.classList.add('hide')
        input.classList.remove('show')

    } else {
        input.classList.add('show')
        input.classList.remove('hide')
        input.style.opacity = 0;
    }

    setTimeout(() => {
        input.style.opacity = 1;
    }, 50);

})

const tituloOriginal = document.title;

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        document.title = "CubosFlix - Volte logo! :(";
    } else {
        document.title = tituloOriginal;
    }
});



