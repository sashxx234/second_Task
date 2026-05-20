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


app.get('/req/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [results] = await connection.query(
            "SELECT r.*, rs.name_ as status_name FROM requests r JOIN req_status rs ON r.status_id = rs.id WHERE r.user_id = ?",
            [userId]
        );
        res.json(results);
    } catch (error) {
        res.json([]);
    }
});

app.get('/all-req', async (req, res) => {  
    try {
        const [results] = await connection.query(
            "SELECT r.*, u.fio, rs.name_ as status_name FROM requests r JOIN users u ON u.id = r.user_id JOIN req_status rs ON rs.id = r.status_id"
        )
        res.json(results);
    } catch (error) {
        console.log(error);
        res.json([]);
    }
});

app.post('/form-req', async (req, res)=>{
    try {
        const {course, study_data, payment_type, user_id} = req.body
        await connection.query(
            "INSERT INTO requests (course, study_data, payment_type, status_id, user_id) VALUES (?, ?, ?, 1, ?)",
            [course, study_data, payment_type, user_id]
        )
        res.json({success: true})
    } catch (error) {
        res.json({success: false})
    }
})

app.put('/requests/status', async (req, res) => {
  const { request_id, status_id } = req.body;
  await connection.query("UPDATE requests SET status_id = ? WHERE id = ?", [status_id, request_id]);
  res.json({ success: true });
});

app.listen(2000, () => console.log("Сервер запущен"));