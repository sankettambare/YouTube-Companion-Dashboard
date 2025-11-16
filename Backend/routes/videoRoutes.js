import express from "express";
import { youtube } from "../config/youtube.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const VIDEO_ID = process.env.YOUTUBE_VIDEO_ID;


router.get("/video", async (req,res)=>{
    try{
        const response = await youtube.videos.list({
            part :["snippet","statistics"],
            id:[VIDEO_ID]
        });

        const video = response.data.items?.[0];
        if(!video){
            return res.status(404).json({
                message:"Video not found"
            })
        }
        res.json({
            id:video.id,
            title:video.snippet.title,
            description: video.snippet.description,
            thumbnails :video.snippet.thumbnails,
            statistics :video.statistics

        })
    }catch(error){
        console.error("Error fetching video",error.message);
        res.status(500).json({message:"FAILED TO FETCH VIDEO DETAILS"});

    }

})

// PATCH /API/VIDEO =- UPDATE TITLE AND DESCRIPTION 

router.patch("/video",async (req,res) => {
    const {title,description} = req.body;

    try{
        const response = await youtube.videos.update({
            part :["snippet"],
            requestBody:{
                id:VIDEO_ID,
                snippet : {
                    title,
                    description,
                    categoryId:"22"
                }
            }

        });
        res.json({
            id:response.data.id,
            title:response.data.snippet.title,
            description:response.data.snippet.description
        });
    }catch(err){
        console.error("Error updating video:",err.message);
        res.status(500).json({message:"Failed to update video details"})
    }
});

export default router;