const express=require("express");
const cors=require("cors");
require("dotenv").config();


const {connection}=require("./config/db");
const {TransactionModel}=require("./model/transction.model");
const {router}=require("./routes/transaction.routes");

const app=express();

app.use(cors());
app.use(express.json());

app.use("/transcation",router);

app.get("/",(req,res)=>{
    res.status(200).send(`<h1> Welcome to Backend </h1>`);
});

// initially data added to database using this route

// app.post("/add_data",async(req,res)=>{
//     try {
//         const {data}=req.body;

//         const insertdata= await TransactionModel.insertMany(data);

//         res.status(201).send({
//             isError:false,
//             message:"data inserted successfully"
//         })
        
//     } catch (error) {
//         res.status(500).send({
//             isError:true,
//             message:error.message
//         })
//     }
// });


app.listen(process.env.port,async(req,res)=>{
    try {
        await connection;
        console.log("connected to DB");
        console.log(`server is running on port ${process.env.port}`)
    } catch (error) {
        console.log(error);
    }
})