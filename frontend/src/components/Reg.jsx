import { useState } from "react"
import { useNavigate } from "react-router"

export function Reg(){
    const nav = useNavigate()
    const [login, setLogin] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [fio, setFio] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setError('')
        if(!login.match(/^[a-z0-9]+$/i)){
            setError('Логин должен состоять только из латиницы и цифр')
            return
        }
        if(login.length < 6){
            setError('Логин должен быть не менее 6 символов')
            return
        }
        if(pass.length < 8){
            setError('Пароль должен быть не менее 8 символов')
            return
        }
        if(fio.length < 5){
            setError('Неккоректное ФИО')
            return
        }
        if(phone.length < 11){
            setError('Некорректный номер телефона')
            return
        }
        try {
            const response = await fetch("http://localhost:2000/reg",{
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body : JSON.stringify({login, pass, fio, phone, email})
            })

            const data = await response.json()

            if(data.success){
                nav('/auth')
            }else{
                setError('Ошибка регистрации')
            }
        } catch (error) {
            setError('error')
        }
    }

    return(
        <div>
            <h1>Регистрация</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
            <input type="text" name="" placeholder="Придумайте логин" id="" value={login} onChange={(e) => setLogin(e.target.value)}/>
            <input type="tel" name="" placeholder="Введите телефон" id="" value={phone} onChange={(e) => setPhone(e.target.value)}/>
            <input type="email" name="" placeholder="Введите почту" id="" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="text" name="" placeholder="Введите ваше ФИО" id="" value={fio} onChange={(e) => setFio(e.target.value)}/>
            <input type="password" name="" placeholder="Придумайте пароль" id="" value={pass} onChange={(e) => setPass(e.target.value)}/>
            <button>Создать пользователя</button>
            </form>
        <button onClick={() => nav('/auth')}>Вход</button>
        </div>
    )
}