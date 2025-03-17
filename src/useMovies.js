import { useEffect, useState } from "react";
const KEY = "6e823df3";

export function useMovie(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function () {
            const controller = new AbortController();
            async function fetchMovie() {
                try {
                    setError("");
                    setIsLoading(true);
                    const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
                        signal: controller.signal,
                    });
                    if (!res.ok) throw new Error("Something Went Wrong!!!");

                    const data = await res.json();
                    setIsLoading(false);
                    if (data.Response === "False") throw new Error("No Movies Found...");
                    setMovies(data.Search);
                    // setError("");
                } catch (err) {
                    console.error(err);
                    if (err.name !== "AbortError") setError(err.message);
                }
            }
            if (query.length < 2) {
                setMovies([]);
                setError("");
                return;
            }

            fetchMovie();
            return function () {
                controller.abort();
            };
        },
        [query]
    );
    return { movies, isLoading, error };
}
