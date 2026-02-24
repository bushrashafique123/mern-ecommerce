import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage =multer.memoryStorage({})
const upload =multer({storage})

const uploadFile =(req,res,next)=>{
    upload.single('file')(req,res,(err)=>{
if(err){
    return res.status(500).json({error:"error uploading file"})
}})
if(!req.file){
return res.status(400).json({error:"No file uploaded"})
}
}