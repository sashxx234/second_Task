import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

export function Requests(){
    const [requests, setRequests] = useState([])
    const nav = useNavigate()

useEffect(() =>{
    const user = JSON.parse(localStorage.getItem('user'))
    if(user){
        fetchRequests(user.id)
    }
}, [])

    const fetchRequests = async (userId) => {
        try {
            const response = await fetch(`http://localhost:2000/req/${userId}`)
            const data = await response.json()
            setRequests(data)
        } catch (error) {
            console.error('Ошибка загрузки')
        }
    }

    return(
        <div>
            <h1>Здесь будут ваши заявки</h1>
            {requests.length === 0 ? (
                <p>У вас пока нет заявок</p>
            ) : (
                <div>
                    {requests.map(req => (
                        <div key={req.id}>
                            <p><strong>Курс:</strong> {req.course}</p>
                            <p><strong>Дата:</strong> {new Date(req.study_data).toLocaleDateString()}</p>
                            <p><strong>Статус:</strong> {req.status_name}</p>
                            <hr/>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => nav('/form-req')}>Новая заявка</button>
            <button onClick={()=> {localStorage.removeItem('user'); nav('/auth')}}>Выйти</button>
        </div>
    )
}