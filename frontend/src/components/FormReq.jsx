import { useState } from "react"
import { useNavigate } from "react-router"
export function FormReq(){
    const [course, setCourse] = useState('')
    const [study_data, setDate] = useState('')
    const [payment_type, setPay] = useState('')
    const nav = useNavigate()
    const [error, setError] = useState('')

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if(!course || !study_data || !payment_type){
            setError('Введите все значения')
            return
        }
        const user = JSON.parse(localStorage.getItem('user'))
        try {
            const response = await fetch("http://localhost:2000/form-req",{
                method : "POST",
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify({course, study_data, payment_type, status_id : 1, user_id : user.id})
            })
            const data = await response.json()
            if(data.success){
                alert('Новая заявка отправлена')
                nav('/req')
            }else{
                setError('Ошибка регистрации')
            }
        } catch (error) {
            setError('error')
        }
    }

    return(
        <div>
            <h1>Новая заявка</h1>
            {error && <div>{error}</div>}
            <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Укажите наименование курса" value={course} onChange={(e) => setCourse(e.target.value)} />
            <input type="date" placeholder="Укажите начало обучения" value={study_data} onChange={(e) => setDate(e.target.value)} />
            <select name="" id="" value={payment_type} onChange={(e) => setPay(e.target.value)}>
                <option value="наличными">наличными</option>
                <option value="переводом по номеру телефона">переводом по номеру телефона</option>
            </select>
            <button>Отправить</button>
            </form>
        </div>
    )
}