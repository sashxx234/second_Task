import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

export function Admin(){
    const [requests, setRequests] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user || user.login !== 'Admin') {
            navigate('/auth')
            return
        }
        fetchAllRequests()
    }, [])

    const fetchAllRequests = async () => {
        try {
            const response = await fetch("http://localhost:2000/all-req")
            const data = await response.json()
            setRequests(data)
        } catch (error) {
            console.error(error)
        }
    }

    const updateStatus = async (requestId, newStatusId) => {
        try {
            const response = await fetch('http://localhost:2000/requests/status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ request_id: requestId, status_id: newStatusId })
            })
            
            if (response.ok) {
                fetchAllRequests()  
            }
        } catch (error) {
            alert('Ошибка обновления статуса')
        }
    }

    const getStatusName = (statusId) => {
        const statuses = { 1: 'Новая', 2: 'Идет обучение', 3: 'Обучение завершено' }
        return statuses[statusId] || 'Новая'
    }

    return(
        <div>
            <h1>Админ панель</h1>
            {requests.length === 0 ? (
                <p>Нет заявок</p>
            ) : (
                <div>
                    {requests.map(req => (
                        <div key={req.id}>
                            <p><strong>ФИО:</strong> {req.fio}</p>
                            <p><strong>Курс:</strong> {req.course}</p>
                            <p><strong>Дата:</strong> {new Date(req.study_data).toLocaleDateString()}</p>
                            <p><strong>Способ оплаты:</strong> {req.payment_type}</p>
                            <p><strong>Статус:</strong> {getStatusName(req.status_id)}</p>
                            <select 
                                value={req.status_id} 
                                onChange={(e) => updateStatus(req.id, parseInt(e.target.value))}
                            >
                                <option value="1">Новая</option>
                                <option value="2">Идет обучение</option>
                                <option value="3">Обучение завершено</option>
                            </select>
                            <hr/>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => { localStorage.removeItem('user'); navigate('/auth') }}>Выйти</button>
        </div>
    )
}