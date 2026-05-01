const signs = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

const seed = async()=>{
    for(let i = 0;i < signs.length; i++){
        for( let j = i ; j < signs.length ; j++){
            try{
                console.log(`Checking: ${signs[i]} + ${signs[j]}`);
            const response  = await fetch(`http://localhost:8080/api/v1/compatibility/get-compatibility/${signs[i]}/${signs[j]}`);
            const data = await response.json();

            if(data.success){
                console.log("Success");
            }
            } catch(err){
                console.error(`❌ Failed for ${s1}-${s2}:`, err.message);
            }
            await new Promise(res => setTimeout(res, 2000));
        }
    }
    console.log("All Done")
}

seed();