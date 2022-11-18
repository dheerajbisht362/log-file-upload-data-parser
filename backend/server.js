const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const multer = require("multer")
const fs = require("fs")

const app = express()
const port = 4000
const upload = multer({dest: "upload/"})

app.use(bodyParser.json());
app.use(cors({
    origin:'http://localhost:4200'
}));

app.post("/api/logupload",upload.single("file") ,(req,res)=>{

    fs.readFile(req.file.path,"utf8",function (err, data){
        
        const responseJson = []
        const logs = data.trim().split("\n").map(String);
            
        
        for(let i=0; i<logs.length; i++){
            const logDetails = logs[i].trim().split(" - ");
            if(logDetails.length!=3) {
                console.log(logDetails,i,logs[i])
                res.status(400).send({message:"File format not correct"})
                return
            }
            if(logDetails[1]=="error"||logDetails[1]=="warn"){
                const outputLog = {}
                outputLog.timestamp = new Date(logDetails[0]).getTime();
                outputLog.loglevel = logDetails[1];
                const logJson = JSON.parse(logDetails[2])
                outputLog.transactionId = logJson.transactionId
                outputLog.err = logJson.err
                responseJson.push(outputLog)
            }
        }
        res.send(responseJson)
    })
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})