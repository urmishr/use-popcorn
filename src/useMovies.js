// import { useEffect, useState } from "react";
// const KEY = "6e823df3";

// export function useMovie(query) {
//     const [movies, setMovies] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState("");

//     useEffect(
//         function () {
//             const controller = new AbortController();
//             async function fetchMovie() {
//                 try {
//                     setError("");
//                     setIsLoading(true);
//                     const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
//                         signal: controller.signal,
//                     });
//                     if (!res.ok) {
//                         setIsLoading(false);
//                         throw new Error("Something Went Wrong!!!");
//                     }

//                     const data = await res.json();
//                     setIsLoading(false);

//                     if (data.Response === "False") throw new Error("No Movies Found...");
//                     setMovies(data.Search);
//                 } catch (err) {
//                     console.error(err);

//                     if (err.name !== "AbortError") setError(err.message);
//                 } finally {
//                 }
//             }
//             if (query.length < 2) {
//                 setMovies([]);
//                 setError("");
//                 setIsLoading(false);
//                 return;
//             }

//             fetchMovie();
//             return function () {
//                 controller.abort();
//             };
//         },
//         [query]
//     );
//     return { movies, isLoading, error };
// }
//using debouce
import { useEffect, useState } from "react";
const KEY = "6e823df3";

export function useMovie(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function () {
            let debounceTimer;

            async function fetchMovie() {
                try {
                    setError("");
                    setIsLoading(true);
                    const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`);

                    if (!res.ok) throw new Error("Something Went Wrong!!!");

                    const data = await res.json();

                    if (data.Response === "False") throw new Error("No Movies Found...");

                    setMovies(data.Search);
                } catch (err) {
                    console.error(err);

                    if (err.name !== "AbortError") setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }

            if (query.length < 2) {
                setMovies([]);
                setError("");
                setIsLoading(false);
                return;
            }

            // Debounce the fetchMovie function
            debounceTimer = setTimeout(() => {
                fetchMovie();
            }, 500); // 500ms delay

            // Cleanup function to clear the debounce timer
            return () => {
                clearTimeout(debounceTimer);
            };
        },
        [query]
    );

    return { movies, isLoading, error };
}
