import { useCallback, useEffect, useRef, useState } from "react";
import { detect,init } from "../utils/utils";
import { useSong } from "../../home/components/hooks/useSong";

const DETECTION_INTERVAL_MS = 10 * 60 * 1000;

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);
    const lastMoodRef = useRef(null);

    const [ expression, setExpression ] = useState("Detecting...");
    const { song, loading, error, handleGetSong } = useSong();

    const handleMoodDetected = useCallback((mood) => {
        if (lastMoodRef.current === mood) return;
        lastMoodRef.current = mood;
        handleGetSong({ mood });
    }, [handleGetSong]);

   

    useEffect(() => {
        

        let disposed = false;
        let resources = null;
        let detectionTimer = null;

        init({landmarkerRef,videoRef,streamRef})
            .then((value) => {
                resources = value;
                if (disposed) {
                    resources.landmarker.close();
                    resources.stream.getTracks().forEach((track) => track.stop());
                    return;
                }
                const detectMood = () => {
                    detect({ landmarkerRef, videoRef, setExpression, onMoodDetected: handleMoodDetected });
                };

                detectMood();
                detectionTimer = window.setInterval(detectMood, DETECTION_INTERVAL_MS);
            })
            .catch((error) => {
                console.error("Unable to start camera or face detector:", error);
                if (!disposed) setExpression("Camera unavailable");
            });

        return () => {
           

            disposed = true;
            if (detectionTimer) window.clearInterval(detectionTimer);
            if (resources?.landmarker) {
                resources.landmarker.close();
            }

            if (resources?.stream) {
                resources.stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [handleMoodDetected]);

    return (
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "400px", borderRadius: "12px" }}
                playsInline
            />
            <h2>{expression}</h2>
            <button onClick={() => {
                detect({ landmarkerRef, videoRef, setExpression, onMoodDetected: handleMoodDetected });
            }}>
                Detect expression
            </button>

            {loading && <p>Finding music for your mood...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && song?.url && (
                <section aria-live="polite">
                    <h3>{song.title}</h3>
                    <p>Selected for your {song.mood} mood.</p>
                    {song.posterurl && <img src={song.posterurl} alt={`${song.title} cover art`} width="220" />}
                    <audio controls src={song.url}>
                        Your browser does not support audio playback.
                    </audio>
                </section>
            )}
        </div>
    );
}
