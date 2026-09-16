 import {
    FaceLandmarker,
    FilesetResolver 
 } from "@mediapipe/tasks-vision"
 
 export const init = async ({landmarkerRef,videoRef,streamRef}) => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const landmarker = await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            }
        );
        landmarkerRef.current = landmarker;

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        return { landmarker, stream };
    };

export const detect = ({landmarkerRef,videoRef,setExpression,onMoodDetected}) => {
        if (!landmarkerRef.current || !videoRef.current || videoRef.current.readyState < 2) return null;

        const results = landmarkerRef.current.detectForVideo(
            videoRef.current,
            performance.now()
        );

        if (results.faceBlendshapes?.length > 0) {
            const blendshapes = results.faceBlendshapes[ 0 ].categories;

            const getScore = (name) =>
                blendshapes.find((b) => b.categoryName === name)?.score || 0;

            const smileLeft = getScore("mouthSmileLeft");
            const smileRight = getScore("mouthSmileRight");
            const jawOpen = getScore("jawOpen");
            const browUp = getScore("browInnerUp");
            const frownLeft = getScore("mouthFrownLeft");
            const frownRight = getScore("mouthFrownRight");

            let currentExpression = "Neutral";
            let mood = null;

            if (smileLeft > 0.5 && smileRight > 0.5) {
                mood = "happy";
                currentExpression = "Happy 😄";
            } else if (jawOpen > 0.2 && browUp > 0.2) {
                mood = "surprised";
                currentExpression = "Surprised 😲";
            } else if (frownLeft > 0.0001 && frownRight > 0.0001) {
                mood = "sad";
                currentExpression = "Sad 😢";
            }

            setExpression(currentExpression);
            if (mood) onMoodDetected?.(mood);
            return { expression: currentExpression, mood };
        }

        setExpression("No face detected");
        return null;
    };
