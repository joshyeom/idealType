import React from "react";
import { useLocation, useNavigate } from "react-router-dom"
import Loading from "../components/Loading"
import { useEffect } from "react";
import { requestImage } from "../services/requestImage";
import { convertToWebP } from "../services/convertToWebP";
import { uploadImageToFirebase } from "../services/uploadImageToFirebase";

const Generate = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const { prompts } = location.state;
        const processAndNavigate = async () => {
            try{
                const responseUrl = await requestImage(prompts)

                if(!responseUrl){
                    throw new Error("Failed to get response URL");
                }
                const webP = await convertToWebP(responseUrl)

                if(!webP){
                    throw new Error("Failed to convert to WebP");
                }
                const firebaseUrl = await uploadImageToFirebase(webP)

                if(!firebaseUrl){
                    throw new Error("Failed to upload and download Image to Firebase");
                }


                const newPrompts = prompts.join(" ")
                navigate(`/result/${encodeURIComponent(newPrompts)}/${encodeURIComponent(firebaseUrl)}`)
            }catch(error){
                console.error(error)
            }
        }
        processAndNavigate()
    }, [])

    return (
        <main className="flex flex-col items-center space-y-8 bg-bg py-16">
            <Loading/>
        </main>
    )
}

export default Generate