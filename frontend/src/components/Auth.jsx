import { useState } from "react"
import { useNavigate } from "react-router"

export function Auth(){
    const nav = useNavigate()
    const [login, setLogin] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')
   
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setError('')
        

        if(login === 'Admin' && pass === 'KorokNET'){
            localStorage.setItem('user', JSON.stringify({ 
                login: 'Admin', 
                role: 'admin',
                full_name: 'Администратор' 
            }));
            nav('/adm')
            return
        }
        
        try {
            const response = await fetch("http://localhost:2000/auth",{
                method: "POST",
                headers: {'Content-Type': 'application/json'},  
                body: JSON.stringify({login, pass})
            })
            
            const data = await response.json()
            
            if(data.success && data.data.length > 0){
                localStorage.setItem('user', JSON.stringify(data.data[0]))  
                nav('/req')
            } else {
                setError('Неверный логин или пароль')
            }
        } catch (error) {
            setError('Ошибка сервера')
        }
    }

    return(
        <div>
            <h1>Вход</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>  
                <input type="text" placeholder="Введите логин" value={login} onChange={(e) => setLogin(e.target.value)}/>
                <input type="password" placeholder="Введите пароль" value={pass} onChange={(e) => setPass(e.target.value)}/>
                <button type="submit">Войти</button>  
            </form>
            <button onClick={() => nav('/reg')}>Регистрация</button>
        </div>
    )
}