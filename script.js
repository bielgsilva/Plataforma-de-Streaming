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

    paginacao.style.fontSize = '15px'
    paginacao.textContent = `Página: ${paginacaoAtual} de ${ListaDeFilmes.length}`
}

filmesDaSemana(paginacaoAtual);

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

async function abrirModal(id) {
    const hidden = document.querySelector('.hidden');

    const response = await api.get(`/movie/${id}?language=pt-BR`);
    const dataModal = response.data;

    const title = document.querySelector('.modal__title')
    const vote_average = document.querySelector('.modal__average')
    const overview = document.querySelector('.modal__description')
    const modalImg = document.querySelector('.modal__img')
    const modalGenres = document.querySelector('.modal__genres')
    const header = document.querySelector('header')
    let genres

    header.style.display = 'none'

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
        header.style.display = 'flex'
    })

    modal.addEventListener('click', function (event) {
        if (event.target.matches('.modal')) {
            hidden.style.display = 'none';
            header.style.display = 'flex'
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

    // highlightGenres.textContent = movieData.genres.map((genre) => genre.name).join(', ');
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

const body = document.querySelector('body')
const header = document.querySelector('header')
const logo = document.querySelector('#logo')
const luaBtn = document.querySelector('.btn-theme')
const moviesContainer = document.querySelector('.movies-container')
const highlight = document.querySelector('.highlight')
const h1 = document.querySelectorAll('h1')
const p = document.querySelectorAll('p')
const span = document.querySelectorAll('span')
const header__title = document.querySelector('.header__title')
const lupaPesquisar = document.querySelector('#lupa-pesquisar')
const aMenuNav = document.querySelectorAll('.header__container-left nav ul li a')
const containerHp = document.querySelector('.container-hp')

const btnMenu = document.querySelector('.btn-menu')
const menuNav = document.querySelector('.menu-nav')

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
        header__title.style.color = '#e21221'
        body.style.backgroundColor = 'white'
        header.style.backgroundColor = 'white'
        moviesContainer.style.backgroundColor = 'var(--bg-secondary)'
        highlight.style.backgroundColor = 'var(--bg-secondary)'
        containerHp.style.backgroundColor = 'var(--bg-secondary)'
        logo.src = "./assets/logo-dark.png"
        luaBtn.src = "./assets/light-mode.svg"
        btnNext.src = "./assets/arrow-right-dark.svg"
        btnPrev.src = "./assets/arrow-left-dark.svg"

        btnMenu.src = "./assets/menu-preto.png"
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
        containerHp.style.backgroundColor = '#2D3440'
        logo.src = "./assets/logo-dark.png"
        luaBtn.src = "./assets/dark-mode.svg"
        btnNext.src = "./assets/arrow-right-light.svg"
        btnPrev.src = "./assets/arrow-left-light.svg"

        input.style.color = 'white'
        input.style.borderColor = 'white'
        btnMenu.src = "./assets/menu-branco.png"
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


const contFlex = document.querySelector('.container-hp')
const itens = document.querySelectorAll('.item')
let hpFilmes = []

async function filmesHP() {
    const hpID = []
    const pesquisado = 'Shrek'

    const response = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${pesquisado}`);

    const TodosOsFilmesImportados = response.data.results;

    hpFilmes.push(TodosOsFilmesImportados.slice(0, 5));

    const pgCom8Filmes = hpFilmes[0];

    pgCom8Filmes.forEach(function (movie) {
        hpID.push(movie.id);

        const movieHP = document.createElement('div')
        movieHP.classList.add('movie-hp')
        contFlex.appendChild(movieHP)

        const divMovieInfo = document.createElement('div')
        divMovieInfo.classList.add('hp-movie__info')

        const title = document.createElement('span')
        title.classList.add('hp-movie__title')

        const vote_average = document.createElement('span')
        vote_average.classList.add('hp-movie__rating')

        const btnPlay = document.createElement('img')
        btnPlay.src = "./assets/play.svg"

        movieHP.appendChild(divMovieInfo)
        movieHP.style.backgroundImage = `url(${movie.poster_path})`;
        movieHP.style.backgroundSize = 'cover'
        movieHP.style.backgroundRepeat = 'no-repeat'

        title.textContent = movie.original_title
        vote_average.textContent = movie.vote_average.toFixed(2)

        divMovieInfo.appendChild(title)
        divMovieInfo.appendChild(vote_average)

        // movieHP.addEventListener('click', () => {
        //     abrirModal(movie.id)
        // })

        movieHP.addEventListener("mouseover", function () {
            movieHP.style.flex = '2'
            movieHP.style.backgroundImage = `url(${movie.backdrop_path})`;
            movieHP.style.backgroundSize = 'cover'
            movieHP.style.backgroundRepeat = 'no-repeat'
            title.style.whiteSpace = 'normal'
            title.style.maxWidth = '200px'

            divMovieInfo.innerHTML = ''
            divMovieInfo.appendChild(title)
            divMovieInfo.appendChild(btnPlay)

            btnPlay.style.width = '520px'
            btnPlay.style.height = '50px'
            divMovieInfo.style.height = '100%'
            divMovieInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'
            divMovieInfo.style.flexDirection = 'column'
            divMovieInfo.style.justifyContent = 'center'
            title.style.position = 'absolute'
            title.style.marginBottom = '250px'
            title.style.fontSize = '25px'
            title.style.textAlign = 'center'

            async function filmeYTB() {
                let responseVideo = await api.get(`/movie/${movie.id}/videos?language=en`);

                let video = responseVideo.data.results;

                let trailer = video.filter(temTrailerNoNome)

                /*fnc callback*/
                function temTrailerNoNome(objeto) {
                    return objeto.name.includes('Trailer');
                }

                movieHP.addEventListener('click', () => {
                    window.location.href = `https://www.youtube.com/watch?v=${trailer[0].key}`
                })
            }
            filmeYTB()

        });
        movieHP.addEventListener("mouseout", function () {
            movieHP.style.flex = '1'
            movieHP.style.backgroundImage = `url(${movie.poster_path})`;
            movieHP.style.backgroundSize = 'cover'
            movieHP.style.backgroundRepeat = 'no-repeat'
            title.style.whiteSpace = 'nowrap'
            title.style.maxWidth = '100px'

            divMovieInfo.innerHTML = ''
            divMovieInfo.appendChild(title)
            divMovieInfo.appendChild(vote_average)

            divMovieInfo.style.height = 'auto'
            divMovieInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'
            divMovieInfo.style.flexDirection = 'row'
            divMovieInfo.style.justifyContent = 'space-between'
            title.style.position = 'static'
            title.style.marginBottom = '0'
            title.style.fontSize = '16px'
            title.style.textAlign = 'none'

        });
    });

}
filmesHP()


btnMenu.addEventListener("click", () => {
    menuNav.classList.toggle("hide");
})