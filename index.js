import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app=express();
const port=3000;
const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"Abcd@123",
    port:5432,
})

db.connect();
let quiz=[];
db.query("SELECT * FROM capitals",(err,res)=>{
    if(err){
        console.log("Error executing query",err.stack);
    }
    else{
        quiz=res.rows;
    }
    db.end();
})

let totalCorrect =0;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let currentQues={};
app.get("/",async(req,res)=>{
    totalCorrect=0;
    await nextQues();
    res.render("index.ejs",{question:currentQues});
});

app.post("/submit",(req,res)=>{
    let answer=req.body.ans.trim();
    let check=false;
    if(currentQues.capital.toLowerCase() === answer.toLowerCase()){
        totalCorrect++;
        check=true;
    }
    nextQues();
    res.render("index.ejs",{
        question:currentQues,
        totalScore:totalCorrect,
        wasCorrect:check,
    })

})
async function nextQues(){
    const randomCountry=quiz[Math.floor(Math.random()*quiz.length)];
    currentQues=randomCountry;
}
app.listen(port,()=>{
    console.log(`server listening on ${port}`);
})
