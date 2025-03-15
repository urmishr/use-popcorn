import { useEffect, useState } from "react";
import StarRating from "./StarRating";

// const tempMovieData = [
//     {
//         imdbID: "tt1375666",
//         Title: "Inception",
//         Year: "2010",
//         Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     },
//     {
//         imdbID: "tt0133093",
//         Title: "The Matrix",
//         Year: "1999",
//         Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//     },
//     {
//         imdbID: "tt6751668",
//         Title: "Parasite",
//         Year: "2019",
//         Poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//     },
// ];

const tempWatchedData = [
    {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        runtime: 148,
        imdbRating: 8.8,
        userRating: 10,
    },
    {
        imdbID: "tt0088763",
        Title: "Back to the Future",
        Year: "1985",
        Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        runtime: 116,
        imdbRating: 8.5,
        userRating: 9,
    },
];

const KEY = "6e823df3";

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState(tempWatchedData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("inception");
    const [selectedId, setSelectedId] = useState(null);

    function handleChangeQuery(e) {
        setQuery(e.target.value);
    }

    function handleSelectedMovie(id) {
        setSelectedId((selectedID) => (id === selectedID ? null : id));
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    useEffect(
        function () {
            async function fetchMovie() {
                try {
                    setIsLoading(true);
                    setError("");
                    const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
                    if (!res.ok) throw new Error("Something Went Wrong!!!");

                    const data = await res.json();
                    if (data.Response === "False") throw new Error("No Movies Found...");

                    setMovies(data.Search);
                    setIsLoading(false);
                } catch (err) {
                    console.error(err);
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }
            if (query.length < 2) {
                setMovies([]);
                setError("");
                return;
            }
            fetchMovie();
        },
        [query]
    );

    return (
        <>
            <NavBar movies={movies}>
                <SearchBar query={query} onChangeQuery={handleChangeQuery} />
                <SearchResult movies={movies} />
            </NavBar>
            <Main>
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && (
                        <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
                    )}
                    {error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    {selectedId ? (
                        <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMovieList watched={watched} />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

function Loader() {
    return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
    return (
        <p className="error">
            <span>🚫</span> {message}
        </p>
    );
}

function NavBar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}

function SearchBar({ query, onChangeQuery }) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={onChangeQuery}
        />
    );
}

function SearchResult({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

function Main({ children }) {
    return <main className="main">{children}</main>;
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}

function MovieList({ movies, onSelectMovie }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
            ))}
        </ul>
    );
}

function Movie({ movie, onSelectMovie }) {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

function MovieDetails({ selectedId, onCloseMovie }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const {
        Title: title,
        Year: year,
        Runtime: runtime,
        Poster: poster,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    useEffect(
        function () {
            try {
                setIsLoading(true);
                async function searchMovie() {
                    const res = await fetch(
                        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
                    );
                    const data = await res.json();
                    setMovie(data);
                    setIsLoading(false);
                }
                searchMovie();
            } catch (err) {
                console.error(err);
            }
        },
        [selectedId]
    );
    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button onClick={onCloseMovie} className="btn-back">
                            ←
                        </button>
                        <img src={poster} alt={title} />
                        <div className="details-overview">
                            <h2>{title} </h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐️</span>
                                {imdbRating} imdb Ratings
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            <StarRating maxStar={10} size={24} />
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring: {actors}</p>
                        <p>Director: {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}

function WatchedMovieList({ watched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} />
            ))}
        </ul>
    );
}

function WatchedMovie({ movie }) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
            </div>
        </li>
    );
}

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}
