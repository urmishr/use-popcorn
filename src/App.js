import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const KEY = "6e823df3";

export default function App() {
    const [query, setQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const [watched, setWatched] = useLocalStorageState([], "watched");

    function handleChangeQuery(e) {
        setQuery(e.target.value);
    }

    function handleSelectedMovie(id) {
        setSelectedId((selectedID) => (id === selectedID ? null : id));
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    function handleAddWatchedMovie(movie) {
        setWatched((watched) => [...watched, movie]);
        handleCloseMovie();
    }

    function handleDeleteMovie(id) {
        setWatched((cWatched) => cWatched.filter((movie) => movie.imdbID !== id));
    }

    const { movies, isLoading, error } = useMovie(query);

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
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatchedMovie={handleAddWatchedMovie}
                            watchedMovies={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMovieList watched={watched} onDeleteMovie={handleDeleteMovie} />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

function Loader() {
    return <div className="loader"></div>;
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
    const inputEL = useRef(null);

    useKey("Enter", () => inputEL.current.select());

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={onChangeQuery}
            ref={inputEL}
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

function MovieDetails({ selectedId, onCloseMovie, onAddWatchedMovie, watchedMovies }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRatings, setUserRatings] = useState(0);
    const alreadyExist = watchedMovies.some((movie) => movie.imdbID === selectedId);
    const watchedUserRatings = watchedMovies.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;

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

    useKey("Escape", onCloseMovie);

    useEffect(
        function () {
            try {
                setIsLoading(true);
                async function searchMovie() {
                    const res = await fetch(
                        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
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

    useEffect(
        function () {
            if (!title) return;
            document.title = `Movie | ${title}`;
            return function () {
                document.title = "usePopcorn";
            };
        },
        [title]
    );

    function handleAdd() {
        const newMovie = {
            imdbID: selectedId,
            Title: title,
            Year: year,
            Poster: poster,
            runtime: Number(runtime.split(" ").at(0)),
            imdbRating: Number(imdbRating),
            userRating: userRatings,
        };
        onAddWatchedMovie(newMovie);
    }
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
                            {!alreadyExist ? (
                                <>
                                    <StarRating
                                        maxStar={10}
                                        size={24}
                                        onSetRating={setUserRatings}
                                        className="starratings"
                                    />
                                    {userRatings > 0 && (
                                        <button className="btn-add" onClick={handleAdd}>
                                            + Add to favourite
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>You already rated this movie with {watchedUserRatings} ⭐️.</p>
                            )}
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

function WatchedMovieList({ watched, onDeleteMovie }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} onDeleteMovie={onDeleteMovie} />
            ))}
        </ul>
    );
}

function WatchedMovie({ movie, onDeleteMovie }) {
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
            <button className="btn-delete" onClick={() => onDeleteMovie(movie.imdbID)}>
                X
            </button>
        </li>
    );
}

function WatchedSummary({ watched }) {
    const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

    const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(2);
    const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(2);
    const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(2);
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div className="movie-summary">
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
