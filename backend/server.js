import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "korki",
  password: "root"
});

const app = express()
app.use(cors(), express.json())

try {
  await connection.connect();
  console.log("Подключение к серверу MySQL успешно установлено");
} catch (err) {
  console.error("Ошибка: " + err.message);
}

app.post("/reg", async(req, res) =>{
    try {

        const {login, pass, fio, phone, email} = req.body;
        await connection.query(
            "insert into users (login, pass, fio, phone, email) values(?, ?, ?, ?, ?)",
            [login, pass, fio, phone, email]
        )
        res.json({success:true})
    } catch (error) {
        res.json({success:false})
    }
})

app.post("/auth", async(req, res) =>{
    try {
        const {login, pass} = req.body;  
        const [results] = await connection.query(
            "SELECT * FROM users WHERE login = ? AND pass = ?",
            [login, pass]
        );
        
        if (results.length > 0) {
            res.json({success: true, data: results});
        } else {
            res.json({success: false, data: []});
        }
    } catch (error) {
        res.json({success: false, data: []});
    }
});

app.get('/req', async(req, res)=>{
    const [results] = await connection.query(
        "select r.*, rs.name as status_name from requests r  join req_status rs on r.status_id = rs.id"
    )
    res.json(results)
})

app.get('/req/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [results] = await connection.query(
            "SELECT r.*, rs.name_ as status_name FROM requests r JOIN req_status rs ON r.status_id = rs.id WHERE r.user_id = ?",
            [userId]
        );
        res.json(results);
    } catch (error) {
        console.log(error);
        res.json([]);
    }
});

app.listen(2000, () => console.log("Сервер запущен"))