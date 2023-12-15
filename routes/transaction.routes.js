const {Router}=require("express");

const {TransactionModel}=require("../model/transction.model");

const router=Router();



router.get("/",async(req,res)=>{
    try {
        let {search,page,month}=req.query;
        // regex for finding document of given month;
        const regexPattern = new RegExp(`^\\d{4}-${month}`);
        let skipcount=(page-1)*10;

        // default limit set to 10 documents
        const data= await TransactionModel.aggregate([
            {
                $match: {
                    $or: [
                        { title: { $regex: new RegExp(search, 'i') } },
                        { description: { $regex: new RegExp(search, 'i') } }
                    ],
                    dateOfSale: { $regex: regexPattern }
                }
            },
            { $skip: skipcount },
            { $limit: 10 }
        ]);

        res.status(200).send({
            isError:false,
            data
        });
        
    } catch (error) {
        res.status(500).send({
            isError:true,
            message:error.message
        })
    }
});


router.get("/statistics",async(req,res)=>{
    try {

        let month=req.query.month;
        // regex for finding document of given month;
        const regexPattern = new RegExp(`^\\d{4}-${month}`);

        // Find items within the selected month
        const filteredData = await TransactionModel.find({
            dateOfSale: {
                $regex: regexPattern
            }
        });

        let totalSaleAmount=0;
        let totalSoldItems=0;
        let totalUnsoldItems=0;
        // count stats
        filteredData.forEach(ele=>{
            if(ele.sold){
                totalSaleAmount+=ele.price;
                totalSoldItems++;
            }else{
                totalUnsoldItems++;
            }
        });


        res.status(200).send({
            isError:false,
            totalSaleAmount,
            totalSoldItems,
            totalUnsoldItems
        })
        
    } catch (error) {
        res.status(500).send({
            isError:true,
            message:error.message
        })
    }
});


router.get("/bar_chart",async(req,res)=>{
    try {

        let month=req.query.month;
        // regex for finding document of given month;
        const regexPattern = new RegExp(`^\\d{4}-${month}`);

        // Find items within the selected month
        const filteredData = await TransactionModel.find({
            dateOfSale: {
                $regex: regexPattern
            }
        });

        let dataObject={};

        // create 10 kyes in dataObject and assigned 0 as defalt value
        for(let i=1;i<=10;i++){
            dataObject[i]=0;
        }
        
        // calculate items for each range and store in dataObject
        filteredData.forEach((ele)=>{
            if(ele.price<=100){
                dataObject["1"]++;
            }
            if(ele.price>100 && ele.price<=200){
                dataObject["2"]++;
            }
            if(ele.price>200 && ele.price<=300){
                dataObject["3"]++;
            }
            if(ele.price>300 && ele.price<=400){
                dataObject["4"]++;
            }
            if(ele.price>400 && ele.price<=500){
                dataObject["5"]++;
            }
            if(ele.price>500 && ele.price<=600){
                dataObject["6"]++;
            }
            if(ele.price>600 && ele.price<=700){
                dataObject["7"]++;
            }
            if(ele.price>700 && ele.price<=800){
                dataObject["8"]++;
            }
            if(ele.price>800 && ele.price<=900){
                dataObject["9"]++;
            }
            if(ele.price>900){
                dataObject["10"]++;
            }
        });

        res.status(200).send({
            isError:false,
            dataObject
        })

    } catch (error) {
        res.status(500).send({
            isError:true,
            message:error.message
        })
    }
});


router.get("/pie_chart",async(req,res)=>{
    try {
        let month=req.query.month;
        
        const regexPattern = new RegExp(`^\\d{4}-${month}`);

        // Find items within the selected month
        const filteredData = await TransactionModel.find({
            dateOfSale: {
                $regex: regexPattern
            }
        });

        let obj={};
        // calculate number of categories present and numberc of item for each category
        filteredData.forEach(ele=>{
            if(obj[ele.category]){
                obj[ele.category]++;
            }else{
                obj[ele.category]=1;
            }
        });

        res.status(200).send({
            isError:false,
            PiChartData:obj
        })
        
    } catch (error) {
        res.status(500).send({
            isError:true,
            message:error.message
        })
    }
})

module.exports= {router}